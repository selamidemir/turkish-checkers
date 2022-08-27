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

const findAllMandatoryMoves = (b, cs, currentGamer, routes) => {
    // b board, c cells 
    // gelen hücrelerde hareket eden taşlar var

    const board = [...b];
    const cells = [...cs];
    let allMoves = [];



    const findAllMoves = (b, c, routes) => {
        let lastMoves = [];
        let sayac = 10;
        let board = b;

        while (sayac) {
            // Sonsuz döngü oluşturuyoruz.
            // Eğer yapılacak hareket kalmazsa 
            // Döngü kırılacak

            // Önde yenilecek taş var mı?
            board = b;
            let isMove = false;
            let deletedItem = null;
            let deletedItemCell = null;
            let cellReached = null;
            let startingCell = c;
            let cellFirst = c;
            let routeId = null;
            let route = null;
            let routeMoves = null;
            let cellItem = null;
            let firstMove = null;
            let lastOneMove = null;
            let lastTwoMove = null;
            console.log(lastMoves)
            if (lastMoves.length) {
                route = routes[lastMoves[0].routeId];
                routeMoves = route.moves.map(item => item.deletedItemCell.id);
                cellReached = route.moves[0].cellReached;
                cellItem = route.moves[0].deletedItem;
                firstMove = lastMoves.shift();
                cellFirst = firstMove.cellReached;
                routeId = firstMove.routeId;
                board = board.map(item => {
                    if (routeMoves.includes(item.id)) delete item.item;
                    if (item.id === cellReached) item.item = cellItem;
                    return item;
                });
            }
            board.forEach(cell => {
                if (isMove) return; // Eğer hareket yapıldı ise geri dön
                if ( // silinen taşı bulalım
                    ((cell.y === cellFirst.y + 1 && currentGamer.color === 'white') || (cell.y === cellFirst.y - 1 && currentGamer.color === 'black'))
                    && cell.item && cell.item.color !== currentGamer.color
                    && cell.x === cellFirst.x
                ) {
                    startingCell = cellFirst;
                    deletedItemCell = cell;
                    deletedItem = cell.item;

                } else if ( // haret edilecek hücreyi bulalım
                    ((cell.y === cellFirst.y + 2 && currentGamer.color === 'white') || (cell.y === cellFirst.y - 2 && currentGamer.color === 'black'))
                    && cell.x === cellFirst.x
                    && !cell.item
                ) {
                    cellReached = cell;
                }
                if (cellReached !== null && deletedItem !== null) isMove = true;
            });
            // Önde hareket var mı?
            let isFrontMove = false;
            if (isMove) {
                let move = {
                    startingCell,
                    deletedItemCell,
                    cellReached,
                    deletedItem,
                }
                if (routeId) {
                    routes[routeId].moves.push(move);
                } else {
                    routeId = nanoid();
                    routes[routeId] = {};
                    routes[routeId].moves = [move];
                }
                isFrontMove = true;
                lastMoves.push({ startingCell, deletedItemCell, cellReached, deletedItem, routeId });
            }
            c = null;
            cellReached = null;
            deletedItem = null;
            deletedItemCell = null;
            isMove = false;

            /* Sola Hareket Var mı? */

            board.forEach(cell => {
                if (isMove) return; // Eğer hareket yapıldı ise geri dön
                if ( // silinen taşı bulalım
                    ((cell.x === cellFirst.x - 1 && currentGamer.color === 'white') || (cell.x === cellFirst.x + 1 && currentGamer.color === 'black'))
                    && cell.item && cell.item.color !== currentGamer.color
                    && cell.y === cellFirst.y
                ) {
                    startingCell = cellFirst;
                    deletedItemCell = cell;
                    deletedItem = cell.item;

                } else if ( // haret edilecek hücreyi bulalım
                    ((cell.x === cellFirst.x - 2 && currentGamer.color === 'white') || (cell.x === cellFirst.x + 2 && currentGamer.color === 'black'))
                    && cell.y === cellFirst.y
                    && !cell.item
                ) {
                    cellReached = cell;
                }
                if (cellReached !== null && deletedItem !== null) isMove = true;
            });
            // Solda hareket var mı?
            let isLeftMove = false;
            if (isMove) {
                let move = {
                    startingCell,
                    deletedItemCell,
                    cellReached,
                    deletedItem,
                }
                if (!isFrontMove) {
                    routes[routeId].moves.push(move);
                } else {
                    let moves = [...routes[routeId].moves];
                    moves.length -= 1; // Öne doğru son hareketi silelim
                    routeId = nanoid();
                    routes[routeId] = {};
                    routes[routeId].moves = [...moves, move];
                }

                lastMoves.push({ startingCell, deletedItemCell, cellReached, deletedItem, routeId });
                isLeftMove = true;
            }
            c = null;
            cellReached = null;
            deletedItem = null;
            deletedItemCell = null;
            startingCell = null;
            isMove = false;

            
            sayac -= 1 // hatalı durumlarda gereksiz döngüyü sonladıracak
            // öne, sola ve sağa hareketlerden sonra bu satır çalışmalı
            if (!lastMoves.length) break; // hareket kalmadı
        }
    }
    // Gelen tüm taşlar için zorunlu hareketleri araştıralım
    cells.forEach(cell => {
        findAllMoves(board, cell, routes);
    });

    console.log("routes ", routes)
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
    let routes = {};
    return findAllMandatoryMoves(board, cells, currentGamer, routes);

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

// const movesFront = (b, c, routes, route) => {
//     // Öne giden hareketleri bul
//     const board = [...b];
//     let deletedItem = null;
//     let deletedItemCell = null;
//     let movedCell = null;
//     let isRouteEnd = false;
//     board.forEach(cell => {
//         if (cell.y === c.y) return;
//         if ( // silinen taşı bulalım
//             ((cell.y === c.y + 1 && currentGamer.color === 'white') || (cell.y === c.y - 1 && currentGamer.color === 'black'))
//             && cell.item && cell.item.com !== currentGamer.color
//             && cell.x === c.x
//         ) {
//             deletedItemCell = cell;
//             deletedItem = cell && cell.item;
//         } else if ( // haret edilecek hücreyi bulalım
//             ((cell.y === c.y + 2 && currentGamer.color === 'white') || (cell.y === c.y - 2 && currentGamer.color === 'black'))
//             && cell.x === c.x
//             && !cell.item
//         ) movedCell = cell;
//     });
//     if (movedCell && deletedItemCell && deletedItem) {
//         routes[route].moves.push({ deletedItem, deletedItemCell, movedCell });
//         findAllMoves(board, movedCell, routes, route);
//         isRouteEnd = true;
//     } else isRouteEnd = false;
//     return isRouteEnd;
// }

// const movesLeft = (b, c, routes, route) => {
//     // Sala giden hareketleri bul
//     const board = [...b];
//     let isRouteEnd = false;
//     let deletedItem = null;
//     let deletedItemCell = null;
//     let movedCell = null;
//     board.forEach(cell => {
//         if (cell.y === c.y) return;
//         if ( // silinen taşı bulalım
//             ((cell.x === c.x - 1 && currentGamer.color === 'white') || (cell.x === c.x + 1 && currentGamer.color === 'black'))
//             && cell.item && cell.item.color !== currentGamer.color
//             && cell.y === c.y
//         ) {
//             deletedItemCell = cell;
//             deletedItem = cell && cell.item;
//         } else if ( // haret edilecek hücreyi bulalım
//             ((cell.x === c.x - 2 && currentGamer.color === 'white') || (cell.x === c.x + 2 && currentGamer.color === 'black'))
//             && cell.y === c.y
//             && !cell.item
//         ) movedCell = cell;
//     });
//     if (movedCell && deletedItemCell && deletedItem) {
//         routes[route].moves.push({ deletedItem, deletedItemCell, movedCell });
//         findAllMoves(board, movedCell, routes, route);
//         isRouteEnd = true;
//     } else isRouteEnd = false;
//     return isRouteEnd;
// }

// const movesRight = (b, c, routes, route) => {
//     // Sağa giden hareketleri bul
//     const board = [...b];
//     let deletedItem = null;
//     let deletedItemCell = null;
//     let movedCell = null;
//     let isRouteEnd = false;
//     board.forEach(cell => {

//         if (cell.y !== c.y) return;
//         if ( // silinen taşı bulalım
//             ((cell.x === c.x + 1 && currentGamer.color === 'white') || (cell.x === c.x - 1 && currentGamer.color === 'black'))
//             && cell.item && cell.item.color !== currentGamer.color
//             && cell.y === c.y
//         ) {
//             deletedItemCell = cell;
//             deletedItem = cell && cell.item;
//         } else if ( // haret edilecek hücreyi bulalım
//             ((cell.x === c.x + 2 && currentGamer.color === 'white') || (cell.x === c.x - 2 && currentGamer.color === 'black'))
//             && cell.y === c.y
//             && !cell.item
//         ) movedCell = cell;
//     });
//     if (movedCell && deletedItemCell && deletedItem) {
//         routes[route].moves.push({ deletedItem, deletedItemCell, movedCell });
//         findAllMoves(board, movedCell, routes, route);
//         isRouteEnd = true;
//     } else isRouteEnd = false;
//     return isRouteEnd;
// }