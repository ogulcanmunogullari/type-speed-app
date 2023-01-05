import { configureStore } from '@reduxjs/toolkit';
import wordsSlicer from './wordsSlice';

export const store = configureStore({
  reducer: {
    words: wordsSlicer,
  },
});
