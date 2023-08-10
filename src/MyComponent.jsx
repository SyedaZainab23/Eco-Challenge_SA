import React, { useState } from 'react';
import './MyComponent.css'; // Make sure to create and link your CSS file


const MyComponent = () => {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);


  const fetchData = async () => {
    try {
      if (showTable) {
        // Hide the table if it's already shown
        setShowTable(false);}
      else{
      const response = await fetch('  https://tkhmrv3pyf.execute-api.sa-east-1.amazonaws.com/dev/top_teams');
      const jsonData = await response.json();
      setData(jsonData);
      setShowTable(true);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Leadership Board</button>
      {showTable && (
        <div className="table-container">
          <table className="data-table">
            <thead>
          <tr>
            <th>Position</th>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.Position}>
              <td>{item.Position}</td>
              <td>{item.ID}</td>
              <td>{item.Name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      )}
    </div>  
      
  );
};

export default MyComponent;
