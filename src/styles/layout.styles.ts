import { Theme } from "@mui/material/styles";
import { imageUrls } from "../utils/constant";

export const dashboardLayoutStyles = (
  theme: Theme,
  bgImageUrl?: string,
  overlayColor?: string,
  overlayOpacity?: number,
) => ({
  root: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    background: `url(${bgImageUrl || imageUrls.bgPicture})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "darken",
    position: "relative",
    transition: "all 0.3s ease-in-out",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: overlayColor || "rgba(0, 0, 0, 0.45)",
    opacity: overlayOpacity ?? 0.45,
    pointerEvents: "none",
    zIndex: 1,
  },

  main: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    zIndex: 2,
  },

  pageContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    padding: "10px",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    WebkitOverflowScrolling: "touch",
    scrollBehavior: "smooth",
    padding: "10px 0px",
    height: "100%",
    boxSizing: "border-box",
    transition: "opacity 0.4s ease, transform 0.4s ease",
    opacity: 0,
    transform: "translateY(20px)",
    position: "relative",
    "&.loaded": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  dragbutton: {
    background: "#1A1A1A26",
    backdropFilter: "blur(16.25px)",
    WebkitBackdropFilter: "blur(16.25px)",
    boxShadow: `
    8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
    0px 0px 20.8px -5.2px #FFFFFF33 inset
  `,
    borderRadius: "50%",
    padding: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    animation:
      "blink 2s ease-in-out infinite, bubblePulse 2s ease-in-out infinite",

    "@keyframes blink": {
      "0%, 100%": {
        background: "#1A1A1A26",
        boxShadow: `
        8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
        -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
        0px 0px 20.8px -5.2px #FFFFFF33 inset,
        0px 0px 15px 0px rgba(255, 255, 255, 0.3)
      `,
      },
      "50%": {
        background: "#3D96E126",
        boxShadow: `
        8.13px 8.13px 24.38px -5.2px #3D96E166 inset,
        -16.25px -8.13px 8.13px -5.2px #3D96E133 inset,
        0px 0px 20.8px -5.2px #3D96E133 inset,
        0px 0px 20px 0px rgba(61, 150, 225, 0.6)
      `,
      },
    },
    "@keyframes bubblePulse": {
      "0%, 100%": {
        transform: "scale(1)",
        boxShadow:
          "0 0 12px rgba(61, 150, 225, 0.6), 0 0 24px rgba(61, 150, 225, 0.3)",
      },
      "50%": {
        transform: "scale(1.1)",
        boxShadow:
          "0 0 25px rgba(61, 150, 225, 0.9), 0 0 45px rgba(61, 150, 225, 0.5)",
      },
    },
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  draggableDiaryButton: (
    diaryPos: { x: number; y: number },
    dragging: boolean,
  ) => ({
    position: "fixed",
    left: diaryPos.x,
    top: diaryPos.y,
    zIndex: 9999,
    cursor: dragging ? "grabbing" : "grab",
    userSelect: "none",
  }),
  diaryImage: {
    width: 44,
    height: 46,
    display: "block",
  },
  fullscreenOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 1200,
    background: "rgba(10, 20, 40, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
  },
  fullscreenContent: {
    width: "100vw",
    height: "100vh",
    overflow: "auto",
    borderRadius: 0,
    boxShadow: "none",
    background: "transparent",
    pointerEvents: "auto",
  },
  logbookBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    pointerEvents: "auto",
  },
  logbookOverlay: {
    position: "absolute",
    bottom: "4px",
    right: "0px",
    width: "100%",
    height: "70%",
    zIndex: 1000,
    maxHeight: "600px",
    minHeight: "400px",
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
  },
});
