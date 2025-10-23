import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "@/src/hooks/useTranslation";
import { documentStyles } from "@/src/styles/document.styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentLimit: number;
  totalCount: number;
  onPageChange: (page: number, limit: number) => void;
  showPagination: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  currentLimit,
  totalCount,
  onPageChange,
  showPagination,
}) => {
  const { t } = useTranslation();

  if (!showPagination) return null;

  const generatePageList = () => {
    const pageList: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        pageList.push(pageNumber);
      }
    } else {
      pageList.push(1);
      let leftBoundary = Math.max(currentPage - 1, 2);
      let rightBoundary = Math.min(currentPage + 1, totalPages - 1);
      if (currentPage === 1) rightBoundary = 2;
      if (currentPage === 2) rightBoundary = 3;
      if (currentPage === totalPages) leftBoundary = totalPages - 1;
      if (currentPage === totalPages - 1) leftBoundary = totalPages - 2;
      if (leftBoundary > 2) pageList.push("ellipsis");
      for (
        let pageNumber = leftBoundary;
        pageNumber <= rightBoundary;
        pageNumber++
      ) {
        pageList.push(pageNumber);
      }
      if (rightBoundary < totalPages - 1) pageList.push("ellipsis");
      pageList.push(totalPages);
    }

    return pageList;
  };

  const pageList = generatePageList();

  const handlePageChange = (page: number) => {
    onPageChange(page, currentLimit);
  };

  const startItem = (currentPage - 1) * currentLimit + 1;
  const endItem = Math.min(currentPage * currentLimit, totalCount);

  return (
    <Box sx={documentStyles.paginationContainer}>
      <Typography sx={documentStyles.paginationText}>
        {t("documentRepository.showing")} {startItem}-{endItem}{" "}
        {t("documentRepository.of")} {totalCount}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box
          component="button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          sx={documentStyles.paginationButton}
        >
          <ChevronLeftIcon fontSize="small" />
        </Box>

        {pageList.map((pageItem, index) => (
          <React.Fragment key={index}>
            {pageItem === "ellipsis" ? (
              <Box
                sx={{
                  ...documentStyles.paginationButton,
                  color: "#A0A3BD",
                  cursor: "default",
                }}
              >
                <MoreHorizIcon fontSize="small" />
              </Box>
            ) : (
              <Box
                component="button"
                onClick={() => handlePageChange(pageItem as number)}
                sx={{
                  ...documentStyles.paginationButton,
                  background:
                    currentPage === pageItem ? "#3D96E1" : "transparent",
                  color: currentPage === pageItem ? "#fff" : "#A0A3BD",
                  border:
                    currentPage === pageItem
                      ? "1px solid #3D96E1"
                      : "1px solid #A0A3BD",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      currentPage === pageItem ? "#3D96E1" : "#808181ff",
                    color: currentPage === pageItem ? "#fff" : "#f5f7f8ff",
                  },
                }}
              >
                {pageItem}
              </Box>
            )}
          </React.Fragment>
        ))}

        <Box
          component="button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          sx={documentStyles.paginationButton}
        >
          <ChevronRightIcon fontSize="small" />
        </Box>
      </Box>
    </Box>
  );
};

export default Pagination;
