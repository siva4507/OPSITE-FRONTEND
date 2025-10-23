import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Fade,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styles } from "./../../styles/styles";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/src/store/slices/notificationSlice";
import { useTranslation } from "@/src/hooks/useTranslation";

interface NotificationDialogProps {
  open: boolean;
  onClose: () => void;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { notifications, loading, error, total, totalPages } = useAppSelector(
    (state) => state.notification,
  );
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (open) {
      dispatch(getUserNotifications({ page: currentPage, limit: pageSize }));
    }
  }, [open, currentPage, dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            ...styles.dialog,
            minHeight: 500,
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
      slots={{ transition: Fade }}
      transitionDuration={300}
    >
      <DialogTitle sx={styles.dialogTitle}>
        {t("notification.title")}

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
          {notifications.length > 1 && (
            <Tooltip title={t("notification.markAsAllRead")} arrow>
              <IconButton
                onClick={handleMarkAllAsRead}
                sx={{ color: "white", mr: 1 }}
              >
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          ...styles.dialogContent,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {loading && <Typography>{t("notification.loading")}</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {!loading && notifications.length === 0 && (
            <Typography>{t("notification.notFound")}</Typography>
          )}

          <List>
            {notifications.map((notification) => {
              const isRead = notification.isRead;

              return (
                <ListItem
                  key={notification._id}
                  sx={{
                    backgroundColor: "transparent",
                    mb: 1,
                    borderRadius: 3,
                    position: "relative",
                    cursor: !isRead ? "pointer" : "default",
                    border: !isRead ? "1px solid #fff" : "none",
                    py: 0,
                  }}
                  onClick={() => !isRead && handleMarkAsRead(notification._id)}
                >
                  <ListItemText
                    primary={
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="subtitle1" sx={{ color: "white" }}>
                          {notification.title}
                        </Typography>
                        <Tooltip title={isRead ? "Unread" : "Read"} arrow>
                          <DoneAllIcon
                            fontSize="small"
                            sx={{ color: isRead ? "#1DA1F2" : "gray" }}
                          />
                        </Tooltip>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ color: "white" }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#3D96E1" }}>
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>

        {total > pageSize && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pt={0.5}
          >
            <IconButton
              onClick={handlePrev}
              disabled={currentPage === 1}
              size="small"
              sx={{ color: currentPage === 1 ? "gray" : "white" }}
            >
              <ChevronLeftIcon />
            </IconButton>

            <Typography variant="body2" sx={{ color: "white" }}>
              {t("notification.page")} {currentPage} / {totalPages} - {total}{" "}
              {t("notification.notifications")}
            </Typography>

            <IconButton
              onClick={handleNext}
              disabled={currentPage === totalPages}
              size="small"
              sx={{ color: currentPage === totalPages ? "gray" : "white" }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
