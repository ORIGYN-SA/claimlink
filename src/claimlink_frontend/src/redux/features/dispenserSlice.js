import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDispensersData = createAsyncThunk(
  "dispensers/fetchDispensersData",
  async () => {
    const response = await "/api/dispensers-data";
    return response.data;
  }
);

const dispensersSlice = createSlice({
  name: "dispensers",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDispensersData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDispensersData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDispensersData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default dispensersSlice.reducer;
