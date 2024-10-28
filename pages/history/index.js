import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function HistoryPage() {
  const [histories, setHistories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectionData, setInspectionData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    standard: '',
    note: '',
    price: '',
    samplingPoint: '',
    samplingDateTime: '',
    upload: null,
  });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => formPayload.append(key, formData[key]));

    try {
      const response = await axios.post('/api/history', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setHistories([response.data.data, ...histories]);
      setFormData({
        name: '',
        standard: '',
        note: '',
        price: '',
        samplingPoint: '',
        samplingDateTime: '',
        upload: null,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit data.');
    }
    setLoading(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      upload: file,
    }));
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
    <div>
      <h1>History Records</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Enter Inspection ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <hr />

      {/* Display search result if available, otherwise list all records */}
      {inspectionData ? (
        <div>
          <h2>Inspection Details</h2>
          <p><strong>Name:</strong> {inspectionData.name}</p>
          <p><strong>Standard:</strong> {inspectionData.standard}</p>
          <p><strong>Note:</strong> {inspectionData.note}</p>
          <p><strong>Price:</strong> {inspectionData.price}</p>
          <p><strong>Sampling Point:</strong> {inspectionData.sampling_point}</p>
          <p><strong>Date & Time:</strong> {inspectionData.sampling_datetime}</p>
        </div>
      ) : (
        <ul>
          {histories.map((history) => (
            <li key={history.id}>
              <h3>
                <Link href={`/history/${history.id}`}>{history.name}</Link>
              </h3>
              <p><strong>Standard:</strong> {history.standard}</p>
              <p><strong>Note:</strong> {history.note}</p>
              <p><strong>Price:</strong> {history.price}</p>
              <p><strong>Sampling Point:</strong> {history.sampling_point}</p>
              <p><strong>Date & Time:</strong> {history.sampling_datetime}</p>
              <p><strong>Total Samples:</strong> {history.total_sample}</p>
              <button onClick={() => handleDelete(history.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
