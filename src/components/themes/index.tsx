"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  fetchThemesThunk,
  deleteThemeThunk,
} from "@/src/store/slices/themeadminSlice";
import DynamicTable from "@/src/components/common/dataTable";
import { Box, Button, TextField, Typography, Tooltip } from "@mui/material";
import { tableStyles } from "@/src/styles/table.styles";
import { ASCENDING, DESCENDING, imageUrls } from "@/src/utils/constant";
import AddThemeModal from "./addThemes";
import EditThemeModal from "./editThemes";
import Pagination from "@/src/components/common/pagination";
import { adminTableStyles } from "@/src/styles/styles";
import DynamicModal from "../common/modal";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { useTranslation } from "@/src/hooks/useTranslation";
import { Theme } from "@/src/types/theme.types";
import { adminStyles } from "@/src/styles/admin.styles";
import { formatDate } from "@/src/utils/config";

const ThemeList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { themes, totalPages, page, pageSize, total, loading } = useAppSelector(
    (state) => state.themes,
  );
  const { t } = useTranslation();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");
  useEffect(() => {
    dispatch(fetchThemesThunk({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch]);

  const headers = [
    {
      field: "name",
      label: t("theme.themeName"),
      sortable: true,
      render: (row: Theme) => (
        <Box display="flex" alignItems="center" gap={1}>
          {row.bgImageUrl && (
            <Box
              component="img"
              src={
                row.bgImageUrl.startsWith("http")
                  ? row.bgImageUrl
                  : `${process.env.NEXT_PUBLIC_API_URL}/${row.bgImageUrl}`
              }
              alt={row.name}
              sx={{
                width: 30,
                height: 30,
                borderRadius: "4px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          )}
          <Tooltip title={row.name || ""}>
            <Typography
              sx={{
                color: "#FFF",
                fontSize: "0.85rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {row.name}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    { field: "type", label: t("theme.type"), sortable: true },
    { field: "createdByName", label: t("theme.createdBy"), sortable: true },
    {
      field: "createdAt",
      label: t("theme.createdAt"),
      sortable: true,
      maxLength: 30,
      render: (row: Theme) => formatDate(row?.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("theme.editTheme"),
      onClick: (row: Theme) => {
        setSelectedTheme(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("theme.deleteTheme"),
      onClick: (row: Theme) => {
        setSelectedTheme(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(fetchThemesThunk({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDeleteTheme = async () => {
    if (!selectedTheme?._id) return;

    try {
      await dispatch(deleteThemeThunk(selectedTheme._id)).unwrap();
      setDeleteModalOpen(false);

      const isLastItemOnPage = themes.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;

      await dispatch(
        fetchThemesThunk({
          page: newPage,
          limit: pageSize,
          sortBy,
          sortOrder,
        }),
      );

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: `"${selectedTheme.name}" ${t("theme.successDelete")}`,
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("theme.failedDelete");
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
      fetchThemesThunk({
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
          {t("theme.title")} ({total})
        </Typography>
        <Box sx={adminStyles.leftRow}>
          <TextField
            placeholder={t("theme.search")}
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
          <Tooltip title={themes.length >= 10 ? t("theme.max10Themes") : ""}>
            <span>
              <Button
                variant="outlined"
                sx={adminTableStyles.addButton}
                onClick={() => setOpenAddModal(true)}
                disabled={themes.length >= 10}
              >
                {t("theme.addTheme")}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<Theme>
          headers={headers}
          rows={themes}
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
              fetchThemesThunk({
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

      <AddThemeModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={() => {
          setOpenAddModal(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(
            fetchThemesThunk({ page: 1, limit: pageSize, sortBy, sortOrder }),
          );
        }}
      />

      {selectedTheme && (
        <EditThemeModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          theme={selectedTheme}
          onSuccess={() => {
            setOpenEditModal(false);
            dispatch(
              fetchThemesThunk({ page, limit: pageSize, sortBy, sortOrder }),
            );
          }}
        />
      )}

      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("theme.confirmDelete")}
        onAction={handleDeleteTheme}
        actionLabel={t("theme.delete")}
        cancelLabel={t("theme.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={adminStyles.Text}>
          {t("theme.deleteMessage", { name: selectedTheme?.name })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default ThemeList;
