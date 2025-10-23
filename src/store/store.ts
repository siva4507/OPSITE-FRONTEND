import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import alertSlice from "./slices/alertSlice";
import { persistedOnboardingReducer } from "./slices/onboardingSlice";
import themeSlice from "./slices/themeSlice";
import shiftChangeSlice from "./slices/shiftChangeSlice";
import documentsReducer from "./slices/documentSlice";
import electronicLogSlice from "./slices/electronicLogSlice";
import companySlice from "./slices/companySlice";
import categorySlice from "./slices/categorySlice";
import roleSlice from "./slices/roleSlice";
import adminTheme from "./slices/themeadminSlice";
import aorSlice from "./slices/aorSlice";
import userSlice from "./slices/userSlice";
import locationSlice from "./slices/locationSlice";
import facilitySlice from "./slices/facilitySlice";
import qosSlice from "./slices/qosSlice";
import aorFormSlice from "./slices/aorFormSlice";
import dashboardSlice from "./slices/dashboardSlice";
import notificationSlice from "./slices/notificationSlice";
import mitigationSlice from "./slices/mitigationSlice";
import sleepHoursSlice from "./slices/sleepHoursSlice";
import shiftHoursSlice from "./slices/shiftHoursSlice";
import hitchDaySlice from "./slices/hitchDaySlice";
import fatigueScoreSlice from "./slices/fatigueScoreSlice";
import fatigueSlice from "./slices/fatigueSlice";

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: unknown) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const persistStorage =
  typeof window !== "undefined" ? storage : createNoopStorage();

const authPersistConfig = {
  key: "auth",
  storage: persistStorage,
  whitelist: ["user", "isOnboardingCompleted", "rememberMe", "selectedRole"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    alert: alertSlice,
    onboarding: persistedOnboardingReducer,
    theme: themeSlice,
    shiftChange: shiftChangeSlice,
    documents: documentsReducer,
    electronicLog: electronicLogSlice,
    company: companySlice,
    category: categorySlice,
    roles: roleSlice,
    themes: adminTheme,
    aor: aorSlice,
    users: userSlice,
    location: locationSlice,
    facility: facilitySlice,
    qos: qosSlice,
    aorForms: aorFormSlice,
    dashboard: dashboardSlice,
    notification: notificationSlice,
    mitigation: mitigationSlice,
    sleepHours: sleepHoursSlice,
    shiftHours: shiftHoursSlice,
    hitchDay: hitchDaySlice,
    fatigueScore: fatigueScoreSlice,
    fatigue: fatigueSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
