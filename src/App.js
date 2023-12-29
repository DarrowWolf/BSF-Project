import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/index";
import Chart from "./pages/Chart";

export default function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route index element={<Home />} />
					<Route path="/chart" element={<Chart />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}
