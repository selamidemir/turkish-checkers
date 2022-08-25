import { createSlice } from "@reduxjs/toolkit";
import { createBoard, gameFindWhiteMoves, gameFindMandatoryMoves, gameFindBlackMoves } from "./game";
import { nanoid } from "@reduxjs/toolkit";


export const gameSlice = createSlice({
    name: 'game',
    initialState: {
        board: {},
        selectedItem: null,
        lastCell: null,
        currentCell: null,
        gamerOne: { id: nanoid(), name: 'Gamer One', color: 'white' },
        gamerTwo: { id: nanoid(), name: 'Gamer Two', color: 'black' },
        currentGamer: null,
    },
    reducers: {
        initGame: (state, action) => {
            state.board = createBoard();
            state.currentGamer = state.gamerOne;
        },
        setSelectedItem: (state, action) => {
            if (state.selectedItem) {// Seçili taş var seçimi iptal et
                state.board[state.selectedItem.cellId].item.isSelected = '';
                for (let cell in state.board) state.board[cell].navigable = false;
                state.lastCell = null;
                state.selectedItem = null;
                return;
            }
            if (state.currentGamer.color !== state.board[action.payload.cellId].item.color) return;
            state.lastCell = state.board[action.payload.cellId];
            state.selectedItem = state.board[action.payload.cellId].item;
            state.selectedItem.isSelected = "selected-item";
        },
        findWhiteMoves: (state, action) => {
            gameFindWhiteMoves({ board: state.board, selectedCell: state.board[state.selectedItem.cellId] });
        },
        findBlackMoves: (state, action) => {
            gameFindBlackMoves({ board: state.board, selectedCell: state.board[state.selectedItem.cellId] });
        },
        findWhiteDamaMoves: (state, action) => {
            console.log("white with dama")
        },
        findBlackDamaMoves: (state, action) => {
            console.log("black with dama")
        },
        moveItem: (state, action) => {
            if (!state.lastCell) return;
            state.currentCell = state.board[action.payload.id];
            if (!state.currentCell.navigable) return; // Buraya hareket yok
            state.currentGamer = state.currentGamer.id === state.gamerOne.id ? state.gamerTwo : state.gamerOne;
            state.board[state.lastCell.id].item = null;
            state.board[action.payload.id].item = state.selectedItem;
            state.board[action.payload.id].item.isSelected = '';
            state.board[action.payload.id].item.cellId = action.payload.id;
            state.selectedItem = null;
            state.currentCell = null;
            state.lastCell = null;
            for (let cell in state.board) state.board[cell].navigable = false;

            let nextMoves = [];
            for (let key in state.board) {
                if (state.board[key].item && (state.board[key].item.color === state.currentGamer.color)) {
                    nextMoves = [...nextMoves, gameFindMandatoryMoves(state.board, state.board[key], state.currentGamer)];
                }
            }
        },
    }
});

export const selectBoard = state => state.game.board;
export const selectSelectedItem = state => state.game.selectedItem;
export const selectCurrentGamer = state => state.game.currentGamer;

export const { initGame, setSelectedItem, moveItem, findWhiteMoves, findWhiteDamaMoves, findBlackMoves, findBlackDamaMoves, setMandatoryMoves } = gameSlice.actions;
export default gameSlice.reducer;