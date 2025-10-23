"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { passwordCriteriaStyles as styles } from "@/src/styles/auth.styles";
import { useTranslation } from "@/src/hooks/useTranslation";
import { PasswordProps } from "@/src/types/types";
import { SxProps, Theme } from "@mui/material";

const PasswordCriteria: React.FC<PasswordProps> = ({
  password = "",
  confirmPassword = "",
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [animatedItems, setAnimatedItems] = useState<boolean[]>([]);

  const conditions = [
    {
      label: `${t("passwordCondition.condition_1")}`,
      isValid: password.length >= 8,
    },
    {
      label: `${t("passwordCondition.condition_2")}`,
      isValid: password.length <= 16,
    },
    {
      label: `${t("passwordCondition.condition_3")}`,
      isValid: /[a-z]/.test(password),
    },
    {
      label: `${t("passwordCondition.condition_4")}`,
      isValid: /[A-Z]/.test(password),
    },
    {
      label: `${t("passwordCondition.condition_5")}`,
      isValid: /[0-9]/.test(password),
    },
    {
      label: `${t("passwordCondition.condition_6")}`,
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      label: `${t("passwordCondition.condition_7")}`,
      isValid: password !== "" && password === confirmPassword,
    },
  ];

  useEffect(() => {
    if (password.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [password]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedItems(conditions.map(() => true));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedItems(conditions.map(() => false));
    }
  }, [isVisible, conditions.length]);

  if (!isVisible) {
    return null;
  }

  return (
    <Box sx={isVisible ? styles.wrapper : styles.wrapperHidden}>
      {conditions.map((cond, index) => (
        <Box
          key={index}
          sx={
            {
              ...styles.item,
              ...(animatedItems[index] ? {} : styles.itemHidden),
              transitionDelay: `${index * 50}ms`,
            } as SxProps<Theme>
          }
        >
          <CircleIcon sx={styles.icon(cond.isValid)} />
          <Typography variant="body2" sx={styles.text(cond.isValid)}>
            {cond.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PasswordCriteria;

export function areAllPasswordConditionsMet(
  password: string,
  confirmPassword: string,
): boolean {
  return [
    password.length >= 8,
    password.length <= 16,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
    password !== "" && password === confirmPassword,
  ].every(Boolean);
}
