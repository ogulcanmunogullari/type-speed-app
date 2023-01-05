import { createSlice } from '@reduxjs/toolkit';
import data from '../words.json';

const lineFunc = () => {
  let line = [];
  for (let i = 0; i < 10; i++) {
    let id = Math.floor(Math.random() * 1000) + 1;
    line.push(data.find((data) => Number(data.id) === id));
  }
  return line.filter((x) => x !== undefined);
};

const WordsSlicer = createSlice({
  name: 'words',
  initialState: {
    correctWord: 0,
    wrongWord: 0,
    correctKey: 0,
    wrongKey: 0,
    line1: [],
    line2: [],
  },
  reducers: {
    lineBuilder(state) {
      state.line1 = lineFunc();
      state.line2 = lineFunc();
    },
    resetGame(state) {
      state.correctWord = 0;
      state.wrongWord = 0;
      state.correctKey = 0;
      state.wrongKey = 0;
    },
    lineChanger(state) {
      state.line1 = [...state.line2];
      state.line2 = lineFunc();
    },
    wordChecker(state, action) {
      const { text, line1, lang, index } = action.payload;
      let correctText = text
        .split('')
        .filter((x) => x !== ' ')
        .join('');
      if (line1[index][lang] === correctText) {
        state.correctWord++;
      } else {
        state.wrongWord++;
      }
    },
    keyChecker(state, action) {
      const { key, textKey, index, line, lang } = action.payload;
      if (index > 0) {
        if (key !== 'Backspace' && line[index][lang][textKey - 1] === key) {
          state.correctKey++;
        } else if (key !== 'Backspace') {
          state.wrongKey++;
        }
      } else {
        if (key !== 'Backspace' && line[index][lang][textKey] === key) {
          state.correctKey++;
        } else if (key !== 'Backspace') {
          state.wrongKey++;
        }
      }
    },
  },
});

export const { lineBuilder, lineChanger, wordChecker, keyChecker, resetGame } =
  WordsSlicer.actions;
export default WordsSlicer.reducer;
