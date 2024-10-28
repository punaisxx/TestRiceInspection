// pages/history/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function InspectionDetail() {
  const router = useRouter();
  const { id } = router.query; // Get ID from the URL
  const [inspectionData, setInspectionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchInspectionData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/history/${id}`);
        const data = await response.json();
        setInspectionData(data);
      } catch (error) {
        console.error('Error fetching inspection data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInspectionData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!inspectionData) return <p>Error: Unable to load inspection details.</p>;

  // Assuming inspectionData has a results field with the required structure
  const results = inspectionData.results || {};

  return (
    <div>
      <h1>Inspection Details</h1>
      <p><strong>Name:</strong> {inspectionData.name}</p>
      <p><strong>Standard:</strong> {inspectionData.standard}</p>
      <p><strong>Note:</strong> {inspectionData.note}</p>
      {inspectionData.price && <p><strong>Price:</strong> {inspectionData.price}</p>}

      {/* Composition Table */}
      <h2>Composition</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Count</th>
            <th>Weight (kg)</th>
            <th>Percentage (%)</th>
          </tr>
        </thead>
        <tbody>
          {results.wholegrain && (
            <tr>
              <td>ข้าวเต็มเมล็ด</td>
              <td>{results.wholegrain.count}</td>
              <td>{results.wholegrain.weight}</td>
              <td>{results.wholegrain.percentage}</td>
            </tr>
          )}
          {results.broken_rice1 && (
            <tr>
              <td>ข้าวหักใหญ่</td>
              <td>{results.broken_rice1.count}</td>
              <td>{results.broken_rice1.weight}</td>
              <td>{results.broken_rice1.percentage}</td>
            </tr>
          )}
          {results.broken_rice2 && (
            <tr>
              <td>ข้าวหักทั่วไป</td>
              <td>{results.broken_rice2.count}</td>
              <td>{results.broken_rice2.weight}</td>
              <td>{results.broken_rice2.percentage}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Defect Rice Table */}
      <h2>Defect Rice</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Count</th>
            <th>Weight (kg)</th>
            <th>Percentage (%)</th>
          </tr>
        </thead>
        <tbody>
          {/* Replace with your actual defect rice data structure */}
          {/* Assuming you have similar structures for defect rice */}
          <tr>
            <td>ข้าวเหลือง</td>
            <td>{results.defect_rice_yellow?.count || 0}</td>
            <td>{results.defect_rice_yellow?.weight || '0.00'}</td>
            <td>{results.defect_rice_yellow?.percentage || '0.00'}</td>
          </tr>
          <tr>
            <td>ข้าวท้องไข่</td>
            <td>{results.defect_rice_egg?.count || 0}</td>
            <td>{results.defect_rice_egg?.weight || '0.00'}</td>
            <td>{results.defect_rice_egg?.percentage || '0.00'}</td>
          </tr>
          <tr>
            <td>ข้าวเปลือก</td>
            <td>{results.defect_rice_husk?.count || 0}</td>
            <td>{results.defect_rice_husk?.weight || '0.00'}</td>
            <td>{results.defect_rice_husk?.percentage || '0.00'}</td>
          </tr>
          <tr>
            <td>ข้าวแดง</td>
            <td>{results.defect_rice_red?.count || 0}</td>
            <td>{results.defect_rice_red?.weight || '0.00'}</td>
            <td>{results.defect_rice_red?.percentage || '0.00'}</td>
          </tr>
          <tr>
            <td>ข้าวเสีย</td>
            <td>{results.defect_rice_damaged?.count || 0}</td>
            <td>{results.defect_rice_damaged?.weight || '0.00'}</td>
            <td>{results.defect_rice_damaged?.percentage || '0.00'}</td>
          </tr>
          <tr>
            <td>ข้าวเหนียว</td>
            <td>{results.defect_rice_sticky?.count || 0}</td>
            <td>{results.defect_rice_sticky?.weight || '0.00'}</td>
            <td>{results.defect_rice_sticky?.percentage || '0.00'}</td>
          </tr>
          <tr>
            <td>ข้าวปลอมปนทั้งหมด</td>
            <td>{results.defect_rice_mixed?.count || 0}</td>
            <td>{results.defect_rice_mixed?.weight || '0.00'}</td>
            <td>{results.defect_rice_mixed?.percentage || '0.00'}</td>
          </tr>
        </tbody>
      </table>
      
      <button onClick={() => router.push(`/history/${id}/edit`)}>Edit</button>
      <button onClick={() => router.push('/')}>Back to Form</button>
    </div>
  );
}

