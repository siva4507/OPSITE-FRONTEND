"use client";

import React from "react";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "@/src/hooks/useTranslation";
import { styles } from "@/src/styles/dashboardUi.styles";
import Fatigue from "./fatigue";
import CurrentShift from "./currentShift";
import RecentActivity from "./activity";
import Timer from "./timer";
import ControlPanel from "./break";
import { RBAC } from "@/src/utils/protectedElements";
import { UserRole } from "@/src/types/auth.types";

const WelcomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <RBAC allowedRoles={[UserRole.ActiveController, UserRole.Observer]}>
        <Box
          sx={{
            flexGrow: 1,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ flex: "0 0 auto", height: "240px" }}>
            <Grid container spacing={2} sx={{ height: "100%" }}>
              <Grid size={{ xs: 12, md: 8 }} sx={{ height: "100%" }}>
                <Grid container spacing={2} sx={{ height: "100%" }}>
                  <Grid size={{ xs: 12, md: 6 }} sx={{ height: "100%" }}>
                    <Box sx={{ ...styles.cardContainer, height: "100%" }}>
                      <CurrentShift />
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }} sx={{ height: "100%" }}>
                    <Box sx={{ ...styles.cardContainer, height: "100%" }}>
                      <Fatigue />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%" }}>
                <Box sx={{ ...styles.cardContainer, height: "100%" }}>
                  <Timer />
                </Box>
              </Grid>
              {/* <Grid size={{ xs: 8, md: 3 }} sx={{ height: "100%" }}>
            <Box sx={{ ...styles.cardContainer, height: "100%" }}>
              <Weather />
            </Box>
          </Grid> */}
            </Grid>
          </Box>

          {/* Second Row remains unchanged */}
          <Box sx={{ flex: "1 1 auto", minHeight: "auto" }}>
            <Grid size={{ xs: 13, md: 7 }} sx={{ height: "100%" }}>
              <Box sx={{ ...styles.cardContainer, height: "100%" }}>
                <RecentActivity />
              </Box>
            </Grid>

             
          </Box>
        </Box>
      </RBAC>
    </>
  );
};

export default WelcomePage;
