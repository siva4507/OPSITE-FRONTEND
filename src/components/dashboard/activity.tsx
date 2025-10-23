"use client";

import React, { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { activityStyles } from "@/src/styles/dashboardUi.styles";
import { fetchRecentActivityAction } from "@/src/store/slices/fatigueSlice";
import { navigationUrls } from "@/src/utils/constant";

const RecentActivity: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get recent activity from Redux
  const { recentActivity, recentActivityLoading } = useAppSelector(
    (state) => state.fatigue,
  );

  useEffect(() => {
    dispatch(fetchRecentActivityAction());
  }, [dispatch]);

  const handleViewAllClick = () => {
    router.push(navigationUrls.logbook);
  };

  return (
    <Box sx={activityStyles.mainContainer}>
      <Box sx={activityStyles.headerContainer}>
        <Typography sx={activityStyles.title}>Recent Activity</Typography>
        <Typography
          sx={activityStyles.viewAllLink}
          onClick={handleViewAllClick}
        >
          View All
        </Typography>
      </Box>

      <Box sx={activityStyles.activitiesContainer}>
        {recentActivityLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        ) : recentActivity && recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <Box
              key={activity._id}
              sx={{
                ...activityStyles.activityCardBase,
                ...(activity.isImportant
                  ? activityStyles.activityCardEmergency
                  : activityStyles.activityCardNormal),
              }}
            >
              <Box sx={activityStyles.activityHeaderContainer}>
                <Typography
                  sx={{
                    ...activityStyles.activityTypeBadgeBase,
                    ...(activity.isImportant
                      ? activityStyles.activityTypeBadgeEmergency
                      : activityStyles.activityTypeBadgeNormal),
                  }}
                >
                  {activity.categoryInfo?.name || activity.categoryId.name}
                </Typography>
                <Typography sx={activityStyles.activityMetaText}>
                  {new Date(activity.createdAt).toLocaleString()} |{" "}
                  {activity.createdByInfo?.username ||
                    activity.createdBy.username}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={activityStyles.activityDescriptionText}>
                  {activity.description}
                </Typography>
                {activity.aorInfo.name && (
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#3D96E1",
                      fontWeight: 600,
                      marginLeft: "8px",
                      flexShrink: 0,
                    }}
                  >
                    {activity.aorInfo.name}
                  </Typography>
                )}
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No recent activity found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default RecentActivity;