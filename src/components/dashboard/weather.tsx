"use client";

import React from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import Image from "next/image";
import { imageUrls } from "@/src/utils/constant";
import { weatherStyles } from "@/src/styles/dashboardUi.styles";

interface WeatherProps {
  location?: string;
  temperature?: number;
  condition?: string;
  humidity?: number;
  day?: string;
}

const Weather: React.FC<WeatherProps> = ({
  location = "New York, USA",
  temperature = 22,
  condition = "Partly Cloudy",
  humidity = 71.6,
  day = "Monday",
}) => {
  return (
    <Box sx={weatherStyles.container}>
      <Typography sx={weatherStyles.title}>{condition}</Typography>

      <Box sx={weatherStyles.contentContainer}>
        {/* Weather Icon Centered */}
        <Box sx={weatherStyles.iconContainer}>
          <Image
            src={imageUrls.weatherCloud}
            alt="Weather Cloud"
            width={100}
            height={90}
          />
        </Box>

        {/* Details Below Image */}
        <Box sx={weatherStyles.detailsContainer}>
          {/* Left side - Location & Day */}
          <Box sx={weatherStyles.leftDetails}>
            {/* <Typography sx={weatherStyles.locationText}>{location}</Typography> */}
            <Select
              value={location}
              onChange={(e) => console.log(e.target.value)} // replace with proper handler
              sx={{
                color: "#FFF", // text color
                border: "1px solid #FFF", // white border
                borderRadius: "10px",
                backgroundColor: "transparent",
                fontSize: "14px",
                padding: "2px 8px", // reduced padding
                "& .MuiSelect-select": {
                  padding: "2px 8px", // ensures inner text has less padding
                },
                "& .MuiSelect-icon": {
                  color: "#FFF", // white dropdown icon
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none", // remove inner outline
                },
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <MenuItem value="New York, USA">New York, USA</MenuItem>
              <MenuItem value="Los Angeles, USA">Los Angeles, USA</MenuItem>
              <MenuItem value="London, UK">London, UK</MenuItem>
            </Select>

            <Typography sx={weatherStyles.locationText}>{day}</Typography>
          </Box>

          {/* Right side - Temperature & Humidity */}
          <Box sx={weatherStyles.rightDetails}>
            <Typography sx={weatherStyles.temperatureText}>
              {temperature}°
            </Typography>
            <Typography sx={weatherStyles.humidityText}>
              {humidity} F
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Weather;
