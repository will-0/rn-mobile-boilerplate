import { combineReducers } from "@reduxjs/toolkit";
import apiSliceReducer from "@/state/api";

const rootReducer = combineReducers({
  api: apiSliceReducer
});

export default rootReducer;
