export interface RoleDto {
  _id: string;
  name: string;
}

export interface AssignedAorDto {
  _id: string;
  name: string;
}

export interface ThemeDto {
  bgImage: string;
  colorCode: string;
  opacity: number;
  imageUrl: string;
}

export interface UserDto {
  _id: string;
  username: string;
  email: string;
  roles: RoleDto[];
  status: boolean;
  isVerified: boolean;
  assignedAors: AssignedAorDto[];
  address: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  logbookFolderId?: string;
  profileUrl?: string | null;
  signatureUrl?: string | null;
  theme: ThemeDto;
}

export interface ProfileResponseDto {
  message: string;
  data: {
    user: UserDto;
    activeShift: number;
    theme: ThemeDto;
  };
}
