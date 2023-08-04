import { createSlice } from "@reduxjs/toolkit";

const defaultOrigin = { location: { lat: 33.6844, lng: 73.0479 } };
const initialState = {
  origin: defaultOrigin,
  destination: null,
  travelTimeInformation: null,
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },
    resetOrigin: (state) => {
      state.origin = defaultOrigin;
    },
    resetDestination: (state) => {
      state.destination = null;
    },
  },
});

export const {
  setOrigin,
  setDestination,
  setTravelTimeInformation,
  resetOrigin,
  resetDestination,
} = navSlice.actions;

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTravelTimeInformation = (state) =>
  state.nav.travelTimeInformation;

export default navSlice.reducer;
