"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getMitigations,
  removeMitigation,
} from "@/src/store/slices/mitigationSlice";
import DynamicTable from "@/src/components/common/dataTable";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { tableStyles } from "@/src/styles/table.styles";
import { ASCENDING, DESCENDING, imageUrls } from "@/src/utils/constant";
import Pagination from "@/src/components/common/pagination";
import { adminTableStyles } from "@/src/styles/styles";
import AddMitigationModal from "./addMitigation";
import EditMitigationModal from "./editMitigation";
import DynamicModal from "@/src/components/common/modal";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import SearchIcon from "@mui/icons-material/Search";
import { Mitigation } from "@/src/types/mitigation.types";
import { formatDate } from "@/src/utils/config";
import { FatigueMitigationType } from "@/src/types/fatigue.types";

const MitigationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { mitigations, totalPages, page, pageSize, total, loading } =
    useAppSelector((state) => state.mitigation);

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMitigation, setSelectedMitigation] =
    useState<Mitigation | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    dispatch(getMitigations({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch]);

  const headers = [
    {
      field: "name",
      label: t("mitigation.name"),
      sortable: true,
      maxLength: 30,
      render: (row: Mitigation) =>
        row.type === FatigueMitigationType.TIMER
          ? `${row.name} mins`
          : row.name,
    },
    { field: "credit", label: t("mitigation.credit"), sortable: true },
    { field: "type", label: t("mitigation.type"), sortable: true },
    {
      field: "createdByName",
      label: t("mitigation.createdBy"),
      sortable: true,
      maxLength: 30,
      render: (row: Mitigation) => row.createdByName || "-",
    },
    {
      field: "createdAt",
      label: t("mitigation.createdAt"),
      sortable: true,
      render: (row: Mitigation) => formatDate(row?.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("mitigation.edit"),
      onClick: (row: Mitigation) => {
        setSelectedMitigation(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("mitigation.delete"),
      onClick: (row: Mitigation) => {
        setSelectedMitigation(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(getMitigations({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDelete = async () => {
    if (!selectedMitigation?._id) return;

    try {
      await dispatch(removeMitigation(selectedMitigation._id)).unwrap();
      setDeleteModalOpen(false);

      const isLastItemOnPage = mitigations.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      dispatch(
        getMitigations({ page: newPage, limit: pageSize, sortBy, sortOrder }),
      );

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("mitigation.deleteSuccess", {
            name: selectedMitigation.name,
          }),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("mitigation.deleteFailed");
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
      getMitigations({
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
          {t("mitigation.list")} ({total})
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          <Button
            variant="outlined"
            sx={adminTableStyles.addButton}
            onClick={() => setOpenModal(true)}
          >
            {t("mitigation.add")}
          </Button>
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<Mitigation>
          headers={headers}
          rows={mitigations}
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
              getMitigations({
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

      <AddMitigationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(
            getMitigations({ page: 1, limit: pageSize, sortBy, sortOrder }),
          );
        }}
      />

      <EditMitigationModal
        open={openEditModal}
        mitigation={selectedMitigation}
        onClose={() => setOpenEditModal(false)}
        onSuccess={() => {
          setOpenEditModal(false);
          dispatch(
            getMitigations({ page, limit: pageSize, sortBy, sortOrder }),
          );
        }}
      />

      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("mitigation.confirmDelete")}
        onAction={handleDelete}
        actionLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={{ color: "#FFF" }}>
          {t("mitigation.deleteMessage", { name: selectedMitigation?.name })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default MitigationList;
