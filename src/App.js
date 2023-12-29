import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/index";
import Chart from "./pages/Chart";
import Test from "./pages/Test";

export default function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route index element={<Home />} />
					<Route path="/chart" element={<Chart />} />
					<Route path="/test" element={<Test />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}
