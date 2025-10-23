"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getShiftHours,
  removeShiftHours,
} from "@/src/store/slices/shiftHoursSlice";
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
import AddShiftHoursModal from "./addShiftHours";
import EditShiftHoursModal from "./editShiftHours";
import DynamicModal from "@/src/components/common/modal";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import SearchIcon from "@mui/icons-material/Search";
import { ShiftHours } from "@/src/types/shiftHours.types";
import { formatDate } from "@/src/utils/config";

const ShiftHoursList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { shiftHours, totalPages, page, pageSize, total, loading } =
    useAppSelector((state) => state.shiftHours);

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedShiftHours, setSelectedShiftHours] =
    useState<ShiftHours | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    dispatch(getShiftHours({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch]);

  const headers = [
    { field: "hours", label: t("shiftHours.hours"), sortable: true },
    { field: "credit", label: t("shiftHours.credit"), sortable: true },
    {
      field: "createdAt",
      label: t("shiftHours.createdAt"),
      sortable: true,
      render: (row: ShiftHours) => formatDate(row.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("shiftHours.edit"),
      onClick: (row: ShiftHours) => {
        setSelectedShiftHours(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("shiftHours.delete"),
      onClick: (row: ShiftHours) => {
        setSelectedShiftHours(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(getShiftHours({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDelete = async () => {
    if (!selectedShiftHours?._id) return;

    try {
      await dispatch(removeShiftHours(selectedShiftHours._id)).unwrap();
      setDeleteModalOpen(false);

      const isLastItemOnPage = shiftHours.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      dispatch(
        getShiftHours({ page: newPage, limit: pageSize, sortBy, sortOrder }),
      );

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("shiftHours.deleteSuccess", {
            hours: selectedShiftHours.hours,
          }),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("shiftHours.deleteFailed");
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
      getShiftHours({
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
          {t("shiftHours.list")} ({total})
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
            {t("shiftHours.add")}
          </Button>
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<ShiftHours>
          headers={headers}
          rows={shiftHours}
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
              getShiftHours({
                page: 1,
                limit: pageSize,
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

      <AddShiftHoursModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(
            getShiftHours({ page: 1, limit: pageSize, sortBy, sortOrder }),
          );
        }}
      />

      <EditShiftHoursModal
        open={openEditModal}
        shiftHours={selectedShiftHours}
        onClose={() => setOpenEditModal(false)}
        onSuccess={() => {
          setOpenEditModal(false);
          dispatch(getShiftHours({ page, limit: pageSize, sortBy, sortOrder }));
        }}
      />

      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("shiftHours.confirmDelete")}
        onAction={handleDelete}
        actionLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={{ color: "#FFF" }}>
          {t("shiftHours.deleteMessage", { hours: selectedShiftHours?.hours })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default ShiftHoursList;
