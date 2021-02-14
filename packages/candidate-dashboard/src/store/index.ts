import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import component from './component';
const store = configureStore({
  reducer: {
    component,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
