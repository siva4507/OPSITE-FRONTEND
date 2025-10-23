"use client";

import React from "react";
import { Box, CircularProgress, CircularProgressProps } from "@mui/material";

interface LoadingSpinnerProps extends CircularProgressProps {
  center?: boolean;
  inline?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  center = false,
  inline = false,
  size = 40,
  ...props
}) => {
  if (inline) {
    return <CircularProgress size={size} {...props} />;
  }

  return (
    <Box
      display={center ? "flex" : undefined}
      justifyContent={center ? "center" : undefined}
      alignItems={center ? "center" : undefined}
      width={center ? "100vw" : undefined}
      height={center ? "100vh" : undefined}
      minHeight={center ? "100vh" : undefined}
      position={center ? "fixed" : undefined}
      top={center ? 0 : undefined}
      left={center ? 0 : undefined}
      zIndex={center ? 1300 : undefined}
      bgcolor={center ? "background.default" : undefined}
    >
      <CircularProgress size={size} {...props} />
    </Box>
  );
};

export default LoadingSpinner;
