import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  // Form state
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    standard: '',
    note: '',
    price: '',
    samplingPoint: [],
    samplingDateTime: '',
    upload: null,
  });

  const [message, setMessage] = useState('');
  const [standards, setStandards] = useState([]);

useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch('/standards.json');
        
        // Check if fetch response was okay
        if (!response.ok) {
          throw new Error(`Failed to fetch standards: ${response.statusText}`);
        }

        const data = await response.json();
        setStandards(data);
      } catch (error) {
        console.error('Error fetching standards:', error);
      }
    };

    fetchStandards();
}, []);



  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      // Handle checkbox multiple selections (sampling points)
      setFormData((prevState) => ({
        ...prevState,
        samplingPoint: checked
          ? [...prevState.samplingPoint, value]
          : prevState.samplingPoint.filter((item) => item !== value),
      }));
    } else if (type === 'file') {
      // Handle file upload
      setFormData({ ...formData, upload: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.standard) {
      setMessage('Please fill out all required fields.');
      return;
    }

    // Validate price range
    if (formData.price && (formData.price < 0 || formData.price > 100000)) {
      setMessage('Price must be between 0 and 100,000.');
      return;
    }

    const formSubmission = {
      ...formData,
      upload: formData.upload ? formData.upload.name : null, // sending only file name
    };

    // Post the data to /history API endpoint
    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formSubmission),
      });

      const result = await response.json();
      if (response.ok && result.data.id) {
        // Redirect to the newly created entry page
        router.push(`/history/${String(result.data.id)}`);
        setMessage('Form submitted successfully.');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setMessage('An error occurred while submitting the form.');
    } 
  };

  return (
    <div>
      <h1>Data Submission Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Name field */}
        <label>
          Name (required):
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        {/* Standard field (dropdown) */}
        <label>
          Standard (required):
          <select
            name="standard"
            value={formData.standard}
            onChange={handleChange}
            required
          >
            <option value="">Select a standard</option>
            {standards.map((std) => (
              <option key={std.id} value={std.id}>
                {std.name}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Note field */}
        <label>
          Note:
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Price field */}
        <label>
          Price (optional, 0-100,000):
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            max="100000"
            step="0.01"
          />
        </label>
        <br />

        {/* Sampling Point (multiple checkboxes) */}
        <fieldset>
          <legend>Sampling Point (optional):</legend>
          <label>
            <input
              type="checkbox"
              name="samplingPoint"
              value="Front End"
              checked={formData.samplingPoint.includes('Front End')}
              onChange={handleChange}
            />
            Front End
          </label>
          <label>
            <input
              type="checkbox"
              name="samplingPoint"
              value="Back End"
              checked={formData.samplingPoint.includes('Back End')}
              onChange={handleChange}
            />
            Back End
          </label>
          <label>
            <input
              type="checkbox"
              name="samplingPoint"
              value="Other"
              checked={formData.samplingPoint.includes('Other')}
              onChange={handleChange}
            />
            Other
          </label>
        </fieldset>
        <br />

        {/* Date/Time of Sampling field */}
        <label>
          Date/Time of Sampling (optional):
          <input
            type="datetime-local"
            name="samplingDateTime"
            value={formData.samplingDateTime}
            onChange={handleChange}
          />
        </label>
        <br />

        {/* File upload */}
        <label>
          Upload (.json file) (optional):
          <input
            type="file"
            name="upload"
            accept=".json"
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Submit button */}
        <button type="submit">Submit</button>
      </form>

      {/* Feedback message */}
      {message && <p>{message}</p>}
    </div>
  );
}
