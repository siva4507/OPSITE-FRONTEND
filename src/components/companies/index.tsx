"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  deleteCompanyThunk,
  getCompanies,
} from "@/src/store/slices/companySlice";
import DynamicTable from "@/src/components/common/dataTable";
import { Box, Button, TextField, Typography } from "@mui/material";
import { tableStyles } from "@/src/styles/table.styles";
import { ASCENDING, DESCENDING, imageUrls } from "@/src/utils/constant";
import AddCompanyModal from "./addCompany";
import Pagination from "@/src/components/common/pagination";
import { adminTableStyles } from "@/src/styles/styles";
import EditCompanyModal from "./editCompany";
import DynamicModal from "../common/modal";
import { useTranslation } from "@/src/hooks/useTranslation";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import type { Company } from "@/src/types/company.types";
import { formatDate } from "@/src/utils/config";

const CompanyList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { companies, totalPages, page, pageSize, total, loading } =
    useAppSelector((state) => state.company);
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    dispatch(getCompanies({ page, limit: pageSize, sortBy, sortOrder }));
  }, [dispatch, page, pageSize]);

  const headers = [
    { field: "name", label: t("company.name"), sortable: true, maxLength: 30 },
    {
      field: "createdByName",
      label: t("company.createdBy"),
      sortable: true,
      maxLength: 30,
    },
    {
      field: "createdAt",
      label: t("company.registerDate"),
      sortable: true,
      render: (row: Company) => formatDate(row?.createdAt),
    },

  ];

  const actions = [
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("company.editCompany"),
      onClick: (row: Company) => {
        setSelectedCompany(row);
        setOpenEditModal(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("company.deleteCompany"),
      onClick: (row: Company) => {
        setSelectedCompany(row);
        setDeleteModalOpen(true);
      },
    },
  ];

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(getCompanies({ page: newPage, limit, sortBy, sortOrder }));
  };

  const handleDeleteCompany = async () => {
    if (!selectedCompany?._id) return;

    try {
      await dispatch(deleteCompanyThunk(selectedCompany._id)).unwrap();
      setDeleteModalOpen(false);
      const isLastItemOnPage = companies.length === 1;
      const newPage = isLastItemOnPage && page > 1 ? page - 1 : page;

      await dispatch(
        getCompanies({
          page: newPage,
          limit: pageSize,
          sortBy,
          sortOrder,
        }),
      );

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("company.deleteSuccess", { name: selectedCompany.name }),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("company.deleteFailed");
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
      getCompanies({
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
          {t("company.title")} ({total})
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            placeholder={t("company.search")}
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
            {t("company.addCompany")}
          </Button>
        </Box>
      </Box>

      <Box sx={adminTableStyles.tableWrapper}>
        <DynamicTable<Company>
          headers={headers}
          rows={companies}
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
              getCompanies({
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

      <AddCompanyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          setSortBy("createdAt");
          setSortOrder("desc");
          dispatch(
            getCompanies({
              page: 1,
              limit: pageSize,
              sortBy,
              sortOrder,
            }),
          );
        }}
      />

      {selectedCompany && (
        <EditCompanyModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          company={selectedCompany}
          onSuccess={() => {
            setOpenEditModal(false);
            dispatch(
              getCompanies({
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
        title={t("company.confirmDelete")}
        onAction={handleDeleteCompany}
        actionLabel={t("company.delete")}
        cancelLabel={t("company.cancel")}
        width={400}
        showMicIcon={false}
      >
        <Typography sx={{ color: "#FFF" }}>
          {t("company.message", { name: selectedCompany?.name })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default CompanyList;
