import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import DynamicModal from "@/src/components/common/modal";
import { User } from "@/src/types/user.types";
import { Role } from "@/src/types/role.types";
import { Aor } from "@/src/types/aor.types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { adminStyles } from "@/src/styles/admin.styles";
import { formatDate } from "@/src/utils/config";

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  onClose,
  user,
}) => {
  const { t } = useTranslation();
  if (!user) return null;

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      showCloseIcon
      title={t("user.userDetails")}
      width={500}
      showMicIcon={false}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            src={user.profileFileUrl || undefined}
            alt={user.username}
            sx={adminStyles.avatar}
          >
            {!user.profileFileUrl && user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ color: "#fff" }}>
            {user.username.charAt(0).toUpperCase() +
              user.username.slice(1).toLowerCase()}
          </Typography>
        </Box>

        <Box sx={adminStyles.userGrid}>
          {[
            { key: t("user.email"), value: user.email || "-" },
            { key: t("user.phone"), value: user.phoneNumber || "-" },
            {
              key: t("user.role"),
              value: user.roles?.map((r: Role) => r.name).join(", ") || "-",
            },
            { key: t("user.address"), value: user.address || "-" },
            {
              key: t("user.createdAt"),
              value: formatDate(user.createdAt),
            },
            {
              key: t("user.aors"),
              value:
                user.assignedAors?.map((a: Aor) => a.name).join(", ") || "-",
            },
          ].map((detail) => (
            <Box key={detail.key} sx={adminStyles.userData}>
              <Typography sx={adminStyles.userKey}>{detail.key}:</Typography>
              <Typography sx={adminStyles.userValue}>{detail.value}</Typography>
            </Box>
          ))}

         
        </Box>
      </Box>
    </DynamicModal>
  );
};

export default UserDetailsModal;
