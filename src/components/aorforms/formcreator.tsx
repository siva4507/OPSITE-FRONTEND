"use client";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  SectionConfig,
  GroupConfig,
  FieldConfig,
  Alignment,
  FieldType,
} from "../../types/aorFormUi.types";
import { formBuilderStyles } from "@/src/styles/aorForm.styles";
import {
  createAorTemplateThunk,
  editAorTemplateThunk,
  getAorUserById,
  getFormTemplateById,
} from "@/src/store/slices/aorFormSlice";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import SectionIconSelect from "./iconSelection";
import { generateUniqueName, toCamelCase } from "./utils";
import {
  DEFAULT_SHIFT_DESCRIPTION,
  DEFAULT_SHIFT_TITLE,
} from "@/src/utils/constant";
import { useTranslation } from "@/src/hooks/useTranslation";

interface Props {
  onChange: (sections: SectionConfig[]) => void;
  aors: { _id: string; name: string }[];
  activeSection: number;
  onActiveSectionChange: (index: number) => void;
  formId?: string | null;
  aorName?: string | null;
  aorId?: string | null;
  onFormSaved?: () => void;
}

const defaultField = (): FieldConfig => ({
  id: `field_${Date.now()}`,
  name: "defaultField1",
  label: "",
  type: "text",
  alignment: "full",
  required: false,
  placeholder: "",
  options: [],
  extents: [],
  value: "",
});

const defaultGroup = (): GroupConfig => ({
  id: `grp_${Date.now()}`,
  title: "",
  description: "",
  alignment: "full",
  fields: [],
});

export const FormBuilderCustom = forwardRef<unknown, Props>(
  (
    {
      onChange,
      activeSection,
      onActiveSectionChange,
      formId = null,
      aorId = null,
      onFormSaved,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const [sections, setSections] = useState<SectionConfig[]>([]);
    const dispatch = useAppDispatch();
    const { selectedFormTemplate, selectedUser } = useAppSelector(
      (state) => state.aorForms,
    );
    const [templateTitle, setTemplateTitle] = useState(DEFAULT_SHIFT_TITLE);
    const [templateDescription, setTemplateDescription] = useState(
      DEFAULT_SHIFT_DESCRIPTION,
    );
    const [rawOptionsInput, setRawOptionsInput] = useState<
      Record<string, string>
    >({});

    useImperativeHandle(ref, () => ({
      saveTemplate,
      editTemplate,
      addSection,
      addGroup,
      addField,
    }));

    const updateSections = (updated: SectionConfig[]) => {
      setSections(updated);
      onChange(updated);
    };

    useEffect(() => {
      if (formId) {
        dispatch(getFormTemplateById(formId));
      }
    }, [dispatch, formId]);

    useEffect(() => {
      if (aorId) {
        dispatch(getAorUserById(aorId));
      }
    }, [aorId, dispatch]);

    useEffect(() => {
      if (selectedFormTemplate?.formTemplate) {
        const transformedSections: SectionConfig[] = Object.keys(
          selectedFormTemplate.formTemplate,
        ).map((key) => {
          const section = selectedFormTemplate.formTemplate[key];
          return {
            id: key,
            title: section.title,
            icon: section.icon,
            description: section.description,
            order: section.order,
            group: section.group.map((group: GroupConfig) => ({
              ...group,
              id: `grp_${Date.now()}${Math.random()}`,
              fields: group.fields.map((field: FieldConfig) => ({
                ...field,
                id: `field_${Date.now()}${Math.random()}`,
                value:
                  field.type === "radio"
                    ? field.extentstrigger?.options?.[0] ||
                      field.options?.[0] ||
                      ""
                    : field.value || "",
                extents: field.extents?.map((ext: FieldConfig) => ({
                  ...ext,
                  id: `extent_${Date.now()}${Math.random()}`,
                })),
              })),
            })),
          };
        });
        updateSections(transformedSections);
      }
    }, [selectedFormTemplate]);

    useEffect(() => {
      if (formId && selectedFormTemplate) {
        setTemplateTitle(selectedFormTemplate.title);
        setTemplateDescription(selectedFormTemplate.description || "");
      }
    }, [formId, selectedFormTemplate]);

    const addSection = () => {
      const newSections = [
        ...sections,
        {
          id: `sec_${Date.now()}`,
          title: t("aorForms.newSection"),
          icon: "",
          description: "",
          order: sections.length + 1,
          group: [],
        },
      ];
      updateSections(newSections);
      onActiveSectionChange(newSections.length - 1);
    };

    const shouldAddControllerField = (groupTitle?: string) => {
      if (!groupTitle) return false;
      const lowerTitle = groupTitle.toLowerCase();
      return (
        lowerTitle.includes("incoming") && lowerTitle.includes("controller")
      );
    };

 

    const addGroup = (sectionIdx: number) => {
      const updated = [...sections];
      const newGroup = defaultGroup();

      if (shouldAddControllerField(newGroup.title)) {
        const controllerField: FieldConfig = {
          id: `field_controller_${Date.now()}`,
          name: "incomingController",
          label: "Incoming Controller",
          type: "select",
          alignment: "full",
          required: true,
          placeholder: "Select Controller",
          options: selectedUser.map((u) => u.username),
          // value: "",
          // extents: [],
          description: "Active controller name of this AOR will show here",
        };
        newGroup.fields = [controllerField];
      }

      updated[sectionIdx].group.push(newGroup);
      updateSections(updated);
    };

    const addField = (sectionIdx: number, groupIdx: number) => {
      const updated = [...sections];

      const allFieldsInSection = updated[sectionIdx].group.flatMap((group) =>
        group.fields.map((field) => field.name),
      );

      let counter = 1;
      let defaultName = `defaultField${counter}`;

      while (allFieldsInSection.includes(defaultName)) {
        counter = counter + 1;
        defaultName = `defaultField${counter}`;
      }

      const newField = {
        ...defaultField(),
        name: defaultName,
      };

      updated[sectionIdx].group[groupIdx].fields.push(newField);
      updateSections(updated);
    };

    const updateField = <K extends keyof FieldConfig>(
      sectionIdx: number,
      groupIdx: number,
      fieldIdx: number,
      key: K,
      value: FieldConfig[K],
    ) => {
      const updated = [...sections];
      updated[sectionIdx].group[groupIdx].fields[fieldIdx][key] = value;
      if (key === "label") {
        const groupFields = updated[sectionIdx].group[groupIdx].fields;
        const baseName = toCamelCase(value as string);
        let uniqueName = baseName;
        let counter = 1;

        while (
          groupFields.some(
            (field, idx) => idx !== fieldIdx && field.name === uniqueName,
          )
        ) {
          uniqueName = `${baseName}${counter}`;
          counter = counter + 1;
        }

        updated[sectionIdx].group[groupIdx].fields[fieldIdx].name = uniqueName;
      }

      updateSections(updated);
    };

    const updateGroup = <K extends keyof GroupConfig>(
      sectionIdx: number,
      groupIdx: number,
      key: K,
      value: GroupConfig[K],
    ) => {
      const updated = [...sections];
      updated[sectionIdx].group[groupIdx][key] = value;

      if (key === "title") {
        const group = updated[sectionIdx].group[groupIdx];
        const hasControllerField = group.fields.some(
          (f) => f.name === "incomingController",
        );
        const shouldHaveController = shouldAddControllerField(value as string);

        if (shouldHaveController && !hasControllerField) {
          const controllerField: FieldConfig = {
            id: `field_controller_${Date.now()}`,
            name: "incomingController",
            label: "Incoming Controller",
            type: "select",
            alignment: "full",
            required: true,
            placeholder: "Select Controller",
            options: selectedUser.map((u) => u.username),
            // value: "",
            // extents: [],
          };
          group.fields.unshift(controllerField);
        } else if (!shouldHaveController && hasControllerField) {
          // Remove controller field
          group.fields = group.fields.filter(
            (f) => f.name !== "incomingController",
          );
        }
      }

      updateSections(updated);
    };

    const updateSection = <K extends keyof SectionConfig>(
      sectionIdx: number,
      key: K,
      value: SectionConfig[K],
    ) => {
      const updated = [...sections];
      updated[sectionIdx][key] = value;
      updateSections(updated);
    };

    const removeField = (
      sectionIdx: number,
      groupIdx: number,
      fieldIdx: number,
    ) => {
      const updated = [...sections];
      updated[sectionIdx].group[groupIdx].fields.splice(fieldIdx, 1);
      updateSections(updated);
    };

    const removeSection = (sectionIdx: number) => {
      const updated = [...sections];
      updated.splice(sectionIdx, 1);
      updateSections(updated);
      if (sectionIdx === activeSection && updated.length > 0) {
        const newActiveSection =
          sectionIdx >= updated.length ? updated.length - 1 : sectionIdx;
        onActiveSectionChange(newActiveSection);
      } else if (sectionIdx < activeSection) {
        onActiveSectionChange(activeSection - 1);
      } else if (updated.length === 0) {
        onActiveSectionChange(0);
      }
    };

    const removeGroup = (sectionIdx: number, groupIdx: number) => {
      const updated = [...sections];
      updated[sectionIdx].group.splice(groupIdx, 1);
      updateSections(updated);
    };

    const moveSection = (index: number, direction: "left" | "right") => {
      const updated = [...sections];
      const targetIndex = direction === "left" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= updated.length) return;
      [updated[index], updated[targetIndex]] = [
        updated[targetIndex],
        updated[index],
      ];
      updateSections(updated);
      if (activeSection === index) {
        onActiveSectionChange(targetIndex);
      } else if (activeSection === targetIndex) {
        onActiveSectionChange(index);
      }
    };

    const slugify = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const cleanExport = (sections: SectionConfig[]) =>
      sections.reduce(
        (acc, { ...section }) => ({
          ...acc,
          [slugify(section.title || t("aorForms.untitledSection"))]: {
            title: section.title,
            icon: section.icon,
            description: section.description,
            order: section.order,
            group: section.group.map(({ ...group }) => ({
              title: group.title,
              description: group.description,
              alignment: group.alignment,
              fields: group.fields.map(({ extents = [], ...field }) => ({
                ...field,
                value:
                  field.type === "radio"
                    ? field.extentstrigger?.options?.[0] ||
                      field.options?.[0] ||
                      ""
                    : field.value || "",
                extents: extents.map(({ ...ext }) => ext),
              })),
            })),
          },
        }),
        {} as Record<string, unknown>,
      );

   

    const saveTemplate = async () => {
      if (!aorId) {
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: t("aorForms.AORnotFound"),
          }),
        );

        return;
      }

      if (sections.length === 0) {
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: t("aorForms.befSaveMsg"),
          }),
        );
        return;
      }

      try {
        const cleaned = cleanExport(sections);
        const payload = {
          aorId: aorId ?? "",
          title: templateTitle,
          description: templateDescription,
          version: 1,
          formTemplate: cleaned,
        };

        await dispatch(createAorTemplateThunk(payload)).unwrap();

        dispatch(
          showAlert({
            type: AlertType.Success,
            message: t("aorForms.createSuccess"),
          }),
        );
        onFormSaved?.();
      } catch (error) {
        const errorMessage =
          typeof error === "string" ? error : t("aorForms.createFailed");
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: errorMessage,
          }),
        );
      }
    };

    const editTemplate = async () => {
      if (!aorId || !formId) {
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: t("aorForms.missingData"),
          }),
        );
        return;
      }

      if (sections.length === 0) {
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: t("aorForms.befSaveMsg"),
          }),
        );
        return;
      }

      try {
        const cleaned = cleanExport(sections);
        const payload = {
          aorId: aorId,
          title: templateTitle,
          description: templateDescription,
          version: (selectedFormTemplate?.version || 1) + 1,
          formTemplate: cleaned,
        };

        await dispatch(editAorTemplateThunk({ id: formId, payload })).unwrap();

        dispatch(
          showAlert({
            type: AlertType.Success,
            message: t("aorForms.updateSuccess"),
          }),
        );
        onFormSaved?.();
      } catch (error) {
        const errorMessage =
          typeof error === "string" ? error : t("aorForms.updateFailed");
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: errorMessage,
          }),
        );
      }
    };

    return (
      <Box sx={formBuilderStyles.container}>
        <Box sx={formBuilderStyles.headerRow}>
         
        <Box sx={formBuilderStyles.headerButtons}>
         

        
          </Box>

          <Box sx={formBuilderStyles.sectionContainer}>
            <Box>
              <label style={formBuilderStyles.label}>
                {t("aorForms.formTitle")}
              </label>
              <input
                type="text"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                style={{ ...formBuilderStyles.input, width: "100%" }}
                placeholder={t("aorForms.enterFormtitle")}
              />
            </Box>

            <Box>
              <label style={formBuilderStyles.label}>
                {t("aorForms.formDescription")}
              </label>
              <input
                type="text"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                style={{ ...formBuilderStyles.input, width: "100%" }}
                placeholder={t("aorForms.enterFormDescription")}
              />
            </Box>
          </Box>
        </Box>

        {sections[activeSection] && (
          <Box
            key={sections[activeSection].id}
            sx={formBuilderStyles.sectionContainer}
          >
            <Box sx={formBuilderStyles.fieldRow}>
              <Box sx={{ position: "relative", width: "100%" }}>
                <Box>
                  <label style={formBuilderStyles.label}>
                    {t("aorForms.sectionTitle")}
                  </label>
                  <input
                    type="text"
                    value={sections[activeSection].title}
                    onChange={(e) =>
                      updateSection(activeSection, "title", e.target.value)
                    }
                    style={{
                      ...formBuilderStyles.input,
                      ...formBuilderStyles.fieldInput,
                    }}
                    placeholder={t("aorForms.enterSectionTitle")}
                  />
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => moveSection(activeSection, "left")}
                    disabled={activeSection === 0}
                    size="small"
                  >
                    <ArrowBackOutlinedIcon
                      fontSize="small"
                      sx={{ color: "white" }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={() => moveSection(activeSection, "right")}
                    disabled={activeSection === sections.length - 1}
                    size="small"
                  >
                    <ArrowForwardOutlinedIcon
                      fontSize="small"
                      sx={{ color: "white" }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={() => removeSection(activeSection)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ position: "relative", width: "100%" }}>
                <label style={formBuilderStyles.label}>
                  {t("aorForms.sectionDescription")}
                </label>
                <input
                  type="text"
                  value={sections[activeSection].description || ""}
                  onChange={(e) =>
                    updateSection(activeSection, "description", e.target.value)
                  }
                  style={{
                    ...formBuilderStyles.input,
                    ...formBuilderStyles.fieldInput,
                  }}
                  placeholder={t("aorForms.enterSectionDescription")}
                />
              </Box>
              <Box sx={{ position: "relative", width: "100%" }}>
                <SectionIconSelect
                  sections={sections}
                  activeSection={activeSection}
                  updateSection={updateSection}
                />
              </Box>
            </Box>

          
            {sections[activeSection].group.map((group, groupIdx) => (
              <Box key={group.id} sx={formBuilderStyles.groupContainer}>
                <Box sx={formBuilderStyles.fieldRow}>
                  <Box sx={{ position: "relative", width: "100%" }}>
                    <Box>
                      <label style={formBuilderStyles.label}>
                        {" "}
                        {t("aorForms.groupTitle")}
                      </label>
                      <input
                        type="text"
                        value={group.title || ""}
                        onChange={(e) =>
                          updateGroup(
                            activeSection,
                            groupIdx,
                            "title",
                            e.target.value,
                          )
                        }
                        style={{
                          ...formBuilderStyles.input,
                          ...formBuilderStyles.fieldInput,
                        }}
                        placeholder={t("aorForms.enterGroupTitle")}
                      />
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        onClick={() => removeGroup(activeSection, groupIdx)}
                      >
                        <DeleteIcon
                          fontSize="small"
                          color="error"
                          sx={{ marginTop: -1 }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                  <FormControl sx={{ minWidth: 120 }}>
                    <label style={formBuilderStyles.label}>
                      {t("aorForms.alignment")}
                    </label>
                    <Select
                      value={group.alignment || "full"}
                      onChange={(e) =>
                        updateGroup(
                          activeSection,
                          groupIdx,
                          "alignment",
                          e.target.value as Alignment,
                        )
                      }
                      sx={formBuilderStyles.select}
                      MenuProps={formBuilderStyles.selectMenu}
                    >
                      <MenuItem value="full">{t("aorForms.full")}</MenuItem>
                      <MenuItem value="half">{t("aorForms.half")}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  onClick={() => addField(activeSection, groupIdx)}
                  startIcon={<AddIcon />}
                >
                  {t("aorForms.addField")}
                </Button>

                {group.fields.map((field, fieldIdx) => (
                  <Box key={field.id} sx={formBuilderStyles.fieldContainer}>
                    <Box sx={formBuilderStyles.fieldRow}>
                      <Box sx={{ position: "relative", width: "100%" }}>
                        <Box>
                          <label style={formBuilderStyles.label}>
                            {t("aorForms.fieldLabel")}
                          </label>
                          <input
                            type="text"
                            value={field.label}
                            placeholder={t("aorForms.enterFieldLabel")}
                            disabled={field.name === "incomingController"}
                            onChange={(e) => {
                              const newLabel = e.target.value;
                              let fieldName: string;

                              if (newLabel.trim()) {
                                fieldName = generateUniqueName(
                                  newLabel,
                                  sections,
                                  {
                                    sectionIdx: activeSection,
                                    groupIdx,
                                    fieldIdx,
                                  },
                                );
                              } else {
                               
                                const allFieldsInSection = sections[
                                  activeSection
                                ].group.flatMap((group) =>
                                  group.fields.map((field) => field.name),
                                );

                                const otherFieldNames =
                                  allFieldsInSection.filter((_, index) => {
                                    let globalIndex = 0;
                                    for (
                                      let gIdx = 0;
                                      gIdx <
                                      sections[activeSection].group.length;
                                      gIdx++
                                    ) {
                                      for (
                                        let fIdx = 0;
                                        fIdx <
                                        sections[activeSection].group[gIdx]
                                          .fields.length;
                                        fIdx++
                                      ) {
                                        if (
                                          gIdx === groupIdx &&
                                          fIdx === fieldIdx
                                        ) {
                                          return globalIndex !== index;
                                        }
                                        globalIndex += 1;
                                      }
                                    }
                                    return true;
                                  });

                                let counter = 1;
                                let defaultName = `defaultField${counter}`;
                                while (otherFieldNames.includes(defaultName)) {
                                  counter += 1;
                                  defaultName = `defaultField${counter}`;
                                }
                                fieldName = defaultName;
                              }

                              updateField(
                                activeSection,
                                groupIdx,
                                fieldIdx,
                                "label",
                                newLabel,
                              );
                              updateField(
                                activeSection,
                                groupIdx,
                                fieldIdx,
                                "name",
                                fieldName,
                              );
                            }}
                            style={{
                              ...formBuilderStyles.input,
                              ...formBuilderStyles.fieldInput,
                              ...(field.name === "incomingController" && {
                                opacity: 0.6,
                                cursor: "not-allowed",
                              }),
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            display: "flex",
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            disabled={fieldIdx === 0}
                            onClick={() => {
                              const updated = [...sections];
                              const temp =
                                updated[activeSection].group[groupIdx].fields[
                                  fieldIdx - 1
                                ];
                              updated[activeSection].group[groupIdx].fields[
                                fieldIdx - 1
                              ] =
                                updated[activeSection].group[groupIdx].fields[
                                  fieldIdx
                                ];
                              updated[activeSection].group[groupIdx].fields[
                                fieldIdx
                              ] = temp;
                              updateSections(updated);
                            }}
                          >
                            <ArrowUpwardIcon
                              fontSize="small"
                              sx={{ color: "white" }}
                            />
                          </IconButton>

                          <IconButton
                            size="small"
                            disabled={fieldIdx === group.fields.length - 1}
                            onClick={() => {
                              const updated = [...sections];
                              const temp =
                                updated[activeSection].group[groupIdx].fields[
                                  fieldIdx + 1
                                ];
                              updated[activeSection].group[groupIdx].fields[
                                fieldIdx + 1
                              ] =
                                updated[activeSection].group[groupIdx].fields[
                                  fieldIdx
                                ];
                              updated[activeSection].group[groupIdx].fields[
                                fieldIdx
                              ] = temp;
                              updateSections(updated);
                            }}
                          >
                            <ArrowDownwardIcon
                              fontSize="small"
                              sx={{ color: "white" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              removeField(activeSection, groupIdx, fieldIdx)
                            }
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      {["text", "textarea"].includes(field.type as string) && (
                        <Box sx={{ position: "relative", width: "100%" }}>
                          <label style={formBuilderStyles.label}>
                            {t("aorForms.placeholder")}
                          </label>
                          <input
                            type="text"
                            value={field.placeholder || ""}
                            placeholder={t("aorForms.enterPlaceholder")}
                            onChange={(e) =>
                              updateField(
                                activeSection,
                                groupIdx,
                                fieldIdx,
                                "placeholder",
                                e.target.value,
                              )
                            }
                            style={{
                              ...formBuilderStyles.input,
                              ...formBuilderStyles.fieldInput,
                            }}
                          />
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          display: "flex",
                          gap: 2,
                        }}
                      >
                        <FormControl sx={{ flex: 1 }}>
                          <label style={formBuilderStyles.label}>
                            {t("aorForms.type")}
                          </label>
                          <Select
                            value={field.type}
                            disabled={field.name === "incomingController"}
                            onChange={(e) =>
                              updateField(
                                activeSection,
                                groupIdx,
                                fieldIdx,
                                "type",
                                e.target.value as FieldType,
                              )
                            }
                            sx={formBuilderStyles.select}
                            MenuProps={formBuilderStyles.selectMenu}
                          >
                            <MenuItem value="text">
                              {t("aorForms.text")}
                            </MenuItem>
                            <MenuItem value="textarea">
                              {t("aorForms.textArea")}
                            </MenuItem>
                            <MenuItem value="radio">
                              {t("aorForms.radio")}
                            </MenuItem>
                            <MenuItem value="checkbox">
                              {t("aorForms.checkBox")}
                            </MenuItem>
                            <MenuItem value="date">
                              {t("aorForms.date")}
                            </MenuItem>
                            <MenuItem value="time">
                              {t("aorForms.time")}
                            </MenuItem>
                            <MenuItem value="esign">
                              {t("aorForms.esign")}
                            </MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl sx={{ flex: 1 }}>
                          <label style={formBuilderStyles.label}>
                            {t("aorForms.alignment")}
                          </label>
                          <Select
                            value={field.alignment}
                            onChange={(e) =>
                              updateField(
                                activeSection,
                                groupIdx,
                                fieldIdx,
                                "alignment",
                                e.target.value as Alignment,
                              )
                            }
                            sx={formBuilderStyles.select}
                            MenuProps={formBuilderStyles.selectMenu}
                          >
                            <MenuItem value="full">
                              {t("aorForms.full")}
                            </MenuItem>
                            <MenuItem value="half">
                              {t("aorForms.half")}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.required}
                            onChange={(e) =>
                              updateField(
                                activeSection,
                                groupIdx,
                                fieldIdx,
                                "required",
                                e.target.checked,
                              )
                            }
                            sx={formBuilderStyles.checkbox}
                          />
                        }
                        label="Required"
                        sx={formBuilderStyles.formControlLabel}
                      />
                    </Box>
                    {field.type !== "radio" && field.type !== "checkbox" && (
                      <Box sx={{ mt: 1 }}>
                        <label style={formBuilderStyles.label}>
                          {t("aorForms.fieldDescription")}
                        </label>
                        <input
                          type="text"
                          disabled={field.name === "incomingController"}
                          value={field.description || ""}
                          placeholder={t("aorForms.enterFieldDescription")}
                          onChange={(e) =>
                            updateField(
                              activeSection,
                              groupIdx,
                              fieldIdx,
                              "description",
                              e.target.value,
                            )
                          }
                          style={{
                            ...formBuilderStyles.input,
                            ...formBuilderStyles.fullWidthInput,
                          }}
                        />
                      </Box>
                    )}

                    {(field.type === "radio" || field.type === "checkbox") && (
                      <>
                        <Box mt={2}>
                          <label style={formBuilderStyles.label}>
                            {t("aorForms.option")}
                          </label>
                          <input
                            type="text"
                            value={
                              rawOptionsInput[field.id] ??
                              (field.options?.join(", ") || "")
                            }
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              setRawOptionsInput((prev) => ({
                                ...prev,
                                [field.id]: inputValue,
                              }));
                              if (inputValue.trim() === "") {
                                updateField(
                                  activeSection,
                                  groupIdx,
                                  fieldIdx,
                                  "options",
                                  [],
                                );
                              } else {
                                let processedOptions = inputValue
                                  .split(",")
                                  .map((option) => option.trim())
                                  .filter((option) => option.length > 0);
                                if (
                                  field.type === "radio" &&
                                  processedOptions.length > 2
                                ) {
                                  processedOptions = processedOptions.slice(
                                    0,
                                    2,
                                  );
                                  const limitedInput =
                                    processedOptions.join(", ");
                                  setRawOptionsInput((prev) => ({
                                    ...prev,
                                    [field.id]: limitedInput,
                                  }));
                                }
                                updateField(
                                  activeSection,
                                  groupIdx,
                                  fieldIdx,
                                  "options",
                                  processedOptions,
                                );
                              }
                            }}
                            onBlur={() => {
                              setRawOptionsInput((prev) => {
                                const newState = { ...prev };
                                delete newState[field.id];
                                return newState;
                              });
                            }}
                            style={{
                              ...formBuilderStyles.input,
                              ...formBuilderStyles.fullWidthInput,
                            }}
                            placeholder={
                              field.type === "radio"
                                ? t("aorForms.radioPlaceholder")
                                : t("aorForms.checkBoxPlaceholder")
                            }
                          />
                        </Box>
                      </>
                    )}
                    {(field.type === "radio" ||
                      field.type === "checkbox" ||
                      field.type === "date" ||
                      field.type === "time") && (
                      <>
                        <Button
                          onClick={() => {
                            const existingExtents = field.extents || [];
                            let counter = 1;
                            let defaultName = `defaultExtent${counter}`;
                            while (
                              existingExtents.some(
                                (ext) => ext.name === defaultName,
                              )
                            ) {
                              counter += 1;
                              defaultName = `defaultExtent${counter}`;
                            }

                            const newExt: FieldConfig = {
                              id: `extent_${Date.now()}`,
                              name: defaultName,
                              label: "",
                              type: "textarea",
                              placeholder: "",
                              alignment: "full",
                            };

                            const updatedExts: FieldConfig[] = field.extents
                              ? [...field.extents, newExt]
                              : [newExt];

                            updateField(
                              activeSection,
                              groupIdx,
                              fieldIdx,
                              "extents",
                              updatedExts,
                            );
                          }}
                          sx={{ mt: 1 }}
                        >
                          {t("aorForms.addExtendField")}
                        </Button>

                        {field.extents?.map((ext, extIdx) => (
                          <Box
                            key={ext.id}
                            sx={formBuilderStyles.extendContainer}
                          >
                            <Box sx={{ position: "relative", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                mb={1}
                                sx={formBuilderStyles.typography}
                              >
                                {t("aorForms.extField")} {extIdx + 1}
                              </Typography>
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: -9,
                                  right: 0,
                                  display: "flex",
                                  gap: 1,
                                }}
                              >
                                <IconButton
                                  color="error"
                                  onClick={() => {
                                    const updatedExt = field.extents!.filter(
                                      (_, i) => i !== extIdx,
                                    );
                                    updateField(
                                      activeSection,
                                      groupIdx,
                                      fieldIdx,
                                      "extents",
                                      updatedExt,
                                    );
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            <Box sx={formBuilderStyles.fieldRow}>
                              <Box sx={{ position: "relative", width: "100%" }}>
                                <Box>
                                  <label style={formBuilderStyles.label}>
                                    {t("aorForms.label")}
                                  </label>
                                  <input
                                    type="text"
                                    value={ext.label}
                                    placeholder={t(
                                      "aorForms.enterExtendFieldLabel",
                                    )}
                                    onChange={(e) => {
                                      const newLabel = e.target.value;
                                      let extentName: string;

                                      if (newLabel.trim()) {
                                        const baseName = toCamelCase(newLabel);
                                        let uniqueName = baseName;
                                        let counter = 1;
                                        while (
                                          field.extents!.some(
                                            (field, idx) =>
                                              idx !== extIdx &&
                                              field.name === uniqueName,
                                          )
                                        ) {
                                          uniqueName = `${baseName}${counter}`;
                                          counter += 1;
                                        }
                                        extentName = uniqueName;
                                      } else {
                                        let counter = 1;
                                        let defaultName = `defaultExtent${counter}`;
                                        while (
                                          field.extents!.some(
                                            (field, idx) =>
                                              idx !== extIdx &&
                                              field.name === defaultName,
                                          )
                                        ) {
                                          counter += 1;
                                          defaultName = `defaultExtent${counter}`;
                                        }
                                        extentName = defaultName;
                                      }

                                      updateField(
                                        activeSection,
                                        groupIdx,
                                        fieldIdx,
                                        "extents",
                                        field.extents!.map((field, idx) =>
                                          idx === extIdx
                                            ? {
                                                ...field,
                                                label: newLabel,
                                                name: extentName,
                                              }
                                            : field,
                                        ),
                                      );
                                    }}
                                    style={{
                                      ...formBuilderStyles.input,
                                      ...formBuilderStyles.fieldInput,
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Box sx={{ position: "relative", width: "100%" }}>
                                <Box>
                                  <label style={formBuilderStyles.label}>
                                    {t("aorForms.placeholder")}
                                  </label>
                                  <input
                                    type="text"
                                    value={ext.placeholder || ""}
                                    placeholder={t("aorForms.enterPlaceholder")}
                                    onChange={(e) =>
                                      updateField(
                                        activeSection,
                                        groupIdx,
                                        fieldIdx,
                                        "extents",
                                        field.extents!.map((field, idx) =>
                                          idx === extIdx
                                            ? {
                                                ...field,
                                                placeholder: e.target.value,
                                              }
                                            : field,
                                        ),
                                      )
                                    }
                                    style={{
                                      ...formBuilderStyles.input,
                                      ...formBuilderStyles.fieldInput,
                                    }}
                                  />
                                </Box>
                              </Box>
                              <FormControl sx={{ minWidth: 120 }}>
                                <label style={formBuilderStyles.label}>
                                  {t("aorForms.label")}
                                </label>
                                <Select
                                  value={ext.type || "textarea"}
                                  onChange={(e) =>
                                    updateField(
                                      activeSection,
                                      groupIdx,
                                      fieldIdx,
                                      "extents",
                                      field.extents!.map((field, idx) =>
                                        idx === extIdx
                                          ? {
                                              ...field,
                                              type: e.target.value as FieldType,
                                            }
                                          : field,
                                      ),
                                    )
                                  }
                                  sx={formBuilderStyles.select}
                                  MenuProps={formBuilderStyles.selectMenu}
                                >
                                  <MenuItem value="text">
                                    {t("aorForms.text")}
                                  </MenuItem>
                                  <MenuItem value="textarea">
                                    {t("aorForms.textArea")}
                                  </MenuItem>
                                  <MenuItem value="radio">
                                    {t("aorForms.radio")}
                                  </MenuItem>
                                  <MenuItem value="checkbox">
                                    {t("aorForms.checkBox")}
                                  </MenuItem>
                                  <MenuItem value="date">
                                    {t("aorForms.date")}
                                  </MenuItem>
                                  <MenuItem value="time">
                                    {t("aorForms.time")}
                                  </MenuItem>
                                  <MenuItem value="esign">
                                    {t("aorForms.esign")}
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Box>

                            {(ext.type === "radio" ||
                              ext.type === "checkbox") && (
                              <Box mt={2}>
                                <label style={formBuilderStyles.label}>
                                  {t("aorForms.option")}
                                </label>
                                <input
                                  type="text"
                                  value={
                                    rawOptionsInput[ext.id] ??
                                    (ext.options?.join(", ") || "")
                                  }
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setRawOptionsInput((prev) => ({
                                      ...prev,
                                      [ext.id]: inputValue,
                                    }));

                                    if (inputValue.trim() === "") {
                                      // Clear options for this extend field
                                      updateField(
                                        activeSection,
                                        groupIdx,
                                        fieldIdx,
                                        "extents",
                                        field.extents!.map((extField, idx) =>
                                          idx === extIdx
                                            ? { ...extField, options: [] }
                                            : extField,
                                        ),
                                      );
                                    } else {
                                      let processedOptions = inputValue
                                        .split(",")
                                        .map((option) => option.trim())
                                        .filter((option) => option.length > 0);

                                      if (
                                        ext.type === "radio" &&
                                        processedOptions.length > 2
                                      ) {
                                        processedOptions =
                                          processedOptions.slice(0, 2);
                                        const limitedInput =
                                          processedOptions.join(", ");
                                        setRawOptionsInput((prev) => ({
                                          ...prev,
                                          [ext.id]: limitedInput,
                                        }));
                                      }

                                      // Update options for this extend field
                                      updateField(
                                        activeSection,
                                        groupIdx,
                                        fieldIdx,
                                        "extents",
                                        field.extents!.map((extField, idx) =>
                                          idx === extIdx
                                            ? {
                                                ...extField,
                                                options: processedOptions,
                                              }
                                            : extField,
                                        ),
                                      );
                                    }
                                  }}
                                  onBlur={() => {
                                    setRawOptionsInput((prev) => {
                                      const newState = { ...prev };
                                      delete newState[ext.id];
                                      return newState;
                                    });
                                  }}
                                  style={{
                                    ...formBuilderStyles.input,
                                    ...formBuilderStyles.fullWidthInput,
                                  }}
                                  placeholder={
                                    ext.type === "radio"
                                      ? t("aorForms.radioPlaceholder")
                                      : t("aorForms.checkBoxPlaceholder")
                                  }
                                />
                              </Box>
                            )}
                            {(field.type === "radio" ||
                              field.type === "checkbox") && (
                              <Box mt={2}>
                                <label style={formBuilderStyles.label}>
                                  {t("aorForms.extendValue")}
                                </label>
                                <input
                                  type="text"
                                  value={
                                    field.extentstrigger?.options?.join(", ") ||
                                    ""
                                  }
                                  onChange={(e) => {
                                    const triggerValues = e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean);

                                    const updatedField = {
                                      ...field,
                                      extentstrigger: {
                                        options: triggerValues,
                                      },
                                      extentsdefault: triggerValues[0] || "",
                                      value:
                                        triggerValues.length > 0
                                          ? triggerValues[0]
                                          : field.options?.[0] || "",
                                    };

                                    const updated = [...sections];
                                    updated[activeSection].group[
                                      groupIdx
                                    ].fields[fieldIdx] = updatedField;
                                    updateSections(updated);
                                  }}
                                  style={{
                                    ...formBuilderStyles.input,
                                    ...formBuilderStyles.fullWidthInput,
                                  }}
                                  placeholder={t("aorForms.extendPlaceholder")}
                                  required
                                />
                              </Box>
                            )}
                          </Box>
                        ))}
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}

        {sections.length === 0 && aorId && (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <Typography variant="body1">
              {t("aorForms.NoSectionMsg")}
            </Typography>
          </Box>
        )}
      </Box>
    );
  },
);

export default FormBuilderCustom;

FormBuilderCustom.displayName = "FormBuilderCustom";
