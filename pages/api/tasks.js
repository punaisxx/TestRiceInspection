// // pages/api/tasks.js
// import query from '../../lib/db';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const result = await query(`
//         SELECT id, created_at AS "createdAt", name, standard, note 
//         FROM history
//         ORDER BY created_at DESC
//       `);
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       res.status(500).json({ error: 'Failed to fetch tasks' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }

// pages/api/history.js
// import query from '../../lib/db';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const { id, page = 1, limit = 10, startDate, endDate } = req.query;
//     const offset = (page - 1) * limit;

//     try {
//       let whereClause = '';
//       const params = [];

//       if (id) {
//         whereClause += ` WHERE inspection_id ILIKE $${params.length + 1}`;
//         params.push(`%${id}%`);
//       }

//       if (startDate && endDate) {
//         whereClause += whereClause ? ' AND' : ' WHERE';
//         whereClause += ` created_at BETWEEN $${params.length + 1} AND $${params.length + 2}`;
//         params.push(new Date(startDate).toISOString(), new Date(endDate).toISOString());
//       }

//       const totalResult = await query(`SELECT COUNT(*) FROM history${whereClause}`, params);
//       const totalCount = totalResult.rows[0].count;

//       const result = await query(`
//         SELECT id, created_at AS "createdAt", inspection_id AS "inspectionId", name, standard, note 
//         FROM history${whereClause} 
//         ORDER BY created_at DESC 
//         LIMIT $${params.length + 1} OFFSET $${params.length + 2}
//       `, [...params, limit, offset]);

//       res.status(200).json({
//         totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//         currentPage: parseInt(page, 10),
//         rows: result.rows,
//       });
//     } catch (error) {
//       console.error('Error fetching history:', error);
//       res.status(500).json({ error: 'Failed to fetch history' });
//     }
//   } else if (req.method === 'DELETE') {
//     try {
//       const { ids } = req.body;
//       await query(`DELETE FROM history WHERE id = ANY($1)`, [ids]);
//       res.status(204).end(); // No content
//     } catch (error) {
//       console.error('Error deleting history:', error);
//       res.status(500).json({ error: 'Failed to delete history' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }

// /pages/api/tasks.js

import query from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await query(`
        SELECT
          created_at AS "createDateTime",
          id AS "inspectionID",
          name,
          standard,
          note,
          total_sample AS "totalSample",
          results
        FROM history
        ORDER BY created_at DESC
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching history data:', error);
      res.status(500).json({ message: 'Failed to fetch history data' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
