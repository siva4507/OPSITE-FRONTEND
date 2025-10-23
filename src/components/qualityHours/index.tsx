"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { getQOS, removeQOS } from "@/src/store/slices/qosSlice";
import DynamicTable from "@/src/components/common/dataTable";
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material";
import { tableStyles } from "@/src/styles/table.styles";
import { ASCENDING, DESCENDING, imageUrls } from "@/src/utils/constant";
import Pagination from "@/src/components/common/pagination";
import { adminTableStyles } from "@/src/styles/styles";
import AddQOSModal from "./addQualityHours";
import EditQOSModal from "./editQualityHours";
import DynamicModal from "@/src/components/common/modal";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { QOS } from "@/src/types/qos.types";
import { adminStyles } from "@/src/styles/admin.styles";
import { formatDate } from "@/src/utils/config";

const QOSList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { qosList, totalPages, page, pageSize, total, loading } =
    useAppSelector((state) => state.qos);

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQOS, setSelectedQOS] = useState<QOS | null>(null);

  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    dispatch(getQOS({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch]);

  const headers = [
    { field: "rating", label: t("qos.rating"), sortable: true, maxLength: 30 },
    {
      field: "quality",
      label: t("qos.quality"),
      sortable: true,
      maxLength: 40,
    },
    {
      field: "credit",
      label: t("qos.credit"),
      sortable: true,
    },
    {
      field: "createdByName",
      label: t("qos.createdBy"),
      sortable: true,
      maxLength: 30,
    },
    {
      field: "createdAt",
      label: t("qos.createdAt"),
      sortable: true,
      render: (row: QOS) => formatDate(row?.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("qos.edit"),
      onClick: (row: QOS) => {
        setSelectedQOS(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("qos.delete"),
      onClick: (row: QOS) => {
        setSelectedQOS(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(getQOS({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDelete = async () => {
    if (!selectedQOS?._id) return;

    try {
      await dispatch(removeQOS(selectedQOS._id)).unwrap();
      setDeleteModalOpen(false);

      const isLastItemOnPage = qosList.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      dispatch(getQOS({ page: newPage, limit: pageSize, sortBy, sortOrder }));

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("qos.deleteSuccess", { quality: selectedQOS.quality }),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("qos.deleteFailed");
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
      getQOS({
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
          {t("qos.list")} ({total})
        </Typography>
        <Box sx={adminStyles.leftRow}>
          <TextField
            placeholder={t("qos.search")}
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
          <Tooltip title={total >= 5 ? t("qos.max10qos") : ""}>
            <Button
              variant="outlined"
              sx={adminTableStyles.addButton}
              onClick={() => setOpenModal(true)}
              disabled={total >= 5}
            >
              {t("qos.add")}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<QOS>
          headers={headers}
          rows={qosList}
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
              getQOS({
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

      {/* Add Modal */}
      <AddQOSModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(getQOS({ page: 1, limit: pageSize, sortBy, sortOrder }));
        }}
      />

      {/* Edit Modal */}
      <EditQOSModal
        open={openEditModal}
        qos={selectedQOS}
        onClose={() => setOpenEditModal(false)}
        onSuccess={() => {
          setOpenEditModal(false);
          dispatch(
            getQOS({
              page,
              limit: pageSize,
              sortBy,
              sortOrder,
            }),
          );
        }}
      />

      {/* Delete Confirmation */}
      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("qos.confirmDelete")}
        onAction={handleDelete}
        actionLabel={t("common.delete")}
        cancelLabel={t("qos.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={adminStyles.Text}>
          {t("qos.deleteMessage")}, {selectedQOS?.quality}?
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default QOSList;
