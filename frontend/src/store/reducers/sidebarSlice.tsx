import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  isOpen: boolean;
}

const initialSidebarState: SidebarState = {
  isOpen: true,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: initialSidebarState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
});

export const { open, close } = sidebarSlice.actions;
export default sidebarSlice.reducer;
