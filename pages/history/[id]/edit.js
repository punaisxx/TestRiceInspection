// pages/history/[id]/edit.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditInspection() {
  const router = useRouter();
  const { id } = router.query;  // Get ID from the URL
  const [formData, setFormData] = useState({
    note: '',
    price: '',
    samplingDateTime: '',
    samplingPoint: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchInspectionData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/history/${id}`);
        const data = await response.json();
        if (response.ok) {
          setFormData({
            note: data.note || '',
            price: data.price || '',
            samplingDateTime: data.sampling_datetime || '',
            samplingPoint: data.sampling_point || ''
          });
        } else {
          console.error('Failed to load data');
        }
      } catch (error) {
        console.error('Error fetching inspection data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInspectionData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/history/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        router.push(`/history/${id}`);  // Redirect to the result page
      } else {
        console.error('Failed to update inspection');
      }
    } catch (error) {
      console.error('Error updating inspection:', error);
    }
  };

  const handleCancel = () => {
    router.push(`/history/${id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Inspection</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Note:</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Sampling Date/Time:</label>
          <input
            type="datetime-local"
            name="samplingDateTime"
            value={formData.samplingDateTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Sampling Point:</label>
          <input
            type="text"
            name="samplingPoint"
            value={formData.samplingPoint}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleCancel}>Cancel</button>
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
}
