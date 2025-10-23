"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import DocumentRepoHeader from "./docRepoHeader";
import DocumentRepoContent from "./docRepo";
import { Box } from "@mui/material";
import { documentStyles } from "@/src/styles/document.styles";
import { useAppSelector } from "@/src/hooks/redux";

const DocumentRepository: React.FC = () => {
  const contentRef = useRef<{ refetch: () => void }>(null);
  const [parentPathStack, setParentPathStack] = useState<
    { id: string; name: string; createdBy?: string }[]
  >([]);
  const parentId =
    parentPathStack.length > 0
      ? parentPathStack[parentPathStack.length - 1].id
      : undefined;
  const [tab, setTab] = useState(0);
  const [previousTab, setPreviousTab] = useState(0);
  const [search, setSearch] = useState("");

  const folders = useAppSelector((state) => state.documents.folders) || [];
  const children = useAppSelector((state) => state.documents.children) || null;

  useEffect(() => {
    if (tab !== previousTab) {
      setParentPathStack([]);
      setPreviousTab(tab);
      if (previousTab === 2 && tab !== 2) {
        setSearch("");
      }
    }
  }, [tab, previousTab]);

  const handleFolderCreated = useCallback(() => {
    contentRef.current?.refetch();
  }, []);

  const handleBreadcrumbNavigate = useCallback(() => {
    setTimeout(() => {
      contentRef.current?.refetch();
    }, 0);
  }, []);

  return (
    <Box id="main-card" sx={documentStyles.container}>
      <DocumentRepoHeader
        onFolderCreated={handleFolderCreated}
        parentId={parentId}
        parentPathStack={parentPathStack}
        folders={folders || []}
        child={children || null}
        tab={tab}
        setTab={setTab}
        search={search}
        setSearch={setSearch}
        setParentPathStack={setParentPathStack}
        onBreadcrumbNavigate={handleBreadcrumbNavigate}
      />
      <DocumentRepoContent
        key={`${tab}-${parentPathStack.length}`}
        ref={contentRef}
        parentId={parentId}
        setParentPathStack={setParentPathStack}
        parentPathStack={parentPathStack}
        tab={tab}
        setTab={setTab}
        search={search}
        setSearch={setSearch}
      />
    </Box>
  );
};

export default DocumentRepository;
