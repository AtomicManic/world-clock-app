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

  const handleEditClocks = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="left-header">
          <button className="add-clock-button" onClick={addClock}>
            <i className="fa-solid fa-plus"></i>
            <span className="button-text">Add Clock</span>
          </button>
          <button className="edit-clocks-btn" onClick={handleEditClocks}>
            {isEditing ? (
              <>
                <i className="fa-solid fa-rotate-left"></i>
                <span className="button-text">Done</span>
              </>
            ) : (
              <>
                <i className="fa-regular fa-pen-to-square"></i>
                <span className="button-text">Edit</span>
              </>
            )}
          </button>
        </div>
        <button className="close-app-button" onClick={closeApp}>
          <i className="fa-solid fa-xmark"></i>
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
            setIsEditing={setIsEditing}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
