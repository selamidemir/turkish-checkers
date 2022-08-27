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

    const movesFront = (b, c, routes, route) => {
        // Öne giden hareketleri bul
        const board = [...b];
        let deletedItem = null;
        let deletedItemCell = null;
        let movedCell = null;
        let isRouteEnd = false;
        board.forEach(cell => {
            if (cell.y === c.y) return;
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
        if (movedCell && deletedItemCell && deletedItem) {
            routes[route].moves.push({deletedItem, deletedItemCell, movedCell});
            findAllMoves(board, movedCell, routes, route);
            isRouteEnd = true;
        } else isRouteEnd = false;
        return isRouteEnd;
    }

    const movesLeft = (b, c, routes, route) => {
        // Sala giden hareketleri bul
        const board = [...b];
        let isRouteEnd = false;
        let deletedItem = null;
        let deletedItemCell = null;
        let movedCell = null;
        board.forEach(cell => {
            if (cell.y === c.y) return;
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
        if (movedCell && deletedItemCell && deletedItem) {
            routes[route].moves.push({deletedItem, deletedItemCell, movedCell});
            findAllMoves(board, movedCell, routes, route);
            isRouteEnd = true;
        } else isRouteEnd = false;
        return isRouteEnd;
    }

    const movesRight = (b, c, routes, route) => {
        // Sağa giden hareketleri bul
        const board = [...b];
        let deletedItem = null;
        let deletedItemCell = null;
        let movedCell = null;
        let isRouteEnd = false;
        board.forEach(cell => {

            if (cell.y !== c.y) return;
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
        if (movedCell && deletedItemCell && deletedItem) {
            routes[route].moves.push({deletedItem, deletedItemCell, movedCell});
            findAllMoves(board, movedCell, routes, route);
            isRouteEnd = true;
        } else isRouteEnd = false;
        return isRouteEnd;
    }

    const findAllMoves = (board, cell, routes, route) => {
        let isRouteEnd = movesFront(board, cell, routes, route);
        if (isRouteEnd) {
            const lastRoutes = route;
            route = nanoid();
            routes[route] = { moves: [...routes[lastRoutes].moves] };
            isRouteEnd = movesRight(board, cell, routes, route);
        } else isRouteEnd = movesRight(board, cell, routes, route);
        if (isRouteEnd) {
            const lastRoutes = route;
            route = nanoid();
            routes[route] = { moves: [...routes[lastRoutes].moves] };
            isRouteEnd = movesLeft(board, cell, routes, route);
        } else isRouteEnd = movesRight(board, cell, routes, route);

    }

    // Gelen tüm taşlar için zorunlu hareketleri araştıralım
    const routes = { };

    cells.forEach(cell => {
        let route = nanoid();
        routes[route] = { moves: [] };
        findAllMoves(board, cell, routes, route);
    });
    for(let key in routes) {
        if(routes[key].moves.length === 0) delete routes[key];
    }
    console.log(routes);
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
    console.log(cells)
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