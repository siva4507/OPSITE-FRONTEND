"use client";

import React from "react";
import { Box, Typography, Button, InputBase } from "@mui/material";
import Image from "next/image";
import { imageUrls } from "@/src/utils/constant";
import { documentStyles } from "@/src/styles/document.styles";
import { DocumentRepoHeaderProps } from "@/src/types/document.types";
import { useTranslation } from "@/src/hooks/useTranslation";
import SearchIcon from "@mui/icons-material/Search";
import { DOC_TABS } from "@/src/utils/config";
import { CreateFolder, UploadFile } from "./components";
import DynamicModal from "@/src/components/common/modal";
import { RBAC } from "@/src/utils/protectedElements";
import { UserRole } from "@/src/types/auth.types";

interface DocumentRepoHeaderWithTabProps extends DocumentRepoHeaderProps {
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
  search: string;
  setSearch: (s: string) => void;
  setParentPathStack: React.Dispatch<
    React.SetStateAction<{ id: string; name: string; createdBy?: string }[]>
  >;
  onBreadcrumbNavigate?: (parentId?: string) => void;
}

const tabLabels = DOC_TABS;

const DocumentRepoHeader: React.FC<DocumentRepoHeaderWithTabProps> = ({
  onFolderCreated,
  parentId,
  parentPathStack,
  tab,
  setTab,
  search,
  setSearch,
  setParentPathStack,
  onBreadcrumbNavigate,
}) => {
  const { t } = useTranslation();

  const [isCreateFolderOpen, setIsCreateFolderOpen] = React.useState(false);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  const handleOpenCreateFolder = () => {
    setIsCreateFolderOpen(true);
  };

  const handleOpenUpload = () => {
    setIsUploadOpen(true);
  };

  const breadcrumb =
    tab === 2
      ? [{ id: undefined, name: "Search" }, ...parentPathStack]
      : [{ id: undefined, name: "Root" }, ...parentPathStack];

  const handleBreadcrumbClick = (clickedIndex: number) => {
    if (clickedIndex === 0) {
      setParentPathStack([]);
      onBreadcrumbNavigate?.(undefined);
    } else {
      const newPathStack = parentPathStack.slice(0, clickedIndex);
      setParentPathStack(newPathStack);
      const clickedItem = parentPathStack[clickedIndex - 1];
      onBreadcrumbNavigate?.(clickedItem?.id);
    }
  };

  const isSystemFolder =
    parentPathStack.length > 0 &&
    parentPathStack[parentPathStack.length - 1]?.createdBy === "system";

  return (
    <>
      <Box sx={documentStyles.headerContainer}>
        <Box sx={documentStyles.titleContainer}>
          <Typography variant="h6" sx={documentStyles.title}>
            {t("documentRepository.documentRepository")}
          </Typography>
          <RBAC
            allowedRoles={[UserRole.Administrator, UserRole.ActiveController]}
          >
            {!isSystemFolder && (
              <Box sx={documentStyles.buttonContainer}>
                <Button
                  variant="outlined"
                  startIcon={
                    <Image
                      src={imageUrls.addFolder}
                      alt="adFolder"
                      width={24}
                      height={24}
                    />
                  }
                  sx={documentStyles.button}
                  onClick={handleOpenCreateFolder}
                >
                  {t("documentRepository.newFolder")}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={
                    <Image
                      src={imageUrls.esign}
                      alt="esign"
                      width={24}
                      height={24}
                    />
                  }
                  sx={documentStyles.button}
                  onClick={handleOpenUpload}
                >
                  {t("documentRepository.upload")}
                </Button>
              </Box>
            )}
          </RBAC>
        </Box>
        <Box sx={documentStyles.docheaderContainer}>
          <Box sx={documentStyles.leftSection}>
            <Box sx={documentStyles.tabContainer}>
              {tabLabels.map((label, idx) => (
                <Box
                  key={label}
                  onClick={() => setTab(idx)}
                  sx={{
                    ...documentStyles.tab,
                    background:
                      tab === idx ? "rgba(255,255,255,0.08)" : "transparent",
                    borderRight:
                      idx < tabLabels.length - 1 ? "2px solid #fff" : "none",
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                ...documentStyles.breadcrumbConteiner,
                visibility: tab === 2 ? "visible" : "hidden",
                opacity: tab === 2 ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <SearchIcon sx={documentStyles.searchIcon} />
                <InputBase
                  placeholder={t("documentRepository.searchPlaceholder")}
                  sx={documentStyles.inputBase}
                  inputProps={{ "aria-label": "search documents" }}
                  value={search}
                  type="text"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
            </Box>
          </Box>
          <Box sx={documentStyles.breadcrumbContent}>
            <Typography variant="subtitle1" sx={documentStyles.breadcrumbItem}>
              {breadcrumb.map((item, idx) => (
                <span
                  key={item.id || "root"}
                  onClick={() => handleBreadcrumbClick(idx)}
                  style={{
                    cursor: "pointer",
                    color:
                      idx === breadcrumb.length - 1 ? "#A0A3BD" : "#3D96E1",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (idx !== breadcrumb.length - 1) {
                      e.currentTarget.style.color = "#5BA3E8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (idx !== breadcrumb.length - 1) {
                      e.currentTarget.style.color = "#3D96E1";
                    }
                  }}
                >
                  {item.name}
                  {idx < breadcrumb.length - 1 && " / "}
                </span>
              ))}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DynamicModal
        open={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        title={t("documentRepository.createNewFolder")}
      >
        <CreateFolder
          parentId={parentId}
          onSuccess={onFolderCreated}
          onClose={() => setIsCreateFolderOpen(false)}
        />
      </DynamicModal>

      <DynamicModal
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title={t("documentRepository.uploadFile")}
      >
        <UploadFile
          open={isUploadOpen}
          parentId={parentId}
          onSuccess={onFolderCreated}
          onClose={() => setIsUploadOpen(false)}
        />
      </DynamicModal>
    </>
  );
};

export default DocumentRepoHeader;
