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

// Auto-detect basename
const getBasename = () => {
  // Nếu đang ở hostname của NEU và có sub-path, thì set basename là '/scoreup'
  if (window.location.hostname === 'fit.neu.edu.vn') {
    return '/scoreup';
  }
  // Ngược lại, không cần sub-path (root)
  return '/';
};

const store = configureStore({
  reducer: allReducers,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <CookiesProvider>
      <Provider store={store}>
        <BrowserRouter basename={getBasename()}>
          <CssVarsProvider theme={theme}>
            <CssBaseline />
            <App />
          </CssVarsProvider>
        </BrowserRouter>
      </Provider>
    </CookiesProvider>
  </React.Fragment>,
);
