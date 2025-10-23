import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertType, AlertState } from "@/src/types/types";

const initialState: AlertState = {
  open: false,
  message: "",
  type: AlertType.Info,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (
      state,
      action: PayloadAction<{ message: string; type?: AlertType }>,
    ) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type || AlertType.Info;
    },
    closeAlert: (state) => {
      state.open = false;
      state.message = "";
    },
  },
});

export const { showAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
