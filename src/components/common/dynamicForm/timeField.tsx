"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, InputBase } from "@mui/material";

interface TimeFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  disabled?: boolean;
}

export const TimeField: React.FC<TimeFieldProps> = ({
  name,
  label,
  value,
  onChange,
  disabled = false,
}) => {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [localError, setLocalError] = useState("");

  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [h, m, s] = value.split(":");
      setHours(h?.padStart(2, "0") || "00");
      setMinutes(m?.padStart(2, "0") || "00");
      setSeconds(s?.padStart(2, "0") || "00");
    }
  }, [value]);

  const validateTime = (h: number, m: number, s: number): boolean => {
    if (h === 0 && m === 0 && s === 0) {
      setLocalError("Duration cannot be 00:00:00");
      return false;
    }
    if (h < 0 || h > 99 || m < 0 || m >= 60 || s < 0 || s >= 60) {
      setLocalError("Invalid duration");
      return false;
    }
    setLocalError("");
    return true;
  };

  const handleSegmentChange = (
    segment: "hours" | "minutes" | "seconds",
    val: string,
  ) => {
    const cleanVal = val.replace(/\D/g, "").slice(0, 2);
    if (segment === "hours") setHours(cleanVal);
    if (segment === "minutes") setMinutes(cleanVal);
    if (segment === "seconds") setSeconds(cleanVal);
  };

  const handleBlur = () => {
    const h = parseInt(hours || "0", 10);
    const m = parseInt(minutes || "0", 10);
    const s = parseInt(seconds || "0", 10);

    const formatted = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

    if (validateTime(h, m, s)) {
      onChange(name, formatted);
    } else {
      const [prevH, prevM, prevS] = value.split(":");
      setHours(prevH || "00");
      setMinutes(prevM || "00");
      setSeconds(prevS || "00");
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text on focus so typing replaces it
    e.target.select();
  };

  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          mb: 0.5,
          fontWeight: 600,
          color: "#fff",
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Typography>

      <Box
        display="flex"
        alignItems="left"
        justifyContent="left"
        sx={{
          border: "1px solid white",
          borderRadius: "8px",
          p: "4px 6px",
          width: "100%",
          color: "#fff",
          backgroundColor: "transparent",
        }}
      >
        <InputBase
          inputRef={hoursRef}
          value={hours}
          onChange={(e) => handleSegmentChange("hours", e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputProps={{
            maxLength: 2,
            style: {
              textAlign: "center",
              width: "24px",
              color: "white",
              background: "transparent",
              border: "none",
              outline: "none",
            },
          }}
          disabled={disabled}
        />
        <Typography sx={{ mt: 0.5, color: "white" }}>:</Typography>
        <InputBase
          inputRef={minutesRef}
          value={minutes}
          onChange={(e) => handleSegmentChange("minutes", e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputProps={{
            maxLength: 2,
            style: {
              textAlign: "center",
              width: "24px",
              color: "white",
              background: "transparent",
              border: "none",
              outline: "none",
            },
          }}
          disabled={disabled}
        />
        <Typography sx={{ mt: 0.5, color: "white" }}>:</Typography>
        <InputBase
          inputRef={secondsRef}
          value={seconds}
          onChange={(e) => handleSegmentChange("seconds", e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputProps={{
            maxLength: 2,
            style: {
              textAlign: "center",
              width: "24px",
              color: "white",
              background: "transparent",
              border: "none",
              outline: "none",
            },
          }}
          disabled={disabled}
        />
      </Box>
      {localError && (
        <Typography sx={{ color: "#ef4444", mt: 0.5, fontSize: 13 }}>
          {localError}
        </Typography>
      )}
    </Box>
  );
};
