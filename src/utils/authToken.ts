import { TOKEN_KEY } from "./constant";

const OPEN_TABS_KEY = "auth_open_tabs";
const TAB_ID_KEY = "auth_tab_id";
const IMPERSONATE_TOKEN_KEY = "impersonateToken";

class AuthTokenManager {
  private static instance: AuthTokenManager;

  static getInstance(): AuthTokenManager {
    if (!AuthTokenManager.instance) {
      AuthTokenManager.instance = new AuthTokenManager();
    }
    return AuthTokenManager.instance;
  }

  private constructor() {}

  storeToken(token: string, rememberMe: boolean): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem("rememberMe", rememberMe.toString());
    }
  }

  getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const browserClosing = localStorage.getItem("browserClosing");

    if (!rememberMe && browserClosing) {
      const closingTime = parseInt(browserClosing, 10);
      const currentTime = Date.now();

      if (currentTime - closingTime > 5000) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("browserClosing");
        localStorage.removeItem("rememberMe");
        return false;
      } else {
        localStorage.removeItem("browserClosing");
      }
    }

    const token = this.getAuthToken();
    if (!token) {
      return false;
    }
    return !!this.getAuthToken();
  }

  getRememberMe(): boolean {
    if (typeof window !== "undefined") {
      const rememberMe = localStorage.getItem("rememberMe");
      return rememberMe === "true";
    }
    return false;
  }

  clearAuth(): void {
    if (typeof window !== "undefined") {
      const itemsToRemove = [
        TOKEN_KEY,
        "rememberMe",
        "userSignatureBase64",
        "selectedRole",
        "loginRequestTime",
        "isOnboardingCompleted",
        "browserClosing",
        "documentViewMode",
        "currentShiftAorId",
        "impersonateToken",
        "activeControllerName",
      ];
      itemsToRemove.forEach((item) => localStorage.removeItem(item));
      itemsToRemove.forEach((item) => sessionStorage.removeItem(item));
      document.cookie =
        "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }
}

function getOpenTabsCount(): number {
  const raw = localStorage.getItem(OPEN_TABS_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

function setOpenTabsCount(n: number): void {
  localStorage.setItem(OPEN_TABS_KEY, String(Math.max(0, n)));
}

function generateTabId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function initAuthSessionLifecycle(): void {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(TAB_ID_KEY)) {
    localStorage.setItem(TAB_ID_KEY, generateTabId());
  }

  let incremented = false;
  const ensureIncrement = () => {
    if (incremented) return;
    incremented = true;
    setOpenTabsCount(getOpenTabsCount() + 1);
  };
  ensureIncrement();

  const handleUnload = (event?: PageTransitionEvent | BeforeUnloadEvent) => {
    let isReload = false;
    const navEntries = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    if (navEntries.length > 0) {
      isReload = navEntries[0].type === "reload";
    }
    if ((event as PageTransitionEvent)?.persisted) {
      isReload = true;
    }
    if (isReload) return;

    const next = getOpenTabsCount() - 1;
    setOpenTabsCount(next);

    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (!rememberMe && next <= 0) {
      localStorage.setItem("browserClosing", Date.now().toString());
    }
  };

  const handleFocus = () => {
    if (localStorage.getItem("browserClosing")) {
      localStorage.removeItem("browserClosing");
    }
  };

  window.addEventListener("beforeunload", handleUnload);
  window.addEventListener("pagehide", handleUnload);
  window.addEventListener("focus", handleFocus);
}

const authManager = AuthTokenManager.getInstance();

export const storeToken = (token: string, rememberMe: boolean) =>
  authManager.storeToken(token, rememberMe);
export const getAuthToken = () => authManager.getAuthToken();
export const isAuthenticated = () => authManager.isAuthenticated();
export const getRememberMe = () => authManager.getRememberMe();
export const clearAuthToken = () => authManager.clearAuth();

export const setImpersonateToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(IMPERSONATE_TOKEN_KEY, token);
  }
};

export const getImpersonateToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(IMPERSONATE_TOKEN_KEY);
  }
  return null;
};

export const clearImpersonateToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(IMPERSONATE_TOKEN_KEY);
  }
};