import React, { useEffect, useRef, useState } from "react";
import { IconButton, Box, Typography, Tooltip } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { electronicLogStyles } from "@/src/styles/electronicLog.styles";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  ALL,
  ASCENDING,
  DESCENDING,
  imageUrls,
  IMPORTANT,
  MY,
} from "@/src/utils/constant";
import {
  getLogEntriesByAor,
  setAORSortBy,
  setShowAddRow,
  clearAddRowState,
  toggleLogEntryImportant,
  toggleImportantOptimistic,
  deleteLogEntryById,
  setAORSortOrder,
} from "@/src/store/slices/electronicLogSlice";
import { LogEntryDto } from "@/src/dto/electronicLog.dto";
import { useTranslation } from "@/src/hooks/useTranslation";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import DynamicTable from "@/src/components/common/dataTable";
import { HeaderConfig, ActionConfig } from "@/src/types/types";
import { ElectronicLogRow } from "@/src/types/electronicLog.types";
import EditLogEntryModal from "./updateLog";
import DynamicModal from "../common/modal";
import { tableStyles } from "@/src/styles/table.styles";
import { UserRole } from "@/src/types/auth.types";
import { formatDate } from "@/src/utils/config";

interface ElectronicLogContentProps {
  onExportReady?: (exportFn: () => void) => void;
}

const ElectronicLogContent: React.FC<ElectronicLogContentProps> = ({
  onExportReady,
}) => {
  const styles = electronicLogStyles();
  const dispatch = useAppDispatch();
  const { logEntries, selectedAOR, tableLoading } = useAppSelector(
    (state) => state.electronicLog,
  );
  const currentAorState = useAppSelector((state) => {
    if (selectedAOR) {
      return (
        state.electronicLog.aorStates[selectedAOR] || {
          filterTab: "all",
          sortBy: "updatedAt",
          sortOrder: "desc",
          currentPage: 1,
          currentLimit: 100,
          search: "",
        }
      );
    }
    return null;
  });
  const { selectedRole } = useAppSelector((state) => state.auth);

  const { filterTab, sortBy, sortOrder } = currentAorState || {};
 

  const { t } = useTranslation();
  const exportFunctionRef = useRef<(() => void) | null>(null);
  const [logToDelete, setLogToDelete] = useState<ElectronicLogRow | null>(null);
  const [editingLogEntry, setEditingLogEntry] =
    useState<ElectronicLogRow | null>(null);

  useEffect(() => {
    if (selectedAOR && currentAorState) {
      dispatch(
        getLogEntriesByAor({
          shiftAorId: selectedAOR,
          sortBy: currentAorState.sortBy,
          sortOrder: currentAorState.sortOrder,
          filter: currentAorState.filterTab.toLowerCase(),
          search: currentAorState.search,
          page: currentAorState.currentPage,
          limit: currentAorState.currentLimit,
        }),
      );
      dispatch(setShowAddRow(false));
      dispatch(clearAddRowState({ aorId: selectedAOR }));
    }
  }, [dispatch, selectedAOR]);

  useEffect(() => {
    if (exportFunctionRef.current && onExportReady) {
      onExportReady(exportFunctionRef.current);
    }
  }, [onExportReady]);

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const handleSort = (field: string) => {
    if (selectedAOR && currentAorState) {
      let newSortBy = field;
      let newSortOrder: "asc" | "desc";
      if (currentAorState.sortBy === field) {
        newSortOrder =
          currentAorState.sortOrder === ASCENDING ? DESCENDING : ASCENDING;
      } else {
        newSortBy = field;
        newSortOrder = ASCENDING;
      }
      dispatch(setAORSortBy({ aorId: selectedAOR, sortBy: newSortBy }));
      dispatch(
        setAORSortOrder({ aorId: selectedAOR, sortOrder: newSortOrder }),
      );
      dispatch(
        getLogEntriesByAor({
          shiftAorId: selectedAOR,
          sortBy: newSortBy,
          sortOrder: newSortOrder,
          filter: currentAorState.filterTab.toLowerCase(),
          search: currentAorState.search,
          page: 1,
          limit: currentAorState.currentLimit || 100,
        }),
      );
    }
  };

  const refreshLogEntries = () => {
    if (selectedAOR && currentAorState) {
      dispatch(
        getLogEntriesByAor({
          shiftAorId: selectedAOR,
          sortBy: currentAorState.sortBy,
          sortOrder: currentAorState.sortOrder,
          filter: currentAorState.filterTab.toLowerCase(),
          search: currentAorState.search,
          page: currentAorState.currentPage,
          limit: currentAorState.currentLimit,
        }),
      );
    }
  };

  const handleToggleImportant = (rowId: string) => {
    dispatch(toggleImportantOptimistic(rowId));
    dispatch(toggleLogEntryImportant(rowId))
      .unwrap()
      .then((res) => {
        dispatch(showAlert({ type: AlertType.Success, message: res.message }));
      })
      .catch((err) => {
        dispatch(toggleImportantOptimistic(rowId));
        dispatch(showAlert({ type: AlertType.Error, message: err }));
      });
  };

  const handleExportCallback = (exportFn: any) => {
    exportFunctionRef.current = exportFn;
  };

  const renderStarWithLabel = <K extends keyof ElectronicLogRow>(
    row: ElectronicLogRow,
    field: K,
    labelExtractor: (value: ElectronicLogRow[K]) => string,
  ) => {
    const fieldValue = row[field];
    const fullText = labelExtractor(fieldValue);

    return (
      <>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleImportant(row._id);
          }}
          sx={{ padding: 0, marginRight: 0.5, verticalAlign: "middle" }}
          disabled={selectedRole === UserRole.Observer}
        >
          {row.isImportant ? (
            <StarIcon sx={{ color: "#FFD700", fontSize: 20 }} />
          ) : (
            <StarBorderIcon sx={{ color: "#999", fontSize: 20 }} />
          )}
        </IconButton>
        <Tooltip title={fullText || ""}>
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              verticalAlign: "middle",
              maxWidth: "calc(100% - 28px)",
            }}
          >
            {fullText}
          </span>
        </Tooltip>
      </>
    );
  };

  const headers: HeaderConfig<ElectronicLogRow>[] = [
    {
      label: t("electronicLogBook.category"),
      field: "categoryId",
      sortKey: "category",
      sortable: true,
      render: (row) =>
        renderStarWithLabel(row, "categoryId", (cat) => cat?.name || "-"),
      exportValue: (row) => row.categoryId?.name || "-",
    },
    {
      label: t("electronicLogBook.facility"),
      field: "facilityIds",
      sortKey: "facility",
      sortable: true,
      render: (row) => {
        const facilities = row.facilityIds || [];
        if (facilities.length === 0) return "-";

        const firstFacility = facilities[0]?.name;
        const remainingFacilities = facilities.slice(1).map((f) => f.name);
        const tooltipText =
          facilities.length > 1 ? facilities.map((f) => f.name).join(", ") : "";

        return (
          <Tooltip
            title={tooltipText}
            disableHoverListener={facilities.length <= 1}
            arrow
          >
            <span
              style={{
                display: "inline-block",
                maxWidth: 130,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {firstFacility}
              {remainingFacilities.length > 0 && (
                <span style={{ color: "#3D96E1" }}>
                  {" "}
                  +{remainingFacilities.length}
                </span>
              )}
            </span>
          </Tooltip>
        );
      },
    },
    {
      label: t("electronicLogBook.description"),
      field: "description",
      sortable: true,
    },
    {
      label: t("electronicLogBook.lastUpdated"),
      field: "updatedAt",
      sortable: true,
      render: (row) => formatDate(row?.updatedAt),
    },
    {
      label: t("electronicLogBook.createdBy"),
      field: "createdBy",
      sortable: true,
      render: (row) => row.createdBy?.username || "-",
    },
    {
      label: t("electronicLogBook.tags"),
      field: "tags",
      sortable: true,
      renderType: "tags",
    },
  ];

  const actions: ActionConfig<ElectronicLogRow>[] = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("common.edit"),
      onClick: (row) => {
        setEditingLogEntry(row);
      },
      show: (row) => row.isNew === true && selectedRole !== UserRole.Observer,
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("common.delete"),
      onClick: (row) => {
        setLogToDelete(row);
      },
      show: (row) => row.isNew === true && selectedRole !== UserRole.Observer,
    },
    {
      icon: <img src={imageUrls.download} width={24} height={24} />,
      tooltip: t("electronicLogBook.download"),
      onClick: (row) => {
        const url = row.fileUrls?.[0];
        if (url) {
          handleDownload(
            url,
            url.split("/").pop() || t("electronicLogBook.download"),
          );
        }
      },
      show: (row) => Array.isArray(row.fileUrls) && row.fileUrls.length > 0,
    },
  ];

  const renderAllEntries = () => {
    return (
      <>
        <DynamicTable<LogEntryDto>
          headers={headers}
          rows={logEntries}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          actions={actions}
          styles={tableStyles}
          noDataMessage={t("electronicLogBook.noDataFound")}
          onExport={handleExportCallback}
          loading={tableLoading}
        />
      </>
    );
  };

  return (
    <>
      {(filterTab === ALL || filterTab === MY || filterTab === IMPORTANT) &&
        renderAllEntries()}

      {editingLogEntry && (
        <DynamicModal
          open={!!editingLogEntry}
          onClose={() => setEditingLogEntry(null)}
          onAction={() => {
            refreshLogEntries();
            setEditingLogEntry(null);
          }}
          title={t("electronicLogBook.editLogEntry")}
          width={800}
        >
          <EditLogEntryModal
            logEntry={editingLogEntry}
            selectedAor={selectedAOR as string}
            onSuccess={() => {
              refreshLogEntries();
              setEditingLogEntry(null);
            }}
            onCancel={() => setEditingLogEntry(null)}
          />
        </DynamicModal>
      )}

      {logToDelete && (
        <DynamicModal
          open={!!logToDelete}
          onClose={() => setLogToDelete(null)}
          onAction={() => {
            if (logToDelete) {
              dispatch(deleteLogEntryById(logToDelete._id))
                .unwrap()
                .then((res) => {
                  dispatch(
                    showAlert({
                      type: AlertType.Success,
                      message: res.message,
                    }),
                  );
                  refreshLogEntries();
                })
                .catch((err) => {
                  dispatch(showAlert({ type: AlertType.Error, message: err }));
                })
                .finally(() => setLogToDelete(null));
            }
          }}
          title={t("electronicLogBook.confirmDelete")}
          width={400}
          cancelLabel="Cancel"
          actionLabel="Delete"
          showMicIcon={false}
        >
          <Typography sx={{ color: "#fff" }}>
            {t("electronicLogBook.deleteConfirmationMessage")}
          </Typography>
        </DynamicModal>
      )}
    </>
  );
};

export default ElectronicLogContent;
