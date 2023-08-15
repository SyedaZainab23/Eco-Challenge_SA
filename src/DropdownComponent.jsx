import React, { useEffect, useState } from 'react';
//import axios from 'axios'; 

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import './App.css';
import Map, { NavigationControl } from "react-map-gl/maplibre";
import { withIdentityPoolId } from "@aws/amazon-location-utilities-auth-helper";

import "maplibre-gl/dist/maplibre-gl.css";

// Amazon Hub Lockers in Vancouver as a GeoJSON FeatureCollection
import lockerGeoJSON from "./lockers.json";

// React Component that renders markers for all provided lockers
import LockerMarkers from "./LockerMarkers";

const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID;
const region = import.meta.env.VITE_REGION;
const mapName = import.meta.env.VITE_MAP_NAME;

const authHelper = await withIdentityPoolId(identityPoolId);

// transform GeoJSON features into simplified locker objects
// const lockers = convertToGeoJSON.features.map(
//   ({
//     geometry: {
//       coordinates: [longitude, latitude],
//     },
//   }) => ({
//     latitude,
//     longitude,
//     })
// );



const DropdownComponent = () => {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedIdData, setSelectedIdData] = useState(null); // State to store the API response for the selected ID
  const [convertedData, setConvertedData] = useState(null);


  
  useEffect(() => {
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint that returns your data.
    const fetchData = async () => {
      try {
        const response = await fetch('https://tkhmrv3pyf.execute-api.sa-east-1.amazonaws.com/dev/get_teams');
        const json=await response.json()
        setData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = async (event) => {
    const selectedId = event.target.value;
    setSelectedOption(selectedId);
    const headers = {
      'Content-Type': 'application/json', // Set your desired headers here
      // Other headers if needed
    };

    const requestData = { ID:  parseInt(selectedId,10) }
    console.log(requestData)

    
    if (selectedId) {
      try {
        const response = await fetch('https://tkhmrv3pyf.execute-api.sa-east-1.amazonaws.com/dev/map', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestData)
        });
        const json=await response.json()
        setSelectedIdData(json);
        const converted = convertToGeoJSON(json);
        setConvertedData(converted);
        console.log(converted)
      } catch (error) {
        console.error('Error fetching selected ID data:', error);
      }
    } else {
      setSelectedIdData(null);
    }
  };
  const convertToGeoJSON = (data) => {
    try {
      const parsedData = JSON.parse(data.body); // Parse the body to JSON
      const features = parsedData.map(item => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.longitude, item.latitude]
        }
      }));

      return {
        features: features
      };
    } catch (error) {
      console.error('Error converting to GeoJSON:', error);
      return null;
    }
  };

  const lockers =
  convertedData &&
  convertedData.features.map(({ geometry: { coordinates: [longitude, latitude] } }) => ({
    latitude,
    longitude,
  }));
  return (
    <div>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="">Select Favourite Team</option>
        {data.map((item) => (
          <option key={item} value={item}>
            {item} {/* Replace 'name' with the key holding the display value */}
          </option>
        ))}
      </select>
      {convertedData && (
        <Map
        // See https://visgl.github.io/react-map-gl/docs/api-reference/map
        initialViewState={{
          latitude: -49.5466,
          longitude: -50.1595,
          zoom: 3,

        }}
        
        style={{ height: "95vh", width: "45vw" }}
        mapStyle={`https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`}
        {...authHelper.getMapAuthenticationOptions()}
      >
        {/* See https://visgl.github.io/react-map-gl/docs/api-reference/navigation-control */}
        <NavigationControl position="bottom-right" showZoom showCompass={false} />
        

        {/* Render markers for all lockers, with a popup for the selected locker */}
        <LockerMarkers lockers={lockers} />
      </Map>
      )}
      
      
  
    </div>
  );
};

export default DropdownComponent;



