import React, { useEffect, useState } from "react";
import {
  Chip,
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Box,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { DynamicTableProps } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { tableStyles, getStatusColor } from "@/src/styles/table.styles";
import ExcelJS from "exceljs";

function DynamicTable<T extends Record<string, unknown>>({
  headers,
  rows,
  onSort,
  actions,
  noDataMessage = "No data found",
  styles = {},
  onRowClick,
  onExport,
  loading = false,
}: DynamicTableProps<T>) {
  const { t } = useTranslation();

  // Column width state
  const [columnWidths, setColumnWidths] = useState<
    Record<string, number | string>
  >({});
  const [resizing, setResizing] = useState<{
    field: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  useEffect(() => {
    if (Object.keys(columnWidths).length === 0) {
      const initialWidths: Record<string, number> = {};
      const numColumns =
        headers.length + (actions && actions.length > 0 ? 1 : 0);
      const defaultWidth = `${100 / numColumns}%`;

      headers.forEach((header) => {
        initialWidths[header.field] = defaultWidth as any;
      });
      setColumnWidths(initialWidths);
    }
  }, [headers, actions]);

  const exportToCSV = () => {
    if (!rows || rows.length === 0) {
      throw new Error(t("common.dataNotAvailable"));
    }

    const csvContent = [
      headers.map((header) => `"${header.label}"`).join(","),
      ...rows.filter(Boolean).map((row) =>
        headers
          .map((header) => {
            let value: unknown;

            if (header.exportValue) {
              value = header.exportValue(row);
            } else if (header.render) {
              const rendered = header.render(row);
              if (typeof rendered === "object" && rendered !== null) {
                value = rendered.toString();
              } else {
                value = rendered;
              }
            } else {
              value = row?.[header.field];
            }

            if (header.renderType === "tags" && Array.isArray(value)) {
              value = value
                .filter((tag) => tag && tag.trim() !== "-")
                .join(", ");
            }

            if (value === null || value === undefined) {
              value = "";
            }

            const stringValue = String(value).replace(/"/g, '""');
            return `"${stringValue}"`;
          })
          .join(","),
      ),
    ].join("\n");

    if (csvContent.length === 0) {
      throw new Error(t("common.failedToGenerate"));
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `electronic_log_export_${timestamp}.csv`;

    saveAs(blob, filename);
    return { success: true, message: t("common.exportSuccess") };
  };


  const exportToExcel = async () => {
    if (!rows || rows.length === 0) {
      throw new Error(t("common.dataNotAvailable"));
    }

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(t("common.logData"));

    // Add headers
    worksheet.columns = headers.map((header) => ({
      header: header.label,
      key: header.field,
      width: 20,
    }));

    // Add data rows
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const rowData: any = {};

      headers.forEach((header) => {
        let value: unknown;

        if (header.exportValue) {
          value = header.exportValue(row);
        } else if (header.render) {
          const rendered = header.render(row);
          value =
            typeof rendered === "object" && rendered !== null
              ? rendered.toString()
              : rendered;
        } else {
          value = row?.[header.field];
        }

        if (header.renderType === "tags" && Array.isArray(value)) {
          value = value.filter((tag) => tag && tag.trim() !== "-").join(", ");
        }

        if (value === null || value === undefined) {
          value = "";
        }

        rowData[header.field] = value;
      });

      const excelRow = worksheet.addRow(rowData);

      // Check if row has fileUrls and add images
      const fileUrls = (row as any).fileUrls;
      if (Array.isArray(fileUrls) && fileUrls.length > 0) {
        const imageUrl = fileUrls[0];

        try {
          // Fetch the image
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();

          // Determine image extension
          const extension = imageUrl.split(".").pop()?.toLowerCase() || "png";

          // Add image to workbook
          // Determine image extension
          let ext = (imageUrl.split(".").pop() || "png").toLowerCase();
          if (ext === "jpg") ext = "jpeg"; // convert 'jpg' to 'jpeg'

          // Add image to workbook
          const imageId = workbook.addImage({
            buffer: arrayBuffer,
            extension: ext as "png" | "jpeg" | "gif",
          });

          // Insert image in a specific column (e.g., last column)
          // Adjust column index as needed
          worksheet.addImage(imageId, {
            tl: { col: headers.length, row: rowIndex + 1 }, // +1 for header row
            ext: { width: 100, height: 100 },
          });

          // Adjust row height to fit image
          excelRow.height = 75;
        } catch (error) {
          console.error("Failed to add image:", error);
          // Continue without image if fetch fails
        }
      }
    }

    // Adjust column width for image column
    worksheet.getColumn(headers.length + 1).width = 15;

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `electronic_log_export_${timestamp}.xlsx`;

    saveAs(blob, filename);

    return { success: true, message: t("common.exportSuccess") };
  };

  useEffect(() => {
    if (onExport) {
      onExport((exportType: "csv" | "xlsx" = "csv") => {
        if (exportType === "xlsx") {
          return exportToExcel();
        } else {
          return exportToCSV();
        }
      });
    }
  }, [rows, headers, onExport]);


  const handleMouseDown = (field: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const tableElement = e.currentTarget.closest("table") as HTMLElement;
    if (tableElement) {
      const newWidths: Record<string, number> = {};
      headers.forEach((header) => {
        const headerCell = tableElement.querySelector(
          `th[data-field="${header.field}"]`,
        ) as HTMLElement;
        if (headerCell) {
          newWidths[header.field] = headerCell.offsetWidth;
        }
      });
      setColumnWidths(newWidths);
    }

    const currentWidth = columnWidths[field];
    const startWidth =
      typeof currentWidth === "string"
        ? (e.currentTarget.parentElement as HTMLElement)?.offsetWidth || 150
        : currentWidth || 150;

    setResizing({
      field,
      startX: e.pageX,
      startWidth: startWidth,
    });
  };

  const calculateMinWidth = (text: string) => {
    const charWidth = 8;
    const padding = 40;
    return Math.max(80, text.length * charWidth + padding);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizing) return;
    const diff = e.pageX - resizing.startX;
    const header = headers.find((h) => h.field === resizing.field);
    const minWidth = header ? calculateMinWidth(header.label) : 80;
    const newWidth = Math.max(
      minWidth,
      Math.min(500, resizing.startWidth + diff),
    );
    setColumnWidths((prev) => ({
      ...prev,
      [resizing.field]: newWidth,
    }));
  };

  const handleMouseUp = () => {
    setResizing(null);
  };

  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [resizing]);

  const getSortIcon = (field: string) => {
    if (!onSort) return null;
    return (
      <SwapVertIcon
        fontSize="small"
        sx={{ color: "#FFF" }}
        onClick={(e) => {
          e.stopPropagation();
          onSort(field);
        }}
      />
    );
  };

  const renderTags = (tags?: string[]) => {
    const validTags = tags?.filter((tag) => tag.trim() !== "-") || [];
    if (validTags.length === 0) return null;

    return (
      <>
        {validTags.slice(0, 2).map((tag) => (
          <Chip
            key={tag}
            size="small"
            sx={{
              ...styles.tagChip,
              height: "24px",
              maxHeight: "24px",
            }}
            label={
              <Box
                sx={{
                  maxWidth: 30,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {tag}
              </Box>
            }
          />
        ))}
        {validTags.length > 2 && (
          <Tooltip
            title={
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                {validTags.slice(2).map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={tag}
                    size="small"
                    sx={{ color: "#FFF" }}
                  />
                ))}
              </Box>
            }
          >
            <Chip
              label={`+${validTags.length - 2}`}
              size="small"
              sx={{
                ...styles.tagChip,
                height: "24px",
                maxHeight: "24px",
              }}
            />
          </Tooltip>
        )}
      </>
    );
  };

  const CellWithTooltip: React.FC<{
    value: unknown;
    maxLength?: number;
    columnWidth: number | string; // Update type here
  }> = ({ value, maxLength = 12, columnWidth }) => {
    const stringValue = String(value ?? "-");
    const displayValue = stringValue;

    const [open, setOpen] = useState(false);

    useEffect(() => {
      const handleScroll = () => setOpen(false);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
      };
    }, []);

    const needsTooltip = stringValue.length > 0 && stringValue !== "-";

    return (
      <Tooltip
        title={needsTooltip ? stringValue : ""}
        open={open}
        disableHoverListener
        disableFocusListener
        disableTouchListener
      >
        <span
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          style={{
            cursor: "default",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: "1.2",
          }}
        >
          {displayValue}
        </span>
      </Tooltip>
    );
  };

  const safeRows = (rows ?? []).filter((row): row is T => row != null);

  return (
    <TableContainer component={Paper} sx={styles.contentTableContainer}>
      <Table
        sx={{
          ...styles.contentTable,
          tableLayout: Object.values(columnWidths).some(
            (w) => typeof w === "number",
          )
            ? "auto"
            : "fixed",
        }}
      >
        <TableHead>
          <TableRow sx={styles.tableHeaderRow}>
            {headers.map((header) => {
              const sortField = header.sortKey || header.field;
              const width = columnWidths[header.field] || 150;

              return (
                <TableCell
                  key={header.field}
                  data-field={header.field}
                  sx={{
                    ...styles.tableHeaderCell,
                    width: width,
                    minWidth: width,
                    maxWidth: width,
                    position: "relative",
                    userSelect: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      cursor: header.sortable ? "pointer" : "default",
                    }}
                    onClick={
                      header.sortable
                        ? () => onSort && onSort(sortField)
                        : undefined
                    }
                  >
                    {header.label}
                    {header.sortable && getSortIcon(sortField)}
                  </Box>
                  <Box
                    onMouseDown={(e) => handleMouseDown(header.field, e)}
                    sx={{
                      ...styles.columnResizeHandle,
                      ...(resizing?.field === header.field &&
                        styles.columnResizeHandleActive),
                    }}
                  />
                </TableCell>
              );
            })}
            {actions && actions.length > 0 && (
              <TableCell sx={styles.tableHeaderCell}>
                {t("common.actions")}
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={headers.length + (actions ? 1 : 0)}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 1,
                  }}
                >
                  <CircularProgress size={28} />
                </Box>
              </TableCell>
            </TableRow>
          ) : safeRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={headers.length + (actions ? 1 : 0)}
                sx={{ textAlign: "center", py: 3, color: "#FFF" }}
              >
                {noDataMessage}
              </TableCell>
            </TableRow>
          ) : (
            safeRows.map((row, rowIndex) => (
              <TableRow
                key={(row as { _id?: string })?._id ?? rowIndex}
                sx={styles.tableBodyRow}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {headers.map((header) => {
                  const width = columnWidths[header.field] || 150;

                  return (
                    <TableCell
                      key={header.field}
                      sx={{
                        ...styles.tableBodyCell,
                        width: width,
                        minWidth: width,
                        maxWidth: width,
                        verticalAlign: "middle",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                          overflow: "hidden",
                        }}
                      >
                        {header.renderType === "status" ? (
                          <Box
                            sx={{
                              ...(tableStyles?.status || {}),
                              backgroundColor: row?.[header.field]
                                ? getStatusColor("active")
                                : getStatusColor("inactive"),
                            }}
                          >
                            {row?.[header.field] ? "Active" : "Inactive"}
                          </Box>
                        ) : header.render ? (
                          <Box
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "100%",
                            }}
                          >
                            {header.render(row)}
                          </Box>
                        ) : header.renderType === "tags" ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {renderTags(
                              (row?.[header.field] as string[]) ?? [],
                            )}
                          </Box>
                        ) : (
                          <CellWithTooltip
                            value={row?.[header.field]}
                            maxLength={header.maxLength}
                            columnWidth={width}
                          />
                        )}
                      </Box>
                    </TableCell>
                  );
                })}

                {actions && (
                  <TableCell
                    sx={{
                      padding: "12px 0",
                      height: "60px",
                      maxHeight: "60px",
                      overflow: "hidden",
                      verticalAlign: "middle",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        height: "100%",
                      }}
                    >
                      {actions
                        .filter((action) =>
                          action.show ? action.show(row) : true,
                        )
                        .map((action, i) => (
                          <Tooltip key={i} title={action.tooltip || ""}>
                            <IconButton
                              sx={styles.iconButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DynamicTable;
