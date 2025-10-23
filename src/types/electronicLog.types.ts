export interface ElectronicLogHeaderProps {
  showToggleIcon?: boolean;
  showMaximizeIcon?: boolean;
  showMinimizeIcon?: boolean;
  onToggleLogbook?: () => void;
  onMaximizeLogbook?: () => void;
  onMinimizeLogbook?: () => void;
  onExportCSV?: (type: "csv" | "xlsx") => void;
  isFullScreen?: boolean;
  themeImageUrl?: string;
  themeOpacity?: number;
  themeColor?: string;
}

export interface ElectronicLogRow {
  _id: string;
  categoryId?: { _id?: string; name?: string };
  facilityIds: { _id: string; name: string }[] | null;
  description?: string;
  updatedAt: string;
  createdBy?: { username?: string };
  tags?: string[];
  isImportant?: boolean;
  fileUrls?: string[];
  isNew?: boolean;
  [key: string]: unknown;
}
