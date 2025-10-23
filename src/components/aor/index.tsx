"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { getAors, deleteAorThunk } from "@/src/store/slices/aorSlice";
import DynamicTable from "@/src/components/common/dataTable";
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material";
import { tableStyles } from "@/src/styles/table.styles";
import { ASCENDING, DESCENDING, imageUrls } from "@/src/utils/constant";
import Pagination from "@/src/components/common/pagination";
import { adminTableStyles } from "@/src/styles/styles";
import DynamicModal from "../common/modal";
import { useTranslation } from "@/src/hooks/useTranslation";
import AddAorModal from "./addAor";
import { getCompanies } from "@/src/store/slices/companySlice";
import EditAorModal from "./editAor";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { Aor } from "@/src/types/aor.types";

const AorList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: aors,
    totalPages,
    page,
    pageSize,
    total,
    loading,
  } = useAppSelector((state) => state.aor);
  const { t } = useTranslation();
  const { companies } = useAppSelector((state) => state.company);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedAor, setSelectedAor] = useState<Aor | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    dispatch(getAors({ page, limit: pageSize, sortBy, sortOrder }));
    dispatch(getCompanies({ page: 1, limit: 100 }));
  }, [dispatch]);

  const headers = [
    {
      field: "name",
      label: t("aor.name"),
      sortable: true,
      render: (row: Aor) => (
        <Box display="flex" alignItems="center" gap={1}>
          {row.color && (
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "3px",
                backgroundColor: row.color,
                flexShrink: 0,
              }}
            />
          )}
          <Tooltip title={row.name || ""}>
            <Typography
              sx={{
                color: "#FFF",
                fontSize: "0.8rem",
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
    {
      field: "company",
      label: t("aor.company"),
      sortable: true,
      render: (row: Aor) => row.company?.name,
    },
    {
      field: "weatherLocation",
      label: t("aor.location"),
      sortable: true,
      render: (row: Aor) => {
        if (!row.Location) return "-";
        const cityName = row.Location.city?.name || "";
        const stateName = row.Location.state?.name || "";
        if (!cityName && !stateName) return "-";
        return (
          <Box display="flex" flexDirection="column">
            <Typography variant="body2">
              {cityName} {stateName}
            </Typography>
          </Box>
        );
      },
    },
    { field: "dailyHosLimit", label: t("aor.dailyHosLimit"), sortable: true },
    { field: "weeklyHosLimit", label: t("aor.weeklyHosLimit"), sortable: true },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("aor.editAor"),
      onClick: (row: Aor) => {
        setSelectedAor(row);
        setEditModalOpen(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("aor.deleteAor"),
      onClick: (row: Aor) => {
        setSelectedAor(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(getAors({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDeleteAor = async () => {
    if (!selectedAor?._id) return;

    try {
      await dispatch(deleteAorThunk(selectedAor._id)).unwrap();
      const isLastItemOnPage = aors.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      dispatch(getAors({ page: newPage, limit: pageSize, sortBy, sortOrder }));
      setDeleteModalOpen(false);

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("aor.deleteSuccess", { name: selectedAor.name }),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("aor.deleteFailed");
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
      getAors({
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
      {/* Header */}
      <Box sx={adminTableStyles.header}>
        <Typography variant="h6" sx={adminTableStyles.headerTitle}>
          {t("aor.title")} ({total})
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            placeholder={t("aor.search")}
            value={searchKey}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#fff" }} />
                </InputAdornment>
              ),
            }}
            sx={adminTableStyles.searchInput}
          />
          <Button
            variant="outlined"
            sx={adminTableStyles.addButton}
            onClick={() => setAddModalOpen(true)}
          >
            {t("aor.addNew")}
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<Aor>
          headers={headers}
          rows={aors}
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
              getAors({
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

      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("aor.confirmDelete")}
        onAction={handleDeleteAor}
        actionLabel={t("aor.delete")}
        cancelLabel={t("aor.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={{ color: "#FFF" }}>
          {t("aor.deleteConfirmation", { name: selectedAor?.name })}
        </Typography>
      </DynamicModal>

      <AddAorModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          setAddModalOpen(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(getAors({ page, limit: pageSize, sortBy, sortOrder }));
        }}
        companies={companies.map((c) => ({ id: c._id, name: c.name }))}
      />

      <EditAorModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          dispatch(getAors({ page, limit: pageSize, sortBy, sortOrder }));
        }}
        companies={companies.map((c) => ({ id: c._id, name: c.name }))}
        aor={selectedAor}
      />
    </Box>
  );
};

export default AorList;
