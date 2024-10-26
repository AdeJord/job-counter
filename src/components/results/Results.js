import React, { useState } from 'react';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';

function Results({ data }) {
  // List of inspectors to include
  const allowedInspectors = [
    'ADRIAN JORDAN',
    'MARK HOPCROFT',
    'MO KHAN',
    'ANTHONY HATCHER',
    'MAHESH VERMA'
  ];

  // State for sorting and toggling views
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showAllInspectors, setShowAllInspectors] = useState(true); // Toggle state: true shows all inspectors, false shows only allowed

  // Toggle handler for the switch
  const handleToggle = () => {
    setShowAllInspectors(!showAllInspectors);
  };

  // Sorting handler
  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort the data based on the toggle and sortConfig
  const filteredData = Object.entries(data || {})
    .filter(([inspector]) => showAllInspectors || allowedInspectors.includes(inspector)) // Filter if showing only allowed inspectors
    .sort((a, b) => {
      const [aInspector, aStats] = a;
      const [bInspector, bStats] = b;

      let comparison = 0;
      if (sortConfig.key === 'inspector') {
        comparison = aInspector.localeCompare(bInspector);
      } else if (sortConfig.key === 'totalJobs') {
        comparison = aStats.totalJobs - bStats.totalJobs;
      } else if (sortConfig.key === 'avgJobsPerDay') {
        comparison = aStats.avgJobsPerDay - bStats.avgJobsPerDay;
      }

      return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });

  if (!data || Object.keys(data).length === 0) {
    return <p>No data available. Please upload files to see the results.</p>;
  }

  return (
    <div>
      <h2>Inspector Job Count Results</h2>

      {/* Toggle Switch */}
      <label>
        <input
          type="checkbox"
          checked={showAllInspectors}
          onChange={handleToggle}
        />
        Show {showAllInspectors ? 'Allowed Inspectors Only' : 'All Inspectors'}
      </label>

      {/* Data Table */}
      <table border="1" style={{ marginTop: '20px' }}>
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
          {filteredData.map(([inspector, stats]) => (
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
