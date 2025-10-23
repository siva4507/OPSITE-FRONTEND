import React from "react";
import { useAppDispatch } from "@/src/hooks/redux";
import { renameFolder } from "@/src/store/slices/documentSlice";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import DynamicForm from "@/src/components/common/formModal";
import { RenameModalProps } from "@/src/types/document.types";

interface LocalRenameModalProps extends RenameModalProps {
  onClose: () => void;
}

const RenameModal: React.FC<LocalRenameModalProps> = ({
  id,
  onSuccess,
  onClose,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleRenameSubmit = async (values: Record<string, unknown>) => {
    if (values.newName) {
      try {
        await dispatch(
          renameFolder({ id, name: String(values.newName) }),
        ).unwrap();
        onClose();

        dispatch(
          showAlert({
            message: t("documentRepository.folderRenamed"),
            type: AlertType.Success,
          }),
        );

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        const errorMessage =
          typeof error === "string"
            ? error
            : t("documentRepository.folderRenamedError");
        dispatch(
          showAlert({
            message: errorMessage,
            type: AlertType.Error,
          }),
        );
      }
    }
  };

  return (
    <DynamicForm
      fields={[
        {
          name: "newName",
          label: t("documentRepository.enterName"),
          type: "text",
          required: true,
          placeholder: t("documentRepository.enterName"),
          maxlength: 50,
        },
      ]}
      onSubmit={handleRenameSubmit}
      onCancel={onClose}
      submitLabel={t("documentRepository.rename")}
    />
  );
};

export default RenameModal;
