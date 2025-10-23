import { SectionConfig } from "../../types/aorFormUi.types";

export const toCamelCase = (str: string): string =>
  str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");

export const generateUniqueName = (
  baseLabel: string,
  sections: SectionConfig[],
  skipFieldPath?: {
    sectionIdx: number;
    groupIdx: number;
    fieldIdx: number;
    extIdx?: number;
  },
) => {
  const baseName = toCamelCase(baseLabel) || "field";
  let uniqueName = baseName;
  let counter = 1;

  const nameExists = (name: string) =>
    sections.some((section, sIdx) =>
      section.group.some((group, gIdx) =>
        group.fields.some((field, fIdx) => {
          if (
            !(
              skipFieldPath &&
              skipFieldPath.sectionIdx === sIdx &&
              skipFieldPath.groupIdx === gIdx &&
              skipFieldPath.fieldIdx === fIdx
            )
          ) {
            if (field.name === name) return true;
          }

          if (field.extents) {
            return field.extents.some((ext, eIdx) => {
              if (
                !(
                  skipFieldPath &&
                  skipFieldPath.sectionIdx === sIdx &&
                  skipFieldPath.groupIdx === gIdx &&
                  skipFieldPath.fieldIdx === fIdx &&
                  skipFieldPath.extIdx === eIdx
                )
              ) {
                return ext.name === name;
              }
              return false;
            });
          }

          return false;
        }),
      ),
    );

  while (nameExists(uniqueName)) {
    uniqueName = `${baseName}${counter}`;
    counter += 1;
  }

  return uniqueName;
};
