"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { dashboardLayoutStyles } from "@/src/styles/layout.styles";
import dynamic from "next/dynamic";
import { DashboardLayoutProps, ThemeConfig } from "@/src/types/types";
import Loader from "@/src/components/common/loader";
import { useStepGuard } from "@/src/hooks/useStepGuard";
import { useAppSelector, useAppDispatch } from "@/src/hooks/redux";
import BackgroundImagePicker from "@/src/components/common/bgImagePicker";
import NotificationModal from "@/src/components/common/notificationList";
import { resolveUserTheme } from "@/src/utils/themeUtils";
import { getSystemThemes } from "@/src/store/slices/themeSlice";
import { DASHBOARD, imageUrls } from "@/src/utils/constant";
import ElectronicLog from "@/src/components/electronicLog";
import { usePathname } from "next/navigation";
import Fade from "@mui/material/Fade";
import { navigationUrls } from "@/src/utils/constant";
import AuthGuard from "@/src/utils/authGuard";
import { UserRole } from "@/src/types/auth.types";
import { useRoleGuard } from "@/src/hooks/useRoleGuard";
import NotificationListener from "@/src/components/common/notificationModal";
import { RBAC } from "@/src/utils/protectedElements";

const Sidebar = dynamic(() => import("@/src/components/layout/sideMenu"), {
  ssr: false,
});
const DashboardHeader = dynamic(
  () => import("@/src/components/layout/dashboardHead"),
  { ssr: false },
);

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  useStepGuard(DASHBOARD);
  useRoleGuard();
  const { user, selectedRole } = useAppSelector((state) => state.auth);
  const { themes } = useAppSelector((state) => state.theme);

  const [previewTheme, setPreviewTheme] = useState<
    Partial<ThemeConfig> | undefined
  >(undefined);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [layoutLoaded, setLayoutLoaded] = useState(false);
  const [diaryPos, setDiaryPos] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const pathname = usePathname();
  const isLogbook = pathname?.includes(navigationUrls.logbook) ?? false;
  const [showLogbookOverlay, setShowLogbookOverlay] = useState(false);
  const [logbookFullscreen, setLogbookFullscreen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedOverlay = localStorage.getItem("logbookOverlay");
    const savedFullscreen = localStorage.getItem("logbookFullscreen");

    if (savedOverlay === "true") setShowLogbookOverlay(true);
    if (savedFullscreen === "true") setLogbookFullscreen(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "logbookOverlay",
      showLogbookOverlay ? "true" : "false",
    );
  }, [showLogbookOverlay]);

  useEffect(() => {
    localStorage.setItem(
      "logbookFullscreen",
      logbookFullscreen ? "true" : "false",
    );
  }, [logbookFullscreen]);

  useEffect(() => {
    const margin = 84;
    const width = 48;
    const height = 60;

    const updatePosition = () => {
      setDiaryPos({
        x: window.innerWidth - width - margin,
        y: window.innerHeight - height - margin,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - diaryPos.x,
      y: e.clientY - diaryPos.y,
    });
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const margin = 24;
      const width = 48;
      const height = 50;
      const maxX = window.innerWidth - width - margin;
      const maxY = window.innerHeight - height - margin;
      const minX = margin;
      const minY = margin;
      setDiaryPos({
        x: Math.max(minX, Math.min(e.clientX - dragOffset.x, maxX)),
        y: Math.max(minY, Math.min(e.clientY - dragOffset.y, maxY)),
      });
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);

  const themeConfig = useMemo(
    () => resolveUserTheme(user, themes, previewTheme),
    [user, themes, previewTheme],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLayoutLoaded(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (user && themes.length === 0) {
      dispatch(getSystemThemes());
    }
  }, [user, themes.length, dispatch]);

  useEffect(() => {
    if (user?.theme) {
      setPreviewTheme(undefined);
    }
  }, [user?.theme]);

  const styles = useMemo(
    () =>
      dashboardLayoutStyles(
        theme,
        themeConfig.imageUrl,
        themeConfig.colorCode,
        themeConfig.opacity,
      ),
    [theme, themeConfig],
  );

  if (!layoutLoaded) {
    return (
      <Box sx={styles.loader}>
        <Loader />
      </Box>
    );
  }

  return (
    <>
      <AuthGuard requireAuth={true}>
        {user?._id && <NotificationListener userId={user._id} />}
        <Box sx={styles.root} position="relative">
          <Box sx={styles.overlay} />
          <Box sx={styles.main} position="relative" zIndex={2}>
            <Sidebar />
            <Box sx={styles.pageContent}>
              <DashboardHeader
                onOpenBgPicker={() => setBgPickerOpen(true)}
                onNotifyOpen={() => setNotifyOpen(true)}
              />
             
              <Box sx={styles.content} className={layoutLoaded ? "loaded" : ""}>
                {!isLogbook && (showLogbookOverlay || logbookFullscreen) ? (
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{ height: "100%", overflowY: "auto" }}
                  >
                    <ElectronicLog
                      showToggleIcon={true}
                      showMaximizeIcon={!logbookFullscreen}
                      showMinimizeIcon={logbookFullscreen}
                      onToggleLogbook={() =>
                        setShowLogbookOverlay(!showLogbookOverlay)
                      }
                      onMaximizeLogbook={() => setLogbookFullscreen(true)}
                      onMinimizeLogbook={() => setLogbookFullscreen(false)}
                      isFullScreen={logbookFullscreen}
                      themeImageUrl={themeConfig?.imageUrl}
                      themeOpacity={themeConfig?.opacity}
                      themeColor={themeConfig?.colorCode}
                    />
                  </Box>
                ) : (
                  children
                )}
              </Box>
            </Box>
          </Box>
          {selectedRole !== UserRole.Administrator &&
            !isLogbook &&
            !showLogbookOverlay && (
              <Box
                sx={{
                  ...styles.draggableDiaryButton(diaryPos, dragging),
                  ...styles.dragbutton,
                }}
              >
                <img
                  src={imageUrls.diary}
                  alt="diary"
                  style={styles.diaryImage}
                  onMouseDown={handleMouseDown}
                  onClick={() => setShowLogbookOverlay(true)}
                  draggable={false}
                />
              </Box>
            )}
          <BackgroundImagePicker
            open={bgPickerOpen}
            onClose={() => {
              setBgPickerOpen(false);
              setPreviewTheme(undefined);
            }}
            onLivePreview={(theme) => setPreviewTheme(theme)}
            onApply={() => {
              setBgPickerOpen(false);
            }}
            userTheme={user?.theme || {}}
          />
          <RBAC allowedRoles={[UserRole.ActiveController]}>
            <NotificationModal
              open={notifyOpen}
              onClose={() => setNotifyOpen(false)}
            />
          </RBAC>
        </Box>

        <Fade in={logbookFullscreen} timeout={400} unmountOnExit>
          <Box
            sx={styles.fullscreenOverlay}
            onClick={() => setLogbookFullscreen(false)}
          >
            <Box
              sx={styles.fullscreenContent}
              onClick={(e) => e.stopPropagation()}
            >
              <Box sx={{ height: "100%", overflowY: "auto" }}>
                <ElectronicLog
                  showToggleIcon={true}
                  showMinimizeIcon={true}
                  onToggleLogbook={() => {
                    setShowLogbookOverlay(false);
                    setLogbookFullscreen(false);
                  }}
                  onMinimizeLogbook={() => setLogbookFullscreen(false)}
                  isFullScreen={logbookFullscreen}
                  themeImageUrl={themeConfig?.imageUrl}
                  themeOpacity={themeConfig?.opacity}
                  themeColor={themeConfig?.colorCode}
                />
              </Box>
            </Box>
          </Box>
        </Fade>
      </AuthGuard>
    </>
  );
}
