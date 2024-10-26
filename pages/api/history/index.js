// // /pages/api/history/index.js

// import query from '../../../lib/db';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const result = await query(`
//         SELECT
//           created_at AS "createDateTime",
//           inspection_id AS "inspectionID",
//           name,
//           standard,
//           note,
//           total_sample AS "totalSample",
//           results
//         FROM history
//         ORDER BY created_at DESC
//       `);
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching history data:', error);
//       res.status(500).json({ message: 'Failed to fetch history data' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }

// pages/api/history.js

import fs from 'fs';
import path from 'path';
import query from '/Users/rawinnipha/Test/next-app/lib/db.js';

// Helper function to calculate inspection results based on standards
function calculateInspection(standard, grains) {
  if (!Array.isArray(grains)) {
    throw new TypeError("grains must be an array.");
  }

  const categories = {};
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

    // Grains that do not match any subStandard are categorized as "unknown"
    if (!matched) {
      if (!categories.unknown) {
        categories.unknown = { totalWeight: 0, count: 0 };
      }
      categories.unknown.totalWeight += grain.weight;
      categories.unknown.count += 1;
    }
  });

  const totalWeight = grains.reduce((sum, grain) => sum + grain.weight, 0);
  const results = {};
  for (const [category, data] of Object.entries(categories)) {
    results[category] = {
      percentage: ((data.totalWeight / totalWeight) * 100).toFixed(2),
      weight: data.totalWeight.toFixed(2),
      count: data.count,
    };
  }
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, standard, note, price, samplingPoint, samplingDateTime, upload } = req.body;

  try {
    // Load and validate the standard from standards.json
    const standardsFilePath = path.join(process.cwd(), 'public', 'standards.json');
    const standards = readJSONFile(standardsFilePath);
    const selectedStandard = standards.find(s => s.id === standard);
    
    if (!selectedStandard) {
      return res.status(400).json({ error: 'Invalid standard ID' });
    }

    // Load and validate grains from raw.json
    const rawFilePath = path.join(process.cwd(), 'public', 'raw.json');
    const rawData = readJSONFile(rawFilePath);
    
    if (!Array.isArray(rawData.grains)) {
      return res.status(400).json({ error: 'Invalid data format in raw.json. Expected grains to be an array.' });
    }

    const results = calculateInspection(selectedStandard, rawData.grains);

    // Insert data into the PostgreSQL database
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
}
