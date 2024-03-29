import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./helpers/custom-toast-styles.css";

import PrivateRoute from "./components/auth/privateRoute";
import Header from "./components/header";
import LandingPage from "./pages/landingPage";
import FeedPage from "./pages/feedPage";
import ExplorePage from "./pages/explorePage";
import WishListPage from "./pages/wishListPage";
import AccountPage from "./pages/accountPage";
import Trnds404 from "./pages/trnds404";
import getDesignTokens from "./helpers/getDesignTokens";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App({ mode }) {
	const colorMode = React.useContext(ColorModeContext);
	return (
		<>
			<ToastContainer
				position="top-center"
				autoClose={4000}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				transition={Slide}
				limit={1}
				theme="colored"
				toastStyle={{
					"--toastify-color-success":
						"var(--toastify-color-success-" + mode.toString() + ")",
					"--toastify-color-error":
						"var(--toastify-color-error-" + mode.toString() + ")",
				}}
			/>
			<BrowserRouter>
				<Routes>
					<Route path="*" element={<Trnds404 />}></Route>
					<Route exact path="/" element={<LandingPage />} />
					<Route element={<ProtectedLayout />}>
						<Route path="" element={<PrivateRoute />}>
							<Route path="/explore" element={<ExplorePage />} />
							<Route path="/feed" element={<FeedPage />} />
							<Route
								path="/wishlist"
								element={<WishListPage />}
							/>
							<Route
								path="/account"
								element={
									<AccountPage
										colorMode={colorMode.toggleColorMode}
									/>
								}
							/>
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

const ProtectedLayout = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export default function ToggleColorMode() {
	const [mode, setMode] = React.useState(() => {
		const storedMode = localStorage.getItem("mode");
		return storedMode || "light";
	});

	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) =>
					prevMode === "light" ? "dark" : "light"
				);
			},
		}),
		[]
	);

	useEffect(() => {
		localStorage.setItem("mode", mode);
	}, [mode]);

	const theme = React.useMemo(
		() => createTheme(getDesignTokens(mode)),
		[mode]
	);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<App mode={mode} />
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}
