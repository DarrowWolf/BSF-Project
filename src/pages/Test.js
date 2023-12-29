// import React, { useState, useEffect } from "react";
// import {
// 	LineChart,
// 	Line,
// 	XAxis,
// 	YAxis,
// 	CartesianGrid,
// 	Tooltip,
// 	Legend,
// } from "recharts";
// import generateTestData from "../components/testData";

// const Test = () => {
// 	const [originalItems, setOriginalItems] = useState([]);
// 	const [items, setItems] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [selectedDataKey, setSelectedDataKey] = useState("Both");
// 	const [selectedTimeRange, setSelectedTimeRange] = useState("All");

// 	const formatTimestamp = (timestamp) => {
// 		const formattedTime = new Date(timestamp * 1000);
// 		const hours = formattedTime.getHours();
// 		const minutes = formattedTime.getMinutes();
// 		const seconds = formattedTime.getSeconds();
// 		const ampm = hours >= 12 ? "PM" : "AM";
// 		const formattedHours = hours % 12 || 12;
// 		const formattedTimeString = `${formattedHours}:${minutes}${ampm}`;
// 		return formattedTimeString;
// 	};

// 	const filterDataByTimeRange = (data, timeRange) => {
// 		const currentDate = new Date();
// 		switch (timeRange) {
// 			case "Today":
// 				return data.filter((item) => {
// 					const itemDate = new Date(item.Timestamp * 1000);
// 					return (
// 						itemDate.getDate() === currentDate.getDate() &&
// 						itemDate.getMonth() === currentDate.getMonth() &&
// 						itemDate.getFullYear() === currentDate.getFullYear()
// 					);
// 				});
// 			case "Past7Days":
// 				const sevenDaysAgo = new Date();
// 				sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
// 				return data.filter(
// 					(item) => new Date(item.Timestamp * 1000) >= sevenDaysAgo
// 				);
// 			case "ThisMonth":
// 				return data.filter((item) => {
// 					const itemDate = new Date(item.Timestamp * 1000);
// 					return (
// 						itemDate.getMonth() === currentDate.getMonth() &&
// 						itemDate.getFullYear() === currentDate.getFullYear()
// 					);
// 				});
// 			default:
// 				return data;
// 		}
// 	};

// 	const fetchData = async () => {
// 		try {
// 			// Use the test data generator during testing
// 			// Replace this with fetchDataFromDynamoDB for production
// 			const fetchedData = generateTestData();

// 			fetchedData.sort((a, b) => a.Timestamp - b.Timestamp);

// 			setOriginalItems(fetchedData); // Store the original dataset
// 			const filteredData = filterDataByTimeRange(
// 				fetchedData,
// 				selectedTimeRange
// 			);

// 			const itemsWithNewIds = filteredData.map((item, index) => ({
// 				...item,
// 				Sensor_Id: index + 1,
// 				Timestamp: formatTimestamp(item.Timestamp),
// 			}));

// 			setItems(itemsWithNewIds);
// 			setLoading(false);
// 		} catch (error) {
// 			console.error("Error fetching data:", error);
// 		}
// 	};

// 	useEffect(() => {
// 		const fetchDataAndAnimate = async () => {
// 			await fetchData();
// 			const interval = setInterval(fetchData, 120000);

// 			return () => clearInterval(interval);
// 		};

// 		fetchDataAndAnimate();
// 	}, [selectedTimeRange]);

// 	const handleDataKeyChange = (newDataKey) => {
// 		setSelectedDataKey(newDataKey);
// 	};

// 	const handleTimeRangeChange = (newTimeRange) => {
// 		setSelectedTimeRange(newTimeRange);

// 		// Apply filtering on the original dataset when the time range changes
// 		const filteredData = filterDataByTimeRange(originalItems, newTimeRange);

// 		const itemsWithNewIds = filteredData.map((item, index) => ({
// 			...item,
// 			Sensor_Id: index + 1,
// 			Timestamp: formatTimestamp(item.Timestamp),
// 		}));

// 		setItems(itemsWithNewIds);
// 	};

// 	const renderTooltipContent = (props) => {
// 		const { payload, label } = props;
// 		let temperatureValue = "";
// 		let humidityValue = "";

// 		payload.forEach((entry) => {
// 			if (entry.name === "Temperature") {
// 				temperatureValue = entry.value + "°C";
// 			} else if (entry.name === "Humidity") {
// 				humidityValue = entry.value + "%";
// 			}
// 		});

// 		return (
// 			<div className="custom-tooltip">
// 				<p>{label}</p>
// 				{temperatureValue && <p>Temperature: {temperatureValue}</p>}
// 				{humidityValue && <p>Humidity: {humidityValue}</p>}
// 			</div>
// 		);
// 	};

// 	return (
// 		<div>
// 			<h1>Data from DynamoDB Table</h1>
// 			<div>
// 				{/* Dropdown to select data key */}
// 				<label htmlFor="dataKeySelect">Select Data:</label>
// 				<select
// 					id="dataKeySelect"
// 					value={selectedDataKey}
// 					onChange={(e) => handleDataKeyChange(e.target.value)}
// 				>
// 					<option value="Both">Both</option>
// 					<option value="Temperature">Temperature</option>
// 					<option value="Humidity">Humidity</option>
// 				</select>

// 				{/* Dropdown to select time range */}
// 				<label htmlFor="timeRangeSelect">Select Time Range:</label>
// 				<select
// 					id="timeRangeSelect"
// 					value={selectedTimeRange}
// 					onChange={(e) => handleTimeRangeChange(e.target.value)}
// 				>
// 					<option value="All">All</option>
// 					<option value="Today">Today</option>
// 					<option value="Past7Days">Past 7 Days</option>
// 					<option value="ThisMonth">This Month</option>
// 				</select>
// 			</div>

// 			<ul>
// 				{items.map((item) => (
// 					<li key={item.Sensor_Id}>
// 						Sensor Check: {item.Sensor_Id},{" "}
// 						{selectedDataKey === "Both"
// 							? `Temperature: ${item.Temperature}°C, Humidity: ${item.Humidity}%`
// 							: `${selectedDataKey}: ${item[selectedDataKey]}`}
// 					</li>
// 				))}
// 			</ul>

// 			{!loading && items.length > 0 && (
// 				<LineChart width={600} height={300} data={items}>
// 					<XAxis dataKey="Timestamp" />
// 					<YAxis />
// 					<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
// 					{selectedDataKey === "Both" ? (
// 						<>
// 							<Line
// 								type="monotone"
// 								dataKey="Temperature"
// 								stroke="#8884d8"
// 								name="Temperature"
// 								isAnimationActive={true}
// 								animationBegin={0}
// 								animationDuration={2000}
// 							/>
// 							<Line
// 								type="monotone"
// 								dataKey="Humidity"
// 								stroke="#82ca9d"
// 								name="Humidity"
// 								isAnimationActive={true}
// 								animationBegin={0}
// 								animationDuration={2000}
// 							/>
// 						</>
// 					) : (
// 						<Line
// 							type="monotone"
// 							dataKey={selectedDataKey}
// 							stroke={selectedDataKey === "Temperature" ? "#8884d8" : "#82ca9d"}
// 							name={selectedDataKey}
// 							isAnimationActive={true}
// 							animationBegin={0}
// 							animationDuration={2000}
// 						/>
// 					)}
// 					<Tooltip content={renderTooltipContent} />
// 					<Legend />
// 				</LineChart>
// 			)}
// 		</div>
// 	);
// };

// export default Test;

import React, { useState, useEffect } from "react";
import { fetchDataFromDynamoDB } from "../components/DynamoDBService";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";

const Test = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedDataKey, setSelectedDataKey] = useState("Both"); // Default to "Both"
	const [selectedTimeRange, setSelectedTimeRange] = useState("All"); // Default to "All"

	const formatTimestamp = (timestamp) => {
		const formattedTime = new Date(timestamp * 1000);
		const hours = formattedTime.getHours();
		const minutes = formattedTime.getMinutes();
		const seconds = formattedTime.getSeconds();
		const ampm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 || 12;
		const formattedTimeString = `${formattedHours}:${minutes}${ampm}`;
		return formattedTimeString;
	};

	const filterDataByTimeRange = (data, timeRange) => {
		const currentDate = new Date();
		switch (timeRange) {
			case "Today":
				return data.filter((item) => {
					const itemDate = new Date(item.Timestamp * 1000);
					return (
						itemDate.getDate() === currentDate.getDate() &&
						itemDate.getMonth() === currentDate.getMonth() &&
						itemDate.getFullYear() === currentDate.getFullYear()
					);
				});
			case "Past7Days":
				const sevenDaysAgo = new Date();
				sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
				return data.filter(
					(item) => new Date(item.Timestamp * 1000) >= sevenDaysAgo
				);
			case "ThisMonth":
				return data.filter((item) => {
					const itemDate = new Date(item.Timestamp * 1000);
					return (
						itemDate.getMonth() === currentDate.getMonth() &&
						itemDate.getFullYear() === currentDate.getFullYear()
					);
				});
			case "Past10Minutes":
				const tenMinutesAgo = new Date();
				tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
				return data.filter(
					(item) => new Date(item.Timestamp * 1000) >= tenMinutesAgo
				);
			default:
				return data;
		}
	};

	const fetchData = async () => {
		try {
			const fetchedData = await fetchDataFromDynamoDB();
			fetchedData.sort((a, b) => a.Timestamp - b.Timestamp);

			const filteredData = filterDataByTimeRange(
				fetchedData,
				selectedTimeRange
			);

			const itemsWithNewIds = filteredData.map((item, index) => ({
				...item,
				Sensor_Id: index + 1,
				Timestamp: formatTimestamp(item.Timestamp),
			}));

			setItems(itemsWithNewIds);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		const fetchDataAndAnimate = async () => {
			await fetchData();
			const interval = setInterval(fetchData, 120000);

			return () => clearInterval(interval);
		};

		fetchDataAndAnimate();
	}, [selectedTimeRange]);

	const handleDataKeyChange = (newDataKey) => {
		setSelectedDataKey(newDataKey);
	};

	const handleTimeRangeChange = (newTimeRange) => {
		setSelectedTimeRange(newTimeRange);
	};

	const renderTooltipContent = (props) => {
		const { payload, label } = props;
		let temperatureValue = "";
		let humidityValue = "";

		payload.forEach((entry) => {
			if (entry.name === "Temperature") {
				temperatureValue = entry.value + "°C";
			} else if (entry.name === "Humidity") {
				humidityValue = entry.value + "%";
			}
		});

		return (
			<div className="custom-tooltip">
				<p>{label}</p>
				{temperatureValue && <p>Temperature: {temperatureValue}</p>}
				{humidityValue && <p>Humidity: {humidityValue}</p>}
			</div>
		);
	};

	return (
		<div>
			<h1>Data from DynamoDB Table</h1>
			<div>
				{/* Dropdown to select data key */}
				<label htmlFor="dataKeySelect">Select Data:</label>
				<select
					id="dataKeySelect"
					value={selectedDataKey}
					onChange={(e) => handleDataKeyChange(e.target.value)}
				>
					<option value="Both">Both</option>
					<option value="Temperature">Temperature</option>
					<option value="Humidity">Humidity</option>
				</select>

				{/* Dropdown to select time range */}
				<label htmlFor="timeRangeSelect">Select Time Range:</label>
				<select
					id="timeRangeSelect"
					value={selectedTimeRange}
					onChange={(e) => handleTimeRangeChange(e.target.value)}
				>
					<option value="All">All</option>
					<option value="Today">Today</option>
					<option value="Past7Days">Past 7 Days</option>
					<option value="ThisMonth">This Month</option>
					<option value="Past10Minutes">Past 10 Minutes</option>
				</select>
			</div>

			<ul>
				{items.map((item) => (
					<li key={item.Sensor_Id}>
						Sensor Check: {item.Sensor_Id},{" "}
						{selectedDataKey === "Both"
							? `Temperature: ${item.Temperature}°C, Humidity: ${item.Humidity}%`
							: `${selectedDataKey}: ${item[selectedDataKey]}`}
					</li>
				))}
			</ul>

			{!loading && items.length > 0 && (
				<LineChart width={600} height={300} data={items}>
					<XAxis dataKey="Timestamp" />
					<YAxis />
					<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
					{selectedDataKey === "Both" ? (
						<>
							<Line
								type="monotone"
								dataKey="Temperature"
								stroke="#8884d8"
								name="Temperature"
								isAnimationActive={true}
								animationBegin={0}
								animationDuration={2000}
							/>
							<Line
								type="monotone"
								dataKey="Humidity"
								stroke="#82ca9d"
								name="Humidity"
								isAnimationActive={true}
								animationBegin={0}
								animationDuration={2000}
							/>
						</>
					) : (
						<Line
							type="monotone"
							dataKey={selectedDataKey}
							stroke={selectedDataKey === "Temperature" ? "#8884d8" : "#82ca9d"}
							name={selectedDataKey}
							isAnimationActive={true}
							animationBegin={0}
							animationDuration={2000}
						/>
					)}
					<Tooltip content={renderTooltipContent} />
					<Legend />
				</LineChart>
			)}
		</div>
	);
};

export default Test;
