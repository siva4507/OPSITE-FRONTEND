"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getFatigueScores,
  removeFatigueScore,
} from "@/src/store/slices/fatigueScoreSlice";
import DynamicTable from "@/src/components/common/dataTable";
import { Box, Button, TextField, Typography } from "@mui/material";
import { tableStyles } from "@/src/styles/table.styles";
import Pagination from "@/src/components/common/pagination";
import { ASCENDING, DESCENDING, imageUrls } from "@/src/utils/constant";
import DynamicModal from "@/src/components/common/modal";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import AddFatigueScoreModal from "./addFatigueScore";
import EditFatigueScoreModal from "./editFatigueScore";
import { FatigueScore } from "@/src/types/fatigueScore.types";
import { formatDate } from "@/src/utils/config";
import { adminTableStyles } from "@/src/styles/styles";

const FatigueScoreList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { scores, totalPages, page, pageSize, total, loading } = useAppSelector(
    (state) => state.fatigueScore,
  );

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState<FatigueScore | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    dispatch(
      getFatigueScores({
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
        search: "",
      }),
    );
  }, [dispatch]);

  const headers = [
    { field: "minScore", label: t("fatigueScore.minScore"), sortable: true },
    { field: "maxScore", label: t("fatigueScore.maxScore"), sortable: true },
    { field: "riskLevel", label: t("fatigueScore.riskLevel"), sortable: true },
    { field: "action", label: t("fatigueScore.action"), sortable: false },
    {
      field: "color",
      label: t("fatigueScore.color"),
      sortable: false,
      render: (row: FatigueScore) => (
        <span style={{ color: row.color }}>{row.color}</span>
      ),
    },
    {
      field: "createdAt",
      label: t("fatigueScore.createdAt"),
      sortable: true,
      render: (row: FatigueScore) => formatDate(row.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("common.edit"),
      onClick: (row: FatigueScore) => {
        setSelectedScore(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("common.delete"),
      onClick: (row: FatigueScore) => {
        setSelectedScore(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(
      getFatigueScores({
        page: newPage,
        limit,
        sortBy,
        sortOrder,
        search: searchKey,
      }),
    );
  };

  const handleDelete = async () => {
    if (!selectedScore?._id) return;

    try {
      await dispatch(removeFatigueScore(selectedScore._id)).unwrap();
      setDeleteModalOpen(false);

      const isLastItemOnPage = scores.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      dispatch(
        getFatigueScores({
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
          message: t("fatigueScore.deleteSuccess", {
            name: selectedScore.riskLevel,
          }),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("fatigueScore.deleteFailed");
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
      getFatigueScores({
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
          {t("fatigueScore.list")} ({total})
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder={t("common.search")}
            value={searchKey}
            onChange={handleSearchChange}
            size="small"
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#000" }} />
                </InputAdornment>
              ),
            }}
            sx={adminTableStyles.searchInput}
          />
          <Button
            variant="outlined"
            onClick={() => setOpenAddModal(true)}
            sx={adminTableStyles.addButton}
          >
            {t("fatigueScore.add")}
          </Button>
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<FatigueScore>
          headers={headers}
          rows={scores}
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
              getFatigueScores({
                page: 1,
                limit: pageSize,
                sortBy: field,
                sortOrder,
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
      <AddFatigueScoreModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={() => {
          setOpenAddModal(false);
          dispatch(
            getFatigueScores({ page: 1, limit: pageSize, sortBy, sortOrder }),
          );
        }}
      />

      <EditFatigueScoreModal
        open={openEditModal}
        fatigueScore={selectedScore}
        onClose={() => setOpenEditModal(false)}
        onSuccess={() => {
          setOpenEditModal(false);
          dispatch(
            getFatigueScores({ page, limit: pageSize, sortBy, sortOrder }),
          );
        }}
      />

      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("fatigueScore.confirmDelete")}
        onAction={handleDelete}
        actionLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={{ color: "#FFF" }}>
          {t("fatigueScore.deleteMessage", { name: selectedScore?.riskLevel })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default FatigueScoreList;
