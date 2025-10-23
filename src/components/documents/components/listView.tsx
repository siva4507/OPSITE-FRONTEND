import React, { useMemo } from "react";
import { Box, Tooltip } from "@mui/material";
import Image from "next/image";
import { documentStyles } from "@/src/styles/document.styles";
import {
  FOLDER,
  FILE,
  imageUrls,
  DESCENDING,
  ASCENDING,
} from "@/src/utils/constant";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppSelector } from "@/src/hooks/redux";
import { DocumentListViewProps, DocumentRow } from "@/src/types/document.types";
import LoadingSpinner from "@/src/components/common/loader";
import DynamicTable from "@/src/components/common/dataTable";
import { HeaderConfig, ActionConfig } from "@/src/types/types";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { tableStyles } from "@/src/styles/table.styles";
import { formatDate } from "@/src/utils/config";

function getDisplayName(name: string, type: string) {
  if (!name) return "";

  if (type === FOLDER) {
    return name.length > 8 ? `${name.substring(0, 8)}...` : name;
  } else {
    const ext = name.includes(".")
      ? name.substring(name.lastIndexOf(".") + 1)
      : "";
    const base = name.includes(".")
      ? name.substring(0, name.lastIndexOf("."))
      : name;

    const isNumericOnly = /^\d+$/.test(base);
    if (isNumericOnly || base.length > 12) {
      return `${base.substring(0, 6)}..${ext ? `.${ext}` : ""}`;
    } else {
      return name;
    }
  }
}

const DocumentListView: React.FC<DocumentListViewProps> = ({
  items,
  onContainerClick,
  onMenuClose,
  onRename,
  handleDownload,
  onSort,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { sortBy, sortOrder } = useAppSelector((state) => state.documents);
  const handleSort = (field: string) => {
    const newSortDirection =
      sortBy === field && sortOrder === DESCENDING ? ASCENDING : DESCENDING;
    onSort?.(field, newSortDirection);
  };

  const headers: HeaderConfig<DocumentRow>[] = useMemo(
    () => [
      {
        label: t("documentRepository.category"),
        field: "name",
        sortable: true,
        render: (row) => {
          if (!row) return null;

          const isImage = row.name
            ? /\.(png|jpg|jpeg|gif|webp)$/i.test(row.name)
            : false;

          const isAudio = row.name
            ? /\.(mp3|wav|ogg|m4a|aac)$/i.test(row.name)
            : false;

          const isVideo = row.name
            ? /\.(mp4|mov|avi|mkv|webm)$/i.test(row.name)
            : false;

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {row.type === FILE ? (
                isImage ? (
                  <Image
                    src={row.imageUrl || imageUrls.fileIcon}
                    alt={row.name || "image"}
                    width={24}
                    height={24}
                    style={{
                      objectFit: "cover",
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  />
                ) : isAudio ? (
                  <Box
                    sx={{
                      backgroundColor: "#3b96e1",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 30,
                      flexShrink: 0,
                    }}
                  >
                    <AudiotrackIcon sx={{ color: "#fff", fontSize: 20 }} />
                  </Box>
                ) : isVideo ? (
                  <Box
                    sx={{
                      backgroundColor: "#3b96e1",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 30,
                      flexShrink: 0,
                    }}
                  >
                    <PlayArrowIcon sx={{ color: "#fff", fontSize: 20 }} />
                  </Box>
                ) : row.name?.toLowerCase().endsWith(".pdf") ? (
                  <Image
                    src={imageUrls.pdf}
                    alt="pdf"
                    width={32}
                    height={32}
                    style={{ flexShrink: 0 }}
                  />
                ) : (
                  <Image
                    src={imageUrls.fileIcon}
                    alt="file"
                    width={32}
                    height={32}
                    style={{ flexShrink: 0 }}
                  />
                )
              ) : (
                <Image
                  src={imageUrls.files}
                  alt="folder"
                  width={32}
                  height={32}
                  style={{ flexShrink: 0 }}
                />
              )}
              <Tooltip title={row.name || ""}>
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                  }}
                >
                  {row.name || ""}
                </span>
              </Tooltip>
            </Box>
          );
        },
      },
      {
        label: t("documentRepository.Document"),
        field: "childrenCount",
        sortable: true,
      },
      {
        label: t("documentRepository.fileSize"),
        field: "folderSize",
        sortable: true,
      },
      {
        label: t("documentRepository.aor"),
        field: "aorName",
        sortable: true,
      },
      {
        label: t("documentRepository.lastModified"),
        field: "updatedAt",
        sortable: true,
        render: (row) => formatDate(row?.updatedAt),
      },
      {
        label: t("documentRepository.createdBy"),
        field: "createdBy",
        sortable: true,
        render: (row) =>
          row?.createdBy
            ? row.createdBy.charAt(0).toUpperCase() + row.createdBy.slice(1)
            : "-",
      },
      {
        label: t("documentRepository.tags"),
        field: "tags",
        renderType: "tags",
      },
      {
        label: t("documentRepository.currentVersion"),
        field: "__v",
      },
    ],
    [t],
  );

  const actions: ActionConfig<DocumentRow>[] = useMemo(
    () => [
      {
        icon: (
          <Image src={imageUrls.rename} alt="rename" width={24} height={24} />
        ),
        tooltip: t("documentRepository.rename"),
        onClick: (row) => {
          onRename(row._id, row.name);
          onMenuClose();
        },
        show: (row) => row?.type === FOLDER && row?.createdBy !== "system",
      },
      {
        icon: (
          <Image
            src={imageUrls.download}
            alt="download"
            width={24}
            height={24}
            style={documentStyles.downloadIcon}
          />
        ),
        tooltip: t("documentRepository.download"),
        onClick: (row) => {
          if (row.imageUrl) handleDownload(row.imageUrl, row.name);
        },
        show: (row) => row?.type !== FOLDER,
      },
    ],
    [onRename, onMenuClose, handleDownload],
  );

  if (loading) {
    return (
      <Box sx={documentStyles.loadContainer}>
        <LoadingSpinner size={24} sx={{ color: "#FFF" }} />
      </Box>
    );
  }

  return (
    <DynamicTable<DocumentRow>
      headers={headers}
      rows={items as DocumentRow[]}
      sortBy={sortBy ?? undefined}
      sortOrder={sortOrder ?? undefined}
      onSort={handleSort}
      actions={actions}
      styles={tableStyles}
      noDataMessage={t("documentRepository.noDataFound")}
      onRowClick={(row) => {
        if (row.type === FOLDER) {
          onContainerClick(row._id, row.type, row.name, row.createdBy);
        }
      }}
    />
  );
};

export default DocumentListView;
