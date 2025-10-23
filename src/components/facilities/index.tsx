"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getFacilities,
  importFacilityThunk,
  deleteFacilityThunk,
} from "@/src/store/slices/facilitySlice";
import DynamicTable from "@/src/components/common/dataTable";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  LinearProgress,
  Link,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { tableStyles } from "@/src/styles/table.styles";
import Pagination from "@/src/components/common/pagination";
import { adminTableStyles } from "@/src/styles/styles";
import { useTranslation } from "@/src/hooks/useTranslation";
import SearchIcon from "@mui/icons-material/Search";
import AddFacilityModal from "./addFacility";
import { AlertType } from "@/src/types/types";
import { showAlert } from "@/src/store/slices/alertSlice";
import DynamicModal from "../common/modal";
import FileInput from "../common/dynamicForm/fileInput";
import EditFacilityModal from "./editFacility";
import {
  ASCENDING,
  DESCENDING,
  imageUrls,
  STORAGE_URL,
} from "@/src/utils/constant";
import { Facility } from "@/src/types/facility.types";
import { FacilityImportResponse } from "@/src/types/facility.types";
import ImportResultRenderer from "@/src/components/common/importResult";
import { formatDate } from "@/src/utils/config";

const FacilityList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { facilities, totalPages, page, pageSize, total, loading } =
    useAppSelector((state) => state.facility);

  const [openModal, setOpenModal] = useState(false);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");
  const [openImportModal, setOpenImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] =
    useState<FacilityImportResponse | null>(null);
  const [showImportResult, setShowImportResult] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<{
    _id: string;
    name: string;
    aorId: string;
    companyId?: string;
  } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [limit, setLimit] = useState<number>(pageSize || 10);

  useEffect(() => {
    dispatch(getFacilities({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch]);

  const headers = [
    {
      field: "name",
      label: t("facility.facilityName"),
      sortable: true,
      maxLength: 30,
    },
    {
      field: "aorName",
      label: t("facility.aor"),
      sortable: true,
      maxLength: 30,
    },
    {
      field: "companyName",
      label: t("facility.company"),
      sortable: true,
      maxLength: 30,
    },
    {
      field: "createdByName",
      label: t("facility.createdBy"),
      sortable: true,
      maxLength: 30,
    },
    {
      field: "createdAt",
      label: t("facility.createdAt"),
      sortable: true,
      render: (row: Facility) => formatDate(row?.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("facility.editFacility"),
      onClick: (row: Facility) => {
        setSelectedFacility({
          _id: row._id,
          name: row.name,
          aorId: row.aorId ?? "",
          companyId: row.companyId ?? "",
        });
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("facility.delete"),
      onClick: (row: Facility) => {
        setSelectedFacility({
          _id: row._id,
          name: row.name,
          aorId: row.aorId ?? "",
          companyId: row.companyId ?? "",
        });
        setDeleteModalOpen(true);
      },
    },
  ];

  const handleDeleteFacility = async () => {
    if (!selectedFacility?._id) return;

    try {
      await dispatch(deleteFacilityThunk(selectedFacility._id)).unwrap();
      setDeleteModalOpen(false);

      const isLastItemOnPage = facilities.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;

      dispatch(
        getFacilities({
          page: newPage,
          limit: pageSize,
          sortBy,
          sortOrder,
          search: searchKey,
        }),
      );

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("facility.deleteSuccess"),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("facility.deleteFacility");
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: errorMessage,
        }),
      );
    }
  };

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(
      getFacilities({
        page: newPage,
        limit,
        sortBy,
        sortOrder,
        search: searchKey,
      }),
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKey(value);
    dispatch(
      getFacilities({
        page: 1,
        limit: pageSize,
        sortBy,
        sortOrder,
        search: value,
      }),
    );
  };

  const handleSort = (field: string) => {
    const newOrder =
      sortBy === field
        ? sortOrder === ASCENDING
          ? DESCENDING
          : ASCENDING
        : ASCENDING;
    setSortBy(field);
    setSortOrder(newOrder);

    dispatch(
      getFacilities({
        page: 1,
        limit: pageSize,
        sortBy: field,
        sortOrder: newOrder,
        search: searchKey,
      }),
    );
  };

  const handlePageLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = Number(event.target.value);
    setLimit(newLimit);

    dispatch(
      getFacilities({
        page: 1,
        limit: newLimit,
        sortBy,
        sortOrder,
        search: searchKey,
      }),
    );
  };

  const MAX_FILE_SIZE_MB = 10;

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return t("facility.fileSizeExceeded", { maxFileSize: MAX_FILE_SIZE_MB });
    }
    const validExtensions = [".csv", ".xlsx", ".xls"];
    const fileName = file.name.toLowerCase();
    if (!validExtensions.some((ext) => fileName.endsWith(ext))) {
      return t("facility.invalidFile");
    }
    return null;
  };

  const handleImportModalClose = () => {
    setOpenImportModal(false);
    setShowImportResult(false);
    setImportResult(null);
    setSelectedFile(null);
    setImportProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      dispatch(showAlert({ type: AlertType.Error, message: validationError }));
      return;
    }

    setIsImporting(true);
    setImportProgress(20);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await dispatch(importFacilityThunk(formData)).unwrap();

      setImportProgress(100);
      setImportResult(result);
      setShowImportResult(true);

      dispatch(getFacilities({ page: 1, limit: pageSize, sortBy, sortOrder }));
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("facility.importFailed");
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: errorMessage,
        }),
      );
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Box sx={adminTableStyles.container}>
      <Box sx={adminTableStyles.header}>
        <Typography variant="h6" sx={adminTableStyles.headerTitle}>
          {t("facility.list")} ({total})
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl
            variant="outlined"
            size="small"
            sx={adminTableStyles.whiteOutlineStyle}
          >
            <Select
              value={limit}
              onChange={handlePageLimitChange}
              displayEmpty
              inputProps={{ "aria-label": "page limit" }}
              sx={{
                color: "#fff",
                "& .MuiSelect-select": {
                  padding: "8px 24px 8px 12px",
                  color: "#fff",
                  "&:focus": { backgroundColor: "transparent" },
                },
                "& .MuiSelect-icon": { color: "#fff" },
              }}
            >
              {[10, 20, 30, 40, 50, 100].map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
              <MenuItem value={500}>All</MenuItem>
            </Select>
          </FormControl>
          <TextField
            placeholder={t("common.search")}
            value={searchKey}
            onChange={handleSearchChange}
            size="small"
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#fff" }} />
                </InputAdornment>
              ),
            }}
            sx={adminTableStyles.searchInput}
          />

          <input
            type="file"
            accept=".csv, .xlsx"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <Button
            variant="outlined"
            sx={adminTableStyles.addButton}
            onClick={() => setOpenImportModal(true)}
          >
            {t("facility.importFacilities")}
          </Button>
          <Button
            variant="outlined"
            sx={adminTableStyles.addButton}
            onClick={() => setOpenModal(true)}
          >
            {t("facility.addFacility")}
          </Button>
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<Facility>
          headers={headers}
          rows={facilities}
          actions={actions}
          sortOrder={sortOrder}
          onSort={handleSort}
          styles={tableStyles}
          loading={loading}
        />
      </Box>

      <Box sx={adminTableStyles.footer}>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          currentLimit={pageSize}
          totalCount={total}
          onPageChange={handlePageChange}
          showPagination={totalPages > 1}
        />
      </Box>

      <AddFacilityModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(
            getFacilities({ page: 1, limit: pageSize, sortBy, sortOrder }),
          );
        }}
      />

      <DynamicModal
        open={openImportModal}
        onClose={handleImportModalClose}
        title={
          showImportResult
            ? t("facility.importResults")
            : t("facility.importFacilities")
        }
        width={600}
        cancelLabel={showImportResult ? "" : t("facility.cancel")}
        actionLabel={
          showImportResult
            ? ""
            : isImporting
              ? t("facility.importing")
              : t("facility.import")
        }
        actionDisabled={showImportResult ? true : !selectedFile || isImporting}
        onAction={() => {
          if (isImporting) {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            setIsImporting(false);
            handleImportModalClose();
          } else if (fileInputRef.current?.files?.[0]) {
            handleFileChange({
              target: fileInputRef.current!,
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        showMicIcon={false}
      >
        {showImportResult ? (
          <ImportResultRenderer
            result={importResult}
            onClose={handleImportModalClose}
          />
        ) : isImporting ? (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography sx={{ color: "#FFF", mb: 2 }}>
              {t("facility.importTitle")}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={importProgress}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" sx={{ color: "#fff", mt: 1 }}>
              {Math.round(importProgress)}% Complete
            </Typography>
          </Box>
        ) : (
          <>
            <Typography sx={{ color: "#FFF", mb: 2 }}>
              {t("facility.importInstruction", { size: MAX_FILE_SIZE_MB })}{" "}
              <Link
                href={`${STORAGE_URL}public/media/facilityforimport.xlsx`}
                download
                underline="hover"
                sx={{ color: "#3D96E1", fontWeight: "bold" }}
              >
                {t("facility.sampleDocument")}
              </Link>
            </Typography>
            <FileInput
              onChange={(file) => {
                setSelectedFile(file);
                if (file && fileInputRef.current) {
                  const dt = new DataTransfer();
                  dt.items.add(file);
                  fileInputRef.current.files = dt.files;
                } else if (!file && fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              onValidationError={(msg) =>
                dispatch(showAlert({ type: AlertType.Error, message: msg }))
              }
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              maxFileSizeMB={MAX_FILE_SIZE_MB}
            />
          </>
        )}
      </DynamicModal>

      <EditFacilityModal
        open={openEditModal}
        facility={selectedFacility}
        onClose={() => setOpenEditModal(false)}
        onSuccess={() => {
          setOpenEditModal(false);
          dispatch(
            getFacilities({
              page,
              limit: pageSize,
              sortBy,
              sortOrder,
            }),
          );
        }}
      />

      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("facility.delete")}
        width={400}
        cancelLabel={t("common.cancel")}
        actionLabel={t("common.delete")}
        onAction={handleDeleteFacility}
        showMicIcon={false}
      >
        <Typography sx={{ color: "#FFF" }}>
          {t("facility.deleteConfirmWithName", {
            name: selectedFacility?.name || "",
          })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default FacilityList;
