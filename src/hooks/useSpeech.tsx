// hooks/useSpeechRecognition.ts
import React from "react";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useSpeech } from "@/src/providers/speechProvider";

export const useSpeechRecognition = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const speechContext = useSpeech();
  const applyTranscript = speechContext?.applyTranscript ?? (() => {});

  const [recording, setRecording] = React.useState(false);
  const [showWaveBox, setShowWaveBox] = React.useState(false);
  const recordingRef = React.useRef(false);
  const recognitionRef = React.useRef<any>(null);
  const isRecognitionRunning = React.useRef(false);
  const transcriptRef = React.useRef("");
  const setTranscript = React.useState("")[1];
  const setError = React.useState<string | null>(null)[1];

  const showMicAccessDeniedAlert = () => {
    const message = t("dashboardHeader.microphoneAccessDenied");
    dispatch(showAlert({ message, type: AlertType.Error }));
  };

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const message = t("dashboardHeader.notSupported");
      setError(message);
      dispatch(showAlert({ message, type: AlertType.Error }));
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      transcriptRef.current = result;
    };

    recognitionRef.current.onerror = (event: any) => {
      setError(event.error || t("dashboardHeader.voiceError"));
      setRecording(false);
      recordingRef.current = false;
      setShowWaveBox(false);
      isRecognitionRunning.current = false;

      if (event.error === "not-allowed" || event.error === "denied") {
        showMicAccessDeniedAlert();
      }
    };

    recognitionRef.current.onend = () => {
      if (recordingRef.current) {
        recognitionRef.current.start();
        isRecognitionRunning.current = true;
        return;
      }

      setRecording(false);
      setShowWaveBox(false);
      isRecognitionRunning.current = false;

      if (transcriptRef.current) {
        if (applyTranscript) {
          applyTranscript(transcriptRef.current);
        }
      }
    };
  }, []);

  const handleMicHoldStart = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    // Check if input is focused
    const activeEl = document.activeElement as HTMLElement | null;
    const isInputFocused =
      activeEl &&
      ((activeEl.tagName === "INPUT" &&
        ["text", "number", "tel", "email"].includes(
          (activeEl as HTMLInputElement).type,
        )) ||
        activeEl.tagName === "TEXTAREA");

    if (!isInputFocused) {
      dispatch(
        showAlert({
          message: t("dashboardHeader.noInputSelected"),
          type: AlertType.Error,
        }),
      );
      return;
    }

    const permission = await navigator.permissions?.query({
      name: "microphone" as PermissionName,
    });
    if (permission?.state === "denied") {
      showMicAccessDeniedAlert();
      return;
    }

    if (!recognitionRef.current) {
      showMicAccessDeniedAlert();
      return;
    }

    if (isRecognitionRunning.current) return;

    setTranscript("");
    transcriptRef.current = "";
    setError(null);
    setRecording(true);
    recordingRef.current = true;
    setShowWaveBox(true);

    try {
      recognitionRef.current.start();
      isRecognitionRunning.current = true;
    } catch {
      setError(t("dashboardHeader.recognitionAlreadyStarted"));
    }
  };

  const handleMicHoldEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setRecording(false);
    recordingRef.current = false;
    setShowWaveBox(false);

    if (recognitionRef.current && isRecognitionRunning.current) {
      recognitionRef.current.stop();
      isRecognitionRunning.current = false;
    }
  };

  return {
    recording,
    showWaveBox,
    handleMicHoldStart,
    handleMicHoldEnd,
  };
};