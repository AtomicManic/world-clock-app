import React, { useState, useEffect } from "react";
import "./Clock.css";
import { timeZones } from "../util/timeZones";

const Clock = ({ clock, removeClock, updateClock, isEditing }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Set an interval to update the time every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get the IANA time zone name
  const timeZone = timeZones.find((tz) => tz.ianaName === clock.timezone);

  // Fallback to "UTC" if the time zone isn't found
  const ianaName = timeZone ? timeZone.ianaName : "UTC";

  // Use Intl.DateTimeFormat to format the time correctly based on time zone
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: clock.format === "12", // Determine 12/24 hour format
    timeZone: ianaName, // Specify the time zone to use
  }).format(time);

  return (
    <div className="clock-container">
      <input
        type="text"
        value={clock.title}
        onChange={(e) => updateClock(clock.id, "title", e.target.value)}
        placeholder="Clock Title"
        className="clock-title"
      />

      <div className="clock-time">
        {formattedTime.split(" ")[0]}
        <span className="clock-period">
          {clock.format === "12" ? formattedTime.split(" ")[1] : ""}
        </span>
      </div>
      {isEditing && (
        <div className="clock-controls">
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
      )}
    </div>
  );
};

export default Clock;
