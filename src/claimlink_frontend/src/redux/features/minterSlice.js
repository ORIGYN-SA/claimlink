import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMinterData = createAsyncThunk(
  "minter/fetchMinterData",
  async () => {
    const response = await "/api/minter-data";
    return response.data;
  }
);

const minterSlice = createSlice({
  name: "minter",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMinterData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMinterData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMinterData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default minterSlice.reducer;
