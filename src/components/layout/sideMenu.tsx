import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Fade,
  Tooltip,
  Typography,
  Link,
  Button,
  Collapse,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { logout } from "@/src/store/slices/authSlice";
import { imageUrls, navigationUrls } from "@/src/utils/constant";
import { useTranslation } from "@/src/hooks/useTranslation";
import { RBAC } from "@/src/utils/protectedElements";
import { sidebarStyles } from "@/src/styles/dashboard.styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CategoryIcon from "@/src/assets/Category.svg";
import BookIcon from "@/src/assets/book.svg";
import FolderIcon from "@/src/assets/Folder.svg";
import HelpIcon from "@/src/assets/help.svg";
import HistoryIcon from "@/src/assets/history.svg";
import CompanyIcon from "@/src/assets/company.svg";
import { UserRole } from "@/src/types/auth.types";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AlignHorizontalLeftOutlinedIcon from "@mui/icons-material/AlignHorizontalLeftOutlined";
import AirlineSeatIndividualSuiteOutlinedIcon from "@mui/icons-material/AirlineSeatIndividualSuiteOutlined";
import ContrastOutlinedIcon from "@mui/icons-material/ContrastOutlined";
import BrightnessAutoOutlinedIcon from "@mui/icons-material/BrightnessAutoOutlined";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import FilterTiltShiftOutlinedIcon from "@mui/icons-material/FilterTiltShiftOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import LockResetIcon from "@mui/icons-material/LockReset";

interface SubMenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuItemWithSub {
  label: string;
  icon: React.ReactNode;
  subItems: SubMenuItem[];
  path?: never;
}

interface MenuItemDirect {
  label: string;
  icon: React.ReactNode;
  path: string;
  subItems?: never;
}

type MenuItem = MenuItemWithSub | MenuItemDirect;

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { selectedRole } = useAppSelector((s) => s.auth);
  
  const [collapsed, setCollapsed] = React.useState(false);
  const [expandedMenus, setExpandedMenus] = React.useState<
    Record<string, boolean>
  >({});

  const styles = sidebarStyles(theme);

  const menuCategories: MenuItem[] = [
    {
      label: t("sidebar.dashboard"),
      icon: <CategoryIcon width={24} height={24} />,
      path: navigationUrls.dashboard,
    },
    {
      label: t("sidebar.userAccess"),
      icon: <SupervisedUserCircleOutlinedIcon width={24} height={24} />,
      subItems: [
        {
          label: t("sidebar.user"),
          icon: <PersonAddAltOutlinedIcon width={20} height={20} />,
          path: navigationUrls.user,
        },
        {
          label: t("sidebar.roles"),
          icon: <ManageAccountsOutlinedIcon width={20} height={20} />,
          path: navigationUrls.roles,
        },
      ],
    },
    {
      label: t("sidebar.organizationSetup"),
      icon: <CorporateFareOutlinedIcon width={24} height={24} />,
      subItems: [
        {
          label: t("sidebar.companies"),
          icon: <CompanyIcon width={20} height={20} />,
          path: navigationUrls.companies,
        },
        {
          label: t("sidebar.facilities"),
          icon: <BookIcon width={20} height={20} />,
          path: navigationUrls.facility,
        },
        {
          label: t("sidebar.categories"),
          icon: <CategoryOutlinedIcon width={20} height={20} />,
          path: navigationUrls.categories,
        },
      ],
    },
    {
      label: t("sidebar.operations"),
      icon: <LockResetIcon width={24} height={24} />,
      subItems: [
        {
          label: t("sidebar.aor"),
          icon: <ManageHistoryOutlinedIcon width={20} height={20} />,
          path: navigationUrls.aor,
        },
        {
          label: t("sidebar.aorForms"),
          icon: <AlignHorizontalLeftOutlinedIcon width={20} height={20} />,
          path: navigationUrls.aorforms,
        },
      ],
    },
    {
      label: t("sidebar.fatigue"),
      icon: <LocalActivityOutlinedIcon width={24} height={24} />,
      subItems: [
        {
          label: t("sidebar.mitigation"),
          icon: <SettingsBackupRestoreOutlinedIcon width={20} height={20} />,
          path: navigationUrls.mitigation,
        },
        {
          label: t("sidebar.hoursOfSleep"),
          icon: (
            <AirlineSeatIndividualSuiteOutlinedIcon width={20} height={20} />
          ),
          path: navigationUrls.sleepHours,
        },
        {
          label: t("sidebar.qos"),
          icon: (
            <AirlineSeatIndividualSuiteOutlinedIcon width={20} height={20} />
          ),
          path: navigationUrls.qos,
        },
        {
          label: t("sidebar.hoursOfShift"),
          icon: <FilterTiltShiftOutlinedIcon width={20} height={20} />,
          path: navigationUrls.shiftHours,
        },
        {
          label: t("sidebar.hitchDay"),
          icon: <CalendarMonthOutlinedIcon width={20} height={20} />,
          path: navigationUrls.hitchDay,
        },
        {
          label: t("sidebar.fatigueScore"),
          icon: <CreditScoreIcon width={20} height={20} />,
          path: navigationUrls.fatigueScore,
        },
      ],
    },
    // Appearance
    {
      label: t("sidebar.appearance"),
      icon: <BrightnessAutoOutlinedIcon width={24} height={24} />,
      subItems: [
        {
          label: t("sidebar.themes"),
          icon: <ContrastOutlinedIcon width={20} height={20} />,
          path: navigationUrls.themes,
        },
      ],
    },
  ];

  const nonAdminItems: MenuItem[] = [
    {
      label: t("sidebar.dashboard"),
      icon: <CategoryIcon width={24} height={24} />,
      path: navigationUrls.dashboard,
    },
    {
      label: t("sidebar.shiftChange"),
      icon: <HistoryIcon width={24} height={24} />,
      path: navigationUrls.shiftChange,
    },
    {
      label: t("sidebar.electronicLogbook"),
      icon: <BookIcon width={24} height={24} />,
      path: navigationUrls.logbook,
    },
    {
      label: t("sidebar.documentRepository"),
      icon: <FolderIcon width={24} height={24} />,
      path: navigationUrls.documents,
    },
    {
      label: t("sidebar.helpAndSupport"),
      icon: <HelpIcon width={24} height={24} />,
      path: navigationUrls.help,
    },
  ];

  const navItems =
    selectedRole === UserRole.Administrator ? menuCategories : nonAdminItems;

  React.useEffect(() => {
    const allPaths: string[] = [];
    navItems.forEach((item) => {
      if ("path" in item && item.path) {
        allPaths.push(item.path);
      }
      if ("subItems" in item && item.subItems) {
        (item as MenuItemWithSub).subItems.forEach((subItem) => {
          allPaths.push(subItem.path);
        });
      }
    });

    allPaths.forEach((path) => {
      router.prefetch(path);
    });
  }, [selectedRole]);


  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(
        showAlert({
          message: t("logout.success"),
          type: AlertType.Success,
        }),
      );
      router.push(navigationUrls.login);
    } catch {
      dispatch(
        showAlert({
          message: t("logout.error"),
          type: AlertType.Error,
        }),
      );
      router.push(navigationUrls.login);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path, { scroll: false });
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleMenu = (menuLabel: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuLabel]: !prev[menuLabel],
    }));
  };

  const getIconColor = (isSelected: boolean) =>
    isSelected ? "#fff" : theme.palette.mode === "dark" ? "#fff" : "#FFFFFF";

  const isPathSelected = (itemPath: string) => {
    const safePathname = pathname ?? "";
    return safePathname === itemPath;
  };

  const isMenuExpanded = (menuLabel: string) =>
    expandedMenus[menuLabel] || false;

  const isMenuActive = (item: MenuItem): boolean => {
    if ("path" in item && item.path) {
      return isPathSelected(item.path);
    }
    if ("subItems" in item && item.subItems) {
      return (item as MenuItemWithSub).subItems.some((subItem) =>
        isPathSelected(subItem.path),
      );
    }
    return false;
  };

  const renderLogo = () => (
    <Box sx={styles.logoBox}>
      {collapsed ? (
        <Image
          src={imageUrls.opsitelogo}
          alt="Collapsed Logo"
          width={60}
          height={16}
          style={styles.collapsedLogo}
          objectFit="contain"
        />
      ) : (
        <Image
          src={imageUrls.logo}
          alt="Logo"
          width={200}
          height={30}
          style={{ objectFit: "contain" }}
        />
      )}
    </Box>
  );

  const renderToggleButton = () => (
    <Box sx={{ ...styles.toggleButton }} onClick={toggleSidebar}>
      <Image
        src={imageUrls.toggle}
        alt="Toggle Sidebar"
        width={12}
        height={12}
        style={{
          transform: collapsed ? "rotate(180deg)" : "none",
          transition: "transform 0.3s",
        }}
      />
    </Box>
  );

  const renderNavigationItems = () => (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.3)"
              : "rgba(0,0,0,0.3)",
          borderRadius: "2px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.5)"
              : "rgba(0,0,0,0.5)",
        },
      }}
    >
      <List sx={styles.navList}>
        {navItems.map((item) => {
          const isActive = isMenuActive(item);
          const iconColor = getIconColor(isActive && !("subItems" in item));
          const expanded = isMenuExpanded(item.label);

          return (
            <React.Fragment key={item.label}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={isActive && !("subItems" in item)}
                  onClick={(e) => {
                    if ("path" in item && item.path) {
                      handleNavigation(item.path);
                    } else if ("subItems" in item && item.subItems) {
                      if (collapsed) {
                        setCollapsed(false);
                        setExpandedMenus((prev) => ({
                          ...prev,
                          [item.label]: true,
                        }));
                      } else {
                        toggleMenu(item.label);
                      }
                      e.stopPropagation();
                    }
                  }}
                  sx={{
                    ...styles.navItem,
                    ...(isActive && !("subItems" in item)
                      ? styles.navItemSelected
                      : {}),
                    justifyContent: collapsed ? "center" : "flex-start",
                    backgroundColor:
                      isActive && "subItems" in item
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      ...styles.navIcon,
                      color: iconColor,
                      mr: collapsed ? 0 : 2,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <>
                      <ListItemText
                        primary={item.label}
                        sx={{ "& .MuiListItemText-primary": styles.navText }}
                      />
                      {"subItems" in item && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", ml: 1 }}
                        >
                          {expanded ? (
                            <ExpandLessIcon
                              sx={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "#FFFFFF",
                              }}
                            />
                          ) : (
                            <ExpandMoreIcon
                              sx={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "#FFFFFF",
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              {"subItems" in item && !collapsed && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {(item as MenuItemWithSub).subItems.map((subItem) => {
                      const isSubSelected = isPathSelected(subItem.path);
                      const subIconColor = getIconColor(isSubSelected);

                      return (
                        <ListItem key={subItem.label} disablePadding>
                          <ListItemButton
                            selected={isSubSelected}
                            onClick={() => handleNavigation(subItem.path)}
                            sx={{
                              ...styles.navItem,
                              ...(isSubSelected ? styles.navItemSelected : {}),
                              pl: 4,
                              minHeight: "40px",
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                ...styles.navIcon,
                                color: subIconColor,
                                mr: 2,
                                minWidth: "36px",
                              }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={subItem.label}
                              sx={{
                                "& .MuiListItemText-primary": {
                                  ...styles.navText,
                                  fontSize: "0.875rem",
                                },
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}

              {/* Tooltip for collapsed sub-menus */}
              {"subItems" in item && collapsed && (
                <Tooltip
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, color: "#fff" }}
                      >
                        {item.label}
                      </Typography>
                      {(item as MenuItemWithSub).subItems.map((subItem) => (
                        <Box
                          key={subItem.label}
                          onClick={() => handleNavigation(subItem.path)}
                          sx={{
                            cursor: "pointer",
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.1)",
                            },
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#fff" }}>
                            {subItem.label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  }
                  placement="right"
                  arrow
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {/* Empty box to serve as tooltip trigger */}
                  </Box>
                </Tooltip>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  const renderShiftChangeButton = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {collapsed ? (
        <Tooltip
          title={
            <Box sx={styles.shiftTooltip}>
              <Box sx={styles.shiftButtonTitle}>
                <Image
                  src={imageUrls.shiftChange}
                  alt="Shift Change"
                  width={34}
                  height={34}
                />
                {t("sidebar.shiftChangeForm")}
              </Box>
              <Typography component="span" sx={styles.shiftButtonDesc}>
                {t("sidebar.shiftChangeDesc")}
                <Link
                  href={navigationUrls.shiftChange}
                  sx={styles.shiftButtonLink}
                >
                  {t("sidebar.shiftChangeLink")}
                </Link>
              </Typography>
            </Box>
          }
          placement="top-end"
          slotProps={{
            popper: {
              modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
            },
            tooltip: {
              sx: { p: 0, background: "transparent", boxShadow: "none" },
            },
          }}
          enterDelay={200}
          leaveDelay={100}
          arrow={false}
        >
          <Box>
            <Image
              src={imageUrls.shiftChange}
              alt="Shift Change Collapsed"
              width={34}
              height={34}
            />
          </Box>
        </Tooltip>
      ) : (
        <Button fullWidth variant="contained" sx={styles.shiftButton}>
          <Box sx={styles.shiftButtonContent}>
            <Box sx={styles.shiftButtonTitle}>
              <Image
                src={imageUrls.shiftChange}
                alt="Shift Change"
                width={34}
                height={34}
              />
              {t("sidebar.shiftChangeForm")}
            </Box>
            <Typography component="span" sx={{ ...styles.shiftButtonDesc }}>
              {t("sidebar.shiftChangeDesc")}
              <Link
                href={navigationUrls.shiftChange}
                sx={styles.shiftButtonLink}
              >
                {t("sidebar.shiftChangeLink")}
              </Link>
            </Typography>
          </Box>
        </Button>
      )}
    </Box>
  );

  const renderLogoutButton = () => (
    <>
      {collapsed ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* PrismaHoriz image */}
          <Image
            src={imageUrls.prismVert}
            alt="Prism Logo"
            width={40}
            height={40}
          />

          {/* Logout icon */}
          <Box sx={styles.listButton} onClick={handleLogout}>
            <Image src={imageUrls.logout} alt="Logout" width={24} height={24} />
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
          {/* PrismaHoriz image */}
          <Image
            src={imageUrls.prismHoriz}
            alt="Prism Logo"
            width={60}
            height={24}
          />

          {/* Logout button */}
          <Button
            fullWidth
            startIcon={
              <Image
                src={imageUrls.logout}
                alt="Logout"
                width={24}
                height={24}
              />
            }
            sx={styles.logoutButton}
            onClick={handleLogout}
          >
            {t("logout.button")}
          </Button>
        </Box>
      )}
    </>
  );

  return (
    <Box
      sx={{
        ...styles.root,
        ...(collapsed ? styles.collapsedRoot : {}),
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "97vh",
      }}
    >
      {/* Top Section */}
      <Box>
        <Fade in timeout={400}>
          <Box>{renderLogo()}</Box>
        </Fade>
        <Fade in timeout={400}>
          <Box>{renderToggleButton()}</Box>
        </Fade>
      </Box>

      {/* Middle Section (Stretching with Scrollbar) */}
      <Fade in timeout={400}>
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderNavigationItems()}
        </Box>
      </Fade>

      {/* Bottom Section (Fixed footer) */}
      <Box sx={styles.bottomSection}>
        <RBAC allowedRoles={[UserRole.ActiveController, UserRole.Observer]}>
          <Fade in timeout={400}>
            <Box>{renderShiftChangeButton()}</Box>
          </Fade>
        </RBAC>
        <Fade in timeout={400}>
          <Box>{renderLogoutButton()}</Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default Sidebar;
