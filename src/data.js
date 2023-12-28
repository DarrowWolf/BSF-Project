import React, { useState, useEffect } from "react";
import { fetchDataFromDynamoDB } from "./DynamoDBService";

const Data = () => {
  const [items, setItems] = useState([]);

  const fetchData = async () => {
    try {
      const fetchedData = await fetchDataFromDynamoDB();
      const itemsWithNewIds = fetchedData.map((item, index) => ({
        ...item,
        Sensor_Id: index + 1, // Assign sequential IDs starting from 1
      }));
      setItems(itemsWithNewIds);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch initial data immediately when the component mounts

    const interval = setInterval(() => {
      fetchData(); // Fetch new data at intervals
    }, 5000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div>
      <h1>Data from DynamoDB Table</h1>
      <ul>
        {items.map((item) => (
          <li key={item.Sensor_Id}>
            Sensor Check: {item.Sensor_Id}, Temperature: {item.Temperature}°C,
            Humidity: {item.Humidity}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Data;
