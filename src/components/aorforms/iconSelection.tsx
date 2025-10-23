"use client";

import React from "react";
import * as MuiIcons from "@mui/icons-material";
import { Autocomplete, TextField, Box, Paper } from "@mui/material";
import { SectionConfig } from "@/src/types/aorFormUi.types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { formBuilderStyles } from "@/src/styles/aorForm.styles";

const iconNames = Object.keys(MuiIcons);

interface Props {
  sections: SectionConfig[];
  activeSection: number;
  updateSection: <K extends keyof SectionConfig>(
    index: number,
    key: K,
    value: SectionConfig[K],
  ) => void;
}

const SectionIconSelect: React.FC<Props> = ({
  sections,
  activeSection,
  updateSection,
}) => {
  const selectedIcon = sections[activeSection]?.icon || "";
  const { t } = useTranslation();

  const filterOptions = (options: string[], state: { inputValue: string }) =>
    options
      .filter((option) =>
        option.toLowerCase().includes(state.inputValue.toLowerCase()),
      )
      .slice(0, 50);

  return (
    <Box sx={{ p: 0, m: 0 }}>
      <label style={{ marginBottom: 4, display: "block", color: "#FFFFFF" }}>
        {t("aorForms.sectionIcon")}
      </label>
      <Autocomplete
        options={iconNames}
        value={selectedIcon}
        filterOptions={filterOptions}
        onChange={(_, newValue) => {
          updateSection(activeSection, "icon", newValue || "");
        }}
        getOptionLabel={(option) => option}
        PaperComponent={(props) => (
          <Paper {...props} sx={formBuilderStyles.dropdownMenuPaperStyle} />
        )}
        ListboxProps={{
          style: { maxHeight: 200, overflowY: "auto" },
        }}
        renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option) => {
          const IconComp = MuiIcons[option as keyof typeof MuiIcons];
          return (
            <Box
              component="li"
              {...props}
              sx={formBuilderStyles.dropdownOption}
            >
              {IconComp && <IconComp fontSize="small" htmlColor="#FFF" />}
              {option}
            </Box>
          );
        }}
        renderTags={(value: readonly string[]) =>
          value.map((val) => {
            const IconComp = MuiIcons[val as keyof typeof MuiIcons];
            return (
              <Box key={val} sx={formBuilderStyles.selectedTag}>
                {IconComp && <IconComp fontSize="small" htmlColor="#FFF" />}
                {val}
              </Box>
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={t("aorForms.selectSearch")}
            size="small"
            variant="outlined"
            sx={{
              ...formBuilderStyles.input,
              width: "100%",
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "auto !important",
                minHeight: "40px !important",
                paddingRight: "60px !important",
                paddingLeft: "12px !important",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                "& .MuiAutocomplete-input": {
                  padding: "0 !important",
                  height: "100% !important",
                  minHeight: "unset !important",
                  color: "#FFFFFF",
                },
                "& .MuiAutocomplete-endAdornment": {
                  right: "8px",
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
              "& .MuiInputBase-input": {
                padding: "0 !important",
                height: "100% !important",
                boxSizing: "border-box",
              },
              "& .MuiInputBase-root": {
                height: "auto !important",
                minHeight: "auto !important",
              },
              "& .MuiAutocomplete-clearIndicator": {
                color: "#FFFFFF",
                padding: "2px",
              },
              "& .MuiAutocomplete-popupIndicator": {
                color: "#FFFFFF",
                padding: "2px",
              },
            }}
          />
        )}
        sx={{
          ...formBuilderStyles.autoCompleteRoot,
          p: 0,
          m: 0,
          "& .MuiAutocomplete-inputRoot": {
            height: "auto !important",
            minHeight: "auto !important",
            padding: "0px 10px !important",
          },
        }}
        disableClearable={!selectedIcon}
      />
    </Box>
  );
};

export default SectionIconSelect;
