import fs from 'fs';
import path from 'path';
import query from '/Path/Test/next-app/lib/db.js';

function calculateInspection(standard, grains) {
  if (!Array.isArray(grains)) {
      throw new TypeError("grains must be an array.");
  }

  const categories = {};
  const defectCategories = {
      "white": { totalWeight: 0, count: 0 },
      "yellow": { totalWeight: 0, count: 0 },
      "red": { totalWeight: 0, count: 0 },
      "damage": { totalWeight: 0, count: 0 },
      "paddy": { totalWeight: 0, count: 0 },
      "chalky": { totalWeight: 0, count: 0 },
      "glutinous": { totalWeight: 0, count: 0 },
      "totalDefects": { totalWeight: 0, count: 0 }
  };

  grains.forEach((grain) => {
      let matched = false;

      for (const subStandard of standard.standardData) {
          const lengthValid = (
              (subStandard.conditionMin === 'GT' ? grain.length > subStandard.minLength : grain.length >= subStandard.minLength) &&
              (subStandard.conditionMax === 'LT' ? grain.length < subStandard.maxLength : grain.length <= subStandard.maxLength)
          );
          const shapeValid = subStandard.shape.includes(grain.shape);

          if (lengthValid && shapeValid) {
              if (!categories[subStandard.key]) {
                  categories[subStandard.key] = { totalWeight: 0, count: 0 };
              }
              categories[subStandard.key].totalWeight += grain.weight;
              categories[subStandard.key].count += 1;
              matched = true;
              break;
          }
      }

      if (!matched) {
          if (!categories.unknown) {
              categories.unknown = { totalWeight: 0, count: 0 };
          }
          categories.unknown.totalWeight += grain.weight;
          categories.unknown.count += 1;
      }

      // Always accumulate for defects based on type
      if (defectCategories[grain.type]) {
          defectCategories[grain.type].totalWeight += grain.weight;
          defectCategories[grain.type].count += 1;
      }
  });

  // Calculate total weight of all grains
  const totalWeight = grains.reduce((sum, grain) => sum + grain.weight, 0);
  const results = {};

  // Prepare composition results
  results.composition = {};
  for (const [category, data] of Object.entries(categories)) {
      results.composition[category] = {
          percentage: ((data.totalWeight / totalWeight) * 100).toFixed(2),
          weight: data.totalWeight.toFixed(2),
          count: data.count,
      };
  }

  results.defectRice = {};
  for (const [type, data] of Object.entries(defectCategories)) {
      if (data.count > 0) { // Only include types with actual counts
          results.defectRice[type] = {
              percentage: ((data.totalWeight / totalWeight) * 100).toFixed(2),
              weight: data.totalWeight.toFixed(2),
              count: data.count,
          };
      }
  }

  results.defectRice.totalDefects = {
      percentage: Object.values(defectCategories).reduce((sum, cat) => sum + (cat.totalWeight / totalWeight) * 100, 0).toFixed(2),
      weight: Object.values(defectCategories).reduce((sum, cat) => sum + cat.totalWeight, 0).toFixed(2),
      count: Object.values(defectCategories).reduce((sum, cat) => sum + cat.count, 0),
  };

  results.totalSample = grains.length;

  return results;
}




// Utility function to read and parse JSON files
function readJSONFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    throw new Error(`Failed to load data from ${filePath}`);
  }
}

// Main handler for API endpoints
export default async function handler(req, res) {
  const { method, query: { id } } = req;

  if (method === 'POST') {
    const { name, standard, note, price, samplingPoint, samplingDateTime, upload } = req.body;

    try {
      const standardsFilePath = path.join(process.cwd(), 'public', 'standards.json');
      const standards = readJSONFile(standardsFilePath);
      const selectedStandard = standards.find(s => s.id === standard);

      if (!selectedStandard) {
        console.error(`Standard with ID ${standard} not found.`);
        return res.status(400).json({ error: 'Invalid standard ID' });
      }

      const rawFilePath = path.join(process.cwd(), 'public', 'raw.json');
      const rawData = readJSONFile(rawFilePath);

      if (!Array.isArray(rawData.grains)) {
        return res.status(400).json({ error: 'Invalid data format in raw.json. Expected grains to be an array.' });
      }

      const results = calculateInspection(selectedStandard, rawData.grains);

      const queryText = `
        INSERT INTO history 
        (name, standard, note, price, sampling_point, sampling_datetime, upload, created_at, updated_at, total_sample, results)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9)
        RETURNING *;
      `;
      const queryValues = [
        name,
        standard,
        note,
        price || null,
        samplingPoint?.length ? samplingPoint : null,
        samplingDateTime || null,
        upload || null,
        results.totalSample,
        JSON.stringify(results),
      ];

      const result = await query(queryText, queryValues);

      res.status(200).json({ message: 'Form submitted successfully', data: result.rows[0] });
    } catch (error) {
      console.error('Error saving form data:', error);
      res.status(500).json({ error: 'Failed to save data' });
    }

  } else if (method === 'GET') {
    if (id) {
      return res.status(400).json({ error: 'Method not allowed' });
    }

    try {
      const result = await query('SELECT * FROM history ORDER BY created_at DESC;');
      res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error('Error retrieving history data:', error);
      res.status(500).json({ error: 'Failed to retrieve data' });
    }

  } else if (method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ error: 'Missing record id in request' });
    }

    try {
      const result = await query('DELETE FROM history WHERE id = $1 RETURNING *;', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      res.status(200).json({ message: 'Record deleted successfully', data: result.rows[0] });
    } catch (error) {
      console.error('Error deleting record:', error);
      res.status(500).json({ error: 'Failed to delete data' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}