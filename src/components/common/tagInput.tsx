import React, { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  maxTagLength?: number;
  placeholder?: string;
}

export const TagsInput: React.FC<TagsInputProps> = ({
  value = [],
  onChange,
  maxTags = 6,
  maxTagLength = 13,
  placeholder = "Tags(Type & press Space)",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim().slice(0, maxTagLength);

    if (!trimmed) return;

    if (value.includes(trimmed)) {
      setError("Tag already exists");
      return;
    }
    if (value.length >= maxTags) {
      setError(`Maximum ${maxTags} tags allowed`);
      return;
    }

    setError(null);
    onChange([...value, trimmed]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (val.includes("#") || val.includes(" ")) {
      const parts = val.split(/[# ]+/);
      parts.forEach((part, idx) => {
        if (part && idx < parts.length - 1) addTag(part);
      });
      val = parts[parts.length - 1];
    }

    if (val.length > maxTagLength) {
      setError(`Max length is ${maxTagLength} characters`);
    } else {
      setError(null);
    }

    setInputValue(val.slice(0, maxTagLength));
  };

  const removeTag = (index: number) => {
    setError(null);
    onChange(value.filter((_, idx) => idx !== index));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: "4px 8px",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          whiteSpace: "nowrap",
          minHeight: "36px",
          maxHeight: "60px",
          gap: 1,
          backgroundColor: "transparent",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
        }}
      >
        {value.map((tag, idx) => (
          <Box
            key={idx}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#515355",
              color: "white",
              padding: "1px 6px",
              borderRadius: 1,
              cursor: "pointer",
              fontSize: "0.8rem",
              userSelect: "none",
            }}
            onClick={() => removeTag(idx)}
            title="Click to remove"
          >
            {tag} &nbsp;×
          </Box>
        ))}
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "#") && inputValue.trim()) {
              e.preventDefault();
              addTag(inputValue);
              setInputValue("");
            }
            if (e.key === "Backspace" && !inputValue && value.length) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          placeholder={placeholder}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              color: "white",
              minWidth: 100,
              flexShrink: 0,
              fontSize: "0.9rem",
              cursor: "text",
            },
          }}
        />
      </Box>

      {/* Helper text below the box */}
      {error && (
        <Typography
          variant="caption"
          sx={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};
