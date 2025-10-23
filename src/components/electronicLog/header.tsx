import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  InputBase,
  Button,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  FormControl,
  Select,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { showAlert } from "@/src/store/slices/alertSlice";
import { electronicLogStyles } from "@/src/styles/electronicLog.styles";
import { imageUrls } from "@/src/utils/constant";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  getAssignedAORs,
  setActiveTab,
  setShowAddRow,
  getCategories,
  getLogEntriesByAor,
  setSelectedAOR,
  clearLogEntries,
  exportLogbookPdfThunk,
  setAORSearch,
  setAORFilterTab,
  setAORSortBy,
  setAORSortOrder,
  setAORCurrentPage,
  setAORCurrentLimit,
} from "@/src/store/slices/electronicLogSlice";
import { scrollTabIntoView } from "@/src/utils/tabScrollHandler";
import { AlertType } from "@/src/types/types";
import { setActiveAorThunk } from "@/src/store/slices/shiftChangeSlice";
import { useTranslation } from "@/src/hooks/useTranslation";
import { ALL, IMPORTANT, MY } from "@/src/utils/constant";
import { ElectronicLogHeaderProps } from "@/src/types/electronicLog.types";
import { formatDistanceToNow } from "date-fns";
import { CSV, EXCEL } from "@/src/utils/constant";
import { RBAC } from "@/src/utils/protectedElements";
import AddRowComponent from "./addLog";
import { UserRole } from "@/src/types/auth.types";
import CircularProgress from "@mui/material/CircularProgress";
import { useSpeechRecognition } from "@/src/hooks/useSpeech";
import Loader from "@/src/components/common/loader";

interface ExtendedElectronicLogHeaderProps extends ElectronicLogHeaderProps {
  onExportCSV?: (type: "csv" | "xlsx") => void;
}

const ElectronicLogHeader: React.FC<ExtendedElectronicLogHeaderProps> = ({
  showToggleIcon,
  showMaximizeIcon,
  showMinimizeIcon,
  onToggleLogbook,
  onMaximizeLogbook,
  onMinimizeLogbook,
  onExportCSV,
  isFullScreen,
}) => {
  const styles = electronicLogStyles();
  const dispatch = useAppDispatch();
  const {
    aors,
    activeTab,
    showAddRow,
    selectedAOR,
    logEntries,
    totalEntries,
    loading,
    aorLoading,
  } = useAppSelector((state) => state.electronicLog);
  const [exportingPdf, setExportingPdf] = useState(false);
  const currentAor = aors[activeTab];
  const currentAorId = currentAor?._id;
  const currentAorState = useAppSelector((state) => {
    if (currentAorId) {
      return (
        state.electronicLog.aorStates[currentAorId] || {
          filterTab: "all",
          sortBy: "createdAt",
          sortOrder: "desc",
          currentPage: 1,
          currentLimit: 100,
          search: "",
        }
      );
    }
    return null;
  });
  const { recording, showWaveBox, handleMicHoldStart, handleMicHoldEnd } =
    useSpeechRecognition();
  const { filterTab, search } = currentAorState || {};
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  const lastEntry = logEntries[0];
  const lastEntryTime = lastEntry?.updatedAt
    ? formatDistanceToNow(new Date(lastEntry.updatedAt), { addSuffix: false })
    : null;
  const { selectedRole } = useAppSelector((state) => state.auth);

  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const exportMenuOpen = Boolean(exportMenuAnchor);

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportTypeSelect = (exportType: typeof CSV | typeof EXCEL) => {
    if (onExportCSV) {
      onExportCSV(exportType);
    } else {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("electronicLogBook.exportNotAvailable"),
        }),
      );
    }
    handleExportMenuClose();
  };

  const handleExportPdf = async () => {
    if (!selectedAOR || !currentAorState) return;

    try {
      setExportingPdf(true);

      const pdfBlob = await dispatch(
        exportLogbookPdfThunk({
          shiftAorId: selectedAOR,
          sortBy: currentAorState.sortBy || "createdAt",
          sortOrder: currentAorState.sortOrder || "desc",
          search: currentAorState.search || "",
          filter: currentAorState.filterTab?.toLowerCase() || "all",
          page: currentAorState.currentPage || 1,
          limit: currentAorState.currentLimit || 100,
          userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      ).unwrap();

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `logbook_${selectedAOR}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("common.exportSuccess"),
        }),
      );
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string"
              ? error
              : t("electronicLogBook.failDownloadPdf"),
        }),
      );
    } finally {
      setExportingPdf(false);
      handleExportMenuClose();
    }
  };

  useEffect(() => {
    dispatch(getCategories());

    dispatch(getAssignedAORs()).then((res) => {
      if (getAssignedAORs.fulfilled.match(res)) {
        const { aors } = res.payload;

        if (Array.isArray(aors) && aors.length > 0) {
          const sortedAors = [...aors].sort((a, b) => {
            const aHasShift = !!a.shiftId && !!a.shiftAorId;
            const bHasShift = !!b.shiftId && !!b.shiftAorId;
            return Number(bHasShift) - Number(aHasShift);
          });

          const activeIndex = sortedAors.findIndex(
            (aor) => aor.isActiveTab === true,
          );
          const finalActiveIndex = activeIndex !== -1 ? activeIndex : 0;
          const activeAor = sortedAors[finalActiveIndex];

          if (activeAor?._id) {
            dispatch(setSelectedAOR(activeAor._id));
            if (selectedRole !== UserRole.Observer) {
              dispatch(setActiveAorThunk(activeAor._id));
              dispatch(setSelectedAOR(activeAor._id));
            }
            dispatch(
              setAORFilterTab({ aorId: activeAor._id, filterTab: "all" }),
            );
            dispatch(
              getLogEntriesByAor({
                shiftAorId: activeAor._id,
                sortBy: "createdAt",
                sortOrder: "desc",
                filter: "all",
                search: "",
                page: 1,
                limit: 100,
              }),
            );
          
          }
        }
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (aors.length > 0 && tabsContainerRef.current) {
      const tabElements =
        tabsContainerRef.current.querySelectorAll('[role="tab"]');
      scrollTabIntoView(tabsContainerRef.current, tabElements, activeTab);
    }
  }, [aors, activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setActiveTab(newValue));

    const selectedAor = aors[newValue];
    if (selectedAor?._id) {
      if (selectedRole !== UserRole.Observer) {
        dispatch(setActiveAorThunk(selectedAor._id));
        dispatch(setSelectedAOR(selectedAor._id));
      }
      dispatch(setSelectedAOR(selectedAor._id));
      dispatch(clearLogEntries());
     
      dispatch(setAORFilterTab({ aorId: selectedAor._id, filterTab: "all" }));
      dispatch(setAORSortBy({ aorId: selectedAor._id, sortBy: "createdAt" }));
      dispatch(setAORSortOrder({ aorId: selectedAor._id, sortOrder: "desc" }));
      dispatch(setAORCurrentPage({ aorId: selectedAor._id, currentPage: 1 }));
      dispatch(
        setAORCurrentLimit({ aorId: selectedAor._id, currentLimit: 100 }),
      );
      dispatch(setAORSearch({ aorId: selectedAor._id, search: "" }));

      dispatch(
        getLogEntriesByAor({
          shiftAorId: selectedAor._id,
          sortBy: "createdAt",
          sortOrder: "desc",
          filter: "all",
          search: "",
          page: 1,
          limit: 100,
        }),
      );
    }

    setTimeout(() => {
      if (!tabsContainerRef.current) return;
      const tabElements =
        tabsContainerRef.current.querySelectorAll('[role="tab"]');
      scrollTabIntoView(tabsContainerRef.current, tabElements, newValue);
    }, 100);
  };

  const handleAddRowToggle = () => {
    dispatch(setShowAddRow(!showAddRow));
  };

  const handleFilterTabChange = (filter: string) => {
    if (currentAorId) {
      dispatch(
        setAORFilterTab({
          aorId: currentAorId,
          filterTab: filter as "all" | "my" | "imp",
        }),
      );

      dispatch(setAORCurrentPage({ aorId: currentAorId, currentPage: 1 }));
      dispatch(setAORCurrentLimit({ aorId: currentAorId, currentLimit: 100 }));

      const currentSearch = currentAorState?.search || "";
      dispatch(
        getLogEntriesByAor({
          shiftAorId: currentAorId,
          sortBy: currentAorState?.sortBy || "createdAt",
          sortOrder: currentAorState?.sortOrder || "desc",
          filter: filter.toLowerCase(),
          search: currentSearch,
          page: 1,
          limit: 100,
        }),
      );
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (currentAorId) {
      dispatch(setAORSearch({ aorId: currentAorId, search: value }));

      dispatch(
        getLogEntriesByAor({
          shiftAorId: currentAorId,
          sortBy: currentAorState?.sortBy,
          sortOrder: currentAorState?.sortOrder,
          filter: currentAorState?.filterTab.toLowerCase(),
          search: value,
          page: 1,
          limit: 100,
        }),
      );
    }
  };

  const handlePageLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = event.target.value as number;
    if (!currentAorId) return;
    dispatch(
      setAORCurrentLimit({ aorId: currentAorId, currentLimit: newLimit }),
    );

    dispatch(
      getLogEntriesByAor({
        shiftAorId: currentAorId,
        sortBy: currentAorState?.sortBy || "createdAt",
        sortOrder: currentAorState?.sortOrder || "desc",
        filter: currentAorState?.filterTab.toLowerCase() || "all",
        search: currentAorState?.search || "",
        page: 1,
        limit: newLimit,
      }),
    );
  };

  return (
    <>
      {aorLoading ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Loader />
        </Box>
      ) : !loading && aors.length === 0 ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#fff" }}>
            No assigned AORs found
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={styles.tabsContainer}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={styles.tabsFlexContainer}
              ref={tabsContainerRef}
              variant="scrollable"
              scrollButtons="auto"
            >
              {aors.map((aor, idx) => {
                const isActive = activeTab === idx;
                const hasShift = aor.shiftId && aor.shiftAorId;

                return (
                  <Tab
                    key={aor._id}
                    label={
                      <Tooltip title={hasShift ? "Active" : "Inactive"} arrow>
                        <Box sx={styles.tabWithDot}>
                          <FiberManualRecordIcon
                            sx={{ ...styles.tabDot, color: aor.color }}
                          />
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              fontWeight: hasShift ? 700 : 400,
                              position: "relative",
                              pb: "2px",
                              ...(hasShift
                                ? {
                                    "&::after": {
                                      content: '""',
                                      position: "absolute",
                                      left: 0,
                                      right: 0,
                                      bottom: -4,
                                      height: "2px",
                                      backgroundColor: aor.color,
                                      borderRadius: "2px",
                                    },
                                  }
                                : {}),
                            }}
                          >
                            {aor.name}
                          </Box>
                        </Box>
                      </Tooltip>
                    }
                    sx={{
                      ...styles.tab,
                      ...(isActive && hasShift
                        ? { backgroundColor: "#00010385" }
                        : {}),
                      minWidth: 120,
                      marginRight: 2,
                    }}
                  />
                );
              })}
            </Tabs>

            <Box sx={styles.headerActionsContainer}>
              {isFullScreen && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    marginLeft: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: recording
                        ? "rgba(255, 255, 255, 0.1)"
                        : "transparent",
                      transition: "all 0.3s ease-in-out",
                      cursor: "pointer",
                      boxShadow: showWaveBox
                        ? "0 0 15px 5px rgba(0, 200, 255, 0.7)"
                        : "none",
                    }}
                  >
                    <img
                      src={imageUrls.microphone}
                      alt="microphone"
                      width={24}
                      height={24}
                      style={{
                        cursor: "pointer",
                        zIndex: 3,
                        filter: recording ? "brightness(1.2)" : "none",
                      }}
                      onMouseDown={handleMicHoldStart}
                      onMouseUp={handleMicHoldEnd}
                      onMouseLeave={recording ? handleMicHoldEnd : undefined}
                      onTouchStart={handleMicHoldStart}
                      onTouchEnd={handleMicHoldEnd}
                    />
                  </Box>
                </Box>
              )}
              {showToggleIcon && (
                <img
                  src={imageUrls.toggleIcon}
                  alt="toggle"
                  width={28}
                  height={26}
                  style={styles.headerIcon}
                  onClick={onToggleLogbook}
                />
              )}
              {showMaximizeIcon && (
                <img
                  src={imageUrls.maximizeIcon}
                  alt="maximize"
                  width={30}
                  height={34}
                  style={styles.headerIconMaximize}
                  onClick={onMaximizeLogbook}
                />
              )}
              {showMinimizeIcon && (
                <img
                  src={imageUrls.minimizeIcon}
                  alt="minimize"
                  width={20}
                  height={20}
                  style={styles.headerIconMinimize}
                  onClick={onMinimizeLogbook}
                />
              )}
              <RBAC
                allowedRoles={[
                  UserRole.Administrator,
                  UserRole.ActiveController,
                ]}
              >
                {currentAor?.shiftId && currentAor?.shiftAorId && (
                  <img
                    src={imageUrls.add}
                    alt="add"
                    width={24}
                    height={24}
                    style={{
                      ...styles.headerIconAdd,
                      transform: showAddRow ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                    onClick={handleAddRowToggle}
                  />
                )}
              </RBAC>
            </Box>
          </Box>

          {!showAddRow && (
            <>
              <Box sx={styles.topBar}>
                <Box sx={styles.topBarContent}>
                  <Box sx={styles.topBarHeader}>
                    <Typography sx={styles.title}>
                      {t("electronicLogBook.title")}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                 
                      <Button
                        variant="outlined"
                        sx={styles.exportButton}
                        onClick={handleExportClick}
                        startIcon={
                          <Box sx={styles.exportIconContainer}>
                            <img
                              src={imageUrls.upload}
                              alt="export"
                              width={20}
                              height={20}
                              style={styles.exportIcon}
                            />
                          </Box>
                        }
                      >
                        {t("electronicLogBook.export")}
                      </Button>
                      <Menu
                        anchorEl={exportMenuAnchor}
                        open={exportMenuOpen}
                        onClose={handleExportMenuClose}
                        MenuListProps={{
                          "aria-labelledby": "export-button",
                        }}
                        PaperProps={{
                          sx: {
                            background: "#1A1A1A26",
                            backdropFilter: "blur(16.25px)",
                            boxSizing: "border-box",
                            marginTop: 0,
                            color: "#fff",
                            boxShadow: `
        8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
        -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
        0px 0px 20.8px -5.2px #FFFFFF33 inset
      `,
                            borderRadius: 2,
                            padding: 0.5,
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            fontSize: "0.3rem",
                          },
                        }}
                      >
                        <MenuItem onClick={() => handleExportTypeSelect(CSV)}>
                          {t("electronicLogBook.asCSV")}
                        </MenuItem>
                        <MenuItem onClick={() => handleExportTypeSelect(EXCEL)}>
                          {t("electronicLogBook.asEXCEL")}
                        </MenuItem>
                        <MenuItem
                          onClick={handleExportPdf}
                          disabled={exportingPdf}
                        >
                          {t("electronicLogBook.asPDF")}
                          {exportingPdf && (
                            <CircularProgress
                              size={18}
                              sx={{ marginLeft: 1, color: "white" }}
                            />
                          )}
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Box>
                  <Box sx={styles.topBarStatusContainer}>
                    <Box sx={styles.topBarStatusItem}>
                      <AccessTimeIcon sx={styles.statusIcon} />
                      {t("electronicLogBook.lastEntry")}:{" "}
                      {lastEntryTime
                        ? `${lastEntryTime}`
                        : t("electronicLogBook.noEntry")}
                    </Box>
                    <Box sx={styles.topBarStatusItem}>
                      <FiberManualRecordIcon sx={styles.statusDot} />
                      {totalEntries} {t("electronicLogBook.entries")}
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={styles.filterSearchContainer}>
                <Box sx={styles.tabbContainer}>
                  <Button
                    variant="outlined"
                    onClick={() => handleFilterTabChange(ALL)}
                    sx={{
                      ...styles.tabb,
                      ...styles.tabbLeftRadius,
                      ...(filterTab === ALL
                        ? {
                            backgroundColor: "rgba(25, 118, 210, 0.15)",
                            color: "white",
                          }
                        : {}),
                    }}
                  >
                    {t("electronicLogBook.allEntries")}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleFilterTabChange(MY)}
                    sx={{
                      ...styles.tabb,
                      ...(filterTab === MY
                        ? {
                            backgroundColor: "rgba(25, 118, 210, 0.15)",
                            color: "white",
                          }
                        : {}),
                    }}
                  >
                    {t("electronicLogBook.myEntries")}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleFilterTabChange(IMPORTANT)}
                    sx={{
                      ...styles.tabb,
                      ...styles.tabbRightRadius,
                      ...(filterTab === IMPORTANT
                        ? {
                            backgroundColor: "rgba(25, 118, 210, 0.15)",
                            color: "white",
                          }
                        : {}),
                    }}
                  >
                    {t("electronicLogBook.important")}
                  </Button>
                </Box>

                <Box
                  sx={styles.filterSearchContainer}
                  display="flex"
                  alignItems="center"
                  gap={0}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    sx={{ ...styles.whiteOutlineStyle, minWidth: 10 }}
                  >
                    <Select
                      value={currentAorState?.currentLimit || 100}
                      onChange={handlePageLimitChange}
                      displayEmpty
                      inputProps={{ "aria-label": "page limit" }}
                      sx={{
                        color: "#fff",
                        "& .MuiSelect-select": {
                          padding: "8px 24px 8px 12px",
                          color: "#fff",
                          "&:focus": {
                            backgroundColor: "transparent",
                          },
                        },
                        "& .MuiSelect-icon": { color: "#fff" },
                      }}
                    >
                      {[10, 20, 30, 40, 50, 100, 500].map((limit) => (
                        <MenuItem key={limit} value={limit}>
                          {limit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={styles.searchContainer} flexGrow={1}>
                    <Box sx={styles.searchBar}>
                      <SearchIcon sx={styles.searchIcon} />
                      <InputBase
                        placeholder={t("electronicLogBook.search")}
                        value={search}
                        onChange={handleSearchChange}
                        sx={styles.searchInput}
                        type="text"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          )}

          {showAddRow && currentAorId && selectedAOR && (
            <AddRowComponent
              currentAorId={currentAorId}
              selectedAOR={selectedAOR}
            />
          )}
        </>
      )}
    </>
  );
};

export default ElectronicLogHeader;
