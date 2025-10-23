"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/src/store/store";
import LoadingSpinner from "@/src/components/common/loader";
import { ReduxProviderProps } from "../types/types";
import { useAuthHydration } from "@/src/hooks/useAuthHydration";
import { useDocumentHydration } from "@/src/hooks/useDocumentHydration";

const InnerHydration: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useAuthHydration();
  useDocumentHydration();
  return <>{children}</>;
};

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => (
  <Provider store={store}>
    <PersistGate
      loading={<LoadingSpinner center size={48} />}
      persistor={persistor}
    >
      <InnerHydration>{children}</InnerHydration>
    </PersistGate>
  </Provider>
);

export default ReduxProvider;
