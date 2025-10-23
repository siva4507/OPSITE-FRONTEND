export interface DocumentItem {
  _id: string;
  name: string;
  type: "file" | "folder";
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  aorName?: string;
  folderSize?: string;
  childrenCount?: number;
  tags?: string[];
  __v?: number;
  [key: string]: unknown; // Allow additional properties
}

export interface DocumentRepoHeaderProps {
  onFolderCreated?: () => void;
  parentId?: string;
  parentPathStack: { id: string; name: string; createdBy?: string }[];
  folders: DocumentItem[];
  child: DocumentItem[] | null;
}

export interface DocumentGridViewProps {
  items: DocumentItem[];
  isChildren: boolean;
  onContainerClick: (
    id: string,
    type: string,
    name: string,
    createdBy?: string,
  ) => void;
  menuAnchorEl: null | HTMLElement;
  menuTargetId: string | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onMenuClose: () => void;
  onRename: (id: string, name: string) => void;
  // onDelete: (id: string, name: string) => void;
  handleDownload: (url: string, name: string) => void;
  loading?: boolean;
}

export interface DocumentListViewProps {
  items: DocumentItem[];
  onContainerClick: (
    id: string,
    type: string,
    name: string,
    createdBy?: string,
  ) => void;
  menuAnchorEl: null | HTMLElement;
  menuTargetId: string | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onMenuClose: () => void;
  onRename: (id: string, name: string) => void;
  // onDelete: (id: string, name: string) => void;
  handleDownload: (url: string, name: string) => void;
  onSort?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  loading?: boolean;
}

export interface CreateFolderModalProps {
  parentId?: string;
  onSuccess?: () => void;
}

export interface RenameModalProps {
  id: string;
  name: string;
  onSuccess?: () => void;
  parentId?: string;
  showChildren?: boolean;
  tab?: number;
  search?: string;
  page?: number;
}

export interface UploadFileModalProps {
  parentId?: string;
  onSuccess?: () => void;
}

export interface DocumentRow {
  _id: string;
  name: string;
  type: "file" | "folder";
  childrenCount: number;
  folderSize: string | number;
  aorName: string;
  updatedAt: string | null;
  createdBy: string;
  tags: string[];
  __v: number;
  imageUrl: string;
  [key: string]: unknown;
}
