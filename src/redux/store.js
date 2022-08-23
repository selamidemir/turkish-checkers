import { configureStore } from "@reduxjs/toolkit";
import GameReducer from './gameSlice';

export const store = configureStore({
    reducer: {
        game: GameReducer,
    }
});