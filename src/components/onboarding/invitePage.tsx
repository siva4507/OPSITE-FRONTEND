
import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { styles } from "@/src/styles/onboarding.styles";
import { useTranslation } from "@/src/hooks/useTranslation";

const WelcomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        ...styles.cardContainer,
        maxWidth: 720,
        width: "100%",
        mx: "auto",
        px: 2,
        py: 4,
      }}
    >
      <Card sx={styles.inviteHead}>
        <CardContent>
          <Typography variant="h4" sx={styles.inviteTitle}>
            {t("welcome.title")}
          </Typography>
          <Typography variant="body1" sx={styles.subtitle}>
            {t("welcome.subtitle")}
          </Typography>
          <Typography variant="body2" sx={styles.contactText}>
            {t("welcome.contactMessage")}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WelcomePage;
