"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { getHitchDays, removeHitchDay } from "@/src/store/slices/hitchDaySlice";
import DynamicTable from "@/src/components/common/dataTable";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import Pagination from "@/src/components/common/pagination";
import { adminTableStyles } from "@/src/styles/styles";
import { ASCENDING, DESCENDING, imageUrls } from "@/src/utils/constant";
import AddHitchDayModal from "./addHitchDay";
import EditHitchDayModal from "./editHitchDay";
import DynamicModal from "@/src/components/common/modal";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import SearchIcon from "@mui/icons-material/Search";
import { formatDate } from "@/src/utils/config";
import { tableStyles } from "@/src/styles/table.styles";

const HitchDayList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { hitchDays, totalPages, page, pageSize, total, loading } =
    useAppSelector((state) => state.hitchDay);

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedHitchDay, setSelectedHitchDay] = useState<any>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    dispatch(getHitchDays({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch, page, pageSize, sortBy, sortOrder]);

  const headers = [
    { field: "day", label: t("hitchDay.day"), sortable: true },
    { field: "credit", label: t("hitchDay.credit"), sortable: true },
    {
      field: "createdAt",
      label: t("hitchDay.createdAt"),
      sortable: true,
      render: (row: any) => formatDate(row.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("hitchDay.edit"),
      onClick: (row: any) => {
        setSelectedHitchDay(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("hitchDay.delete"),
      onClick: (row: any) => {
        setSelectedHitchDay(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(getHitchDays({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDelete = async () => {
    if (!selectedHitchDay?._id) return;

    try {
      await dispatch(removeHitchDay(selectedHitchDay._id)).unwrap();
      setDeleteModalOpen(false);

      const isLastItemOnPage = hitchDays.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      dispatch(
        getHitchDays({ page: newPage, limit: pageSize, sortBy, sortOrder }),
      );

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("hitchDay.deleteSuccess"),
        }),
      );
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string" ? error : t("hitchDay.deleteFailed"),
        }),
      );
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKey(value);
    dispatch(
      getHitchDays({
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
          {t("hitchDay.list")} ({total})
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
            {t("hitchDay.add")}
          </Button>
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable
          headers={headers}
          rows={hitchDays}
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
              getHitchDays({
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

      <AddHitchDayModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          dispatch(
            getHitchDays({
              page: 1,
              limit: pageSize,
              sortBy: "createdAt",
              sortOrder: "desc",
            }),
          );
        }}
      />

      <EditHitchDayModal
        open={openEditModal}
        hitchDay={selectedHitchDay}
        onClose={() => setOpenEditModal(false)}
        onSuccess={() => {
          setOpenEditModal(false);
          dispatch(getHitchDays({ page, limit: pageSize, sortBy, sortOrder }));
        }}
      />

      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("hitchDay.confirmDelete")}
        onAction={handleDelete}
        actionLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={{ color: "#FFF" }}>
          {t("hitchDay.deleteMessage", { day: selectedHitchDay?.day })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default HitchDayList;
