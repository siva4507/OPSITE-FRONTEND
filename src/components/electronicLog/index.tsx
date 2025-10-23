"use client";

import React, { useRef } from "react";
import { Box } from "@mui/material";
import { electronicLogStyles } from "@/src/styles/electronicLog.styles";
import ElectronicLogHeader from "./header";
import ElectronicLogContent from "./contentView";
import { ElectronicLogHeaderProps } from "@/src/types/electronicLog.types";
import Pagination from "../common/pagination";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getLogEntriesByAor,
  setAORCurrentPage,
} from "@/src/store/slices/electronicLogSlice";
import { AlertType } from "@/src/types/types";
import { showAlert } from "@/src/store/slices/alertSlice";
import { useTranslation } from "@/src/hooks/useTranslation";
import { CSV, EXCEL } from "@/src/utils/constant";

const ElectronicLog: React.FC<ElectronicLogHeaderProps> = ({
  showToggleIcon,
  showMaximizeIcon,
  showMinimizeIcon,
  onToggleLogbook,
  onMaximizeLogbook,
  onMinimizeLogbook,
  isFullScreen = false,
  themeImageUrl,
}) => {
  const styles = electronicLogStyles();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { selectedAOR, logEntries } = useAppSelector(
    (state) => state.electronicLog,
  );
  const currentAorState = useAppSelector((state) => {
    if (selectedAOR) {
      return state.electronicLog.aorStates[selectedAOR];
    }
    return null;
  });

  const { totalPages, totalEntries } = useAppSelector(
    (state) => state.electronicLog,
  );

  const { currentPage = 1, currentLimit = 100 } = currentAorState || {};



  const handlePageChange = (page: number, limit: number) => {
    if (selectedAOR && currentAorState) {
      dispatch(setAORCurrentPage({ aorId: selectedAOR, currentPage: page }));
      dispatch(
        getLogEntriesByAor({
          shiftAorId: selectedAOR,
          sortBy: currentAorState.sortBy,
          sortOrder: currentAorState.sortOrder,
          filter: currentAorState.filterTab.toLowerCase(),
          search: currentAorState.search,
          page: page,
          limit: limit,
        }),
      );
    }
  };

  const exportFunctionRef = useRef<
    ((exportType?: typeof CSV | typeof EXCEL) => void) | null
  >(null);

  const handleExportReady = (
    exportFn: (exportType?: typeof CSV | typeof EXCEL) => void,
  ) => {
    exportFunctionRef.current = exportFn;
  };

  const handleExportCSV = (exportType: typeof CSV | typeof EXCEL = CSV) => {
    if (!logEntries || logEntries.length === 0) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("electronicLogBook.noDataToExport"),
        }),
      );
      return;
    }
    if (exportFunctionRef.current) {
      try {
        exportFunctionRef.current(exportType);
        dispatch(
          showAlert({
            type: AlertType.Success,
            message: t("electronicLogBook.exportSuccess"),
          }),
        );
      } catch {
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: t("electronicLogBook.exportFailed"),
          }),
        );
      }
    } else {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("electronicLogBook.exportNotAvailable"),
        }),
      );
    }
  };

  const getContainerStyles = () => {
    const baseStyles = styles.container;

    if (isFullScreen && themeImageUrl) {
      return {
        ...baseStyles,
        position: "relative",
        backgroundImage: `url(${themeImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#1A1A1A",
          opacity: 0.75,
          backdropFilter: "blur(20px)",
          zIndex: 1,
        },
        "& > *": {
          position: "relative",
          zIndex: 2,
        },
        boxShadow: `
        4px 4px 12px -2px #FFFFFF44 inset,
        -8px -4px 4px -2px #FFFFFF22 inset,
        0px 0px 10px -2px #FFFFFF22 inset
      `,
      };
    }

    return baseStyles;
  };

  return (
    <Box sx={getContainerStyles()}>
      <ElectronicLogHeader
        showToggleIcon={showToggleIcon}
        showMaximizeIcon={showMaximizeIcon}
        showMinimizeIcon={showMinimizeIcon}
        onToggleLogbook={onToggleLogbook}
        onMaximizeLogbook={onMaximizeLogbook}
        onMinimizeLogbook={onMinimizeLogbook}
        onExportCSV={handleExportCSV}
        isFullScreen={isFullScreen}
      />
      <Box sx={styles.scrollableContent}>
        <ElectronicLogContent onExportReady={handleExportReady} />
      </Box>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        currentLimit={currentLimit}
        totalCount={totalEntries}
        onPageChange={handlePageChange}
        showPagination={totalPages > 1}
      />
    </Box>
  );
};

export default ElectronicLog;
