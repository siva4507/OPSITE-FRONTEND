"use client";
import React, {
  useRef,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from "react";
import ShiftChangeHeader from "./shiftChangeHeader";
import ShiftFormBuilder from "./shiftFormBuilder";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  fetchShiftFormTemplate,
  fetchActiveShifts,
  saveShiftFormValues,
  resetShiftChange,
} from "@/src/store/slices/shiftChangeSlice";
import { ShiftFormTemplateResponse } from "@/src/dto/shiftChange.dto";
import {
  ShiftChangeFormState,
  TabIndicesState,
} from "@/src/types/shiftChange.types";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { NestFieldErrors } from "@/src/types/form.types";
import { useTranslation } from "@/src/hooks/useTranslation";
import Loader from "@/src/components/common/animateLoader";
import { Box } from "@mui/material";
import DynamicModal from "@/src/components/common/modal";
import {
  CHANGES,
  DAY_SHIFT,
  ESIGN,
  NIGHT_SHIFT,
  NO_CHANGES,
  SELECT,
} from "@/src/utils/constant";
import { shiftChangeHeaderStyles } from "../../styles/shiftChangeForm.styles";
import { useTheme } from "@mui/material/styles";
import { getAorUserById } from "@/src/store/slices/aorFormSlice";
import { AorUser } from "@/src/types/aorForm.types";

const getTabIndexForAor = (
  tabIndices: TabIndicesState,
  aorId: string,
): number => tabIndices[aorId] ?? 0;

const setTabIndexForAor = (
  tabIndices: TabIndicesState,
  aorId: string,
  step: number,
): TabIndicesState => ({ ...tabIndices, [aorId]: step });

const formatStepKey = (key: string): string =>
  key
    .replace(/-/g, " ")
    .replace(
      /(^|\s)([a-z])/g,
      (_, boundary, letter) => boundary + letter.toUpperCase(),
    );

const shouldShowExtents = (
  field: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  valueObj: any, // eslint-disable-line @typescript-eslint/no-explicit-any
): boolean => {
  if (!field.extents) return false;
  const trigger = field.extentstrigger?.options;
  if (!trigger || trigger.length === 0) return true;

  const value = valueObj?.value;
  const triggerLower = trigger.map((t: string) => t.toLowerCase());

  if (Array.isArray(value)) {
    return value.some((val: unknown) =>
      triggerLower.includes(String(val).toLowerCase()),
    );
  }
  return triggerLower.includes(String(value).toLowerCase());
};

const isFieldEmpty = (val: unknown): boolean =>
  val === undefined ||
  val === null ||
  val === "" ||
  (Array.isArray(val) && val.length === 0);

const cleanFormGroup = (
  group: Record<string, unknown>,
): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(group)) {
    if (field && typeof field === "object" && !Array.isArray(field)) {
      const cleanedField: Record<string, unknown> = {};

      for (const [subKey, value] of Object.entries(field)) {
        cleanedField[subKey] = value ?? "";
      }

      if (CHANGES in cleanedField && cleanedField.value === NO_CHANGES) {
        const { ...rest } = cleanedField;
        cleaned[key] = rest;
      } else {
        cleaned[key] = cleanedField;
      }
    } else {
      cleaned[key] = field ?? "";
    }
  }

  return cleaned;
};


const getShiftType = (shiftStartTime: string): string => {
  if (!shiftStartTime) return "";
  const date = new Date(shiftStartTime);
  const hour = date.getHours();
  return hour >= 5 && hour < 17 ? DAY_SHIFT : NIGHT_SHIFT;
};

const formatShiftStartTime = (shiftStartTime: string): string => {
  if (!shiftStartTime) return "";
  const date = new Date(shiftStartTime);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const ShiftChangeForm: React.FC = () => {
  // State
  const [shiftAorId, setShiftAorId] = useState<string | null>(null);
  const [tabIndices, setTabIndices] = useState<TabIndicesState>({});
  const [showErrors, setShowErrors] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<NestFieldErrors>({});
  const [formValues, setFormValues] = useState<ShiftChangeFormState>({});
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const theme = useTheme();
  const styles = shiftChangeHeaderStyles(theme);
  const user = useAppSelector((state) => state.auth.user);
  // Refs
  const lastSavedFormValuesRef = useRef<Record<string, any>>({}); // eslint-disable-line @typescript-eslint/no-explicit-any
  const hasEditedRef = useRef(false);
  const { stoppedAor } = useAppSelector((state) => state.shiftChange);
  // Hooks
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // Selectors
  const { activeShifts, formtemplates, formtemplateLoading, shiftLoading } =
    useAppSelector((state) => state.shiftChange);

  // Memoized values
  const allShiftAors = useMemo(
    () => activeShifts.flatMap((shift) => shift.shiftAors),
    [activeShifts],
  );

  const step = useMemo(
    () => (shiftAorId ? getTabIndexForAor(tabIndices, shiftAorId) : 0),
    [shiftAorId, tabIndices],
  );

  const template = useMemo(
    () =>
      shiftAorId
        ? (formtemplates[shiftAorId] as ShiftFormTemplateResponse)
        : null,
    [shiftAorId, formtemplates],
  );

  const currentShift = useMemo(() => {
    if (!shiftAorId) return null;
    return activeShifts.find((shift) =>
      shift.shiftAors.some((aor) => aor._id === shiftAorId),
    );
  }, [activeShifts, shiftAorId]);

  const shiftStartTime = useMemo(
    () => formatShiftStartTime(currentShift?.shiftStartTime || ""),
    [currentShift?.shiftStartTime],
  );

  const shiftType = useMemo(
    () => getShiftType(currentShift?.shiftStartTime || ""),
    [currentShift?.shiftStartTime],
  );

  const noFormTemplate = useMemo(
    () =>
      !template ||
      !template.formTemplate ||
      Object.keys(template.formTemplate).length === 0,
    [template],
  );

  const loading = useMemo(
    () => (shiftAorId ? !!formtemplateLoading[shiftAorId] : true),
    [shiftAorId, formtemplateLoading],
  );

  const stepKeys = useMemo(
    () => (template?.formTemplate ? Object.keys(template.formTemplate) : []),
    [template],
  );

  const allFieldsPerStep = useMemo(() => {
    if (!template?.formTemplate) return [];
    return stepKeys.map((stepKey) => {
      const section = template.formTemplate[stepKey];
      return (section.group || []).flatMap((group: any) => group.fields || []); // eslint-disable-line @typescript-eslint/no-explicit-any
    });
  }, [template, stepKeys]);

  const currentStepFieldErrors = useMemo(() => {
    if (!shiftAorId) return {};
    const stepKey = `${shiftAorId}-${step}`;
    return fieldErrors[stepKey] || {};
  }, [fieldErrors, shiftAorId, step]);

  useEffect(() => {
    dispatch(resetShiftChange());
    dispatch(fetchActiveShifts());
  }, [dispatch]);

  const buildInitialValuesFromFields = async (
    fields: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
    user: { signatureUrl?: string } | null,
    fieldToGroupTitleMap: Record<string, string>,
    aorId?: string,
  ): Promise<Record<string, unknown>> => {
    const result: Record<string, unknown> = {};

    // Fetch incoming users if aorId is provided
    let incomingUsers: AorUser[] = [];
    if (aorId) {
      try {
        const response = await dispatch(getAorUserById(aorId)).unwrap();
        incomingUsers = response;
      } catch (error) {
        console.error("Failed to fetch incoming users", error);
      }
    }

    for (const field of fields) {
      const fieldValue: Record<string, unknown> = {};

      // Check if THIS specific field belongs to an "incoming" group
      const groupTitle = fieldToGroupTitleMap[field.name] || "";
      const isIncomingGroup = groupTitle.toLowerCase().includes("incoming");

      if (field.type === ESIGN) {
        let base64: string | null = null;
        let signatureUrl: string | null = null;

        // Only get from localStorage and user signatureUrl if NOT in an incoming group
        if (!isIncomingGroup) {
          if (typeof window !== "undefined") {
            base64 = localStorage.getItem("userSignatureBase64");
          }
          signatureUrl = user?.signatureUrl || null;
        }

        fieldValue.value =
          base64 ||
          signatureUrl ||
          (field.value ?? field.extentsdefault) ||
          null;
      } else if (field.name.toLowerCase() === "date" && !field.value) {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const year = today.getFullYear();
        fieldValue.value = `${month}/${day}/${year}`;
      } else if (
        field.name.toLowerCase() === "incomingcontroller" &&
        isIncomingGroup &&
        field.type === SELECT
      ) {
        // Populate incoming controller options dynamically
        const usernames = incomingUsers.map((u) => u.username);
        fieldValue.options = usernames;
        fieldValue.value = field.value ?? field.extentsdefault ?? null;
      } else {
        fieldValue.value = field.value ?? field.extentsdefault ?? null;
      }

      if (field.extents?.length > 0) {
        for (const extent of field.extents) {
          if (extent.value !== undefined) {
            fieldValue[extent.name] = extent.value;
          }
        }
      }

      result[field.name] = fieldValue;
    }

    return result;
  };
 
  useEffect(() => {
    if (allShiftAors.length > 0 && !shiftLoading) {
      if (!shiftAorId || stoppedAor) {
        const activeShiftAor = allShiftAors.find((aor) => aor.isActive);
        const shiftAorToUse = activeShiftAor
          ? activeShiftAor._id
          : allShiftAors[0]._id;

        setShiftAorId(shiftAorToUse);

        if (stoppedAor) {
          setTabIndices({});
        }
      }
    } else if (allShiftAors.length === 0) {
      setShiftAorId(null);
      setTabIndices({});
      setFormValues({});
      setFieldErrors({});
      setShowErrors(false);
    }
  }, [allShiftAors, shiftAorId, stoppedAor, shiftLoading]);


  useEffect(() => {
    if (shiftAorId && !shiftLoading) {
      dispatch(fetchShiftFormTemplate({ shiftAorId }));
    }
  }, [shiftAorId, dispatch, shiftLoading]);

  useEffect(() => {
    allShiftAors.forEach((aor) => {
      const aorId = aor._id;
      const aorTemplate = formtemplates[aorId] as ShiftFormTemplateResponse;

      if (aorTemplate?.formTemplate && !formValues[aorId]) {
        const stepKeys = Object.keys(aorTemplate.formTemplate);
        const allFieldsPerStep = stepKeys.map((stepKey) => {
          const section = aorTemplate.formTemplate[stepKey];

          // Create a map of field name -> group title for ALL groups in this section
          const fieldToGroupTitleMap: Record<string, string> = {};
          (section.group || []).forEach((group: any) => {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            const groupTitle = group.title || "";
            (group.fields || []).forEach((field: any) => {
              // eslint-disable-line @typescript-eslint/no-explicit-any
              fieldToGroupTitleMap[field.name] = groupTitle;
            });
          });

          return {
            fields: (section.group || []).flatMap(
              (group: any) => group.fields || [], // eslint-disable-line @typescript-eslint/no-explicit-any
            ),
            fieldToGroupTitleMap,
          };
        });

        const initial: Record<number, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
        allFieldsPerStep.forEach((stepData, idx) => {
          initial[idx] = buildInitialValuesFromFields(
            stepData.fields,
            user,
            stepData.fieldToGroupTitleMap,
          );
        });

        setFormValues((prev) => ({
          ...prev,
          [aorId]: initial,
        }));
      }
    });
  }, [allShiftAors, formtemplates]);


  useEffect(() => {
    if (!shiftAorId) return;
    const currentTemplate = formtemplates[
      shiftAorId
    ] as ShiftFormTemplateResponse;
    if (currentTemplate?.formTemplate && !formValues[shiftAorId]) {
      const stepKeys = Object.keys(currentTemplate.formTemplate);
      const allFieldsPerStep = stepKeys.map((stepKey) => {
        const section = currentTemplate.formTemplate[stepKey];

        // Create a map of field name -> group title for ALL groups in this section
        const fieldToGroupTitleMap: Record<string, string> = {};
        (section.group || []).forEach((group: any) => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          const groupTitle = group.title || "";
          (group.fields || []).forEach((field: any) => {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            fieldToGroupTitleMap[field.name] = groupTitle;
          });
        });

        return {
          fields: (section.group || []).flatMap(
            (group: any) => group.fields || [], // eslint-disable-line @typescript-eslint/no-explicit-any
          ),
          fieldToGroupTitleMap,
        };
      });

      // Async initialization function
      const initializeFormValues = async () => {
        const initial: Record<number, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

        // Get the actual AOR ID from the shift
        const currentShiftAor = allShiftAors.find(
          (aor) => aor._id === shiftAorId,
        );
        const actualAorId = currentShiftAor?.aor?._id;

        for (let idx = 0; idx < allFieldsPerStep.length; idx++) {
          const stepData = allFieldsPerStep[idx];
          initial[idx] = await buildInitialValuesFromFields(
            stepData.fields,
            user,
            stepData.fieldToGroupTitleMap,
            actualAorId, // Pass the actual AOR ID
          );
        }

        setFormValues((prev) => ({
          ...prev,
          [shiftAorId]: initial,
        }));
      };

      initializeFormValues();
    }
  }, [shiftAorId, formtemplates, formValues, allShiftAors, user, dispatch]);



  // Callbacks
  const validateStep = useCallback(
    (stepIdx: number) => {
      if (!shiftAorId || !template) return {};

      const fields = allFieldsPerStep[stepIdx] || [];
      const valuesForStep = formValues[shiftAorId]?.[stepIdx] || {};
      const invalidFields: Record<
        string,
        { main?: boolean; extents?: Record<string, boolean> }
      > = {};

      for (const field of fields) {
        const fieldValueObj: Record<string, any> = // eslint-disable-line @typescript-eslint/no-explicit-any
          valuesForStep[field.name] || {};
        const fieldErrors: {
          main?: boolean;
          extents?: Record<string, boolean>;
        } = {};

        if (field.required && isFieldEmpty(fieldValueObj.value)) {
          fieldErrors.main = true;
        }

        if (field.extents && shouldShowExtents(field, fieldValueObj)) {
          const extentErrors: Record<string, boolean> = {};
          for (const extentField of field.extents) {
            if (
              extentField.required &&
              isFieldEmpty(fieldValueObj[extentField.name])
            ) {
              extentErrors[extentField.name] = true;
            }
          }
          if (Object.keys(extentErrors).length > 0) {
            fieldErrors.extents = extentErrors;
          }
        }

        if (fieldErrors.main || fieldErrors.extents) {
          invalidFields[field.name] = fieldErrors;
        }
      }
      return invalidFields;
    },
    [shiftAorId, template, formValues, allFieldsPerStep],
  );

  const sectionStatuses: { [aorId: string]: boolean[] } = useMemo(() => {
    const result: { [aorId: string]: boolean[] } = {};
    allShiftAors.forEach((aor) => {
      const aorId = aor._id;
      if (!formValues[aorId] || !formtemplates[aorId]) return;
      const template = formtemplates[aorId] as ShiftFormTemplateResponse;
      const stepKeys = template?.formTemplate
        ? Object.keys(template.formTemplate)
        : [];
      const allFieldsPerStep = stepKeys.map((stepKey) => {
        const section = template.formTemplate[stepKey];
        return (section.group || []).flatMap(
          (group: any) => group.fields || [], // eslint-disable-line @typescript-eslint/no-explicit-any
        );
      });
      result[aorId] = allFieldsPerStep.map((fields, sectionIndex) => {
        const valuesForStep = formValues[aorId]?.[sectionIndex] || {};
        for (const field of fields) {
          const fieldValueObj: Record<string, any> = // eslint-disable-line @typescript-eslint/no-explicit-any
            valuesForStep[field.name] || {};
          if (field.required && isFieldEmpty(fieldValueObj.value)) {
            return false;
          }
          if (field.extents && shouldShowExtents(field, fieldValueObj)) {
            for (const extentField of field.extents) {
              if (
                extentField.required &&
                isFieldEmpty(fieldValueObj[extentField.name])
              ) {
                return false;
              }
            }
          }
        }
        return true;
      });
    });
    return result;
  }, [allShiftAors, formValues, formtemplates]);

  const areRequiredFieldsFilled = useMemo(
    () => sectionStatuses[shiftAorId || ""]?.every(Boolean) || false,
    [sectionStatuses, shiftAorId],
  );

  const handleFormValueChange = useCallback(
    (fieldName: string, value: unknown) => {
      if (!shiftAorId || !template) return;

      hasEditedRef.current = true;
      setFormValues((prev) => {
        const prevValue = prev[shiftAorId]?.[step]?.[fieldName];
        if (JSON.stringify(prevValue) === JSON.stringify(value)) return prev;

        const updatedFormValues = { ...prev };
        if (!updatedFormValues[shiftAorId]) {
          updatedFormValues[shiftAorId] = {};
        }
        if (!updatedFormValues[shiftAorId][step]) {
          updatedFormValues[shiftAorId][step] = {};
        }
        updatedFormValues[shiftAorId][step][fieldName] = value;

        return updatedFormValues;
      });

      const stepKey = `${shiftAorId}-${step}`;
      if (fieldErrors[stepKey]?.[fieldName]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          if (newErrors[stepKey]?.[fieldName]) {
            const stepErrors = { ...newErrors[stepKey] };
            delete stepErrors[fieldName];
            if (Object.keys(stepErrors).length === 0) {
              delete newErrors[stepKey];
            } else {
              newErrors[stepKey] = stepErrors;
            }
          }
          return newErrors;
        });

        const hasAnyErrors = Object.values(fieldErrors).some(
          (stepErrors) => Object.keys(stepErrors).length > 0,
        );
        if (!hasAnyErrors) {
          setShowErrors(false);
        }
      }
    },
    [shiftAorId, step, fieldErrors, template],
  );

  const handleSaveForm = useCallback(async () => {
    if (!shiftAorId || !template) return;

    const allStepData = stepKeys.reduce(
      (acc, stepKey, idx) => {
        const group = formValues[shiftAorId]?.[idx] || {};
        acc[stepKey] = { group: cleanFormGroup(group) };
        return acc;
      },
      {} as Record<string, unknown>,
    );

    const response = {
      shiftAorId,
      formValues: { data: allStepData },
    };

    try {
      const result = await dispatch(
        saveShiftFormValues({ data: response, completed: true }),
      ).unwrap();
      const validation = result?.data?.validation;

      if (validation?.length > 0) {
        setValidationMessages(validation);
        setValidationModalOpen(true);
      } else {
        dispatch(
          showAlert({
            message: t("shiftChangeHeader.shiftFormSavedSuccessfully"),
            type: AlertType.Success,
          }),
        );
      }
    } catch {
      dispatch(
        showAlert({
          message: t("shiftChangeHeader.failedToSaveShiftFormValues"),
          type: AlertType.Error,
        }),
      );
    }
  }, [shiftAorId, template, formValues, dispatch, stepKeys, t]);

  const handleSetStep = useCallback(
    (newStep: number) => {
      if (!shiftAorId) return;

      const invalidFields = validateStep(step);
      const stepKey = `${shiftAorId}-${step}`;

      if (Object.keys(invalidFields).length > 0) {
        setFieldErrors((prev) => ({ ...prev, [stepKey]: invalidFields }));
        setShowErrors(true);
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[stepKey];
          return newErrors;
        });
      }

      setTabIndices((prev) => setTabIndexForAor(prev, shiftAorId, newStep));
    },
    [shiftAorId, step, validateStep],
  );

  const handleAorChange = useCallback(
    (newShiftAorId: string) => {
      if (newShiftAorId === shiftAorId || !shiftAorId) return;

      const invalidFields = validateStep(step);
      const stepKey = `${shiftAorId}-${step}`;

      if (Object.keys(invalidFields).length > 0) {
        setFieldErrors((prev) => ({ ...prev, [stepKey]: invalidFields }));
        setShowErrors(true);
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[stepKey];
          return newErrors;
        });
      }

      setShiftAorId(newShiftAorId);
      if (!tabIndices[newShiftAorId]) {
        setTabIndices((prev) => ({ ...prev, [newShiftAorId]: 0 }));
      }
    },
    [shiftAorId, step, tabIndices, validateStep],
  );

  useEffect(() => {
    if (!shiftAorId || !template || !hasEditedRef.current) return;

    const allStepData = stepKeys.reduce(
      (acc, stepKey, idx) => {
        const group = formValues[shiftAorId]?.[idx] || {};
        acc[stepKey] = { group: cleanFormGroup(group) };
        return acc;
      },
      {} as Record<string, unknown>,
    );

    const response = {
      shiftAorId,
      formValues: { data: allStepData },
    };

    const lastSaved = lastSavedFormValuesRef.current[shiftAorId]?.[step];
    const current = JSON.stringify(response.formValues.data);

    if (lastSaved !== current) {
      dispatch(saveShiftFormValues(response));
      lastSavedFormValuesRef.current[shiftAorId] = {
        ...lastSavedFormValuesRef.current[shiftAorId],
        [step]: current,
      };
    }
  }, [formValues, shiftAorId, step, template, dispatch, stepKeys]);

  if (allShiftAors.length === 0) {
    return (
      <ShiftChangeHeader
        onAorChange={() => {}}
        steps={[]}
        step={0}
        setStep={() => {}}
        title={undefined}
        description={undefined}
        currentAorId={undefined}
        onSaveForm={() => {}}
        disabledSaveButton={true}
        sectionStatuses={{}}
        noFormTemplate={false}
      />
    );
  }

  if (!shiftAorId) return null;

  return (
    <>
      <DynamicModal
        open={validationModalOpen}
        onClose={() => setValidationModalOpen(false)}
        title={t("shiftChangeHeader.modalTitle_2")}
      >
        <ul style={styles.validationMessage}>
          {validationMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </DynamicModal>

      <ShiftChangeHeader
        onAorChange={handleAorChange}
        steps={stepKeys
          .map((key) => ({
            label: formatStepKey(key),
            icon: (template?.formTemplate?.[key] as any)?.icon, // eslint-disable-line @typescript-eslint/no-explicit-any
            order: template?.formTemplate?.[key]?.order ?? 0,
          }))
          .sort((a, b) => a.order - b.order)}
        step={step}
        setStep={handleSetStep}
        title={template?.title}
        description={template?.description}
        currentAorId={shiftAorId}
        onSaveForm={handleSaveForm}
        disabledSaveButton={!areRequiredFieldsFilled}
        sectionStatuses={sectionStatuses}
        noFormTemplate={noFormTemplate && !loading}
      />

      <Box
        sx={{
          ...styles.message,
          opacity: loading ? 0.4 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {noFormTemplate && !loading ? (
          <div
            style={{
              padding: 32,
              textAlign: "center",
              color: "#888",
              fontSize: 18,
            }}
          >
            {t("shiftChangeHeader.noFormTemplate")}
          </div>
        ) : (
          <ShiftFormBuilder
            key={`${shiftAorId}-${step}-${template?.formTemplate ? Object.keys(template.formTemplate).length : 0}`}
            shiftAorId={shiftAorId}
            step={step}
            template={loading ? null : template}
            loading={false}
            showErrors={showErrors}
            fieldErrors={currentStepFieldErrors}
            initialFormValues={formValues[shiftAorId]?.[step] || {}}
            onFormValueChange={handleFormValueChange}
            shiftStartTime={shiftStartTime}
            shiftType={shiftType}
          />
        )}

        {loading && (
          <Box sx={styles.loader}>
            <Loader />
          </Box>
        )}
      </Box>
    </>
  );
};

export default ShiftChangeForm;
