import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const submitForm = createAsyncThunk(
  "form/submitForm",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await formData;
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const formSlice = createSlice({
  name: "form",
  initialState: {
    formData: {},
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitForm.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFormData } = formSlice.actions;

export default formSlice.reducer;
