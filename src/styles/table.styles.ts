export const tableStyles = {
  contentTableContainer: {
    height: "100%",
    overflow: "auto",
    scrollBehavior: "smooth",
    backgroundColor: "transparent",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: "6px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  contentTable: {
    minWidth: 100,
    tableLayout: "fixed",
    borderCollapse: "separate",
    backgroundColor: "transparent",
    paddingBottom: "30px",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tagChip: {
    marginRight: 0.5,
    background: "#22344A",
    color: "#fff",
  },
  tableHeaderRow: {
    backgroundColor: "#3D96E1",
    color: "#FFF",
    position: "sticky",
    top: 0,
    zIndex: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    color: "#FFF",
    padding: "12px",
    paddingLeft: "8px",
    paddingRight: "8px",
  },
  columnResizeHandle: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "8px",
    cursor: "col-resize",
    backgroundColor: "transparent",
    borderRight: "2px solid rgba(255, 255, 255, 0.3)", // Visible line
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRight: "2px solid rgba(255, 255, 255, 0.6)",
    },
    zIndex: 20,
  },
  columnResizeHandleActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRight: "2px solid #90caf9",
  },
  tableBodyRow: {
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.05)",
    },
    backgroundColor: "transparent",
    height: "60px",
    maxHeight: "60px",
  },
  tableBodyCell: {
    padding: "12px",
    paddingLeft: "8px",
    paddingRight: "8px",
    color: "#FFF",
    backgroundColor: "transparent",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    height: "60px",
    maxHeight: "60px",
  },
  status: {
    fontWeight: "bold",
    borderRadius: "12px",
    px: 1.5,
    py: 0.5,
    color: "#fff",
    display: "inline-block",
    textAlign: "center",
    minWidth: 70,
  },
  iconButton: {
    background: "none",
    border: "none",
    color: "#A0A3BD",
    cursor: "pointer",
    fontSize: "1.1rem",
    "&:hover": {
      color: "#3D96E1",
    },
  },
};

export const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "#4caf50";
    case "inactive":
      return "#f44336";
    case "pending":
      return "#ff9800";
    default:
      return "#9e9e9e";
  }
};
