"use client";

import React, { createContext, useContext, useRef, useEffect } from "react";
import { SpeechContextProps } from "./../types/types";
import { store } from "@/src/store/store";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";

const SpeechContext = createContext<SpeechContextProps | undefined>(undefined);

export const useSpeech = () => {
  const { t } = useTranslation();
  const context = useContext(SpeechContext);
  if (!context) {
    store.dispatch(
      showAlert({
        message: t("common.speechProviderError"),
        type: AlertType.Error,
      }),
    );
    return null;
  }
  return context;
};

// Helper to update value in a way React recognizes
function setNativeValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const prototype = Object.getPrototypeOf(element);
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }
}

const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const transcriptHandlerRef = useRef<((transcript: string) => void) | null>(
    null,
  );
  const focusedInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null,
  );

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === "INPUT" &&
          ["text", "number", "tel", "email"].includes(
            (target as HTMLInputElement).type,
          )) ||
        target.tagName === "TEXTAREA"
      ) {
        focusedInputRef.current = target as
          | HTMLInputElement
          | HTMLTextAreaElement;
      } else {
        focusedInputRef.current = null;
      }
    };
    const handleBlur = () => {
      focusedInputRef.current = null;
    };
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);
    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, []);

  const applyTranscript = (transcript: string) => {
    const input = focusedInputRef.current;

    if (
      input &&
      document.activeElement === input &&
      ((input.tagName === "INPUT" &&
        ["text", "number", "tel", "email"].includes(input.type)) ||
        input.tagName === "TEXTAREA")
    ) {
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      const value = input.value;

      const newValue = value.slice(0, start) + transcript + value.slice(end);

      setNativeValue(input, newValue);

      const cursor = start + transcript.length;
      input.setSelectionRange(cursor, cursor);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    if (transcriptHandlerRef.current) {
      transcriptHandlerRef.current(transcript);
    } else {
      store.dispatch(
        showAlert({
          message: !focusedInputRef.current
            ? t("common.noInputBoxAvailable")
            : t("common.noTranscriptHandlerRegistered"),
          type: AlertType.Error,
        }),
      );
    }
  };

  const setHandler = (handler: (transcript: string) => void) => {
    transcriptHandlerRef.current = handler;
  };

  return (
    <SpeechContext.Provider
      value={{
        applyTranscript,
        setTranscriptHandler: setHandler,
        hasHandler: () => !!transcriptHandlerRef.current,
        registerGlobalHandler: setHandler,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export default SpeechProvider;
