import React from "react";
import * as Icons from "@mui/icons-material";
import { IconMapperProps } from "@/src/types/types";

const IconMapper: React.FC<IconMapperProps> = ({
  icon,
  fontSize = "small",
  color = "white",
}) => {
  if (!icon) return null;

  const normalizedIconName = icon.replace(/Icon$/, "");
  const DynamicIcon = (Icons as Record<string, React.ElementType>)[
    normalizedIconName
  ];

  if (!DynamicIcon) return null;

  return <DynamicIcon fontSize={fontSize} sx={{ color }} />;
};

export default IconMapper;
