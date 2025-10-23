export interface DocumentFolder {
  _id: string;
  name: string;
  parentId: string;
  type: "folder" | "file";
  path: string;
  isDeleted: boolean;
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  childrenCount: number;
  folderSize: string;
  [key: string]: unknown;
}

export interface FetchUserFoldersData {
  children: DocumentFolder[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FetchUserFoldersResponse {
  message: string;
  data: FetchUserFoldersData;
}

export type RenameFolderResponse = FetchUserFoldersResponse;
export type DeleteFolderResponse = FetchUserFoldersResponse;
export type CreateFolderResponse = FetchUserFoldersResponse;
export interface CreateFolderRequest {
  name: string;
  parentId?: string;
}

export interface UploadFileRequest {
  file: File;
  tags: string[];
  parentId?: string;
}

export interface UploadFileResponse {
  message: string;
  data: DocumentFolder;
}
