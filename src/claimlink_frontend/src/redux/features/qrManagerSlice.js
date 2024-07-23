import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchQrData = createAsyncThunk(
  "qrManager/fetchQrData",
  async () => {
    const response = await "/api/qr-data";
    return response.data;
  }
);

const qrManagerSlice = createSlice({
  name: "qrManager",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQrData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQrData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchQrData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default qrManagerSlice.reducer;
