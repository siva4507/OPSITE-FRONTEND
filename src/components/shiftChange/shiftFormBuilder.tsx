import React from "react";
import { FormValuesProvider, FormBuilder } from "../form";
import {
  ShiftFormTemplateResponse,
  ShiftFormSection,
  ShiftFormGroup,
} from "@/src/dto/shiftChange.dto";
import { ShiftChangeDynamicFormProps } from "@/src/types/shiftChange.types";
import Loader from "@/src/components/common/loader";

interface ShiftFormBuilderProps
  extends Omit<ShiftChangeDynamicFormProps, "aorId"> {
  shiftAorId: string;
  shiftStartTime?: string;
  shiftType?: string;
}

const getSectionsFromTemplate = (
  template: ShiftFormTemplateResponse | null,
) => {
  if (!template || !template.formTemplate) return [];
  return Object.entries(template.formTemplate)
    .map(([key, section]: [string, ShiftFormSection]) => ({
      key,
      order: section.order,
      title: section.title || key,
      description: section.description,
      fields: (section.group || []).flatMap(
        (group: ShiftFormGroup) => group.fields || [],
      ),
      groups: section.group || [],
    }))
    .sort(
      (sectionA, sectionB) => (sectionA.order ?? 0) - (sectionB.order ?? 0),
    );
};

const ShiftFormBuilder: React.FC<ShiftFormBuilderProps> = ({
  shiftAorId,
  step,
  template,
  loading,
  showErrors = false,
  fieldErrors = {},
  initialFormValues,
  onFormValueChange,
  shiftStartTime,
  shiftType,
}) => {
  const sections = React.useMemo(
    () => getSectionsFromTemplate(template),
    [template],
  );
  const currentSection = React.useMemo(
    () => sections[step] || null,
    [sections, step],
  );
  const formKey = React.useMemo(
    () => `${shiftAorId}-${step}`,
    [shiftAorId, step],
  );

  if (loading) {
    return <Loader center />;
  }

  if (!template || !currentSection) {
    return null;
  }

  return (
    <FormValuesProvider
      key={formKey}
      initialValues={initialFormValues}
      onValueChange={onFormValueChange}
    >
      <FormBuilder
        fields={currentSection.fields || []}
        title={currentSection.title}
        description={currentSection.description}
        groups={currentSection.groups || []}
        showErrors={showErrors}
        fieldErrors={fieldErrors}
        onFormValueChange={onFormValueChange}
        shiftStartTime={shiftStartTime}
        shiftType={shiftType}
      />
    </FormValuesProvider>
  );
};

export default React.memo(ShiftFormBuilder);
