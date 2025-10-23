"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setViewMode } from "@/src/store/slices/documentSlice";
import { GRID_VIEW, LIST_VIEW } from "@/src/utils/constant";

export const useDocumentHydration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedViewMode = localStorage.getItem("documentViewMode");
    if (savedViewMode === GRID_VIEW || savedViewMode === LIST_VIEW) {
      dispatch(setViewMode(savedViewMode));
    }
  }, [dispatch]);
};
