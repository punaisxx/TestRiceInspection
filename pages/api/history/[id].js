import query from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM history WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Inspection not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching inspection:', error);
      res.status(500).json({ error: 'Failed to fetch inspection data' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await query('DELETE FROM history WHERE id = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      res.status(200).json({ message: 'Record deleted successfully', data: result.rows[0] });
    } catch (error) {
      console.error('Error deleting record:', error);
      res.status(500).json({ error: 'Failed to delete record' });
    }
  } else if (req.method === 'PATCH') {
    const {
      note,
      price,
      samplingDateTime,
      samplingPoint
    } = req.body;

    const values = [
      note,
      price || null,
      samplingDateTime || null, 
      samplingPoint || null,
      id
    ];

    try {
      const result = await query(
        `UPDATE history
         SET note = $1,
             price = $2,
             sampling_datetime = $3,
             sampling_point = $4,
             updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        values
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      res.status(200).json({ message: 'Record updated successfully', data: result.rows[0] });
    } catch (error) {
      console.error('Error updating record:', error);
      res.status(500).json({ error: 'Failed to update data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
