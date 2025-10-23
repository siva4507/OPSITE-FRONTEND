"use client";

import React, { useEffect, useState, useRef } from "react";
import FormBuilderCustom from "./formcreator";
import LivePreview from "./livePreview";
import { SectionConfig } from "../../types/aorFormUi.types";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { formBuilderStyles } from "@/src/styles/aorForm.styles";
import {
  clearSelectedFormTemplate,
  getAorsWithTemplate,
  getFormTemplateById,
} from "@/src/store/slices/aorFormSlice";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import AddIcon from "@mui/icons-material/Add";

interface FormBuilderPageProps {
  formId?: string | null;
  aorName?: string | null;
  aorId?: string | null;
  onClose: () => void;
}

interface FormBuilderRef {
  saveTemplate: () => void;
  editTemplate: () => void;
  addSection: () => void;
  addGroup: (sectionIdx: number) => void;
}

export default function Page({
  formId = null,
  aorName = null,
  aorId = null,
  onClose,
}: FormBuilderPageProps) {
  const { t } = useTranslation();
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [effectiveAorId, setEffectiveAorId] = useState<string | null>(aorId);
  const [effectiveAorName, setEffectiveAorName] = useState<string | null>(
    aorName,
  );
  const [isDirty, setIsDirty] = useState(false);
  const [backClickedOnce, setBackClickedOnce] = useState(false);
  const initialSectionsRef = useRef<SectionConfig[]>([]);
  const isInitialLoadRef = useRef(true);
  const dispatch = useAppDispatch();
  const { aorsWithTemplate, selectedFormTemplate } = useAppSelector(
    (state) => state.aorForms,
  );
  const formBuilderRef = useRef<FormBuilderRef | null>(null);
  const sectionsEqual = (
    sections1: SectionConfig[],
    sections2: SectionConfig[],
  ) => {
    if (sections1.length !== sections2.length) return false;

    return sections1.every((section1, index) => {
      const section2 = sections2[index];
      return (
        section1.id === section2.id &&
        section1.title === section2.title &&
        section1.description === section2.description &&
        section1.icon === section2.icon &&
        section1.order === section2.order &&
        JSON.stringify(section1.group) === JSON.stringify(section2.group)
      );
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    dispatch(getAorsWithTemplate());
  }, [dispatch]);

  useEffect(() => {
    if (formId) {
      dispatch(getFormTemplateById(formId));
    }
  }, [dispatch, formId]);

  useEffect(() => {
    if (formId && selectedFormTemplate) {
      setEffectiveAorId(selectedFormTemplate.aorId || null);
      if (selectedFormTemplate.aorId && aorsWithTemplate.length > 0) {
        const matchingAor = aorsWithTemplate.find(
          (aor) => aor._id === selectedFormTemplate.aorId,
        );
        if (matchingAor) {
          setEffectiveAorName(matchingAor.name);
        }
      }
    } else {
      setEffectiveAorId(aorId);
      setEffectiveAorName(aorName);
    }
  }, [formId, selectedFormTemplate, aorsWithTemplate, aorId, aorName]);

  useEffect(() => {
    if (selectedFormTemplate?.formTemplate) {
      const transformed = Object.keys(selectedFormTemplate.formTemplate)
        .map((key, index) => {
          const section = selectedFormTemplate.formTemplate[key];
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
        .filter(Boolean) as SectionConfig[];

      const sortedSections = transformed.sort(
        (a, b) => (a.order || 0) - (b.order || 0),
      );
      setSections(sortedSections);

      initialSectionsRef.current = JSON.parse(JSON.stringify(sortedSections));
      isInitialLoadRef.current = true;
      setIsDirty(false);
    }
  }, [selectedFormTemplate]);

  useEffect(() => {
    if (sections.length > 0 && activeSection >= sections.length) {
      setActiveSection(0);
    }
  }, [sections, activeSection]);

  const handleSectionsChange = (newSections: SectionConfig[]) => {
    setSections(newSections);

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
    }

    const hasChanges = !sectionsEqual(newSections, initialSectionsRef.current);
    setIsDirty(hasChanges);
  };

  const handleBack = () => {
    if (isDirty && !backClickedOnce) {
      dispatch(
        showAlert({
          type: AlertType.Warning,
          message: t("aorForms.warningOnBack"),
        }),
      );
      setBackClickedOnce(true);
      return;
    }
    onClose();
  };

  const handleFormSaved = () => {
    initialSectionsRef.current = JSON.parse(JSON.stringify(sections));
    setIsDirty(false);
    setBackClickedOnce(false);
    dispatch(clearSelectedFormTemplate());

    onClose();
  };

  const saveTemplate = () => {
    if (formBuilderRef.current) {
      formBuilderRef.current.saveTemplate();
    }
  };

  const editTemplate = () => {
    if (formBuilderRef.current) {
      formBuilderRef.current.editTemplate();
    }
  };

  const addSection = () => {
    if (formBuilderRef.current) {
      formBuilderRef.current.addSection();
    }
  };

  const addGroup = () => {
    if (formBuilderRef.current && activeSection !== undefined) {
      formBuilderRef.current.addGroup(activeSection);
    }
  };

  return (
    <Box sx={formBuilderStyles.pageContainer}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: 1, p: 1 }}
      >
        <Typography variant="h6" sx={{ color: "#FFF" }}>
          {formId
            ? `${t("aorForms.editForm")} (${effectiveAorName})`
            : `${t("aorForms.createForm")} (${effectiveAorName})`}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {formId ? (
            <Button
              variant="outlined"
              onClick={editTemplate}
              sx={formBuilderStyles.button}
            >
              {t("aorForms.editTemplate")}
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={saveTemplate}
              sx={formBuilderStyles.button}
            >
              {t("aorForms.saveTemplate")}
            </Button>
          )}

          <Button
            variant="outlined"
            onClick={handleBack}
            sx={formBuilderStyles.button}
          >
            {t("aorForms.back")}
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 1, p: 1 }}>
        <Button
          onClick={addSection}
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{
            color: "#fff",
            borderColor: "#fff",
            borderRadius: "10px",
            "&:hover": {
              borderColor: "#fff",
              backgroundColor: "rgba(255,255,255,0.08)",
            },
          }}
        >
          {t("aorForms.addSection")}
        </Button>

        <Button
          onClick={addGroup}
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{
            color: "#fff",
            borderColor: "#fff",
            borderRadius: "10px",
            "&:hover": {
              borderColor: "#fff",
              backgroundColor: "rgba(255,255,255,0.08)",
            },
          }}
        >
          {t("aorForms.addGroup")}
        </Button>
      </Box>
      <Divider sx={{ backgroundColor: "white", opacity: 0.5, mb: 2 }} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }} sx={formBuilderStyles.leftGrid}>
          <FormBuilderCustom
            ref={formBuilderRef}
            onChange={handleSectionsChange}
            aors={aorsWithTemplate}
            activeSection={activeSection}
            onActiveSectionChange={setActiveSection}
            formId={formId}
            aorName={effectiveAorName}
            aorId={effectiveAorId}
            onFormSaved={handleFormSaved}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 8 }}
          sx={formBuilderStyles.rightGrid}
        >
          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: "white", opacity: 0.5 }}
          />
          <LivePreview
            sections={sections}
            activeSection={activeSection}
            onActiveSectionChange={setActiveSection}
          />
        </Grid>
      </Grid>
    </Box>
  );
}