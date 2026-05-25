import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";
import { initTheme } from "./lib/theme.js";

initTheme();

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
