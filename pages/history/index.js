// pages/history/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchHistoryData();
  }, [currentPage]);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history?page=${currentPage}&id=${searchId}`);
      const data = await response.json();
      setHistoryData(data.records || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching history data:', error);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1); // Reset to the first page when searching
    fetchHistoryData();
  };

  const handleDelete = async () => {
    if (!selectedIds.length) return;

    const confirmed = confirm("Are you sure you want to delete the selected records?");
    if (confirmed) {
      try {
        await fetch('/api/history', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: selectedIds }),
        });
        setSelectedIds([]); // Clear selection after deletion
        fetchHistoryData(); // Refresh the history
      } catch (error) {
        console.error('Error deleting history:', error);
      }
    }
  };

  const toggleSelectId = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearSearch = () => {
    setSearchId('');
    setCurrentPage(1);
    fetchHistoryData();
  };

  const handleRowClick = (id) => {
    router.push(`/history/${id}`);
  };

  return (
    <div>
      <h1>Inspection History</h1>

      {/* Search Input */}
      <input
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Search by Inspection ID"
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleClearSearch}>Clear</button>

      {/* Delete Button */}
      <button onClick={handleDelete} disabled={!selectedIds.length}>Delete Selected</button>

      {/* History Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Create Date - Time</th>
              <th>Inspection ID</th>
              <th>Name</th>
              <th>Standard</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((record) => (
              <tr key={record.id} onClick={() => handleRowClick(record.id)}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(record.id)}
                    onChange={() => toggleSelectId(record.id)}
                  />
                </td>
                <td>{new Date(record.createdAt).toLocaleString()}</td>
                <td>{record.id}</td>
                <td>{record.name}</td>
                <td>{record.standard}</td>
                <td>{record.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {/* <div>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div> */}
    </div>
  );
}

// /pages/history.js

// // /pages/history.js

// import { useState, useEffect } from 'react';

// export default function History() {
//   const [historyData, setHistoryData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const response = await fetch('/api/history');
//         const data = await response.json();
//         setHistoryData(data);
//       } catch (error) {
//         console.error('Error fetching history data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Inspection History</h2>
//       <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
//         <thead>
//           <tr>
//             <th>Create Date - Time</th>
//             <th>Inspection ID</th>
//             <th>Name</th>
//             <th>Standard</th>
//             <th>Note</th>
//             <th>Total Sample</th>
//             <th>Results</th>
//           </tr>
//         </thead>
//         <tbody>
//           {historyData.map((item, index) => (
//             <tr key={index}>
//               <td>{new Date(item.createDateTime).toLocaleString()}</td>
//               <td>{item.inspectionID}</td>
//               <td>{item.name}</td>
//               <td>{item.standard}</td>
//               <td>{item.note}</td>
//               <td>{item.totalSample}</td>
//               <td>
//                 <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
//                   {JSON.stringify(item.results, null, 2)}
//                 </pre>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
