"use client";

import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { appBarStyles } from "../../styles/styles";
import { useAppDispatch } from "@/src/hooks/redux";
import { imageUrls, navigationUrls } from "@/src/utils/constant";
import { AppbarProps } from "@/src/types/types";
import { logout } from "@/src/store/slices/authSlice";

const AppBarComponent: React.FC<AppbarProps> = ({ userName, profileUrl }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const displayName = userName
    ? userName.charAt(0).toUpperCase() + userName.slice(1)
    : "";

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      handleMenuClose();
      router.push(navigationUrls.login);
    } catch {
      handleMenuClose();
      router.push(navigationUrls.login);
    }
  };

  return (
    <AppBar position="static" elevation={0} sx={appBarStyles.appBar}>
      <Toolbar sx={appBarStyles.toolbar}>
        <Image src={imageUrls.logo} alt="Logo" width={140} height={20} />
        <Box sx={appBarStyles.profileBox}>
          <IconButton
            onClick={handleMenuClick}
            sx={appBarStyles.profileButton}
            aria-controls={anchorEl ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? "true" : undefined}
          >
            <Avatar
              alt={displayName}
              src={
                profileUrl && profileUrl.trim() !== "" ? profileUrl : undefined
              }
              sx={appBarStyles.avatar}
            >
              {(!profileUrl || profileUrl.trim() === "") &&
                displayName.charAt(0)}
            </Avatar>
            <Typography sx={appBarStyles.userName}>{displayName}</Typography>
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: appBarStyles.menuPaper,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleLogout} sx={appBarStyles.menuItem}>
              <ListItemIcon sx={appBarStyles.menuIcon}>
                <Logout fontSize="small" sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
