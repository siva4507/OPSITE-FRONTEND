export const styles = {
  cardContainer: {
    background: "#1A1A1A26",
    backdropFilter: "blur(10.25px)",
    WebkitBackdropFilter: "blur(10.25px)",
    borderRadius: "24px",
    boxShadow: `
      8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
      -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
      0px 0px 20.8px -5.2px #FFFFFF33 inset
    `,
    padding: "20px !important",
    textAlign: "left",
    width: "100%",
    position: "relative",
    zIndex: 2,
    transition: "all 0.3s ease-in-out",
    opacity: 1,
    transform: "translateY(0)",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
};

export const shiftStyles = {
  title: {
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "10px",
    color: "#FFFFFF",
    textAlign: "left" as const,
  },
  contentContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    flexDirection: { xs: "column", md: "row" } as const,
    width: "100%",
  },
  circularContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    minWidth: "140px",
    maxWidth: "140px",
  },
  circularProgress: {
    width: "100px",
    height: "100px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },
  currentTime: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#FFFFFF",
    position: "relative" as const,
    zIndex: 2,
  },
  shiftInfo: {
    textAlign: "left" as const,
  },
  shiftLabel: {
    fontSize: "10px",
    color: "#FFF",
    marginBottom: "1px",
    lineHeight: 1.2,
  },
  shiftStatus: {
    fontSize: "10px",
    fontWeight: 600,
    marginTop: "4px",
  },
  hoursContainer: {
    flex: 1,
    minWidth: 0, // Allow shrinking
    maxWidth: "calc(100% - 160px)", // Ensure it doesn't overflow
  },
  hoursTitle: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#FFFFFF",
    marginBottom: "12px",
    textAlign: "left" as const,
  },
  progressItem: {
    marginBottom: "10px",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  progressLabel: {
    fontSize: "12px",
    color: "#A0A3BD",
    fontWeight: 500,
  },
  progressValue: {
    fontSize: "12px",
    fontWeight: 600,
  },
  progressBar: {
    height: "15px",
    borderRadius: "10px",
    backgroundColor: "#FFFFFF", // Changed to white background
    "& .MuiLinearProgress-bar": {
      borderRadius: "3px",
      background:
        "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, currentColor 100%)", // Add gradient effect
    },
  },
  legendContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "18px",
    padding: "0 4px",
    gap: "3px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  legendColorBox: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  legendText: {
    fontSize: "0.7rem",
    color: "#FFF",
  },
};

export const fatigueStyles = {
  title: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#3D96E1",
    marginBottom: "16px",
    textAlign: "left" as const,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    flex: 1,
    height: "100%",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2px",
  },
  label: {
    fontSize: "14px",
    color: "#FFF",
    fontWeight: 400,
  },
  value: {
    fontSize: "1rem",
    color: "#34A353",
    textAlign: "right" as const,
    fontWeight: 600,
  },
  recommendation: {
    fontSize: "0.8rem",
    color: "#3D96E1",
    background: "#3D96E133",
    textAlign: "left" as const,
    fontStyle: "italic",
    lineHeight: 1.4,
    padding: "6px",
    borderRadius: 2,
  },
  redText: {
    color: "#FF3F2F !important",
  },
  greenText: {
    color: "#34A353 !important",
    backgroundColor: "#34A3534D",
    borderRadius: "12px",
    padding: "4px 8px",
  },
  cardContent: {
    display: "flex",
    gap: "2px",
    flex: 1,
  },
  titles: {
    color: "#3D96E1",
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "2px",
  },
  subTitle: {
    color: "#A0A3BD",
    fontSize: "12px",
    marginBottom: "12px",
  },
  leftCard: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
  },

  // Main container styles
  mainContainer: {
    display: "flex",
    gap: "10px",
    minHeight: "400px",
  },

  // Left column container
  leftColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },

  // Glass effect style
  glassStyle: {
    background: "#1A1A1A26",
    backdropFilter: "blur(10.25px)",
    WebkitBackdropFilter: "blur(10.25px)",
    borderRadius: "24px",
    boxShadow: `
      8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
      -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
      0px 0px 20.8px -5.2px #FFFFFF33 inset
    `,
  },

  // Fatigue assessment card
  fatigueAssessmentCard: {
    padding: "16px",
     height: "auto",
    display: "flex",
    flexDirection: "column" as const,
  },

  // Legend container
  legendContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "8px",
  },

  // Legend item
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  // Legend dot
  legendDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },

  // Legend text
  legendText: {
    color: "#A0A3BD",
    fontSize: "9px",
  },

  // Chart container
  chartContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    gap: "30px",
    height: "90px",
    marginBottom: "8px",
    flex: 1,
  },

  // Chart bar container
  chartBarContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "4px",
  },

  // Chart bar
  chartBar: {
    width: "25px",
    backgroundColor: "#3D96E1",
    borderRadius: "2px",
  },

  // Chart label base
  chartLabelBase: {
    color: "#FFFFFF",
    fontSize: "0.9rem",
    padding: "0",
    borderRadius: "0",
  },

  chartValueLabel: {
    color: "#FFF",
    fontSize: "0.75rem",
    fontWeight: 500,
    textAlign: "center",
  },

  // Chart label highlighted
  chartLabelHighlighted: {
    backgroundColor: "#FF8C00",
    padding: "1px 4px",
    borderRadius: "6px",
  },

  // Chart x-axis label
  chartXAxisLabel: {
    color: "#A0A3BD",
    fontSize: "9px",
    textAlign: "center" as const,
  },

  // Right side stats container
  rightSideContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "240px",
  },

  // Stats grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    width: "100%",
    marginBottom: "8px",
  },

  // Stat item container
  statItem: {
    textAlign: "center" as const,
  },

  // Stat label
  statLabel: {
    color: "#A0A3BD",
    fontSize: "9px",
  },

  // Stat value
  statValue: {
    color: "#FFFFFF",
    fontSize: "12px",
    fontWeight: 600,
  },

  // Hitch day badge
  hitchDayBadge: {
    borderRadius: "6px",
    padding: "1px 2px",
    marginTop: "1px",
  },

  // Hitch day text
  hitchDayText: {
    color: "#FFFFFF",
    fontSize: "10px",
    fontWeight: 600,
  },

  // Progress circle container
  progressCircleContainer: {
    position: "relative" as const,
    width: "60px",
    height: "60px",
    marginBottom: "8px",
  },

  // Progress circle outer
  progressCircleOuter: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background:
      "conic-gradient(from 0deg, #FF8C00 0deg, #FF8C00 252deg, rgba(255,255,255,0.2) 252deg, rgba(255,255,255,0.2) 360deg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Progress circle inner
  progressCircleInner: {
    width: "42px",
    height: "42px",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Progress circle text
  progressCircleText: {
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: 700,
  },

  circularProgress: {
    width: "80px",
    height: "80px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },

  currentTime: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#FFFFFF",
    position: "absolute" as const,
    zIndex: 2,
  },

  // Monitor button
  monitorButton: {
    backgroundColor: "#FF8C00",
    color: "#FFFFFF",
    borderRadius: "16px",
    fontSize: "10px",
    textTransform: "none" as const,
    padding: "3px 10px",
    minHeight: "auto",
    "&:hover": { backgroundColor: "#FF8C00" },
  },

  // Recent shifts container
  recentShiftsContainer: {
    padding: "20px",
    height: "180px",
  },

  // Recent shifts title
  recentShiftsTitle: {
    color: "#3D96E1",
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "16px",
  },

  // Table header container
  tableHeaderContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
    gap: "6px",
    marginBottom: "10px",
    paddingBottom: "6px",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    width: "100%",
  },

  // Table header text
  tableHeaderText: {
    color: "#A0A3BD",
    fontSize: "10px",
    fontWeight: 500,
  },

  // Table row container
  tableRowContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
    gap: "6px",
    marginBottom: "6px",
    alignItems: "center",
    width: "100%",
  },

  // Table cell text
  tableCellText: {
    color: "#FFFFFF",
    fontSize: "11px",
  },

  // Status badge complete
  statusBadgeComplete: {
    backgroundColor: "#4CD964",
    borderRadius: "10px",
    padding: "3px 6px",
    textAlign: "center" as const,
  },

  // Status badge warning
  statusBadgeWarning: {
    backgroundColor: "#FFC107",
    borderRadius: "10px",
    padding: "3px 6px",
    textAlign: "center" as const,
  },

  // Status badge text
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: "9px",
    fontWeight: 500,
  },

  // Right column (mitigation) container
  rightColumn: {
    width: "300px",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    height: "410px",
  },

  // Mitigation header container
  mitigationHeaderContainer: {
    borderRadius: "8px",
    padding: "4px",
    marginBottom: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Mitigation title
  mitigationTitle: {
    color: "#3D96E1",
    fontSize: "14px",
    fontWeight: 600,
  },

  // Mitigation table header
  mitigationTableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "8px",
    paddingBottom: "6px",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    marginBottom: "8px",
    backgroundColor: "#3D96E1",
    borderRadius: "8px",
    padding: "12px",
  },

  // Mitigation table header text
  mitigationTableHeaderText: {
    color: "#FFF",
    fontSize: "12px",
    fontWeight: 600,
  },

  // Mitigation table content container
  mitigationTableContent: {
    flex: 1,
    overflowY: "auto" as const,
    paddingRight: "4px",
    "&::-webkit-scrollbar": { display: "none" },
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
  },

  // Mitigation item container
  mitigationItemContainer: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "8px",
    padding: "10px",
    marginBottom: "6px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)",
    alignItems: "center",
  },

  // Mitigation item title
  mitigationItemTitle: {
    color: "#FFFFFF",
    fontSize: "12px",
    lineHeight: 1.3,
  },

  // Mitigation item credits
  mitigationItemCredits: {
    color: "#FFFFFF",
    fontSize: "12px",
    textAlign: "center" as const,
  },
};

export const activityStyles = {
  // Main container
  mainContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
  },

  // Header container
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#FFF",
    // marginBottom: "16px",
    textAlign: "left" as const,
  },
  // View all link
  viewAllLink: {
    fontSize: "14px",
    color: "#3D96E1",
    cursor: "pointer",
    "&:hover": { textDecoration: "underline" },
  },

  // Activities container
  activitiesContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },

  // Activity card base
  activityCardBase: {
    borderRadius: "20px",
    padding: "18px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },

  // Normal activity card
  activityCardNormal: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderLeft: "3px solid #FFFFFF", // only left border
  },

  // Emergency activity card
  activityCardEmergency: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderLeft: "3px solid #FF6B6B", // only left border
  },

  // Activity header container
  activityHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Activity type badge base
  activityTypeBadgeBase: {
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 8px",
    borderRadius: "12px",
  },

  // Normal activity type badge
  activityTypeBadgeNormal: {
    color: "#3D96E1",
    backgroundColor: "#3D96E122",
  },

  // Emergency activity type badge
  activityTypeBadgeEmergency: {
    color: "#FF6B6B",
    backgroundColor: "#FF6B6B22",
  },

  // Activity meta text (time and action)
  activityMetaText: {
    fontSize: "12px",
    color: "#FFF",
  },

  // Activity description text
  activityDescriptionText: {
    fontSize: "11px",
    color: "#FFFFFF",
    lineHeight: 1.3,
  },
};

export const breakStyles = {
  // Main container
  mainContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "center",
    gap: "16px",
  },

  // Controls grid container
  controlsGrid: {
    display: "grid",
    // gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gridTemplateColumns: "1fr 1fr", // 2 columns
    gridTemplateRows: "1fr 1fr", // 2 rows
    gap: "12px",
    flex: 1,
    height: "100%",
  },

  // Control item container
  controlItem: {
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "10px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  },

  // Control label text
  controlLabel: {
    fontSize: "1rem",
    color: "#FFFFFF",
    textAlign: "center" as const,
    lineHeight: 1.1,
    fontWeight: 500,
  },
};

export const weatherStyles = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#FFFFFF",
    marginBottom: "12px",
    textAlign: "center",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  iconContainer: {
    width: "80px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  detailsContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "auto",
  },
  leftDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  rightDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  locationText: {
    fontSize: "14px",
    color: "#FFF",
    fontWeight: 400,
  },
  temperatureText: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#FFFFFF",
  },
  humidityText: {
    fontSize: "14px",
    color: "#FFF",
    fontWeight: 400,
  },
};

export const timerStyles = {
  mainContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    padding: "10px",
    position: "relative" as const,
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // only align left section
    marginBottom: "8px",
    gap: "12px",
  },

  iconsColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "30px", // space between bell and pause
  },

  icon: {
    fontSize: "20px",
    color: "#FFFFFF",
    mt: 1,
  },

  timerText: {
    fontSize: "3.5rem",
    fontWeight: 1000,
    color: "#FFFFFF",
    lineHeight: 1.5,
  },

  plusIcon: {
    position: "absolute" as const,
    top: "6px",
    right: "6px",
  },

  bottomSection: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },

  bottomTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#FFFFFF",
  },

  bottomSubtitle: {
    fontSize: "12px",
    color: "#FFF",
  },

  rightControls: {
    position: "absolute" as const,
    right: "2px",
    bottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  controlCircle: {
    width: "20px",
    height: "20px",
    backgroundColor: "#A0A3BD",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  controlIcon: {
    color: "#fff",
    fontSize: 18,
  },
};
