import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./pages/index";
import Chart from "./pages/Chart";
import Test from "./pages/Test";
import { NextUIProvider } from "@nextui-org/system";

export default function App() {
	return (
		<NextUIProvider>
			<div>
				<BrowserRouter>
					<Routes>
						<Route index element={<Home />} />
						<Route path="/chart" element={<Chart />} />
						<Route path="/test" element={<Test />} />
					</Routes>
				</BrowserRouter>
			</div>
		</NextUIProvider>
	);
}
