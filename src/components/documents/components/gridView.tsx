import React from "react";
import {
  Grid,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import { documentStyles } from "@/src/styles/document.styles";
import { FILE, FOLDER, imageUrls } from "@/src/utils/constant";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from "@/src/hooks/useTranslation";
import {
  DocumentGridViewProps,
  DocumentItem,
} from "@/src/types/document.types";
import CalendarIcon from "@/src/assets/calendar.svg";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { RBAC } from "@/src/utils/protectedElements";
import { UserRole } from "@/src/types/auth.types";
import LoadingSpinner from "../../common/loader";

function getDisplayName(name: string, type: string) {
  if (!name) return "";
  if (type === FOLDER) {
    return name.length > 12 ? `${name.substring(0, 12)}...` : name;
  } else {
    const ext = name.includes(".")
      ? name.substring(name.lastIndexOf(".") + 1)
      : "";
    const base = name.includes(".")
      ? name.substring(0, name.lastIndexOf("."))
      : name;
    if (base.length > 12) {
      return `${base.substring(0, 12)}...${ext || ""}`;
    } else {
      return name;
    }
  }
}

const DocumentGridView: React.FC<DocumentGridViewProps> = ({
  items,
  onContainerClick,
  menuAnchorEl,
  menuTargetId,
  onMenuOpen,
  onMenuClose,
  onRename,
  // onDelete,
  handleDownload,
  loading = false,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box sx={documentStyles.loadContainer}>
        <LoadingSpinner size={24} sx={{ color: "#FFF" }} />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {items.map((item: DocumentItem) => {
        if (!item || typeof item !== "object") return null;
        let modified = "";
        if (item.updatedAt) {
          const date = new Date(item.updatedAt);
          modified = `${t("documentRepository.modified")}: ${date.toLocaleDateString("en-US")}`;
        }
        let iconContent;
        if (item.type === "file") {
          const isImage = item.name
            ? /\.(png|jpg|jpeg|gif|webp)$/i.test(item.name)
            : false;

          const isAudio = item.name
            ? /\.(mp3|wav|ogg|m4a|aac)$/i.test(item.name)
            : false;

          const isVideo = item.name
            ? /\.(mp4|mov|avi|mkv|webm)$/i.test(item.name)
            : false;

          if (isImage) {
            iconContent = (
              <Image
                src={item.imageUrl || imageUrls.fileIcon}
                alt={item.name || "file"}
                width={58}
                height={58}
                style={{
                  ...documentStyles.fileIcon,
                  objectFit: "cover",
                  borderRadius: 4,
                  fontSize: "1px",
                  lineHeight: "1px",
                  textAlign: "center",
                }}
              />
            );
          } else if (isAudio) {
            iconContent = (
              <Box
                sx={{
                  backgroundColor: "#3b96e1",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 58,
                  height: 58,
                }}
              >
                <AudiotrackIcon sx={{ color: "#fff", fontSize: 32 }} />
              </Box>
            );
          } else if (isVideo) {
            iconContent = (
              <Box
                sx={{
                  backgroundColor: "#3b96e1",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 58,
                  height: 58,
                }}
              >
                <PlayArrowIcon sx={{ color: "#fff", fontSize: 32 }} />
              </Box>
            );
          } else if (item.name?.toLowerCase().endsWith(".pdf")) {
            iconContent = (
              <Image
                src={imageUrls.pdf}
                alt="pdf"
                width={58}
                height={58}
                style={documentStyles.fileIcon}
              />
            );
          } else {
            iconContent = (
              <Image
                src={imageUrls.fileIcon}
                alt="file"
                width={58}
                height={58}
                style={documentStyles.fileIcon}
              />
            );
          }
        } else {
          iconContent = (
            <Image
              src={imageUrls.files}
              alt="folder"
              width={58}
              height={58}
              style={documentStyles.folderIcon}
            />
          );
        }
        if (item.type === FILE) {
          return (
            <Grid key={item._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={documentStyles.fileCardHorizontal}>
                <Box sx={documentStyles.fileIconContainer}>{iconContent}</Box>
                <Box sx={documentStyles.fileCardInfo}>
                  <Box sx={documentStyles.fileCardHeader}>
                    <Typography sx={documentStyles.fileCardName}>
                      {getDisplayName(item.name, item.type)}
                    </Typography>
                    <Typography sx={documentStyles.fileCardType}>
                      {item.aorName || ""}
                    </Typography>
                  </Box>
                  <Box sx={documentStyles.fileCardDetails}>
                    {/* Date */}
                    <Box sx={documentStyles.fileCardDate}>
                      <span style={documentStyles.calendarIcon}>
                        <CalendarIcon />
                      </span>
                      <Typography sx={documentStyles.fileCardDateText}>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              },
                            )
                          : ""}
                      </Typography>
                    </Box>
                    {/* Created By */}
                    <Typography sx={documentStyles.fileCardCreatedBy}>
                      {item.createdBy
                        ? item.createdBy.length > 5
                          ? `${item.createdBy.charAt(0).toUpperCase()}${item.createdBy.slice(1, 5)}...`
                          : `${item.createdBy.charAt(0).toUpperCase()}${item.createdBy.slice(1)}`
                        : "-"}
                    </Typography>

                    {/* File Size */}
                    <Typography sx={documentStyles.fileCardSize}>
                      {item.folderSize || "-"}
                    </Typography>
                  </Box>

                  {/* Tags row */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {Array.isArray(item.tags) && item.tags.length > 0 ? (
                      <>
                        {item.tags
                          .slice(0, 2)
                          .map((tag: string, idx: number) => (
                            <span
                              key={tag + idx}
                              style={{ color: "#3D96E1", fontSize: "0.8em" }}
                            >
                              #{tag.length > 3 ? `${tag.slice(0, 3)}..` : tag}
                            </span>
                          ))}
                        {item.tags.length > 2 && (
                          <Tooltip
                            title={
                              <Box>
                                {item.tags
                                  .slice(2)
                                  .map((tag: string, idx: number) => (
                                    <div
                                      key={idx}
                                      style={{
                                        marginBottom: "2px",
                                        color: "#3D96E1",
                                      }}
                                    >
                                      #{tag}
                                    </div>
                                  ))}
                              </Box>
                            }
                          >
                            <span
                              style={
                                documentStyles.listTagMore as React.CSSProperties
                              }
                            >
                              +{item.tags.length - 2}
                            </span>
                          </Tooltip>
                        )}
                      </>
                    ) : (
                      <span style={{ color: "#A0A3BD" }}>-</span>
                    )}
                    <Box sx={{ mt: 0.5 }}>
                      <Typography sx={documentStyles.fileCardVersion}>
                        {item.__v || "1.0"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={documentStyles.fileCardDownloadBtnContainer}>
                  <IconButton
                    sx={documentStyles.fileCardDownloadBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.imageUrl) {
                        handleDownload(item.imageUrl, item.name);
                      }
                    }}
                  >
                    <Image
                      src={imageUrls.downloadFile}
                      alt="download"
                      width={54}
                      height={54}
                      style={documentStyles.fileCardDownloadIcon}
                    />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          );
        }
        return (
          <Grid key={item._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={documentStyles.fileContainer}
              onClick={() =>
                onContainerClick(item._id, item.type, item.name, item.createdBy)
              }
            >
              <Box sx={documentStyles.fileCardHeader}>
                {iconContent}
                <Box sx={documentStyles.fileCardNameContainer}>
                  <Typography sx={documentStyles.folderName}>
                    {getDisplayName(item.name, item.type)}
                  </Typography>
                  {item.type === "folder" &&
                    item.childrenCount !== undefined && (
                      <Typography sx={documentStyles.info}>
                        {item.childrenCount} {t("documentRepository.documents")}
                      </Typography>
                    )}
                  {modified && (
                    <Typography sx={documentStyles.info}>{modified}</Typography>
                  )}
                </Box>
                {item.type === "folder" ? (
                  <>
                    <RBAC
                      allowedRoles={[
                        UserRole.Administrator,
                        UserRole.ActiveController,
                      ]}
                    >
                      {item.createdBy !== "system" && (
                        <IconButton
                          sx={documentStyles.menuIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMenuOpen(e, item._id);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}

                      <Menu
                        anchorEl={menuAnchorEl}
                        open={menuTargetId === item._id}
                        onClose={onMenuClose}
                        PaperProps={{ sx: documentStyles.menu }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MenuItem
                          sx={documentStyles.menuItem}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRename(item._id, item.name);
                            onMenuClose();
                          }}
                        >
                          {t("documentRepository.rename")}
                        </MenuItem>
                        {/* <MenuItem
                        sx={documentStyles.menuItem}
                        onClick={e => {
                          e.stopPropagation();
                          onDelete(item._id, item.name);
                          onMenuClose();
                        }}
                      >
                        {t("documentRepository.delete")}
                      </MenuItem> */}
                      </Menu>
                    </RBAC>
                  </>
                ) : (
                  <Image
                    src={imageUrls.downloadFile}
                    alt="download"
                    width={58}
                    height={58}
                    style={documentStyles.fileCardDownloadIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.imageUrl) {
                        handleDownload(item.imageUrl, item.name);
                      }
                    }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DocumentGridView;
