import { nanoid } from "@reduxjs/toolkit";

export const createItem = (y_line) => {
    if (y_line === 2 || y_line === 3) return {  id: nanoid(), dama: false, color: 'white', isSelected: ''};
    else if (y_line === 6 || y_line === 7) return {  id: nanoid(), dama: false, color: 'black', isSelected: ''};
    return;
}

export const createBoard = () => {
    const board = {};
    // const x_line = 'ABCDEFGH';
    let color = 'cell-black';
    for (let i = 1; i <= 8; i++) {
        for (let j = 8; j >= 1; j--) {
            color = (((j+i) % 2) !== 0) ? 'cell-black' : 'cell-white';
            let item = createItem(j);
            let id = nanoid();
            if(item) item.cellId = id;
            board[id] = {
                id: id,
                y: i, //x_line[i-1],
                x: j,
                navigable: false,
                color: color,
                item: item,
            };    
        }
    }
    return board;
}

const addRoute = (board, items, currentGamer) => {
    let routes = [];
    for(let key in board) {
        for(let item in items) {
            if((board[key].x === (items[item].x + 1))
                && (board[key].y === (items[item].y))
                && !board[key].item
                && currentGamer.color === 'white') {
                    board[key].navigable = true;
                    // routes = [...routes, ...findMandatoryMoves(board, board[key], currentGamer)];
            } else if((board[key].x === (items[item].x - 1))
                && (board[key].y === (items[item].y)) 
                && !board[key].item
                && currentGamer.color === 'black') {
                    board[key].navigable = true;
                    // routes = [...routes, ...findMandatoryMoves(board, board[key], currentGamer)];
            } else if((board[key].y === (items[item].y + 1))
                && (board[key].x === (items[item].x)) 
                && !board[key].item
                && currentGamer.color === 'white') {
                    board[key].navigable = true;
                    routes = [...routes, ...findMandatoryMoves(board, board[key], currentGamer)];
            } //else if((board[key].y === (items[item].y - 1))
            // && (board[key].x === (items[item].x)) 
            // && !board[key].item
            // && currentGamer.color === 'white') {
            //     board[key].navigable = true;
            //     routes = [...routes, ...findMandatoryMoves(board, board[key], currentGamer)];
            // }  else if((board[key].y === (items[item].y + 1))
            // && (board[key].x === (items[item].x)) 
            // && !board[key].item
            // && currentGamer.color === 'black') {
            //     board[key].navigable = true;
            //     routes = [...routes, ...findMandatoryMoves(board, board[key], currentGamer)];
            // } else if((board[key].y === (items[item].y - 1))
            // && (board[key].x === (items[item].x)) 
            // && !board[key].item
            // && currentGamer.color === 'black') {
            //     board[key].navigable = true;
            //     routes = [...routes, ...findMandatoryMoves(board, board[key], currentGamer)];
            // } 
        }
    }
    return routes;
}

const findMandatoryMoves = (board, item, currentGamer) => {
    let cells = [];
    let routes = [];
    for (let key in board) {
        // önde taş var mı?
        if((board[key].x === (board[item.cellId].x + 1))
        && (board[key].y === (board[item.cellId].y)) 
        && board[key].item
        && board[key].item.color !== currentGamer.color
        && currentGamer.color === 'white') {
            board[key].navigable = true;
            cells.push(board[key]);
        } else if((board[key].x === (board[item.cellId].x - 1))
        && (board[key].y === (board[item.cellId].y)) 
        && board[key].item
        && board[key].item.color !== currentGamer.color
        && currentGamer.color === 'black') {
            board[key].navigable = true;
            cells.push(board[key]);
        } else if((board[key].y === (board[item.cellId].y + 1))
        && (board[key].x === (board[item.cellId].x)) 
        && board[key].item
        && board[key].item.color !== currentGamer.color
        && currentGamer.color === 'white') {
            board[key].navigable = true;
            cells.push(board[key]);
        } else if((board[key].y === (board[item.cellId].y - 1))
        && (board[key].x === (board[item.cellId].x)) 
        && board[key].item
        && board[key].item.color !== currentGamer.color
        && currentGamer.color === 'white') {
            board[key].navigable = true;
            cells.push(board[key]);
        }  else if((board[key].y === (board[item.cellId].y + 1))
        && (board[key].x === (board[item.cellId].x)) 
        && board[key].item
        && board[key].item.color !== currentGamer.color
        && currentGamer.color === 'black') {
            board[key].navigable = true;
            cells.push(board[key]);
        } else if((board[key].y === (board[item.cellId].y - 1))
        && (board[key].x === (board[item.cellId].x)) 
        && board[key].item
        && board[key].item.color !== currentGamer.color
        && currentGamer.color === 'black') {
            board[key].navigable = true;
            cells.push(board[key]);
        } 
    }

    return [...routes, ...addRoute(board, cells, currentGamer)];
}

export const gameSetMandatoryMoves = (board, currentGamer) => {
    let nextItems = []
    for(let key in board) {
        if(board[key].item && (board[key].item.color === currentGamer.color)) nextItems = [...findMandatoryMoves(board, board[key].item, currentGamer)]
    }
    return nextItems;
}

export const gameFindWhiteMoves = (data) => {
    const board = data.board;
    const selectedCell = board[data.selectedCell.id];

    // const selectedCell = state.board[state.selectedItem.cellId];
    for (let cell in board) {
        // Öndeki kare boş mu? x + 1
        if (((selectedCell.x + 1) === board[cell].x)
            && selectedCell.y === board[cell].y
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        } else if ((selectedCell.y - 1) === board[cell].y
            && selectedCell.x === board[cell].x
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        } else if ((selectedCell.y + 1) === board[cell].y
            && selectedCell.x === board[cell].x
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        }
    }
}