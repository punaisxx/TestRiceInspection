import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from '/Path/Test/next-app/styles/HistoryRecords.module.css';

export default function HistoryPage() {
  const [histories, setHistories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectionData, setInspectionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all history records initially
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/history');
        setHistories(response.data.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchHistory();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`/api/history/${searchQuery}`);
      setInspectionData(response.data); // set specific search result
      setError(''); // Clear previous error messages
    } catch (error) {
      console.error('Error fetching inspection data:', error);
      setError('No inspection found with that ID.');
      setInspectionData(null); // Clear any previous search data
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`/api/history/${id}`);
      setHistories(histories.filter((history) => history.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>History Records</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Enter Inspection ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>Search</button>
      </div>

      <hr />

      {/* Display search result if available, otherwise list all records */}
      {inspectionData ? (
        <div className={styles.resultCard}>
          <h2>Inspection Details</h2>
          <p className={styles.recordDetail}><strong>Date & Time:</strong> {inspectionData.created_at}</p>
          <p className={styles.recordDetail}><strong>Inspection ID:</strong> {inspectionData.id}</p>
          <p className={styles.recordDetail}><strong>Name:</strong> {inspectionData.name}</p>
          <p className={styles.recordDetail}><strong>Standard:</strong> {inspectionData.standard}</p>
          <p className={styles.recordDetail}><strong>Note:</strong> {inspectionData.note}</p>
        </div>
      ) : (
        <ul>
          {histories.map((history) => (
            <li key={history.id} className={styles.historyItem}>
              <p><strong>Date & Time:</strong> {history.created_at}</p>
              <p><strong>Inspection ID:</strong> {history.id}</p>
              <p><strong>Name:</strong> {history.name}</p>
              <p><strong>Standard:</strong> {history.standard}</p>
              <p><strong>Note:</strong> {history.note}</p>
              <div className={styles.actions}>
                <Link href={`/history/${history.id}`} className={styles.viewLink}>View</Link>
                <button onClick={() => handleDelete(history.id)} className={styles.deleteButton}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
