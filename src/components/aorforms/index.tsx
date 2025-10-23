"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getAorForms,
  removeAorForm,
  getFormTemplateById,
  clearSelectedFormTemplate,
  getAorsWithTemplate,
} from "@/src/store/slices/aorFormSlice";
import DynamicTable from "@/src/components/common/dataTable";
import Pagination from "@/src/components/common/pagination";
import { Box, Button, TextField, Typography } from "@mui/material";
import { tableStyles } from "@/src/styles/table.styles";
import { adminTableStyles } from "@/src/styles/styles";
import { useTranslation } from "@/src/hooks/useTranslation";
import FormBuilderPage from "./liveFormPage";
import { ASCENDING, DESCENDING, imageUrls } from "@/src/utils/constant";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DynamicModal from "@/src/components/common/modal";
import DynamicForm from "@/src/components/common/formModal";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import LivePreview from "@/src/components/aorforms/livePreview";
import { SectionConfig } from "@/src/types/aorFormUi.types";
import { AorForm } from "@/src/types/aorForm.types";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { formatDate } from "@/src/utils/config";

const AorFormList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const {
    forms,
    totalPages,
    page,
    pageSize,
    total,
    loading,
    selectedFormTemplate,
    loadingTemplate,
    aorsWithTemplate,
  } = useAppSelector((state) => state.aorForms);
  const [openFormBuilder, setOpenFormBuilder] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [aorName, setAorName] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<AorForm | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [activeTemplateSection, setActiveTemplateSection] = useState(0);
  const [openAorModal, setOpenAorModal] = useState(false);
  const [aorId, setAorId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    if (openAorModal) {
      dispatch(getAorsWithTemplate());
    }
  }, [openAorModal, dispatch]);

  const aorOptions = aorsWithTemplate.map((aor) => ({
    value: aor._id,
    label: aor.name,
  }));

  useEffect(() => {
    dispatch(clearSelectedFormTemplate());
    dispatch(
      getAorForms({
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
        search: searchKey,
      }),
    );
  }, [dispatch, page, sortBy, sortOrder, searchKey]);

  useEffect(() => {
    if (!openFormBuilder && !selectedFormTemplate) {
      dispatch(getAorForms({ page, limit: pageSize }));
    }
  }, [dispatch, page, openFormBuilder, selectedFormTemplate]);

  const headers = [
    {
      field: "title",
      label: t("aorForms.title"),
      maxLength: 50,
      sortable: true,
    },
    {
      field: "version",
      label: t("aorForms.version"),
      maxLength: 10,
      sortable: true,
    },
    {
      field: "aorName",
      label: t("aorForms.aor"),
      maxLength: 50,
      sortable: true,
    },
    {
      field: "description",
      label: t("aorForms.description"),
      maxLength: 100,
      sortable: true,
    },
    {
      field: "updatedAt",
      label: t("aorForms.lastModified"),
      maxLength: 30,
      sortable: true,
      render: (row: AorForm) => formatDate(row?.updatedAt),
    },
  ];

  const actions = [
    {
      icon: <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />,
      tooltip: t("aorForms.view"),
      onClick: (row: AorForm) => dispatch(getFormTemplateById(row._id)),
    },
    {
      icon: <img src={imageUrls.edit} width={20} height={20} />,
      tooltip: t("aorForms.edit"),
      onClick: (row: AorForm) => {
        setEditingFormId(row._id);
        setAorName(row.aorName);
        setOpenFormBuilder(true);
      },
    },
    {
      icon: <img src={imageUrls.delete} width={20} height={20} />,
      tooltip: t("aorForms.delete"),
      onClick: (row: AorForm) => {
        setSelectedForm(row);
        setOpenDeleteModal(true);
      },
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKey(value);
    dispatch(
      getAorForms({
        page: 1,
        limit: pageSize,
        sortBy,
        sortOrder,
        search: value,
      }),
    );
  };

  const handlePageChange = (newPage: number, limit: number) => {
    dispatch(
      getAorForms({
        page: newPage,
        limit,
        sortBy,
        sortOrder,
        search: searchKey,
      }),
    );
  };

  const handleDelete = async () => {
    if (!selectedForm?._id) return;

    try {
      await dispatch(removeAorForm(selectedForm._id)).unwrap();
      setOpenDeleteModal(false);
      const newPage = forms.length === 1 && page > 1 ? page - 1 : page;

      dispatch(
        getAorForms({
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
          message: t("aorForms.deleteSuccess", { name: selectedForm.title }),
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("aorForms.deleteFailed");
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: errorMessage,
        }),
      );
    }
  };

  const handleBackToTable = () => {
    setOpenFormBuilder(false);
    setEditingFormId(null);
    setAorName(null);
    setAorId(null);
    dispatch(clearSelectedFormTemplate());
    dispatch(
      getAorForms({
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
        search: searchKey,
      }),
    );
  };

  const handleAorSelection = async (values: Record<string, unknown>) => {
    const selectedAorId = values.aorId as string;
    const selectedAor = aorOptions.find(
      (option) => option.value === selectedAorId,
    );

    if (selectedAor) {
      setAorName(selectedAor.label);
      setAorId(selectedAorId);
      setOpenAorModal(false);
      setOpenFormBuilder(true);
    }
  };

  const aorFields: FieldConfig[] = [
    {
      name: "aorId",
      label: t("aorForms.selectAOR"),
      type: "select",
      required: true,
      options: aorOptions,
      placeholder: t("aorForms.selectAORPlaceholder"),
    },
  ];

  const initialAorValues = {
    aorId: "",
  };

  const transformFormTemplateToSections = (
    formTemplate: any,
  ): SectionConfig[] => {
    if (!formTemplate) return [];
    return Object.keys(formTemplate)
      .map((key, index) => {
        const section = formTemplate[key];
        if (!section?.group) return null;
        return {
          id: key,
          title: section.title || `Section ${index + 1}`,
          description: section.description || "",
          icon: section.icon,
          order: section.order || index,
          group: section.group || [],
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a!.order || 0) - (b!.order || 0)) as SectionConfig[];
  };

  if (openFormBuilder) {
    return (
      <Box sx={adminTableStyles.container}>
        <FormBuilderPage
          formId={editingFormId}
          aorName={aorName}
          aorId={aorId}
          onClose={handleBackToTable}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ ...adminTableStyles.container, pb: 4 }}>
      {!selectedFormTemplate ? (
        <>
          <Box sx={adminTableStyles.header}>
            <Typography variant="h6" sx={adminTableStyles.headerTitle}>
              {t("aorForms.list")} ({total})
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                placeholder={t("aorForms.search")}
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
                onClick={() => {
                  setEditingFormId(null);
                  setAorName(null);
                  setOpenAorModal(true);
                }}
              >
                {t("aorForms.createForm")}
              </Button>
            </Box>
          </Box>

          <Box sx={adminTableStyles.tableWrapper}>
            

            <DynamicTable<AorForm>
              headers={headers}
              rows={forms}
              sortOrder={sortOrder}
              onSort={(field) => {
                let newOrder: "asc" | "desc" = ASCENDING;
                if (sortBy === field) {
                  newOrder = sortOrder === ASCENDING ? DESCENDING : ASCENDING;
                  setSortOrder(newOrder);
                } else {
                  setSortBy(field);
                  setSortOrder(ASCENDING);
                }

                dispatch(
                  getAorForms({
                    page: 1,
                    limit: pageSize,
                    sortBy: field,
                    sortOrder: newOrder,
                    search: searchKey,
                  }),
                );
              }}
              styles={tableStyles}
              loading={loading}
              actions={actions}
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
        </>
      ) : (
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ color: "#FFF" }}>
              {selectedFormTemplate.title}
            </Typography>
            <Button variant="outlined" onClick={handleBackToTable}>
              {t("common.back")}
            </Button>
          </Box>
          {loadingTemplate ? (
            <Typography sx={{ color: "#FFF" }}>
              {t("common.loading")}
            </Typography>
          ) : (
            <LivePreview
              sections={transformFormTemplateToSections(
                selectedFormTemplate.formTemplate,
              )}
              values={{}}
              activeSection={activeTemplateSection}
              onActiveSectionChange={setActiveTemplateSection}
            />
          )}
        </Box>
      )}

      <DynamicModal
        open={openAorModal}
        onClose={() => setOpenAorModal(false)}
        title={t("aorForms.createAORtemplate")}
        onAction={() => document.getElementById("dynamic-form-submit")?.click()}
        width={500}
        showMicIcon={false}
      >
        <DynamicForm
          fields={aorFields}
          onSubmit={handleAorSelection}
          onCancel={() => setOpenAorModal(false)}
          initialValues={initialAorValues}
        />
      </DynamicModal>

      <DynamicModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title={t("aorForms.confirmDelete")}
        onAction={handleDelete}
        actionLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        width={400}
      >
        <Typography sx={{ color: "#FFF" }}>
          {t("aorForms.deleteMessage", { name: selectedForm?.title })}
        </Typography>
      </DynamicModal>
    </Box>
  );
};

export default AorFormList;
