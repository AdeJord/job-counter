// src/components/Upload.js
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
    const inspectorCount = {};
    const numberOfDays = files.length; // Treat each file as one day

    Array.from(files).forEach((file) => {
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

            if (inspector && leg === 'In 1/2') {
              if (!inspectorCount[inspector]) {
                inspectorCount[inspector] = 0;
              }
              inspectorCount[inspector]++;
            }
          });
        });

        // After processing, calculate average jobs per day based on the number of files (days)
        const inspectorData = {};
        Object.keys(inspectorCount).forEach((inspector) => {
          const totalJobs = inspectorCount[inspector];
          const avgJobsPerDay = totalJobs / numberOfDays;
          inspectorData[inspector] = {
            totalJobs,
            avgJobsPerDay: avgJobsPerDay.toFixed(2),
          };
        });

        // Pass the inspector data back to the parent component
        onDataUpdate(inspectorData);
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
