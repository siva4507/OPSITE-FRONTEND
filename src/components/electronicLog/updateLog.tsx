import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  updateLogEntryThunk,
  getCategories,
  updateLogEntryInList,
} from "@/src/store/slices/electronicLogSlice";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import DynamicForm from "@/src/components/common/formModal";
import { ElectronicLogRow } from "@/src/types/electronicLog.types";
import { DEFAULT_ALLOWED_TYPES, MAX_LENGTH } from "@/src/utils/constant";
import { fetchFacilitiesByAorId } from "@/src/store/slices/facilitySlice";

interface EditLogEntryModalProps {
  logEntry: ElectronicLogRow;
  selectedAor: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditLogEntryModal: React.FC<EditLogEntryModalProps> = ({
  logEntry,
  selectedAor,
  onCancel,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.electronicLog.categories);
  const [facilityOptions, setFacilityOptions] = useState<
    { _id: string; name: string }[]
  >([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchFacilities = async () => {
      if (!logEntry.aorId) return;
      try {
        const facilities = await dispatch(
          fetchFacilitiesByAorId({ aorId: selectedAor }),
        ).unwrap();
        setFacilityOptions(facilities);
      } catch (error) {
        const errorMessage =
          typeof error === "string"
            ? error
            : t("electronicLogBook.fetchFacilitiesFailed");
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: errorMessage,
          }),
        );
      }
    };

    fetchFacilities();
  }, [dispatch, logEntry.aorId, selectedAor, t]);

  const handleAutocompleteSearch = useCallback(
    (fieldName: string, searchValue: string) => {
      if (fieldName === "facilities") {
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
        const newTimeout = setTimeout(async () => {
          if (searchValue.trim().length >= 2) {
            try {
              const facilities = await dispatch(
                fetchFacilitiesByAorId({
                  aorId: selectedAor,
                  search: searchValue,
                }),
              ).unwrap();
              setFacilityOptions(facilities);
            } catch (error) {
              const errorMessage =
                typeof error === "string"
                  ? error
                  : t("electronicLogBook.fetchFacilitiesFailed");
              dispatch(
                showAlert({
                  type: AlertType.Error,
                  message: errorMessage,
                }),
              );
            }
          }
        }, 300);

        setSearchTimeout(newTimeout);
      }
    },
    [dispatch, selectedAor, searchTimeout],
  );

  useEffect(
    () => () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    },
    [searchTimeout],
  );

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  const fields: FieldConfig[] = [
    {
      name: "categoryId",
      label: t("electronicLogBook.category"),
      type: "select",
      required: true,
      options: categoryOptions,
      placeholder: t("electronicLogBook.selectOption"),
    },
    {
      name: "tags",
      label: t("electronicLogBook.tags"),
      type: "tags",
      placeholder: t("electronicLogBook.tagValid"),
    },
    {
      name: "description",
      label: t("electronicLogBook.description"),
      type: "textarea",
      required: true,
      placeholder: t("electronicLogBook.enterDesc"),
    },
    {
      name: "facilities",
      label: t("electronicLogBook.facility"),
      type: "autocomplete",
      maxlength: MAX_LENGTH,
      placeholder: t("electronicLogBook.enterFacility"),
      options: facilityOptions.map((f) => ({
        value: f._id,
        label: f.name,
      })),
    },
    {
      name: "file1",
      type: "file",
      label: t("electronicLogBook.attachment"),
      accept: DEFAULT_ALLOWED_TYPES,
      maxFileSizeMB: 10,
      previewUrl: logEntry.fileUrls?.[0] || "",
    },
  ];

  const initialValues = {
    categoryId: logEntry.categoryId?._id || "",
    tags: logEntry.tags?.join(", ") || "",
    facilities: logEntry.facilityIds?.[0]
      ? {
          value: logEntry.facilityIds[0]._id,
          label: logEntry.facilityIds[0].name,
        }
      : null,
    description: logEntry.description || "",
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      let selectedFile = values.file1 as File | null;
      let clearedFile = false;

      if (values.file1 === null) {
        clearedFile = true;
      }

      let facilityValue = "";
      if (typeof values.facilities === "string") {
        facilityValue = values.facilities;
      } else if (
        values.facilities &&
        typeof values.facilities === "object" &&
        "value" in values.facilities
      ) {
        facilityValue = (values.facilities as { value: string }).value;
      }

      if (!selectedFile && !clearedFile && logEntry.fileUrls?.[0]) {
        try {
          const response = await fetch(logEntry.fileUrls[0]);
          const blob = await response.blob();
          const filename =
            logEntry.fileUrls[0].split("/").pop() || "attachment";
          selectedFile = new File([blob], filename, { type: blob.type });
        } catch {
          dispatch(
            showAlert({
              type: AlertType.Error,
              message: t("electronicLogBook.fileFetchFailed"),
            }),
          );
        }
      }

      const payload = {
        categoryId: values.categoryId as string,
        tags: typeof values.tags === "string" ? values.tags : "",
        facilities: facilityValue,
        description: values.description as string,
        filename: clearedFile ? null : selectedFile?.name || null,
      };

      const files = selectedFile && !clearedFile ? [selectedFile] : [];

      await dispatch(
        updateLogEntryThunk({
          logId: logEntry._id,
          payload,
          files,
        }),
      ).unwrap();

      dispatch(
        updateLogEntryInList({
          logId: logEntry._id,
          updatedData: {
            categoryId: categories.find(
              (cat) => cat._id === payload.categoryId,
            ),
            description: payload.description,
            tags: payload.tags
              ? payload.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0)
              : [],
            facilityIds: facilityValue
              ? facilityOptions.filter((f) => f._id === facilityValue).length >
                0
                ? facilityOptions.filter((f) => f._id === facilityValue)
                : [
                    {
                      _id: facilityValue,
                      name:
                        (values.facilities as { label?: string })?.label ||
                        (values.facilities as string),
                    },
                  ]
              : [],

            updatedAt: new Date().toISOString(),
            fileUrls: clearedFile
              ? []
              : selectedFile
                ? [URL.createObjectURL(selectedFile)]
                : logEntry.fileUrls,
            isImportant: logEntry.isImportant,
            isNew: logEntry.isNew,
            aorId: logEntry.aorId,
            _id: logEntry._id,
          },
        }),
      );

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("electronicLogBook.updateSuccess"),
        }),
      );

      onCancel?.();
    } catch (error) {
      dispatch(
        showAlert({
          message:
            typeof error === "string"
              ? error
              : t("electronicLogBook.updateFailed"),
          type: AlertType.Error,
        }),
      );
    }
  };

  return (
    <DynamicForm
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={t("electronicLogBook.update")}
      cancelLabel={t("electronicLogBook.cancel")}
      initialValues={initialValues}
      onAutocompleteInputChange={handleAutocompleteSearch}
    />
  );
};

export default EditLogEntryModal;
