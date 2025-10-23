"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  LinearProgress,
  Link,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  fetchUsersThunk,
  deleteUserThunk,
  importUsersThunk,
} from "@/src/store/slices/userSlice";
import DynamicTable from "@/src/components/common/dataTable";
import Pagination from "@/src/components/common/pagination";
import { tableStyles } from "@/src/styles/table.styles";
import { adminTableStyles } from "@/src/styles/styles";
import {
  ABORT_ERROR,
  ASCENDING,
  DESCENDING,
  imageUrls,
  REQUEST_TIMEOUT,
  STORAGE_URL,
} from "@/src/utils/constant";
import DynamicModal from "@/src/components/common/modal";
import { useTranslation } from "@/src/hooks/useTranslation";
import AddUserModal from "./addUser";
import EditUserModal from "./editUser";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import UserDetailsModal from "./userDetail";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { BulkImportResponse, User } from "@/src/types/user.types";
import FileInput from "../common/dynamicForm/fileInput";
import { Role } from "@/src/types/role.types";
import { Aor } from "@/src/types/aor.types";
import ImportResultRenderer from "@/src/components/common/importResult";
import { adminStyles } from "@/src/styles/admin.styles";
import { formatDate } from "@/src/utils/config";
import { SelectChangeEvent } from "@mui/material";

const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, total, page, pageSize, totalPages, loading } = useAppSelector(
    (state) => state.users,
  );
  const { t } = useTranslation();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const [importResult, setImportResult] = useState<BulkImportResponse | null>(
    null,
  );
  const [showImportResult, setShowImportResult] = useState(false);
  const [limit, setLimit] = useState<number>(pageSize || 10);
  const MAX_FILE_SIZE_MB = 10;

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return t("user.fileSizeExceeded", { maxFileSize: MAX_FILE_SIZE_MB });
    }

    const validExtensions = [".csv", ".xlsx", ".xls"];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some((ext) =>
      fileName.endsWith(ext),
    );

    if (!hasValidExtension) {
      return t("invalidFileType");
    }

    return null;
  };




  const processFileOptimized = async (file: File): Promise<FormData> =>
    new Promise((resolve) => {
      const formData = new FormData();
      let fileName = file.name;
      if (fileName.length > 100) {
        const extension = fileName.substring(fileName.lastIndexOf("."));
        const baseName = fileName
          .substring(0, fileName.lastIndexOf("."))
          .substring(0, 95);
        fileName = `${baseName}${extension}`;
      }

      const optimizedFile = new File([file], fileName, {
        type: file.type,
        lastModified: file.lastModified,
      });

      formData.append("file", optimizedFile);
      formData.append("fileSize", file.size.toString());
      formData.append("fileName", fileName);
      formData.append("uploadTime", new Date().toISOString());

      resolve(formData);
    });

  const simulateProgress = () => {
    setImportProgress(10);

    const progressInterval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    return progressInterval;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: validationError,
        }),
      );
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    abortControllerRef.current = new AbortController();

    const progressInterval = simulateProgress();

    try {
      const formData = await processFileOptimized(file);
      setImportProgress(20);

      const result: BulkImportResponse = (await Promise.race([
        dispatch(importUsersThunk(formData)).unwrap(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 300000),
        ),
      ])) as BulkImportResponse;

      clearInterval(progressInterval);
      setImportProgress(100);
      setImportResult(result);
      setShowImportResult(true);

      dispatch(
        fetchUsersThunk({
          page: 1,
          limit: pageSize,
          sortBy,
          sortOrder,
        }),
      );
    } catch (error: unknown) {
      clearInterval(progressInterval);

      if (error instanceof Error) {
        if (error.message === ABORT_ERROR) {
          dispatch(
            showAlert({
              type: AlertType.Warning,
              message: t("importCancelled"),
            }),
          );
        } else if (error.message === REQUEST_TIMEOUT) {
          dispatch(
            showAlert({
              type: AlertType.Error,
              message: t("importTimeout"),
            }),
          );
        } else {
          dispatch(
            showAlert({
              type: AlertType.Error,
              message: error.message || t("user.importFailed"),
            }),
          );
        }
      } else {
        // fallback if error is not an instance of Error
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: t("user.importFailed"),
          }),
        );
      }
    } finally {
      setIsImporting(false);
      setImportProgress(0);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImportModalClose = () => {
    setOpenImportModal(false);
    setShowImportResult(false);
    setImportResult(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancelImport = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsImporting(false);
    setImportProgress(0);
    setOpenImportModal(false);
  };

  useEffect(() => {
    dispatch(fetchUsersThunk({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch]);

  const handlePageLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = Number(event.target.value);
    setLimit(newLimit);

    dispatch(
      fetchUsersThunk({
        page: 1,
        limit: newLimit,
        sortBy,
        sortOrder,
        search: searchKey,
      }),
    );
  };

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  const headers = [
    {
      field: "username",
      label: t("user.userProfile"),
      sortable: true,
      render: (row: User) => (
        <Box display="flex" alignItems="center" sx={{ pr: 20 }}>
          <Avatar
            src={row.profileFileUrl || undefined}
            alt={row.username}
            sx={{ width: 40, height: 40, marginRight: 1, bgcolor: "#3D96E1" }}
          >
            {!row.profileFileUrl && row.username
              ? row.username.charAt(0).toUpperCase()
              : ""}
          </Avatar>
          <Box>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={adminStyles.userName}
            >
              {row.username.charAt(0).toUpperCase() +
                row.username.slice(1).toLowerCase()}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "roleName",
      label: t("user.role"),
      sortable: true,
      render: (row: User) => {
        if (!row.roles || row.roles.length === 0) return "-";

        const firstTwo = row.roles
          .slice(0, 1)
          .map((role: Role) => role.name)
          .join(", ");
        const remaining = row.roles.slice(1).map((role: Role) => role.name);

        return (
          <Typography component="span" sx={adminStyles.Text}>
            {firstTwo}
            {remaining.length > 0 && (
              <span style={adminStyles.userRole}>+{remaining.length}</span>
            )}
          </Typography>
        );
      },
    },
    {
      field: "aorName",
      label: t("user.aors"),
      sortable: true,
      render: (row: User) => {
        if (!row.assignedAors || row.assignedAors.length === 0) return "-";

        const firstTwo = row.assignedAors
          .slice(0, 1)
          .map((aor: Aor) => aor.name)
          .join(", ");
        const remaining = row.assignedAors.slice(1).map((aor: Aor) => aor.name);

        return (
          <Typography component="span" sx={adminStyles.Text}>
            {firstTwo}
            {remaining.length > 0 && (
              <span style={adminStyles.userAor}>+{remaining.length}</span>
            )}
          </Typography>
        );
      },
    },
    {
      field: "createdAt",
      label: t("user.registerDate"),
      sortable: true,
      render: (row: User) => formatDate(row?.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("user.editUser"),
      onClick: (row: User) => {
        setSelectedUser(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("user.deleteUser"),
      onClick: (row: User) => {
        setSelectedUser(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(fetchUsersThunk({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const deletedUser = await dispatch(
        deleteUserThunk(selectedUser._id),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("user.deleteSuccess", { name: deletedUser.username }),
        }),
      );

      setDeleteModalOpen(false);
      const isLastItemOnPage = users.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      dispatch(
        fetchUsersThunk({
          page: newPage,
          limit: pageSize,
          sortBy,
          sortOrder,
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("user.deleteFailed");
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: errorMessage,
        }),
      );
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKey(value);
    dispatch(
      fetchUsersThunk({
        page: 1,
        limit: pageSize,
        sortBy,
        sortOrder,
        search: value,
      }),
    );
  };

  return (
    <Box sx={adminTableStyles.container}>
      <Box sx={adminTableStyles.header}>
        <Typography variant="h6" sx={adminTableStyles.headerTitle}>
          {t("user.title")} ({total})
        </Typography>
        <Box sx={adminStyles.leftRow}>
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
            placeholder={t("user.search")}
            value={searchKey}
            onChange={handleSearchChange}
            size="small"
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={adminStyles.Text} />
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
            {t("user.importUsers")}
          </Button>
          <Button
            variant="outlined"
            sx={adminTableStyles.addButton}
            onClick={() => setOpenAddModal(true)}
          >
            {t("user.addUser")}
          </Button>
        </Box>
      </Box>
      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<User>
          headers={headers}
          rows={users}
          actions={actions}
          sortOrder={sortOrder}
          onSort={(field) => {
            if (sortBy === field) {
              setSortOrder(sortOrder === ASCENDING ? DESCENDING : ASCENDING);
            } else {
              setSortBy(field);
              setSortOrder(ASCENDING);
            }
            dispatch(
              fetchUsersThunk({
                page: 1,
                limit: 10,
                sortBy: field,
                sortOrder:
                  sortBy === field
                    ? sortOrder === ASCENDING
                      ? DESCENDING
                      : ASCENDING
                    : ASCENDING,
              }),
            );
          }}
          onRowClick={(row: User) => {
            setSelectedUser(row);
            setOpenUserDetails(true);
          }}
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

      <AddUserModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={() => {
          setOpenAddModal(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(
            fetchUsersThunk({ page: 1, limit: pageSize, sortBy, sortOrder }),
          );
        }}
      />

      {selectedUser && (
        <EditUserModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          user={selectedUser}
          onSuccess={() => {
            setOpenEditModal(false);
            dispatch(
              fetchUsersThunk({ page, limit: pageSize, sortBy, sortOrder }),
            );
          }}
        />
      )}

      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("user.confirmDelete")}
        onAction={handleDeleteUser}
        actionLabel={t("user.delete")}
        cancelLabel={t("user.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={adminStyles.Text}>
          {t("user.message", { username: selectedUser?.username })}
        </Typography>
      </DynamicModal>

      {selectedUser && (
        <UserDetailsModal
          open={openUserDetails}
          onClose={() => setOpenUserDetails(false)}
          user={selectedUser}
        />
      )}

      <DynamicModal
        open={openImportModal}
        onClose={handleImportModalClose}
        title={
          showImportResult ? t("user.importResults") : t("user.importUsers")
        }
        width={500}
        cancelLabel={showImportResult ? "" : t("user.cancel")}
        actionLabel={
          showImportResult
            ? ""
            : isImporting
              ? t("user.importing")
              : t("user.import")
        }
        actionDisabled={showImportResult ? true : !selectedFile || isImporting}
        showMicIcon={false}
        onAction={() => {
          if (isImporting) {
            handleCancelImport();
          } else if (fileInputRef.current?.files?.[0]) {
            handleFileChange({
              target: fileInputRef.current!,
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
      >
        {showImportResult ? (
          <ImportResultRenderer
            result={importResult}
            onClose={handleImportModalClose}
          />
        ) : isImporting ? (
          <Box sx={adminStyles.importContainer}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography sx={adminStyles.importText}>
              {t("user.pleaseWait")}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={importProgress}
              sx={adminStyles.progress}
            />
            <Typography variant="body2" sx={adminStyles.progressText}>
              {Math.round(importProgress)}% {t("user.complete")}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography sx={adminStyles.importText}>
              {t("user.selectFile")} {MAX_FILE_SIZE_MB}MB.{" "}
              <Link
                href={`${STORAGE_URL}public/media/Opsiteusersforimport.xlsx`}
                download
                underline="hover"
                sx={adminStyles.importLink}
              >
                {t("user.sampleDocument")}
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
    </Box>
  );
};

export default UserList;
