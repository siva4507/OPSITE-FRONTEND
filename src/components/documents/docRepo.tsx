"use client";

import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import { documentStyles } from "@/src/styles/document.styles";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getUserFolders,
  deleteFolder,
  getUserFoldersSearch,
  clearSearchResults,
  setViewMode,
  resetSortToDefaults,
} from "@/src/store/slices/documentSlice";
import DynamicModal from "@/src/components/common/modal";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import DocumentGridView from "./components/gridView";
import DocumentListView from "./components/listView";
import { useTranslation } from "@/src/hooks/useTranslation";
import { GRID_VIEW, LIST_VIEW } from "@/src/utils/constant";
import { RenameFolder, Pagination } from "./components";

async function handleDownload(url: string, name: string) {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, "_blank");
  }
}

const DocumentRepoContent = forwardRef<
  { refetch: () => void },
  {
    parentId?: string;
    parentPathStack: { id: string; name: string; createdBy?: string }[];
    setParentPathStack: React.Dispatch<
      React.SetStateAction<{ id: string; name: string; createdBy?: string }[]>
    >;
    tab: number;
    setTab: React.Dispatch<React.SetStateAction<number>>;
    search: string;
    setSearch: (s: string) => void;
  }
>(
  (
    { parentId, parentPathStack, setParentPathStack, tab, search, setSearch },
    ref,
  ) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const {
      folders,
      loading,
      error,
      children,
      deleteLoading,
      deleteError,
      totalPages,
      total,
      searchResults,
      searchLoading,
      searchError,
      searchPage,
      searchTotalPages,
      viewMode,
      sortBy,
      sortOrder,
    } = useAppSelector((state) => state.documents);

    const [page, setPage] = React.useState(1);
    const [showChildren, setShowChildren] = React.useState(false);

    useEffect(() => {
      setShowChildren(parentPathStack.length > 0);
    }, [parentPathStack.length]);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
      null,
    );
    const [menuTargetId, setMenuTargetId] = React.useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [deleteTarget] = React.useState<{
      id: string;
      name: string;
    } | null>(null);
    const [renameModalOpen, setRenameModalOpen] = React.useState(false);
    const [renameTarget, setRenameTarget] = React.useState<{
      id: string;
      name: string;
    } | null>(null);

    const handleContainerClick = (
      id: string,
      type: string,
      name: string,
      createdBy?: string,
    ) => {
      dispatch(resetSortToDefaults());
      if (type === "folder") {
        setPage(1);
        dispatch(
          getUserFolders({ id, sortBy: "updatedAt", sortOrder: "desc" }),
        );
        const isAlreadyInPath = parentPathStack.some((item) => item.id === id);
        if (!isAlreadyInPath) {
          setParentPathStack([...parentPathStack, { id, name, createdBy }]);
        }

        setShowChildren(true);
        setSearch("");
      }
    };

    const handleBack = () => {
      dispatch(resetSortToDefaults());
      setParentPathStack((prev) => {
        if (prev.length === 0) return prev;
        const newStack = prev.slice(0, -1);
        const newParentId =
          newStack.length > 0 ? newStack[newStack.length - 1].id : undefined;
        setPage(1);
        const defaultSortBy = "updatedAt";
        const defaultSortOrder = "desc";

        if (tab === 1) {
          if (newParentId) {
            dispatch(
              getUserFolders({
                id: newParentId,
                sortBy: defaultSortBy,
                sortOrder: defaultSortOrder,
              }),
            );
          } else {
            dispatch(
              getUserFolders({
                recent: true,
                sortBy: defaultSortBy,
                sortOrder: defaultSortOrder,
              }),
            );
          }
        } else if (tab === 2) {
          if (newParentId) {
            dispatch(
              getUserFolders({
                id: newParentId,
                sortBy: defaultSortBy,
                sortOrder: defaultSortOrder,
              }),
            );
            setSearch("");
          } else {
            dispatch(
              getUserFoldersSearch({
                search,
                sortBy: defaultSortBy,
                sortOrder: defaultSortOrder,
              }),
            );
          }
        } else {
          if (newParentId) {
            dispatch(
              getUserFolders({
                id: newParentId,
                sortBy: defaultSortBy,
                sortOrder: defaultSortOrder,
              }),
            );
          } else {
            dispatch(
              getUserFolders({
                sortBy: defaultSortBy,
                sortOrder: defaultSortOrder,
              }),
            );
          }
        }

        setShowChildren(newStack.length > 0);
        return newStack;
      });
    };

    const handleMenuOpen = (
      event: React.MouseEvent<HTMLElement>,
      id: string,
    ) => {
      setMenuAnchorEl(event.currentTarget);
      setMenuTargetId(id);
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
      setMenuTargetId(null);
    };

    const handleSort = (
      sortByParam: string,
      sortOrderParam: "asc" | "desc",
    ) => {
      if (tab === 2) {
        if (search && search.trim().length > 0) {
          dispatch(
            getUserFoldersSearch({
              search,
              id: showChildren ? parentId : undefined,
              page: currentPage,
              sortBy: sortByParam,
              sortOrder: sortOrderParam,
            }),
          );
        } else {
          dispatch(
            getUserFolders({
              id: showChildren ? parentId : undefined,
              page: currentPage,
              sortBy: sortByParam,
              sortOrder: sortOrderParam,
            }),
          );
        }
      } else {
        dispatch(
          getUserFolders({
            id: showChildren ? parentId : undefined,
            page: currentPage,
            recent: tab === 1,
            sortBy: sortByParam,
            sortOrder: sortOrderParam,
          }),
        );
      }
    };

    const handleRename = (id: string, name: string) => {
      handleMenuClose();
      setRenameTarget({ id, name });
      setRenameModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
      if (deleteTarget) {
        try {
          await dispatch(deleteFolder(deleteTarget.id)).unwrap();
          setDeleteModalOpen(false);
          dispatch(
            showAlert({
              message: t("documentRepository.folderDeleted"),
              type: AlertType.Success,
            }),
          );
        } catch {
          dispatch(
            showAlert({
              message: t("documentRepository.folderDeletedError"),
              type: AlertType.Error,
            }),
          );
        }
      }
    };

    const refetch = () => {
      const commonParams: Record<string, unknown> = {
        sortBy: sortBy || "updatedAt",
        sortOrder: sortOrder || "desc",
      };

      if (page > 1) {
        commonParams.page = page;
      }

      if (tab === 2 && search?.trim()) {
        dispatch(getUserFoldersSearch({ search, ...commonParams }));
        return;
      }

      if (showChildren && parentId) {
        dispatch(getUserFolders({ id: parentId, ...commonParams }));
        return;
      }

      dispatch(getUserFolders(commonParams));
    };

    useImperativeHandle(ref, () => ({ refetch }));

    useEffect(() => {
      if (tab === 2) return;

      const commonParams: Record<string, unknown> = {
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      };

      if (page > 1) {
        commonParams.page = page;
      }

      if (showChildren && parentId) {
        dispatch(getUserFolders({ id: parentId, ...commonParams }));
      } else if (tab === 1) {
        dispatch(getUserFolders({ recent: true, ...commonParams }));
      } else {
        dispatch(getUserFolders(commonParams));
      }
    }, [dispatch, parentId, page, showChildren, tab]);

    useEffect(() => {
      if (tab === 2) {
        if (search && search.trim().length > 0) {
          const handler = setTimeout(() => {
            dispatch(
              getUserFoldersSearch({
                search,
                id: showChildren ? parentId : undefined,
                page,
                sortBy: sortBy || undefined,
                sortOrder: sortOrder || undefined,
              }),
            );
          }, 400);
          return () => clearTimeout(handler);
        } else {
          dispatch(clearSearchResults());
        }
      }
    }, [tab, search, showChildren, parentId, page, dispatch]);

    const getCurrentData = () => {
      if (tab === 2) {
        const hasSearchTerm = search && search.trim().length > 0;
        const items = hasSearchTerm
          ? searchResults || []
          : showChildren
            ? children || []
            : folders || [];
        const isLoading = hasSearchTerm
          ? searchLoading
          : showChildren
            ? loading
            : loading;
        const currentError = hasSearchTerm
          ? searchError
          : showChildren
            ? error
            : error;
        const currentPage = hasSearchTerm
          ? searchPage || 1
          : showChildren
            ? page
            : page;
        const totalPagesCount = hasSearchTerm
          ? searchTotalPages || 1
          : showChildren
            ? totalPages || 1
            : totalPages || 1;

        return {
          items,
          currentPage,
          totalPagesCount,
          total: total,
          isLoading,
          error: currentError,
        };
      } else {
        const items = showChildren ? children || [] : folders || [];
        return {
          items,
          currentPage: page,
          totalPagesCount: totalPages || 1,
          isLoading: loading,
          error,
        };
      }
    };

    const {
      items,
      currentPage,
      totalPagesCount,
      isLoading,
      error: currentError,
    } = getCurrentData();

    const showPagination = (() => {
      if (tab === 1) {
        return showChildren && (items.length > 9 || totalPagesCount > 1);
      }
      return items.length > 9 || totalPagesCount > 1;
    })();

    const getPageTitle = () => {
      if (tab === 1) {
        return t("documentRepository.recent");
      } else if (tab === 2) {
        return t("documentRepository.searchResults");
      } else {
        return t("documentRepository.root");
      }
    };

    const handlePageChange = (newPage: number) => {
      setPage(newPage);
      if (tab === 2) {
        dispatch(
          getUserFoldersSearch({
            search,
            id: showChildren ? parentId : undefined,
            page: newPage,
            sortBy: sortBy || undefined,
            sortOrder: sortOrder || undefined,
          }),
        );
      } else {
        dispatch(
          getUserFolders({
            id: showChildren ? parentId : undefined,
            page: newPage,
            recent: tab === 1,
            sortBy: sortBy || undefined,
            sortOrder: sortOrder || undefined,
          }),
        );
      }
    };

    const renderViewToggle = () => (
      <Box sx={documentStyles.viewToggleContainer}>
        <IconButton
          onClick={() => dispatch(setViewMode(LIST_VIEW))}
          sx={documentStyles.viewToggleButton(viewMode === LIST_VIEW)}
        >
          <ViewListIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => dispatch(setViewMode(GRID_VIEW))}
          sx={documentStyles.viewToggleButton(viewMode === GRID_VIEW)}
        >
          <GridViewIcon fontSize="small" />
        </IconButton>
      </Box>
    );

    const renderContentView = () => {
      if (items.length === 0) {
        return (
          <Box sx={documentStyles.noDataContainer}>
            {t("documentRepository.noDataFound")}
          </Box>
        );
      }

      const commonProps = {
        items,
        onContainerClick: handleContainerClick,
        menuAnchorEl,
        menuTargetId,
        onMenuOpen: handleMenuOpen,
        onMenuClose: handleMenuClose,
        onRename: handleRename,
        handleDownload,
        onSort: handleSort,
        loading: isLoading,
      };

      if (viewMode === GRID_VIEW) {
        return <DocumentGridView {...commonProps} isChildren={showChildren} />;
      } else {
        return <DocumentListView {...commonProps} />;
      }
    };

    const renderPagination = () => (
      <Pagination
        currentPage={currentPage}
        currentLimit={9}
        totalPages={totalPagesCount}
        totalCount={total}
        onPageChange={handlePageChange}
        showPagination={showPagination}
      />
    );

    const renderBackButton = () => {
      if (!showChildren) return null;

      return (
        <button onClick={handleBack} style={documentStyles.backButton}>
          {t("documentRepository.back")}
        </button>
      );
    };

    if (currentError) {
      return <Box sx={documentStyles.errorContainer}>{currentError}</Box>;
    }

    return (
      <>
        <Box sx={documentStyles.contentContainer}>
          <Box sx={documentStyles.headerContainers(showChildren)}>
            {showChildren ? (
              renderBackButton()
            ) : (
              <Typography variant="h6" sx={documentStyles.contentTitle}>
                {getPageTitle()}
              </Typography>
            )}
            {renderViewToggle()}
          </Box>

          <Box sx={documentStyles.contentScrollArea}>{renderContentView()}</Box>
          {renderPagination()}
        </Box>

        <DynamicModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title={
            deleteTarget
              ? `${t("documentRepository.delete")} "${deleteTarget.name}"`
              : t("documentRepository.delete")
          }
          actionLabel={t("documentRepository.delete")}
          onAction={handleDeleteConfirm}
          actionLoading={deleteLoading}
          cancelLabel={t("documentRepository.cancel")}
        >
          <Typography sx={documentStyles.modalTypography}>
            {deleteTarget
              ? `${t("documentRepository.deleteConfirm")} "${deleteTarget.name}"?`
              : t("documentRepository.deleteConfirm")}
          </Typography>
          {deleteError && (
            <Typography color="error" sx={documentStyles.errorTypography}>
              {deleteError}
            </Typography>
          )}
        </DynamicModal>

        <DynamicModal
          open={renameModalOpen}
          onClose={() => setRenameModalOpen(false)}
          title={
            renameTarget
              ? `${t("documentRepository.rename")} "${renameTarget.name}"`
              : t("documentRepository.rename")
          }
        >
          {renameTarget && (
            <RenameFolder
              id={renameTarget.id}
              name={renameTarget.name}
              onClose={() => setRenameModalOpen(false)}
              onSuccess={() => {
                setRenameModalOpen(false);
                if (tab === 2 && search && search.trim().length > 0) {
                  dispatch(
                    getUserFoldersSearch({
                      search,
                      id: showChildren ? parentId : undefined,
                      page,
                    }),
                  );
                }
              }}
              parentId={parentId}
              showChildren={showChildren}
              tab={tab}
              search={search}
              page={page}
            />
          )}
        </DynamicModal>
      </>
    );
  },
);

DocumentRepoContent.displayName = "DocumentRepoContent";

export default DocumentRepoContent;
