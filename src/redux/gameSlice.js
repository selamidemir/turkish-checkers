import { createSlice } from "@reduxjs/toolkit";
import { createBoard, gameFindWhiteMoves, gameFindBlackMoves, findMandatoryMoves } from "./game";
import { nanoid } from "@reduxjs/toolkit";


export const gameSlice = createSlice({
    name: 'game',
    initialState: {
        board: {},
        selectedItem: null,
        lastCell: null,
        currentCell: null,
        gamerOne: { id: nanoid(), name: 'White', color: 'white'},
        gamerTwo: { id: nanoid(), name: 'Black', color: 'black'},
        currentGamer : null,
        isForcedMove: false,
    },
    reducers: {
        initGame: (state, action) => {
            state.board = createBoard();
            state.currentGamer = state.gamerOne;
        },
        resetGame: (state, action) => {
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
            if(state.currentGamer.color !== state.board[action.payload.cellId].item.color) return;
            state.lastCell = state.board[action.payload.cellId];
            state.selectedItem = state.board[action.payload.cellId].item;
            state.selectedItem.isSelected = "selected-item";
        },
        findWhiteMoves: (state, action) => {
            if(state.isForcedMove) return;
            const items = gameFindWhiteMoves({board: state.board, selectedCell: state.board[state.selectedItem.cellId]});
            for(let key in items) state.board[key].navigable = state.isForcedMove ? false : true;
        },
        findBlackMoves: (state, action) => {
            if(state.isForcedMove) return;
            const items = gameFindBlackMoves({board: state.board, selectedCell: state.board[state.selectedItem.cellId]});
            for(let key in items) state.board[key].navigable = state.isForcedMove ? false : true;
        },
        findWhiteDamaMoves: (state, action) => {
            console.log("white with dama")
        },
        findBlackDamaMoves: (state, action) => {
            console.log("black with dama")
        },
        moveItem: (state, action) => {
            if (!state.lastCell) return; 
            let isMove = false;
            let itemDeleted = false;
            state.currentCell = state.board[action.payload.id];
            if(!state.currentCell.navigable) return; // Buraya hareket yok
            state.board[state.lastCell.id].item = null;
            state.board[action.payload.id].item = state.selectedItem;
            state.board[action.payload.id].item.isSelected = '';
            state.board[action.payload.id].item.cellId = action.payload.id;
            if((state.selectedItem.y === 8 && state.selectedItem.color === 'white') || (state.selectedItem.y === 1 && state.selectedItem.color === 'black')) console.log("yeni dama çıktı")
            console.log(state.selectedItem.x, state.selectedItem.y)
            state.selectedItem = null;
            state.currentCell = null;
            state.lastCell = null;
            state.currentGamer = state.currentGamer.id === state.gamerOne.id ? state.gamerTwo : state.gamerOne;
            for (let cell in state.board) {
                state.board[cell].navigable = false;
                // state.board[cell].reached = false;
                state.board[cell].startingCell = false;
                state.isForcedMove = false;
                if(state.board[cell].item && state.board[cell].item.willDelete) {
                    delete state.board[cell].item;
                    itemDeleted = true;
                    state.currentGamer = state.currentGamer.id === state.gamerOne.id ? state.gamerTwo : state.gamerOne;
                }

            }
            isMove = findMandatoryMoves(state.board, state.currentGamer);
            if(isMove) state.isForcedMove = true;
            else if(!isMove && itemDeleted) {
                itemDeleted = false;
                state.currentGamer = state.currentGamer.id === state.gamerOne.id ? state.gamerTwo : state.gamerOne;
            }
        }
    }
});

export const selectBoard = state => state.game.board;
export const selectSelectedItem = state => state.game.selectedItem;
export const selectCurrentGamer = state => state.game.currentGamer;
export const selectIsForcedMove = state => state.game.isForcedMove;

export const { initGame, setSelectedItem, moveItem, findWhiteMoves, findWhiteDamaMoves, findBlackMoves, findBlackDamaMoves, resetGame } = gameSlice.actions;
export default gameSlice.reducer;