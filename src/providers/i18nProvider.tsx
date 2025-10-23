"use client";

import React from "react";
import "@/src/utils/i18n";
import { I18nProviderProps } from "../types/types";

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => (
  <>{children}</>
);

export default I18nProvider;
