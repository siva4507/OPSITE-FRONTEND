import React from "react";
import { useAppDispatch } from "@/src/hooks/redux";
import { createFolder } from "@/src/store/slices/documentSlice";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import DynamicForm from "@/src/components/common/formModal";
import { CreateFolderModalProps } from "@/src/types/document.types";

interface LocalCreateFolderModalProps extends CreateFolderModalProps {
  onClose: () => void;
}

const CreateFolderModal: React.FC<LocalCreateFolderModalProps> = ({
  parentId,
  onSuccess,
  onClose,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleCreateFolder = async (values: Record<string, unknown>) => {
    const name = values.name as string;
    try {
      await dispatch(
        createFolder(parentId ? { name, parentId } : { name }),
      ).unwrap();
      onClose();

      if (onSuccess) {
        onSuccess();
      }

      dispatch(
        showAlert({
          message: t("documentRepository.folderCreatedSuccess"),
          type: AlertType.Success,
        }),
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : t("documentRepository.folderCreatedError");

      dispatch(
        showAlert({
          message: errorMessage,
          type: AlertType.Error,
        }),
      );
    }
  };

  return (
    <DynamicForm
      fields={[
        {
          name: "name",
          label: t("documentRepository.folderName"),
          type: "text",
          required: true,
          placeholder: t("documentRepository.enterFolderName"),
          maxlength: 50,
        },
      ]}
      onSubmit={handleCreateFolder}
      onCancel={onClose}
      submitLabel={t("documentRepository.create")}
      cancelLabel={t("documentRepository.cancel")}
    />
  );
};

export default CreateFolderModal;
