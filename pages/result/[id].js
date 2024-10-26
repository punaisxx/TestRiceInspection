// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';

// const ResultPage = () => {
//   const router = useRouter();
//   const { id } = router.query;

//   const [resultData, setResultData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (id) {
//       fetch(`/api/result/${id}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Failed to fetch the result');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           setResultData(data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           setError(err.message);
//           setLoading(false);
//         });
//     }
//   }, [id]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;
//   if (!resultData) return <div>No result found.</div>;

//   return (
//     <div>
//       <h1>Result Details</h1>
//       <p><strong>Name:</strong> {resultData.name}</p>
//       <p><strong>Standard:</strong> {resultData.standard}</p>
//       <p><strong>Note:</strong> {resultData.note}</p>
//       <p><strong>Price:</strong> {resultData.price}</p>
//       <p><strong>Sampling Point:</strong> {resultData.sampling_point}</p>
//       <p><strong>Sampling Date/Time:</strong> {resultData.sampling_datetime}</p>
//       <p><strong>Upload:</strong> {resultData.upload}</p>
//       <p><strong>Created At:</strong> {new Date(resultData.created_at).toLocaleString()}</p>
//       <p><strong>Updated At:</strong> {new Date(resultData.updated_at).toLocaleString()}</p>
//       <p><strong>Total Sample:</strong> {resultData.total_sample}</p>
//       <h2>Results</h2>
//       <pre>{JSON.stringify(JSON.parse(resultData.results), null, 2)}</pre>
//     </div>
//   );
// };

// export default ResultPage;

// import React, { useEffect, useState } from 'react';
// import { useParams, useHistory } from 'react-router-dom'; // Assuming you use React Router for navigation

// const ResultPage = () => {
//   const { id } = useParams(); // Get the inspection ID from the URL
//   const [inspectionData, setInspectionData] = useState(null);
//   const [standard, setStandard] = useState(null);
//   const [error, setError] = useState('');
//   const history = useHistory();

//   // Fetch inspection result by ID
//   useEffect(() => {
//     const fetchInspectionData = async () => {
//       try {
//         const response = await fetch(`/api/history/${id}`); // Adjust this API endpoint to fetch inspection by ID
//         if (!response.ok) {
//           throw new Error('Failed to fetch inspection data');
//         }
//         const data = await response.json();
//         setInspectionData(data);
//         fetchStandard(data.standard); // Fetch the corresponding standard based on the selected standard
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchInspectionData();
//   }, [id]);

//   // Fetch the standard data
//   const fetchStandard = async (standardName) => {
//     try {
//       const response = await fetch('/standards.json'); // Adjust the path if needed
//       const standards = await response.json();
//       const foundStandard = standards.find((std) => std.name === standardName);
//       setStandard(foundStandard);
//     } catch (err) {
//       setError('Failed to fetch standards data');
//     }
//   };

//   if (error) {
//     return <div>Error: {error}</div>; // Display error message if fetching fails
//   }

//   if (!inspectionData || !standard) {
//     return <div>Loading...</div>; // Show loading state while data is being fetched
//   }

//   // Destructure inspection data for easier access
//   const {
//     name,
//     note,
//     price,
//     samplingDateTime,
//     samplingPoint,
//     total_sample,
//     composition,
//     defect_rice,
//     createdAt,
//     updatedAt,
//   } = inspectionData;

//   return (
//     <div>
//       <h1>Inspection Result</h1>

//       <h2>Basic Information</h2>
//       <p><strong>Create Date - Time:</strong> {new Date(createdAt).toLocaleString()}</p>
//       <p><strong>Inspection ID:</strong> {id}</p>
//       <p><strong>Standard:</strong> {standard.name}</p>
//       <p><strong>Total Sample:</strong> {total_sample}</p>
//       <p><strong>Update Date - Time:</strong> {new Date(updatedAt).toLocaleString()}</p>
//       <p><strong>Note:</strong> {note}</p>
//       {price && <p><strong>Price:</strong> {price}</p>}
//       {samplingDateTime && <p><strong>Date/Time of Sampling:</strong> {new Date(samplingDateTime).toLocaleString()}</p>}
//       {samplingPoint && <p><strong>Sampling Point:</strong> {samplingPoint.join(', ')}</p>}

//       <h2>Inspection Result</h2>

//       {/* Composition Table */}
//       <h3>Composition</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Length (mm)</th>
//             <th>Actual (%)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {standard.standardData.map((data) => (
//             <tr key={data.key}>
//               <td>{data.name}</td>
//               <td>{data.minLength} - {data.maxLength}</td>
//               <td>{composition[data.key] || 0}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Defect Rice Table */}
//       <h3>Defect Rice</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Actual (%)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.keys(defect_rice).map((key) => (
//             <tr key={key}>
//               <td>{key}</td>
//               <td>{defect_rice[key] || 0}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Navigation Buttons */}
//       <button onClick={() => history.push('/create-inspection')}>Back</button>
//       <button onClick={() => history.push(`/edit-result/${id}`)}>Edit</button>
//     </div>
//   );
// };

// export default ResultPage;
