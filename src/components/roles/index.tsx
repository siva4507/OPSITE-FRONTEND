"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { fetchRolesThunk, deleteRoleThunk } from "@/src/store/slices/roleSlice";
import DynamicTable from "@/src/components/common/dataTable";
import { Box, TextField, Typography } from "@mui/material";
import { tableStyles } from "@/src/styles/table.styles";
import { ASCENDING, DESCENDING, imageUrls } from "@/src/utils/constant";
import Pagination from "@/src/components/common/pagination";
import { adminTableStyles } from "@/src/styles/styles";
import DynamicModal from "../common/modal";
import AddRoleModal from "./addRole";
import EditRoleModal from "./editRole";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { Role } from "@/src/types/role.types";
import { adminStyles } from "@/src/styles/admin.styles";
import { formatDate } from "@/src/utils/config";

const RoleList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { roles, totalPages, page, pageSize, total, loading } = useAppSelector(
    (state) => state.roles,
  );

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");
  useEffect(() => {
    dispatch(fetchRolesThunk({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch]);

  const headers = [
    { field: "name", label: t("role.name"), sortable: true, maxLength: 30 },
    {
      field: "createdAt",
      label: t("role.createdDate"),
      sortable: true,
      render: (row: Role) => formatDate(row?.createdAt),
    },
  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("role.edit"),
      onClick: (row: Role) => {
        setSelectedRole(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("role.delete"),
      onClick: (row: Role) => {
        setSelectedRole(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(fetchRolesThunk({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDeleteRole = async () => {
    if (!selectedRole?._id) return;
    try {
      await dispatch(deleteRoleThunk(selectedRole._id)).unwrap();
      setDeleteModalOpen(false);

      const isLastItemOnPage = roles.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;

      dispatch(
        fetchRolesThunk({
          page: newPage,
          limit: pageSize,
          sortBy,
          sortOrder,
        }),
      );
      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("role.deleteSuccess", { name: selectedRole.name }),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("role.deleteFailed");
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
      fetchRolesThunk({
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
          {t("role.list")} ({total})
        </Typography>
        <Box sx={adminStyles.leftRow}>
          <TextField
            placeholder={t("company.search")}
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
 
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<Role>
          headers={headers}
          rows={roles}
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
              fetchRolesThunk({
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

      <AddRoleModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={() => {
          setOpenAddModal(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(
            fetchRolesThunk({ page: 1, limit: pageSize, sortOrder, sortBy }),
          );
        }}
      />

      {selectedRole && (
        <EditRoleModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          role={selectedRole}
          onSuccess={() => {
            setOpenEditModal(false);
            dispatch(
              fetchRolesThunk({
                page,
                limit: pageSize,
                sortBy,
                sortOrder,
              }),
            );
          }}
        />
      )}

      <DynamicModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("role.confirmDelete")}
        onAction={handleDeleteRole}
        actionLabel={t("role.delete")}
        cancelLabel={t("role.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={adminStyles.Text}>
          {t("role.deleteMessage", { name: selectedRole?.name })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default RoleList;
