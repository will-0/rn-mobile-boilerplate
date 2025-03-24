import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "@/state/reducer";
import { fruitsApi } from "@/state/api";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fruitsApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;

export default store;
