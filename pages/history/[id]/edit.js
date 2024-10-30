// pages/history/[id]/edit.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '/Users/rawinnipha/Test/next-app/styles/EditInspection.module.css';

export default function EditInspection() {
  const router = useRouter();
  const { id } = router.query;  
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
        router.push(`/history/${id}`);  
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
    <div className={styles.container}>
      <h1>Edit Inspection</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Note:</label>
          <textarea
            name="note"
            className={styles.formInput}
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
            className={styles.formInput}
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Sampling Date/Time:</label>
          <input
            type="datetime-local"
            name="samplingDateTime"
            className={styles.formInput}
            value={formData.samplingDateTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Sampling Point:</label>
          <input
            type="text"
            name="samplingPoint"
            className={styles.formInput}
            value={formData.samplingPoint}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
    </div>
  );
}
