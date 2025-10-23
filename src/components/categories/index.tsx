"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getCategories,
  removeCategory,
} from "@/src/store/slices/categorySlice";
import DynamicTable from "@/src/components/common/dataTable";
import { Box, Button, TextField, Typography } from "@mui/material";
import { tableStyles } from "@/src/styles/table.styles";
import { ASCENDING, DESCENDING, imageUrls } from "@/src/utils/constant";
import Pagination from "@/src/components/common/pagination";
import { adminTableStyles } from "@/src/styles/styles";
import AddCategoryModal from "./addCategory";
import EditCategoryModal from "./editCategory";
import DynamicModal from "@/src/components/common/modal";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { Category } from "@/src/types/category.types";
import { formatDate } from "@/src/utils/config";

const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { categories, totalPages, page, pageSize, total, loading } =
    useAppSelector((state) => state.category);

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");
  useEffect(() => {
    dispatch(getCategories({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch]);

  const headers = [
    { field: "name", label: t("category.name"), sortable: true, maxLength: 30 },
    {
      field: "createdByName",
      label: t("category.createdBy"),
      sortable: true,
      maxLength: 30,
      render: (row: Category) => row.createdByName || "-",
    },
    {
      field: "createdAt",
      label: t("category.createdAt"),
      sortable: true,
      render: (row: Category) => formatDate(row?.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("category.edit"),
      onClick: (row: Category) => {
        setSelectedCategory(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("category.delete"),
      onClick: (row: Category) => {
        setSelectedCategory(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(getCategories({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDelete = async () => {
    if (!selectedCategory?._id) return;

    try {
      await dispatch(removeCategory(selectedCategory._id)).unwrap();
      setDeleteModalOpen(false);

      const isLastItemOnPage = categories.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      dispatch(
        getCategories({ page: newPage, limit: pageSize, sortBy, sortOrder }),
      );
      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("category.deleteSuccess", { name: selectedCategory.name }),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("category.deleteFailed");
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
      getCategories({
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
          {t("category.list")} ({total})
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            placeholder="Search..."
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
            {t("category.add")}
          </Button>
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<Category>
          headers={headers}
          rows={categories}
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
              getCategories({
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

      <AddCategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(
            getCategories({ page: 1, limit: pageSize, sortBy, sortOrder }),
          );
        }}
      />

      <EditCategoryModal
        open={openEditModal}
        category={selectedCategory}
        onClose={() => setOpenEditModal(false)}
        onSuccess={() => {
          setOpenEditModal(false);
          dispatch(
            getCategories({
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
        title={t("category.confirmDelete")}
        onAction={handleDelete}
        actionLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={{ color: "#FFF" }}>
          {t("category.deleteMessage", { name: selectedCategory?.name })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default CategoryList;
