import { configureStore } from '@reduxjs/toolkit';
import NewPaletteReducer from './features/saved/NewPalette';

export default configureStore({
  reducer: {
    NewPalette: NewPaletteReducer,
  },
})