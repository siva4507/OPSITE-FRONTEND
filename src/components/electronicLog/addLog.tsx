import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Autocomplete,
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import DynamicModal from "@/src/components/common/modal";
import FileInput from "@/src/components/common/dynamicForm/fileInput";
import { showAlert } from "@/src/store/slices/alertSlice";
import {
  electronicLogStyles,
  CustomPopper,
} from "@/src/styles/electronicLog.styles";
import { imageUrls } from "@/src/utils/constant";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  saveLogEntriesThunk,
  getLogEntriesByAor,
  setShowAddRow,
} from "@/src/store/slices/electronicLogSlice";
import { fetchFacilitiesByAorId } from "@/src/store/slices/facilitySlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { DESCRIPTION_LENGTH, FACILITY_TAGS } from "@/src/utils/config";
import { DEFAULT_ALLOWED_TYPES } from "@/src/utils/constant";
import { SelectChangeEvent } from "@mui/material/Select";

interface AddRowComponentProps {
  currentAorId: string;
  selectedAOR: string;
}

interface LocalRowState {
  categoryId: string;
  description: string;
  tags: string[];
  tagInput: string;
  facility: string;
  facilityId: string;
  file: File | null;
  fileName: string;
}

interface FacilityOption {
  _id: string;
  name: string;
}

const AddRowComponent: React.FC<AddRowComponentProps> = ({
  currentAorId,
  selectedAOR,
}) => {
  const styles = electronicLogStyles();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { categories, categoriesLoading, categoriesError } = useAppSelector(
    (state) => state.electronicLog,
  );

  const { facilitiesByAorId, loading: facilitiesLoading } = useAppSelector(
    (state) => state.facility,
  );

  const [rowCount, setRowCount] = useState(1);
  const [rows, setRows] = useState([0]);
  const [isSaving, setIsSaving] = useState(false);
  const [savingRows, setSavingRows] = useState<{ [key: number]: boolean }>({});

  const [localRowsState, setLocalRowsState] = useState<{
    [key: number]: LocalRowState;
  }>({
    0: {
      categoryId: "",
      description: "",
      tags: [],
      tagInput: "",
      facility: "",
      facilityId: "",
      file: null,
      fileName: "",
    },
  });

  const [facilityOptions, setFacilityOptions] = useState<FacilityOption[]>([]);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [tempSelectedFile, setTempSelectedFile] = useState<File | null>(null);
  const debounceTimers = useRef<{ [key: number]: NodeJS.Timeout }>({});



  useEffect(
    () => () =>
      Object.values(debounceTimers.current).forEach((timer) => {
        if (timer) clearTimeout(timer);
      }),
    [],
  );

  useEffect(() => {
    if (facilitiesByAorId && Array.isArray(facilitiesByAorId)) {
      setFacilityOptions(facilitiesByAorId);
    }
  }, [facilitiesByAorId]);



  const getRowState = (rowId: number): LocalRowState =>
    localRowsState[rowId] || {
      categoryId: "",
      description: "",
      tags: [],
      tagInput: "",
      facility: "",
      facilityId: "",
      file: null,
      fileName: "",
    };


  const updateRowState = (rowId: number, updates: Partial<LocalRowState>) => {
    setLocalRowsState((prev) => ({
      ...prev,
      [rowId]: {
        ...getRowState(rowId),
        ...updates,
      },
    }));
  };

  const handleFacilityChange = (
    rowId: number,
    value: FacilityOption | string | null,
  ) => {
    if (value && typeof value === "object" && "_id" in value) {
      updateRowState(rowId, {
        facility: value.name,
        facilityId: value._id,
      });
    } else if (typeof value === "string") {
      updateRowState(rowId, {
        facility: value,
        facilityId: "",
      });
    } else {
      updateRowState(rowId, {
        facility: "",
        facilityId: "",
      });
    }
  };

  const handleFacilityInputChange = (rowId: number, inputValue: string) => {
    if (debounceTimers.current[rowId]) {
      clearTimeout(debounceTimers.current[rowId]);
    }

    updateRowState(rowId, {
      facility: inputValue,
      facilityId: "",
    });

    if (inputValue.length > 0) {
      debounceTimers.current[rowId] = setTimeout(() => {
        if (currentAorId) {
          dispatch(
            fetchFacilitiesByAorId({ aorId: currentAorId, search: inputValue }),
          );
        }
      }, 300);
    } else if (currentAorId) {
      dispatch(fetchFacilitiesByAorId({ aorId: currentAorId }));
    }
  };

  const addTag = (rowId: number, value: string) => {
    const trimmed = value.replace(/\s/g, "").slice(0, 10);
    if (!trimmed || trimmed.length === 0) return;

    const currentState = getRowState(rowId);
    if (currentState.tags.length >= 6) return;
    if (currentState.tags.includes(trimmed)) return;

    updateRowState(rowId, {
      tags: [...currentState.tags, trimmed].slice(0, 6),
      tagInput: "",
    });
  };

  const handleTagInputChange = (
    rowId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = e.target.value.replace(/\s/g, "");
    if (value.includes("#")) {
      const parts = value.split("#");
      parts.forEach((part, idx) => {
        if (part && idx < parts.length - 1) addTag(rowId, part);
      });
      value = parts[parts.length - 1];
    }
    updateRowState(rowId, { tagInput: value.slice(0, 10) });
  };

  const handleTagInputKeyDown = (
    rowId: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const currentState = getRowState(rowId);
    if ((e.key === " " || e.key === "#") && currentState.tagInput) {
      e.preventDefault();
      addTag(rowId, currentState.tagInput);
    }
    if (
      e.key === "Backspace" &&
      !currentState.tagInput?.trim() &&
      currentState.tags.length
    ) {
      updateRowState(rowId, {
        tags: currentState.tags.slice(0, -1),
      });
    }
  };

  const handleCategoryChange = (
    rowId: number,
    e: SelectChangeEvent<string>,
  ) => {
    updateRowState(rowId, { categoryId: e.target.value });
  };

  const handleDescriptionChange = (
    rowId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateRowState(rowId, { description: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSave = () => {
    if (isSaving) return;
    for (const rowId of rows) {
      const rowState = getRowState(rowId);
      if (!rowState.categoryId) {
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: t("electronicLogBook.selectAllrows"),
          }),
        );
        return;
      }
      if (!rowState.description || rowState.description.trim() === "") {
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: t("electronicLogBook.addDescription"),
          }),
        );
        return;
      }
    }

    const payload = rows.map((rowId) => {
      const rowState = getRowState(rowId);
      return {
        categoryId: rowState.categoryId,
        tags: rowState.tags.join(", "),
        description: rowState.description,
        facilities: rowState.facilityId || rowState.facility || "",
        filename: rowState.file?.name || "",
      };
    });

    const files = rows
      .map((rowId) => getRowState(rowId).file)
      .filter((file): file is File => file !== null);
    setIsSaving(true);
    dispatch(saveLogEntriesThunk({ payload, files }))
      .unwrap()
      .then(() => {
        dispatch(
          showAlert({
            type: AlertType.Success,
            message: t("electronicLogBook.logSuccess"),
          }),
        );

        setRowCount(1);
        setRows([0]);
        setLocalRowsState({
          0: {
            categoryId: "",
            description: "",
            tags: [],
            tagInput: "",
            facility: "",
            facilityId: "",
            file: null,
            fileName: "",
          },
        });

        if (selectedAOR) {
          dispatch(
            getLogEntriesByAor({
              shiftAorId: selectedAOR,
              sortBy: "updatedAt",
              sortOrder: "desc",
              page: 1,
              limit: 100,
            }),
          );
          dispatch(setShowAddRow(true));
        }
      })
      .catch((error) => {
        dispatch(showAlert({ type: AlertType.Error, message: error }));
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleAddRow = () => {
    if (rowCount < 10) {
      const newRowId = Math.max(...rows) + 1;
      setRows((prev) => [...prev, newRowId]);
      setRowCount((prev) => prev + 1);
      setLocalRowsState((prev) => ({
        ...prev,
        [newRowId]: {
          categoryId: "",
          description: "",
          tags: [],
          tagInput: "",
          facility: "",
          facilityId: "",
          file: null,
          fileName: "",
        },
      }));
    }
  };

  const handleDeleteRow = (rowId: number) => {
    if (rowCount > 1) {
      setRows((prev) => prev.filter((id) => id !== rowId));
      setRowCount((prev) => prev - 1);
      setLocalRowsState((prev) => {
        const newState = { ...prev };
        delete newState[rowId];
        return newState;
      });
    }
  };

  const handleIndividualRowSave = (rowId: number) => {
    if (isSaving) return;
    if (savingRows[rowId]) return;
    const rowState = getRowState(rowId);
    if (!rowState.categoryId) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("electronicLogBook.selectCategory"),
        }),
      );
      return;
    }

    if (!rowState.description || rowState.description.trim() === "") {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("electronicLogBook.addDescription"),
        }),
      );
      return;
    }
    const payload = [
      {
        categoryId: rowState.categoryId,
        tags: rowState.tags.join(", "),
        description: rowState.description,
        facilities: rowState.facilityId || rowState.facility || "",
        filename: rowState.file?.name || "",
      },
    ];

    const files = rowState.file ? [rowState.file] : [];
    setIsSaving(true);
    setSavingRows((prev) => ({ ...prev, [rowId]: true }));
    dispatch(saveLogEntriesThunk({ payload, files }))
      .unwrap()
      .then(() => {
        dispatch(
          showAlert({
            type: AlertType.Success,
            message: t("electronicLogBook.logSuccess"),
          }),
        );

        setRows((prev) => {
          const updated = prev.filter((id) => id !== rowId);
          return updated.length > 0 ? updated : [0];
        });

        setLocalRowsState((prev) => {
          const newState = { ...prev };
          delete newState[rowId];
          return newState;
        });

        setRowCount((prev) => {
          const newCount = prev > 1 ? prev - 1 : 1;
          return newCount;
        });

        if (selectedAOR) {
          dispatch(
            getLogEntriesByAor({
              shiftAorId: selectedAOR,
              sortBy: "updatedAt",
              sortOrder: "desc",
              page: 1,
              limit: 100,
            }),
          );
        }
      })
      .catch((error) => {
        dispatch(showAlert({ type: AlertType.Error, message: error }));
      })
      .finally(() => {
        setIsSaving(false);
        setSavingRows((prev) => ({ ...prev, [rowId]: false }));
      });
  };

  const handleAttachmentClick = (rowId: number) => {
    setSelectedRowId(rowId);
    const rowState = getRowState(rowId);
    if (rowState.file) {
      setTempSelectedFile(rowState.file);
    } else {
      setTempSelectedFile(null);
    }
    setAttachmentModalOpen(true);
  };

  const handleModalClose = () => {
    setAttachmentModalOpen(false);
    setSelectedRowId(null);
    setTempSelectedFile(null);
  };

  const handleFileUpload = () => {
    if (selectedRowId !== null && tempSelectedFile) {
      updateRowState(selectedRowId, {
        file: tempSelectedFile,
        fileName: tempSelectedFile.name,
      });
      handleModalClose();
    } else {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("electronicLogBook.uploadFile"),
        }),
      );
    }
  };

  return (
    <>
      <Box sx={styles.addRowContainer} onKeyDown={handleKeyDown}>
        <Box sx={styles.addRowScrollableContent}>
          {rows.map((rowId) => {
            const rowState = getRowState(rowId);
            return (
              <Box key={rowId} sx={styles.addRowItem}>
                <Box sx={styles.selectContainer}>
                  <FormControl
                    fullWidth
                    sx={{
                      ...styles.selectInput,
                      "&:before, &:after": { border: "none" },
                      "& .MuiSelect-select": {
                        padding: "6px 8px",
                        color: "#fff",
                      },
                    }}
                    size="small"
                  >
                    <Select
                      value={rowState.categoryId}
                      onChange={(e) => handleCategoryChange(rowId, e)}
                      disabled={categoriesLoading}
                      MenuProps={{
                        PaperProps: { sx: styles.selectMenuPaper },
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                      }}
                      displayEmpty
                    >
                      <MenuItem value="">
                        {t("electronicLogBook.selectCategory")}
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {categoriesLoading && (
                    <Box sx={styles.loadingText}>
                      <CircularProgress
                        size={14}
                        sx={{ mr: 0.5, color: "#fff" }}
                      />
                      {t("electronicLogBook.loading")}
                    </Box>
                  )}

                  {categoriesError && (
                    <Box sx={styles.errorText}>{categoriesError}</Box>
                  )}
                </Box>

                <Box sx={styles.selectContainer}>
                  {rowState.tags.map((tag, idx) => (
                    <span
                      key={tag + idx}
                      style={{
                        display: "inline-block",
                        color: "#fff",
                        fontSize: 13,
                        padding: "2px 6px",
                        backgroundColor: "#333",
                        borderRadius: 4,
                        whiteSpace: "nowrap",
                        marginRight: 6,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                  <input
                    type="text"
                    style={styles.inputfield}
                    placeholder={
                      rowState.tags.length >= 6
                        ? t("electronicLogBook.tagplaceholder1")
                        : t("electronicLogBook.tagplaceholder2")
                    }
                    value={rowState.tagInput}
                    maxLength={10}
                    onChange={(e) => handleTagInputChange(rowId, e)}
                    onKeyDown={(e) => handleTagInputKeyDown(rowId, e)}
                    disabled={rowState.tags.length >= FACILITY_TAGS}
                  />
                </Box>

                <Box
                  sx={{
                    ...styles.selectContainer,
                    padding: 0,
                  }}
                >
                  <Autocomplete<FacilityOption, false, false, true>
                    options={facilityOptions}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name || ""
                    }
                    isOptionEqualToValue={(option, value) => {
                      if (
                        typeof option === "string" ||
                        typeof value === "string"
                      ) {
                        return false;
                      }
                      return option._id === value._id;
                    }}
                    value={
                      rowState.facilityId
                        ? facilityOptions.find(
                            (opt) => opt._id === rowState.facilityId,
                          ) || null
                        : rowState.facility
                          ? { _id: "", name: rowState.facility }
                          : null
                    }
                    inputValue={rowState.facility}
                    onChange={(event, newValue) => {
                      if (
                        newValue &&
                        typeof newValue === "object" &&
                        "_id" in newValue
                      ) {
                        handleFacilityChange(rowId, newValue as FacilityOption);
                      } else if (typeof newValue === "string") {
                        handleFacilityChange(rowId, newValue);
                      } else {
                        handleFacilityChange(rowId, null);
                        handleFacilityInputChange(rowId, "");
                      }
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === "input") {
                        handleFacilityInputChange(rowId, newInputValue);
                      } else if (reason === "clear") {
                        handleFacilityInputChange(rowId, "");
                      }
                    }}
                    freeSolo
                    clearOnEscape
                    loading={facilitiesLoading}
                    PopperComponent={CustomPopper}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("electronicLogBook.facility")}
                        variant="outlined"
                        size="small"
                        inputProps={{
                          ...params.inputProps,
                          maxLength: 50,
                        }}
                        sx={{
                          width: 220,
                          minHeight: 20,
                          "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                            backgroundColor: "transparent",
                            minHeight: 20,
                            "& fieldset": { border: "none" },
                            "& input": {
                              padding: "0px 8px",
                              color: "#fff",
                              "&::placeholder": {
                                color: "rgba(255, 255, 255, 0.6)",
                                opacity: 1,
                              },
                            },
                          },
                          "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
                            color: "#fff",
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li
                        {...props}
                        style={{
                          padding: "10px 12px",
                          color: "#333",
                          fontSize: "14px",
                          listStyle: "none",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f0f8ff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {typeof option === "string" ? option : option.name}
                      </li>
                    )}
                  />
                </Box>

                <Box sx={styles.flexInput}>
                  <input
                    type="text"
                    placeholder={t("electronicLogBook.descriptionPlaceholder")}
                    style={styles.inputfield}
                    value={rowState.description}
                    maxLength={DESCRIPTION_LENGTH}
                    onChange={(e) => handleDescriptionChange(rowId, e)}
                  />
                </Box>

                <IconButton
                  onClick={() => handleAttachmentClick(rowId)}
                  disabled={isSaving || savingRows[rowId]}
                >
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={imageUrls.attachment}
                      alt="attach"
                      width={22}
                      height={22}
                      style={{
                        width: 22,
                        height: 22,
                        fontSize: "0.7rem",
                        objectFit: "contain",
                      }}
                    />
                    {rowState.file && <Box sx={styles.filecount}>1</Box>}
                  </Box>
                </IconButton>

                <IconButton
                  onClick={() => handleIndividualRowSave(rowId)}
                  disabled={isSaving || savingRows[rowId]}
                >
                  {savingRows[rowId] ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    <img
                      src={imageUrls.save}
                      alt="save"
                      width={22}
                      height={22}
                      style={{
                        width: 22,
                        height: 22,
                        fontSize: "0.7rem",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </IconButton>

                {rowCount > 1 && (
                  <IconButton
                    onClick={() => handleDeleteRow(rowId)}
                    disabled={rowCount === 1 || isSaving || savingRows[rowId]}
                  >
                    <img
                      src={imageUrls.delete}
                      alt="delete"
                      width={22}
                      height={22}
                      style={{
                        width: 22,
                        height: 22,
                        fontSize: "0.7rem",
                        objectFit: "contain",
                      }}
                    />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>

        <Box sx={styles.closeButtonContainer}>
          <Typography sx={{ color: "#fff", fontSize: 14 }}>
            {rowCount} row{rowCount !== 1 ? "s" : ""}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              sx={styles.addButton}
              onClick={handleAddRow}
              type="button"
              disabled={rowCount === 10}
            >
              {t("electronicLogBook.addRow")}
            </Button>
            <Button
              variant="contained"
              type="button"
              sx={{
                ...styles.filterButton,
                backgroundColor: "#1976d2",
                color: "white",
              }}
              onClick={handleSave}
              disabled={isSaving}
            >
              {t("electronicLogBook.save")}
            </Button>
          </Box>
        </Box>
      </Box>

      <DynamicModal
        open={attachmentModalOpen}
        onClose={handleModalClose}
        title={t("electronicLogBook.uploadAttachment")}
        actionLabel={t("electronicLogBook.upload")}
        cancelLabel={t("electronicLogBook.cancel")}
        width={400}
        actionDisabled={!tempSelectedFile}
        onAction={handleFileUpload}
        showMicIcon={false}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FileInput
            onChange={(file: File | null) => {
              if (file && selectedRowId !== null) {
                setTempSelectedFile(file);
              } else {
                setTempSelectedFile(null);
              }
            }}
            value={tempSelectedFile}
            onValidationError={(error) => {
              dispatch(showAlert({ type: AlertType.Error, message: error }));
            }}
            accept={DEFAULT_ALLOWED_TYPES}
            maxFileSizeMB={10}
          />
        </Box>
      </DynamicModal>
    </>
  );
};

export default AddRowComponent;