import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./pages/Chart";
import Chart from "./pages/Chart";
import Raw from "./pages/index";
import { NextUIProvider } from "@nextui-org/system";

export default function App() {
	return (
		<NextUIProvider>
			<div>
				<BrowserRouter>
					<Routes>
						<Route index element={<Home />} />
						<Route path="/raw" element={<Raw />} />
						<Route path="/chart" element={<Chart />} />
					</Routes>
				</BrowserRouter>
			</div>
		</NextUIProvider>
	);
}
