import { createSlice } from "@reduxjs/toolkit";

export const yearSlice = createSlice({
  name: "year",
  initialState: 2024,
  reducers: {
    setYear: (state, action) => {
      return action.payload;
    },
  },
});

export const { setYear } = yearSlice.actions;

export default yearSlice.reducer;
