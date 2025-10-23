"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getSleepHours,
  removeSleepHours,
} from "@/src/store/slices/sleepHoursSlice";
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
import AddSleepHoursModal from "./addSleepHours";
import EditSleepHoursModal from "./editSleepHours";
import DynamicModal from "@/src/components/common/modal";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import SearchIcon from "@mui/icons-material/Search";
import { SleepHours } from "@/src/types/sleepHours.types";
import { formatDate } from "@/src/utils/config";

const SleepHoursList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { sleepHours, totalPages, page, pageSize, total, loading } =
    useAppSelector((state) => state.sleepHours);

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSleepHours, setSelectedSleepHours] =
    useState<SleepHours | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    dispatch(getSleepHours({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch]);

  const headers = [
    { field: "hours", label: t("sleepHours.hours"), sortable: true },
    { field: "credit", label: t("sleepHours.credit"), sortable: true },
    {
      field: "createdAt",
      label: t("sleepHours.createdAt"),
      sortable: true,
      render: (row: SleepHours) => formatDate(row.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("sleepHours.edit"),
      onClick: (row: SleepHours) => {
        setSelectedSleepHours(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("sleepHours.delete"),
      onClick: (row: SleepHours) => {
        setSelectedSleepHours(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(getSleepHours({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDelete = async () => {
    if (!selectedSleepHours?._id) return;

    try {
      await dispatch(removeSleepHours(selectedSleepHours._id)).unwrap();
      setDeleteModalOpen(false);

      const isLastItemOnPage = sleepHours.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      dispatch(
        getSleepHours({ page: newPage, limit: pageSize, sortBy, sortOrder }),
      );

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("sleepHours.deleteSuccess", {
            hours: selectedSleepHours.hours,
          }),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("sleepHours.deleteFailed");
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
      getSleepHours({
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
          {t("sleepHours.list")} ({total})
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
            {t("sleepHours.add")}
          </Button>
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<SleepHours>
          headers={headers}
          rows={sleepHours}
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
              getSleepHours({
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

      <AddSleepHoursModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(
            getSleepHours({ page: 1, limit: pageSize, sortBy, sortOrder }),
          );
        }}
      />

      <EditSleepHoursModal
        open={openEditModal}
        sleepHours={selectedSleepHours}
        onClose={() => setOpenEditModal(false)}
        onSuccess={() => {
          setOpenEditModal(false);
          dispatch(getSleepHours({ page, limit: pageSize, sortBy, sortOrder }));
        }}
      />

      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("sleepHours.confirmDelete")}
        onAction={handleDelete}
        actionLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={{ color: "#FFF" }}>
          {t("sleepHours.deleteMessage", { hours: selectedSleepHours?.hours })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default SleepHoursList;