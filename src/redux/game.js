import { nanoid } from "@reduxjs/toolkit";

export const createItem = (y_line) => {
    if (y_line === 2 || y_line === 3) return { id: nanoid(), dama: false, color: 'white', isSelected: '' };
    else if (y_line === 6 || y_line === 7) return { id: nanoid(), dama: false, color: 'black', isSelected: '' };
    return;
}

export const createBoard = () => {
    const board = {};
    // const x_line = 'ABCDEFGH';
    let color = 'cell-black';
    for (let i = 1; i <= 8; i++) {
        for (let j = 8; j >= 1; j--) {
            color = (((j + i) % 2) !== 0) ? 'cell-black' : 'cell-white';
            let item = createItem(j);
            let id = nanoid();
            if (item) item.cellId = id;
            board[id] = {
                id: id,
                y: j, //x_line[i-1],
                x: i,
                navigable: false,
                color: color,
                item: item,
            };
        }
    }
    return board;
}

const findAllMandatoryMoves = (b, cs, currentGamer) => {
    // b board, c cells 
    // gelen hücrelerde hareket eden taşlar var
    // İç içe çağırma işlemi yapılarak
    // taşın her hareketi yakalanmaya çalışılacak
    // Her hareketten sonra yenilen taş tahtadan
    // çıkarılacak ve yiyen taş yer değiştirecek
    // Sonrasında bu işlem bir dizi içerisinde
    // nesne olarak tutulacak

    const board = [...b];
    const cells = [...cs];
    let allMoves = [];

    const movesFront = (b, c) => {
        // Öne giden hareketleri bul
        const board = [...b];
        let moves = [];
        let deletedItem = null;
        let deletedItemCell = null;
        let movedCell = null;
        board.forEach(cell => {
            if(cell.y === c.y) return;
            if ( // silinen taşı bulalım
                ((cell.y === c.y + 1 && currentGamer.color === 'white') || (cell.y === c.y - 1 && currentGamer.color === 'black'))
                && cell.item && cell.item.com !== currentGamer.color
                && cell.x === c.x
            ) {
                deletedItemCell = cell;
                deletedItem = cell && cell.item;
            } else if ( // haret edilecek hücreyi bulalım
                ((cell.y === c.y + 2 && currentGamer.color === 'white') || (cell.y === c.y - 2 && currentGamer.color === 'black'))
                && cell.x === c.x
                && !cell.item
            ) movedCell = cell;
        });
        if (movedCell && deletedItemCell && deletedItem) moves.push({
            deletedItem,
            deletedItemCell,
            movedCell
        });
        if (movedCell) moves = [...moves, ...findAllMoves(board, movedCell)];
        // console.log("moves: ", moves);
        return moves;
    }

    const movesLeft = (b, c) => {
        // Sala giden hareketleri bul
        const board = [...b];
        let moves = [];
        let deletedItem = null;
        let deletedItemCell = null;
        let movedCell = null;
        board.forEach(cell => {
            if(cell.y === c.y) return;
            if ( // silinen taşı bulalım
                ((cell.x === c.x - 1 && currentGamer.color === 'white') || (cell.x === c.x + 1 && currentGamer.color === 'black'))
                && cell.item && cell.item.color !== currentGamer.color
                && cell.y === c.y
            ) {
                deletedItemCell = cell;
                deletedItem = cell && cell.item;
            } else if ( // haret edilecek hücreyi bulalım
                ((cell.x === c.x - 2 && currentGamer.color === 'white') || (cell.x === c.x + 2 && currentGamer.color === 'black'))
                && cell.y === c.y
                && !cell.item
            ) movedCell = cell;
        });
        if (movedCell && deletedItemCell && deletedItem) moves.push({
            deletedItem,
            deletedItemCell,
            movedCell
        });
        if (movedCell) moves = [...moves, ...findAllMoves(board, movedCell)];

        return moves;
    }

    const movesRight = (b, c) => {
        // Sağa giden hareketleri bul
        const board = [...b];
        let moves = [];
        let deletedItem = null;
        let deletedItemCell = null;
        let movedCell = null;
        board.forEach(cell => {

            if(cell.y !== c.y) return;
            if ( // silinen taşı bulalım
                ((cell.x === c.x + 1 && currentGamer.color === 'white') || (cell.x === c.x - 1 && currentGamer.color === 'black'))
                && cell.item && cell.item.color !== currentGamer.color
                && cell.y === c.y
            ) {
                deletedItemCell = cell;
                deletedItem = cell && cell.item;
            } else if ( // haret edilecek hücreyi bulalım
                ((cell.x === c.x + 2 && currentGamer.color === 'white') || (cell.x === c.x - 2 && currentGamer.color === 'black'))
                && cell.y === c.y
                && !cell.item
            ) movedCell = cell;
        });
        if (movedCell && deletedItemCell && deletedItem) moves.push({
            deletedItem,
            deletedItemCell,
            movedCell
        });
        if (movedCell) moves = [...moves, ...findAllMoves(board, movedCell)];

        return moves;
    }

    const findAllMoves = (board, cell) => {
        let moves = [];
        moves = [...moves, movesFront(board, cell)];
        moves = [...moves, movesRight(board, cell)];
        moves = [...moves, movesLeft(board, cell)];
        return moves;
    }

    // Gelen tüm taşlar için zorunlu hareketleri araştıralım
    cells.forEach(cell => {
        let newMoves = findAllMoves(board, cell);
        if (newMoves.length > 0) allMoves = [...allMoves, newMoves];
    });
    console.log(allMoves)
    return allMoves;
}

export const findMandatoryMoves = (b, cg) => {

    const board = [];
    const currentGamer = {
        id: cg.id,
        name: cg.name,
        color: cg.color,
    }
    for (let c in b) {
        let cell = b[c];
        board.push({
            id: cell.id,
            x: cell.x,
            y: cell.y,
            color: cell.color,
            navigable: cell.navigable,
            item: cell.item && {
                id: cell.item.id,
                color: cell.item.color,
                cellId: cell.item.cellId,
                dama: cell.item.dama,
                isSelected: cell.item.isSelected,
            }
        });
    }
    const cells = board.filter(cell => {
        return cell.item && cell.item.color === currentGamer.color
            && ((board.filter(cell1 => cell1.x === cell.x + 1 // beyaz taş öne
                && cell1.y === cell.y
                && cell1.item
                && cell1.item.color !== currentGamer.color).length > 0)
                || (board.filter(cell3 => cell3.y === cell.y - 1 // siyah taş ön
                    && cell3.x === cell.x
                    && cell3.item
                    && cell3.item.color !== currentGamer.color).length > 0)
                || (board.filter(cell2 => cell2.x === cell.x - 1 // sağa hareket
                    && cell2.y === cell.y
                    && cell2.item
                    && cell2.item.color !== currentGamer.color).length > 0)
                || (board.filter(cell3 => cell3.y === cell.y + 1 // sola hareket
                    && cell3.x === cell.x
                    && cell3.item
                    && cell3.item.color !== currentGamer.color).length > 0)
                || cell.item.dama
            )
    });

    // Taşa basan taşlar bulundu. Şimdi bu taşların hareketleni bulalım
    return findAllMandatoryMoves(board, cells, currentGamer);

}


export const gameFindWhiteMoves = (data) => {
    const board = data.board;
    const selectedCell = board[data.selectedCell.id];

    // const selectedCell = state.board[state.selectedItem.cellId];
    for (let cell in board) {
        // Öndeki kare boş mu? x + 1
        if (((selectedCell.y + 1) === board[cell].y)
            && selectedCell.x === board[cell].x
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        } else if ((selectedCell.x - 1) === board[cell].x
            && selectedCell.y === board[cell].y
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        } else if ((selectedCell.x + 1) === board[cell].x
            && selectedCell.y === board[cell].y
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        }
    }
}

export const gameFindBlackMoves = (data) => {
    const board = data.board;
    const selectedCell = board[data.selectedCell.id];

    // const selectedCell = state.board[state.selectedItem.cellId];
    for (let cell in board) {
        // Öndeki kare boş mu? x - 1
        if (((selectedCell.y - 1) === board[cell].y)
            && selectedCell.x === board[cell].x
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        } else if ((selectedCell.x - 1) === board[cell].x
            && selectedCell.y === board[cell].y
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        } else if ((selectedCell.x + 1) === board[cell].x
            && selectedCell.y === board[cell].y
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        }
    }
}