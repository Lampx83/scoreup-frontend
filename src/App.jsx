import { useEffect } from 'react'
import './App.css'
import HomePage from "./pages/HomePage/index.jsx";
import {Route, Routes} from "react-router-dom";
import LayoutDefault from "./layout/LayoutDefault/index.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutDefault />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
      {/*<HomePage />*/}
    </>
  )
}

export default App
