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
import Dropdown from "../components/dropdown-menu";
import Loading from "../components/loading";

const Chart = () => {
	const [temperatureData, setTemperatureData] = useState([]);
	const [humidityData, setHumidityData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedTimeRange, setSelectedTimeRange] = useState("All");
	const [averages, setAverages] = useState(null);

	const formatTimestamp = (timestamp) => {
		const formattedTime = new Date(timestamp * 1000);
		// Extract hours, minutes, and seconds
		const hours = formattedTime.getHours();
		const minutes = formattedTime.getMinutes();
		// Convert to 12-hour format
		const ampm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 || 12;
		// Construct formatted time string
		const formattedTimeString = `${String(formattedHours).padStart(
			2,
			"0"
		)}:${String(minutes).padStart(2, "0")}${ampm}`;
		return formattedTimeString;
	};

	const calculateAverage = (data) => {
		const totalTemperature = data.reduce((sum, item) => {
			const temperature = parseFloat(item.Temperature);
			return !isNaN(temperature) ? sum + temperature : sum;
		}, 0);
		const totalHumidity = data.reduce((sum, item) => {
			const Humidity = parseFloat(item.Humidity);
			return !isNaN(Humidity) ? sum + Humidity : sum;
		}, 0);

		const averageTemperature = totalTemperature / data.length;
		const averageHumidity = totalHumidity / data.length;

		return {
			averageTemperature,
			averageHumidity,
		};
	};

	const filterDataByTimeRange = (data, timeRange) => {
		const currentDate = new Date();

		switch (timeRange) {
			case "Today":
				const todayData = data.filter((item) => {
					const itemDate = new Date(item.Timestamp * 1000);
					return (
						itemDate.getDate() === currentDate.getDate() &&
						itemDate.getMonth() === currentDate.getMonth() &&
						itemDate.getFullYear() === currentDate.getFullYear()
					);
				});
				const todayAverages = calculateAverage(todayData);
				return { filteredData: todayData, averages: todayAverages };

			case "Past7Days":
				const sevenDaysAgo = new Date();
				sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
				const past7DaysData = data.filter(
					(item) => new Date(item.Timestamp * 1000) >= sevenDaysAgo
				);
				const past7DaysAverages = calculateAverage(past7DaysData);
				return { filteredData: past7DaysData, averages: past7DaysAverages };

			case "ThisMonth":
				const thisMonthData = data.filter((item) => {
					const itemDate = new Date(item.Timestamp * 1000);
					return (
						itemDate.getMonth() === currentDate.getMonth() &&
						itemDate.getFullYear() === currentDate.getFullYear()
					);
				});
				const thisMonthAverages = calculateAverage(thisMonthData);
				return { filteredData: thisMonthData, averages: thisMonthAverages };

			default:
				const allAverages = calculateAverage(data);
				return { filteredData: data, averages: allAverages };
		}
	};

	const fetchData = async () => {
		try {
			const fetchedData = await fetchDataFromDynamoDB();
			fetchedData.sort((a, b) => a.Timestamp - b.Timestamp);

			const { filteredData, averages } = filterDataByTimeRange(
				fetchedData,
				selectedTimeRange
			);

			const dataWithNewIds = filteredData.map((item, index) => ({
				...item,
				Sensor_Id: index + 1,
				Timestamp: formatTimestamp(item.Timestamp),
			}));

			setTemperatureData(dataWithNewIds);
			setHumidityData(dataWithNewIds);
			setAverages(averages);
			console.log(averages);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		const fetchDataAndAnimate = async () => {
			await fetchData();
		};

		fetchDataAndAnimate();

		const interval = setInterval(fetchData, 120000);

		return () => clearInterval(interval);
	}, [selectedTimeRange]);

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
			<div
				className="custom-tooltip"
				style={{
					background: "#fff",
					border: "1px solid #ccc",
					padding: "10px",
					borderRadius: "5px",
				}}
			>
				{/* for some reason i can't get this to work with tailwindCSS so i'm just gonna leave it as is */}
				<p>{label}</p>
				{temperatureValue && <p>Temperature: {temperatureValue}</p>}
				{humidityValue && <p>Humidity: {humidityValue}</p>}
			</div>
		);
	};

	return loading ? (
		<Loading />
	) : (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-4">Data from DynamoDB Table</h1>
				<h1 className="mb-4">
					Data is taken from the sensors every 25 minutes
				</h1>
				<div className="flex justify-end">
					{/* Dropdown to select time range */}
					<Dropdown
						title="Select Time Range"
						description="Select a filter option:"
						options={[
							{ label: "All", value: "All" },
							{ label: "Today", value: "Today" },
							{ label: "Past 7 Days", value: "Past7Days" },
							{ label: "This Month", value: "ThisMonth" },
						]}
						onSelectOption={(selectedOption) =>
							handleTimeRangeChange(selectedOption)
						}
					/>
				</div>

				<div className="pt-10 border-2 rounded">
					{loading ? (
						<Loading />
					) : (
						<>
							{temperatureData.length > 0 && (
								<LineChart
									width={900}
									height={200}
									data={temperatureData}
									margin={{ top: 5, right: 40, left: 20, bottom: 5 }}
								>
									{/* Temperature Chart */}
									<XAxis dataKey="Timestamp" />
									<YAxis />
									<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
									<Line
										type="monotone"
										dataKey="Temperature"
										stroke="#8884d8"
										name="Temperature"
										isAnimationActive={true}
										animationBegin={0}
										animationDuration={2000}
									/>
									<Tooltip content={renderTooltipContent} />
									<Legend />
								</LineChart>
							)}

							{humidityData.length > 0 && (
								<LineChart
									width={900}
									height={200}
									data={humidityData}
									margin={{ top: 5, right: 40, left: 20, bottom: 5 }}
								>
									{/* Humidity Chart */}
									<XAxis dataKey="Timestamp" />
									<YAxis />
									<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
									<Line
										type="monotone"
										dataKey="Humidity"
										stroke="#82ca9d"
										name="Humidity"
										isAnimationActive={true}
										animationBegin={0}
										animationDuration={2000}
									/>
									<Tooltip content={renderTooltipContent} />
									<Legend />
								</LineChart>
							)}
						</>
					)}
					{averages && (
						<div className="my-4 text-center">
							<h2 className="text-xl font-semibold">Average Values</h2>
							<p>
								Average Temperature: {averages.averageTemperature.toFixed(2)}°C
							</p>
							<p>Average Humidity: {averages.averageHumidity.toFixed(2)}%</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Chart;
