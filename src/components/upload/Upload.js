import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function Upload({ onDataUpdate }) {
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFiles) {
      processFiles(selectedFiles);
    } else {
      alert('Please select files to upload.');
    }
  };

  const processFiles = (files) => {
    const inspectorData = {};

    Array.from(files).forEach((file, dayIndex) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          jsonData.forEach((row) => {
            const inspector = row['Inspector'];
            const leg = row['Leg'];

            // Include "In 1/1" and "In 1/2"
            if (inspector && (leg === 'In 1/1' || leg === 'In 1/2')) {
              // Initialize inspector's data if not already done
              if (!inspectorData[inspector]) {
                inspectorData[inspector] = {
                  totalJobs: 0,
                  activeDays: new Set(),
                };
              }
              // Increment job count
              inspectorData[inspector].totalJobs++;
              // Track the day (using `dayIndex` as a unique identifier for each spreadsheet/day)
              inspectorData[inspector].activeDays.add(dayIndex);
            }
          });
        });

        // Calculate average jobs per day for each inspector
        const processedData = Object.entries(inspectorData).reduce((acc, [inspector, stats]) => {
          const totalJobs = stats.totalJobs;
          const activeDaysCount = stats.activeDays.size; // Unique days worked
          const avgJobsPerDay = activeDaysCount > 0 ? (totalJobs / activeDaysCount).toFixed(2) : 0;
          
          acc[inspector] = {
            totalJobs,
            avgJobsPerDay: parseFloat(avgJobsPerDay), // Convert to float for display
          };
          return acc;
        }, {});

        // Pass processed data to the parent component
        onDataUpdate(processedData);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      <h2>Upload Files</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Upload;
