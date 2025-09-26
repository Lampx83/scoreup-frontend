import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "./theme.js";
import allReducers from "./redux/reducers/index.js";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {CookiesProvider} from "react-cookie";

// Get basename from environment or auto-detect
const getBasename = () => {
  // Ưu tiên lấy từ environment variable
  const envBasename = import.meta.env.VITE_BASE_URL;
  if (envBasename) {
    return envBasename;
  }
  
  // Auto-detect dựa trên hostname (đồng bộ với vite.config.js)
  if (window.location.hostname === 'fit.neu.edu.vn') {
    return '/scoreup/';
  }
  
  // Development: nếu không set VITE_BASE_URL, mặc định dùng /scoreup/ (giống vite.config.js)
  return '/scoreup/';
};

const store = configureStore({
  reducer: allReducers,
});

// Debug logging cho basepath
const currentBasename = getBasename();
console.log('🚀 ScoreUp Frontend Starting...');
console.log('📍 Basename:', currentBasename);
console.log('🌍 Hostname:', window.location.hostname);
console.log('🔗 Full URL:', window.location.href);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <CookiesProvider>
      <Provider store={store}>
        <BrowserRouter basename={currentBasename}>
          <CssVarsProvider theme={theme}>
            <CssBaseline />
            <App />
          </CssVarsProvider>
        </BrowserRouter>
      </Provider>
    </CookiesProvider>
  </React.Fragment>,
);
