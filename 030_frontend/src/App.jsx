import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Main_Input from "./main_input.jsx"

export default function App() {

  return (
    <>

        <Routes>
          <Route path="/" element={<Main_Input />} />
        </Routes>

    </>
  );
}
