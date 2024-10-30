import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '/Path/Test/next-app/styles/InspectionDetail.module.css';

export default function InspectionDetail() {
  const router = useRouter();
  const { id } = router.query; // Get ID from the URL
  const [inspectionData, setInspectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchInspectionData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/history/${id}`);
        const data = await response.json();
        setInspectionData(data);
        
        // Assuming `data` has a `results` field containing the inspection results
        setResults(data.results); 
      } catch (error) {
        console.error('Error fetching inspection data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInspectionData();
  }, [id]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!inspectionData || !results) return <p>Error: Unable to load inspection details.</p>;

  return (
    <div className={styles.inspectionContainer}>
      <h2>Inspection Results</h2>
      <div className={styles.inspectionDetail}>
        <p><strong>Name:</strong> {inspectionData.name}</p>
        <p><strong>Create Date - Time:</strong> {inspectionData.created_at}</p>
        <p><strong>Inspection ID:</strong> {inspectionData.id}</p>
        <p><strong>Standard:</strong> {inspectionData.standard}</p>
        <p><strong>Total Sample:</strong> {results.totalSample || 0}</p>
        <p><strong>Update Date - Time:</strong> {inspectionData.updated_at}</p>
        <p><strong>Note:</strong> {inspectionData.note}</p>
        {inspectionData.price && <p><strong>Price:</strong> {inspectionData.price}</p>}
        {inspectionData.sampling_datetime && <p><strong>Date/Time of Sampling:</strong> {inspectionData.sampling_datetime}</p>}
        {inspectionData.sampling_point && <p><strong>Sampling Point:</strong> {inspectionData.sampling_point}</p>}
      </div>
      <div className={styles.resultsSection}>
        <h3>Composition</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actual (%)</th>
              <th>Weight (kg)</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(results.composition || {}).map(([key, data]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{data.percentage || '0.00'}</td>
                <td>{data.weight || '0.00'}</td>
                <td>{data.count || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.resultsSection}>
        <h3>Defect Rice</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actual (%)</th>
              <th>Weight (kg)</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(results.defectRice || {}).map(([key, data]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{data.percentage || '0.00'}</td>
                <td>{data.weight || '0.00'}</td>
                <td>{data.count || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.buttonContainer}>
        <button className={`${styles.button} ${styles.editButton}`} onClick={() => router.push(`/history/${id}/edit`)}>
          Edit
        </button>
        <button className={`${styles.button} ${styles.backButton}`} onClick={() => router.push('/')}>
          Back to Form
        </button>
      </div>
    </div>
  );
}
