import React, { useState, useEffect } from "react";
import Clock from "./components/Clock";
import "./App.css";

const App = () => {
  const [clocks, setClocks] = useState([
    { id: Date.now(), timezone: "UTC", format: "24", title: "New Clock" },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState("horizontal");

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    adjustWindowSize();
  }, [clocks, resizeDirection, isEditing]);

  const adjustWindowSize = () => {
    const clockwidth = 200; // Size of each clock
    const numClocks = clocks.length;
    const clockHeight = clocks.length === 2 ? 165 : 140; // Height of each clock
    const baseWidth = 300; // Base width for one clock
    const baseHeight = 200; // Base height for one clock, adjusted for visibility
    const editSectionHeight = 120; // Height of the edit section
    const newSize =
      numClocks === 1
        ? {
            width: baseWidth + numClocks * clockwidth,
            height: isEditing ? baseHeight + editSectionHeight : baseHeight,
          }
        : resizeDirection === "horizontal"
        ? {
            width: baseWidth + numClocks * clockwidth,
            height: isEditing ? baseHeight + editSectionHeight : baseHeight,
          }
        : {
            width: 430,
            height:
              // baseHeight +
              numClocks * clockHeight +
              (isEditing ? editSectionHeight * numClocks : 0),
          };

    // Ensure the height doesn't exceed the screen height
    const screenHeight = window.screen.availHeight;
    if (newSize.height > screenHeight) {
      newSize.height = screenHeight;
    }

    window.electron.ipcRenderer.send("resize-app", newSize);
    console.log("numClocks", numClocks);
  };

  const addClock = () => {
    if (clocks.length < 5) {
      setClocks([
        ...clocks,
        { id: Date.now(), timezone: "UTC", format: "24", title: "New Clock" },
      ]);
    }
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

  const toggleResizeDirection = () => {
    setResizeDirection(
      resizeDirection === "horizontal" ? "vertical" : "horizontal"
    );
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
          <button
            className="resize-direction-btn"
            onClick={toggleResizeDirection}
          >
            {resizeDirection === "horizontal" ? (
              <i class="fa-solid fa-arrows-up-down"></i>
            ) : (
              <i class="fa-solid fa-arrows-left-right"></i>
            )}
            <span className="button-text">
              {resizeDirection === "horizontal" ? "Vertical" : "Horizontal"}
            </span>
          </button>
        </div>
        <button
          className="close-app-button"
          id="close-app-btn"
          onClick={closeApp}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className={`clocks-container ${resizeDirection}`}>
        {clocks.map((clock) => (
          <Clock
            key={clock.id}
            clock={clock}
            removeClock={removeClock}
            updateClock={updateClock}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            totalClocks={clocks.length}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
