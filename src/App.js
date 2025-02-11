import React from "react";
import Header from "./components/Header";
import Home from "./components/Home";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Home />
    </div>
  );
}

export default App;
