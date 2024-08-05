import React, { useState } from "react";
import Clock from "./components/Clock";
import "./App.css";

const App = () => {
  const [clocks, setClocks] = useState([]);
  const [isEditing, setIsEditing] = useState(true);

  const addClock = () => {
    setClocks([
      ...clocks,
      { id: Date.now(), timezone: "UTC", format: "24", title: "New Clock" },
    ]);
  };

  const removeClock = (id) => {
    setClocks(clocks.filter((clock) => clock.id !== id));
  };

  const updateClock = (id, key, value) => {
    setClocks(
      clocks.map((clock) =>
        clock.id === id ? { ...clock, [key]: value } : clock
      )
    );
  };

  const closeApp = () => {
    window.electron.ipcRenderer.send("close-app");
  };

  return (
    <div
      className="app-container"
      onMouseEnter={() => setIsEditing(true)}
      onMouseLeave={() => setIsEditing(false)}
    >
      <div className={`app-header ${isEditing ? "visible" : ""}`}>
        <button className="add-clock-button" onClick={addClock}>
          +
        </button>
        <button
          className="edit-clocks-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Done Editing" : "Edit Clocks"}
        </button>
        <button className="close-app-button" onClick={closeApp}>
          X
        </button>
      </div>
      <div className="clocks-container">
        {clocks.map((clock) => (
          <Clock
            key={clock.id}
            clock={clock}
            removeClock={removeClock}
            updateClock={updateClock}
            isEditing={isEditing}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
