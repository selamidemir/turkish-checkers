import { createSlice } from "@reduxjs/toolkit";
import { createBoard, gameFindWhiteMoves, gameFindBlackMoves, findMandatoryMoves, gameFindWhiteDamaMoves, gameFindBlackDamaMoves } from "./game";
import { nanoid } from "@reduxjs/toolkit";


export const gameSlice = createSlice({
    name: 'game',
    initialState: {
        board: {},
        selectedItem: null,
        lastCell: null,
        currentCell: null,
        gamerOne: { id: nanoid(), name: 'White', color: 'white', stones: 16 },
        gamerTwo: { id: nanoid(), name: 'Black', color: 'black', stones: 16 },
        currentGamer: null,
        isForcedMove: false,
        isGameOver: false,
        winner: null,
    },
    reducers: {
        initGame: (state, action) => {
            state.board = createBoard();
            state.currentGamer = state.gamerOne;
            state.isForcedMove = false;
            state.selectedItem = null;
            state.lastCell = null;
            state.isGameOver = false;
            state.winner = null;
        },
        resetGame: (state, action) => {
            state.board = createBoard();
            state.currentGamer = state.gamerOne;
            state.isForcedMove = false;
            state.selectedItem = null;
            state.lastCell = null;
            state.isGameOver = false;
            state.winner = null;
        },
        setSelectedItem: (state, action) => {
            if (state.selectedItem) {// Seçili taş var seçimi iptal et
                state.board[state.selectedItem.cellId].item.isSelected = '';
                // Eğer herhangi bir taşa basılmıyorsa 
                if (!state.isForcedMove) {
                    for (let cell in state.board) {
                        state.board[cell].navigable = false;
                        state.board[cell].deletedItem = null;
                    }
                }
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
            if (state.isForcedMove) return;
            const items = gameFindWhiteMoves({ board: state.board, selectedCell: state.board[state.selectedItem.cellId] });
            for (let key in items) state.board[key].navigable = state.isForcedMove ? false : true;
        },
        findBlackMoves: (state, action) => {
            if (state.isForcedMove) return;
            const items = gameFindBlackMoves({ board: state.board, selectedCell: state.board[state.selectedItem.cellId] });
            for (let key in items) state.board[key].navigable = state.isForcedMove ? false : true;
        },
        findWhiteDamaMoves: (state, action) => {
            if (state.isForcedMove) return;
            const items = gameFindWhiteDamaMoves({ board: state.board, selectedCell: state.board[state.selectedItem.cellId] });
            for (let key in items) state.board[key].navigable = state.isForcedMove ? false : true;
        },
        findBlackDamaMoves: (state, action) => {
            if (state.isForcedMove) return;
            const items = gameFindBlackDamaMoves({ board: state.board, selectedCell: state.board[state.selectedItem.cellId] });
            for (let key in items) state.board[key].navigable = state.isForcedMove ? false : true;
        },
        moveItem: (state, action) => {
            if (!state.lastCell) return;
            let isMove = false;
            let itemDeleted = false;
            state.currentCell = state.board[action.payload.id];
            if (!state.currentCell.navigable) return; // Buraya hareket yok
            state.board[state.lastCell.id].item = null;
            state.board[action.payload.id].item = state.selectedItem;
            state.board[action.payload.id].item.isSelected = '';
            state.board[action.payload.id].item.cellId = action.payload.id;
            state.selectedItem = null;
            state.lastCell = null;
            // Eğer bir hareket varsa oyuncu değişmiştir.
            // Bu nedenle oyuncuyu önceden değiştirelim.
            // Sonra gerekirse bu hareketi geri alacağız
            state.currentGamer = state.currentGamer.id === state.gamerOne.id ? state.gamerTwo : state.gamerOne;

            for (let cell in state.board) {
                state.board[cell].navigable = false;
                // state.board[cell].reached = false;
                state.board[cell].startingCell = false;
                state.isForcedMove = false;
                if (state.board[cell].item
                    && state.board[cell].item.willDelete
                    && state.currentCell.deletedItem
                    && state.currentCell.deletedItem.id === state.board[cell].item.id) {
                    state.board[cell].item.color === 'white' ? state.gamerOne.stones-- : state.gamerTwo.stones--;
                    delete state.board[cell].item;
                    itemDeleted = true;

                }
                state.currentCell.itemDeleted = null;
            }

            // Alınan taş varsa oyun sonucunu denetleyelim
            if (itemDeleted) {
                // Eğer alınan taş varsa varsayılan olarak güncell oyuncu
                // yukarıda değiştiği için tekrar geri çevir ve 
                // taş alan oyuncuya geri dönelim
                state.currentGamer = state.currentGamer.id === state.gamerOne.id ? state.gamerTwo : state.gamerOne;
                // Oyunu kazanan var mı?
                if (state.gamerOne.stones === 0 || state.gamerTwo.stones === 0) { // Son oynayan oyuncu kazanır
                    alert(`${state.currentGamer.name} Kazanır`);
                    state.isGameOver = true;
                    state.winner = state.currentGamer;
                } else if(state.gamerOne.stones === 1 && state.gamerTwo.stones ===1) { // Oyun berabere biter.
                    alert(`Oyun Berabere Biter!`);
                    state.isGameOver = true;
                    state.winner = false;
                }
            }
            state.currentCell = null;


            isMove = findMandatoryMoves(state.board, state.currentGamer);

            // Eğer alınan taş var ve yeni hareket yoksa
            // güncel oyuncuyu değiştirerek onun hareketi var mı 
            // denetleyerek yolumuza devam edelim
            if (itemDeleted && !isMove) {
                state.currentGamer = state.currentGamer.id === state.gamerOne.id ? state.gamerTwo : state.gamerOne;
                isMove = findMandatoryMoves(state.board, state.currentGamer);
            }

            else if (isMove && itemDeleted) state.isForcedMove = true;
            else if (isMove) state.isForcedMove = true;
            else if (!isMove && itemDeleted) state.isForcedMove = false;
        },
        setItemDama: (state, action) => {
            const cell = state.board[action.payload.cellId];
            if(!cell) return;
            if ((cell.y === 8 && cell.item.color === 'white')
                || (cell.y === 1 && cell.item.color === 'black'))
                state.board[action.payload.cellId].item.dama = true;
        },
        setWinners: (state, action) => {
            state.currentGamer = state.currentGamer.id === state.gamerOne.id ? state.gamerTwo : state.gamerOne;
            if (action.payload) alert(`${state.currentGamer.name} Kazanır`);
            else alert("Oyun Berabere Biter!")
        }
    }
});

export const selectBoard = state => state.game.board;
export const selectSelectedItem = state => state.game.selectedItem;
export const selectCurrentGamer = state => state.game.currentGamer;
export const selectIsForcedMove = state => state.game.isForcedMove;
export const selectIsGameOver = state => state.game.isGameOver;

export const { initGame, setSelectedItem, moveItem, findWhiteMoves, findWhiteDamaMoves, findBlackMoves, findBlackDamaMoves, resetGame, setItemDama, setWinners } = gameSlice.actions;
export default gameSlice.reducer;