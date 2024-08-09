import React, { useState, useEffect } from "react";
import "./Clock.css";
import { timeZones } from "../util/timeZones";

const Clock = ({ clock, removeClock, updateClock, isEditing, totalClocks }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeZone = timeZones.find((tz) => tz.ianaName === clock.timezone);
  const ianaName = timeZone ? timeZone.ianaName : "UTC";

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: clock.format === "12",
    timeZone: ianaName,
  }).format(time);

  const getFontSize = () => {
    const baseSize = 4;
    const maxClocks = 6;
    const scaleFactor = Math.max(1 - (totalClocks - 1) / maxClocks, 0.6);
    return `${baseSize * scaleFactor}em`;
  };

  return (
    <div className="clock-container">
      <input
        type="text"
        value={clock.title}
        onChange={(e) => updateClock(clock.id, "title", e.target.value)}
        placeholder="Clock Title"
        className="clock-title"
      />

      <div className="clock-time" style={{ fontSize: getFontSize() }}>
        {formattedTime.split(" ")[0]}
        <span className="clock-period">
          {clock.format === "12" ? formattedTime.split(" ")[1] : ""}
        </span>
      </div>
      <div className={`clock-controls ${isEditing ? "visible" : "hidden"}`}>
        <select
          value={clock.timezone}
          onChange={(e) => updateClock(clock.id, "timezone", e.target.value)}
        >
          {timeZones.map((tz) => {
            if (tz.ianaName === null) {
              return (
                <option key={tz.label} value={tz.ianaName} disabled>
                  {tz.label}
                </option>
              );
            } else {
              return (
                <option key={tz.label} value={tz.ianaName}>
                  {tz.label}
                </option>
              );
            }
          })}
        </select>
        <select
          value={clock.format}
          onChange={(e) => updateClock(clock.id, "format", e.target.value)}
        >
          <option value="24">24-hour</option>
          <option value="12">12-hour</option>
        </select>
        <button className="remove-btn" onClick={() => removeClock(clock.id)}>
          X
        </button>
      </div>
    </div>
  );
};

export default Clock;
