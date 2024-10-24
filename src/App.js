// src/App.js
import React, { useState } from 'react';
import Upload from './components/upload/Upload';
import Results from './components/results/Results';

function App() {
  const [inspectorData, setInspectorData] = useState(null);

  // Function to handle file upload and pass data back
  const handleDataUpdate = (data) => {
    setInspectorData(data);
  };

  return (
    <div className="App">
      <h1>Inspector Job Counter</h1>
      {/* Render the Upload component */}
      <Upload onDataUpdate={handleDataUpdate} />

      {/* Conditionally render Results if inspectorData is available */}
      {inspectorData && <Results data={inspectorData} />}
    </div>
  );
}

export default App;
