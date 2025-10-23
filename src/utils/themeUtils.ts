import { Theme } from "@/src/dto/theme.dto";
import { User } from "@/src/types/auth.types";
import { imageUrls, SYSTEM, CUSTOM } from "@/src/utils/constant";
import { ThemeConfig, ThemeApiResponse } from "@/src/types/types";

export const getDefaultThemeConfig = (): ThemeConfig => ({
  imageUrl: imageUrls.bgPic,
  colorCode: "#3D96E1",
  opacity: 0.45,
});

export const resolveUserTheme = (
  user: User | null,
  themes: Theme[],
  previewTheme?: Partial<ThemeConfig>,
): ThemeConfig => {
  if (previewTheme && previewTheme.imageUrl) {
    return {
      imageUrl: previewTheme.imageUrl,
      colorCode: previewTheme.colorCode || "#3D96E1",
      opacity: previewTheme.opacity || 0.45,
    };
  }

  if (user?.theme) {
    const userTheme = user.theme;

    if (userTheme.isSelected === SYSTEM && userTheme.theme) {
      const matchedTheme = themes.find((t) => t._id === userTheme.theme!._id);
      if (matchedTheme) {
        return {
          imageUrl: matchedTheme.imageUrl,
          colorCode: userTheme.theme.colorCode,
          opacity: userTheme.theme.opacity,
        };
      } else {
        return {
          imageUrl: userTheme.imageUrl || imageUrls.bgPic,
          colorCode: userTheme.theme.colorCode,
          opacity: userTheme.theme.opacity,
        };
      }
    } else if (userTheme.isSelected === CUSTOM) {
      return {
        imageUrl: userTheme.imageUrl || imageUrls.bgPic,
        colorCode: userTheme.colorCode || "#3D96E1",
        opacity: userTheme.opacity || 0.45,
      };
    } else {
      return {
        imageUrl: userTheme.imageUrl || imageUrls.bgPic,
        colorCode: userTheme.colorCode || "#3D96E1",
        opacity: userTheme.opacity || 0.45,
      };
    }
  }

  return getDefaultThemeConfig();
};

export const getSystemThemes = (themes: Theme[]): Theme[] =>
  themes.filter((theme) => !theme.isSelected);

export const getSelectedTheme = (themes: Theme[]): Theme | null =>
  themes.find((theme) => theme.isSelected) || null;

export const buildThemePayload = (
  selectedThemeObj: Theme | undefined,
  colorCode: string,
  opacity: number,
): { themeId?: string; colorCode: string; opacity: number } => {
  if (selectedThemeObj?.isSelected === SYSTEM) {
    return {
      themeId: selectedThemeObj._id,
      colorCode,
      opacity,
    };
  } else {
    return {
      colorCode,
      opacity,
    };
  }
};

export const updateUserThemeFromResponse = (
  user: User | null,
  themes: Theme[],
  apiResponse: ThemeApiResponse,
): User["theme"] | undefined => {
  if (!user?.theme) return undefined;

  if (apiResponse.isSelected === CUSTOM) {
    return {
      imageUrl: apiResponse.imageUrl || imageUrls.bgPic,
      colorCode: apiResponse.colorCode,
      opacity: apiResponse.opacity,
      isSelected: CUSTOM,
    };
  } else if (apiResponse.isSelected === SYSTEM && apiResponse.theme) {
    const matchedTheme = themes.find((t) => t._id === apiResponse.theme?._id);
    if (matchedTheme) {
      return {
        imageUrl: matchedTheme.imageUrl,
        colorCode: apiResponse.theme.colorCode,
        opacity: apiResponse.theme.opacity,
        isSelected: SYSTEM,
        theme: apiResponse.theme,
      };
    } else {
      return {
        imageUrl: user.theme.imageUrl || imageUrls.bgPic,
        colorCode: apiResponse.theme?.colorCode || "#3D96E1",
        opacity: apiResponse.theme?.opacity || 0.45,
        isSelected: SYSTEM,
        theme: apiResponse.theme!,
      };
    }
  }

  return user.theme;
};
