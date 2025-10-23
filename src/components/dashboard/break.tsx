"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { breakStyles } from "@/src/styles/dashboardUi.styles";
import { imageUrls } from "@/src/utils/constant";

const ControlPanel: React.FC = () => {
  const controls = [
    { icon: imageUrls.add, label: "Add Countermeasures" },
    { icon: imageUrls.book, label: "Add Logbook Entry" },
    { icon: imageUrls.job, label: "View Active Job" },
    { icon: imageUrls.alertWhite, label: "Emergency Alert" },
  ];

  return (
    <Box sx={breakStyles.mainContainer}>
      <Box sx={breakStyles.controlsGrid}>
        {controls.map((control, index) => (
          <Box
            key={index}
            sx={breakStyles.controlItem}
            style={{ cursor: "pointer" }}
          >
            <Image
              src={control.icon}
              alt={control.label}
              width={50}
              height={50}
            />
            <Typography sx={breakStyles.controlLabel}>
              {control.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ControlPanel;