import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function Results({ data }) {
  // List of inspectors to include
  const allowedInspectors = [
    'ADRIAN JORDAN',
    'MARK HOPCROFT',
    'MO KHAN',
    'ANTHONY HATCHER',
    'MAHESH VERMA'
  ];

  // States for sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Sorting handler
  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sorting logic applied to data
  const sortedData = Object.entries(data || {})
    // Filter out inspectors who are not in the allowed list
    .filter(([inspector]) => allowedInspectors.includes(inspector))
    // Sort based on the selected column and direction
    .sort((a, b) => {
      const [aInspector, aStats] = a;
      const [bInspector, bStats] = b;

      let comparison = 0;
      if (sortConfig.key === 'inspector') {
        comparison = aInspector.localeCompare(bInspector); // Alphabetical sort by name
      } else if (sortConfig.key === 'totalJobs') {
        comparison = aStats.totalJobs - bStats.totalJobs; // Numeric sort by total jobs
      } else if (sortConfig.key === 'avgJobsPerDay') {
        comparison = aStats.avgJobsPerDay - bStats.avgJobsPerDay; // Numeric sort by avg jobs
      }

      return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });

  // Download the data as an Excel file
//   const handleDownload = () => {
//     const wb = XLSX.utils.book_new();
//     const wsData = [['Inspector', 'Total Jobs', 'Average Jobs Per Day']]; // Header row
//     Object.entries(data || {})
//       .filter(([inspector]) => allowedInspectors.includes(inspector)) // Ensure only filtered data is downloaded
//       .forEach(([inspector, stats]) => {
//         wsData.push([inspector, stats.totalJobs, stats.avgJobsPerDay]);
//       });

//     const ws = XLSX.utils.aoa_to_sheet(wsData);
//     XLSX.utils.book_append_sheet(wb, ws, 'Inspector Data');

//     const xlsxBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'blob' });
//     saveAs(xlsxBlob, 'results.xlsx');
//   };

  // Check if there is any data before rendering the table
  if (!data || Object.keys(data).length === 0) {
    return <p>No data available. Please upload files to see the results.</p>;
  }

  return (
    <div>
      <h2>Inspector Job Count Results</h2>

      {/* Data Table */}
      <table border="1">
        <thead>
          <tr>
            <th onClick={() => sortData('inspector')}>
              Inspector {sortConfig.key === 'inspector' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
            </th>
            <th onClick={() => sortData('totalJobs')}>
              Total Jobs {sortConfig.key === 'totalJobs' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
            </th>
            <th onClick={() => sortData('avgJobsPerDay')}>
              Average Jobs Per Day {sortConfig.key === 'avgJobsPerDay' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(([inspector, stats]) => (
            <tr key={inspector}>
              <td>{inspector}</td>
              <td>{stats.totalJobs}</td>
              <td>{stats.avgJobsPerDay}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <button onClick={handleDownload}>Download as XLSX</button> */}
    </div>
  );
}

export default Results;
