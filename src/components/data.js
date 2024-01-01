import React, { useState, useEffect } from "react";
import { fetchDataFromDynamoDB } from "../components/DynamoDBService";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const Data = () => {
	const [items, setItems] = useState([]);
	const [selectedRow, setSelectedRow] = useState(null);

	const fetchData = async () => {
		try {
			const fetchedData = await fetchDataFromDynamoDB();
			const itemsWithNewIds = fetchedData.map((item, index) => ({
				id: index + 1,
				...item,
				Timestamp: formatTimestamp(item.Timestamp),
			}));
			const sortedItems = itemsWithNewIds.sort(
				(a, b) => a.Sensor_Id - b.Sensor_Id
			);
			setItems(sortedItems);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const formatTimestamp = (timestamp) => {
		const formattedTime = new Date(timestamp * 1000).toISOString();
		return formattedTime.slice(0, 19).replace("T", " ");
	};

	useEffect(() => {
		fetchData();

		const interval = setInterval(() => {
			fetchData();
		}, 120000);

		return () => clearInterval(interval);
	}, []);

	const handleDeleteClick = (id) => () => {
		setItems((prevItems) => prevItems.filter((item) => item.id !== id));
	};

	const columns = [
		{ field: "Sensor_Id", headerName: "Sensor ID", width: 100, editable: true },
		{
			field: "Temperature",
			headerName: "Temperature (°C)",
			width: 150,
			editable: true,
		},
		{
			field: "Humidity",
			headerName: "Humidity (%)",
			width: 120,
			editable: true,
		},
		{ field: "Timestamp", headerName: "Time", width: 220, editable: true },
		{
			field: "actions",
			headerName: "Actions",
			width: 200,
			renderCell: (params) => {
				return (
					<>
						<DeleteIcon
							onClick={handleDeleteClick(params.id)}
							style={{ cursor: "pointer" }}
						/>
					</>
				);
			},
		},
	];

	const theme = createTheme(); // Create an empty theme to avoid conflicting styles

	return (
		<ThemeProvider theme={theme}>
			<div className="flex justify-center items-center h-screen">
				<div style={{ height: 700, width: "70%" }}>
					<DataGrid
						initialState={{
							pagination: { paginationModel: { pageSize: 25 } },
						}}
						rows={items}
						columns={columns}
						pageSizeOptions={[10, 25, 50, 100]}
						checkboxSelection
						disableSelectionOnClick
					/>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default Data;
