"use client";

import React from "react";
import { Box, Grid } from "@mui/material";
import { authSectionStyles } from "../../styles/styles";
import { imageUrls } from "@/src/utils/constant";
import Image from "next/image";

const AuthSection: React.FC = () => (
  <Grid
    sx={{
      ...authSectionStyles.root,
      width: { xs: "100%", md: "50%" },
    }}
  >
    <Box sx={authSectionStyles.overlay} />

    {/* Positioned at bottom-left */}
    <Box sx={authSectionStyles.contentWrapper}>
      <Image
        src={imageUrls.prismMain}
        alt="Prism Logo"
        width={300}
        height={100}
        style={{
          objectFit: "contain",
          width: "100%",
          height: "auto",
        }}
      />
    </Box>
  </Grid>
);

export default AuthSection;
