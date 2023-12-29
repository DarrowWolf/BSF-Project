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

const Chart = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedDataKey, setSelectedDataKey] = useState("Both"); // Default to "Both"

	const fetchData = async () => {
		try {
			const fetchedData = await fetchDataFromDynamoDB();
			const itemsWithNewIds = fetchedData.map((item, index) => ({
				...item,
				Sensor_Id: index + 1,
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
			const interval = setInterval(fetchData, 5000);

			return () => clearInterval(interval);
		};

		fetchDataAndAnimate();
	}, []);

	const handleDataKeyChange = (newDataKey) => {
		setSelectedDataKey(newDataKey);
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
			<div
				className="custom-tooltip"
				style={{
					background: "#fff",
					border: "1px solid #ccc",
					padding: "10px",
					borderRadius: "5px",
				}}
			>
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
			</div>

			<ul>
				{items.map((item) => (
					<li key={item.Sensor_Id}>
						Sensor Check: {item.Sensor_Id},{" "}
						{selectedDataKey === "Both"
							? "Temperature: " +
							  item.Temperature +
							  "°C, Humidity: " +
							  item.Humidity +
							  "%"
							: selectedDataKey + ": " + item[selectedDataKey]}
					</li>
				))}
			</ul>

			{!loading && items.length > 0 && (
				<LineChart width={800} height={300} data={items}>
					<XAxis dataKey="Sensor_Id" />
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

export default Chart;
