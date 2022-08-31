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
                y: j,
                x: i,
                navigable: false,
                moveable: false,
                color: color,
                item: item,
            };
        }
    }
    return board;
}
const findFrontMove = (data) => {
    // Önde yenilecek taş var mı?
    let board = [...data.board];
    let currentGamer = { ...data.currentGamer };
    let isMove = false;
    let deletedItem = null;
    let deletedItemCell = null;
    let cellReached = null;
    let startingCell = { ...data.cell };
    let cellFirst = startingCell;
    let move = { isMove: false };


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
        if (cellReached && deletedItem && deletedItemCell) isMove = true;
    });
    // Önde hareket var mı?
    if (isMove) {
        move = {
            move: {
                startingCell,
                deletedItemCell,
                cellReached,
                deletedItem,
            },
            isMove,
        }
    }
    return move;
}

const findLeftMove = (data) => {
    /* Sola Hareket Var mı? */
    let board = [...data.board];
    let currentGamer = { ...data.currentGamer };
    let isMove = false;
    let deletedItem = null;
    let deletedItemCell = null;
    let cellReached = null;
    let startingCell = { ...data.cell };
    let cellFirst = startingCell;
    let move = { isMove: false };

    board.forEach(cell => {
        if (isMove) return; // Eğer hareket yapıldı ise geri dön
        if ( // silinen taşı bulalım
            (cell.x === cellFirst.x - 1)
            && cell.item && (cell.item.color !== currentGamer.color)
            && cell.y === cellFirst.y
        ) {
            startingCell = cellFirst;
            deletedItemCell = cell;
            deletedItem = cell.item;

        } else if ( // hareket edilecek hücreyi bulalım
            ((cell.x === cellFirst.x - 2))
            && cell.y === cellFirst.y
            && !cell.item
        ) {
            cellReached = cell;
        }
        if (cellReached && deletedItem && deletedItemCell) isMove = true;
    });
    // Sola hareket var mı?
    if (isMove) {
        move = {
            move: {
                startingCell,
                deletedItemCell,
                cellReached,
                deletedItem,
            },
            isMove,
        }
    }
    return move;
}

// const findRightMove = () => {
//     // /* Sağa Hareket Var mı? */

//     // board.forEach(cell => {
//     //     if (isMove) return; // Eğer hareket yapıldı ise geri dön
//     //     if ( // silinen taşı bulalım
//     //         ((cell.x === cellFirst.x + 1 && currentGamer.color === 'white') || (cell.x === cellFirst.x - 1 && currentGamer.color === 'black'))
//     //         && cell.item && cell.item.color !== currentGamer.color
//     //         && cell.y === cellFirst.y
//     //     ) {
//     //         startingCell = cellFirst;
//     //         deletedItemCell = cell;
//     //         deletedItem = cell.item;
//     //         console.log("sağ alır")
//     //     } else if ( // haret edilecek hücreyi bulalım
//     //         ((cell.x === cellFirst.x + 2 && currentGamer.color === 'white') || (cell.x === cellFirst.x - 2 && currentGamer.color === 'black'))
//     //         && cell.y === cellFirst.y
//     //         && !cell.item
//     //     ) {
//     //         cellReached = cell;
//     //     }
//     //     if (cellReached !== null && deletedItem !== null) isMove = true;
//     // });
//     // // Sağa hareket var mı?
//     // // let isRightMove = false; 
//     // if (isMove) {
//     //     console.log("sağa hareket")
//     //     let move = {
//     //         startingCell,
//     //         deletedItemCell,
//     //         cellReached,
//     //         deletedItem,
//     //     }
//     //     let moves = null;
//     //     if (isFrontMove && !isLeftMove) {
//     //         moves = [...routes[routeId].moves];
//     //         moves.length -= 1;
//     //         routeId = nanoid();
//     //         routes[routeId] = {};
//     //         routes[routeId].moves = [...moves, move];
//     //         routes[routeId].moves.push(move);
//     //     } else if (!isFrontMove && isLeftMove) {
//     //         moves = [...routes[routeId].moves];
//     //         moves.length -= 1;
//     //         routeId = nanoid();
//     //         routes[routeId] = {};
//     //         routes[routeId].moves = [...moves, move];
//     //         routes[routeId].moves.push(move);
//     //     } else if (isFrontMove && isLeftMove) {
//     //         moves = [...routes[routeId].moves];
//     //         moves.length -= 2;
//     //         routeId = nanoid();
//     //         routes[routeId] = {};
//     //         routes[routeId].moves = [...moves, move];
//     //         routes[routeId].moves.push(move);
//     //     } else {
//     //         routeId = nanoid();
//     //         routes[routeId] = {};
//     //         routes[routeId].moves = [move];
//     //     }

//     //     lastMoves.push({ startingCell, deletedItemCell, cellReached, deletedItem, routeId });
//     //     // isRightMove = true;
//     // }
//     // c = null;
//     // cellReached = null;
//     // deletedItem = null;
//     // deletedItemCell = null;
//     // startingCell = null;
//     // isMove = false;
//     // routeId = null;

// }

const findAllMoves = (b, c, cg, bb) => {
    let board = [...b];
    let cell = { ...c };
    let currentGamer = { ...cg };
    let lastMoves = [];
    let sayac = 1;
    let routes = {};
    let newMove = {};
    let routeId = null;
    let firstMove = null;
    let route = null;

    while (sayac < 10) {
        // Sonsuz döngü oluşturuyoruz.
        // Eğer yapılacak hareket kalmazsa 
        // Döngü kırılacak
        if (lastMoves.length > 0) {
            route = routes[lastMoves[0].routeId];
            let routeMoves = route.moves.map(item => item.deletedItemCell.id);
            let cellReached = route.moves[0].cellReached;
            let startingCell = route.moves[0].startingCell;
            console.log("route : ", route)
            board = board.map(item => {
                bb[item.id].willDelete = false;   
                bb[item.id].willMove = false;   
                if (routeMoves.includes(item.id)) {
                    delete item.item;
                    // bb[item.id].willDelete = true;
                }
                if (item.id === cellReached.id) {
                    item.item = startingCell.item;
                    // bb[item.id].willMove = true;
                }
                if (item.id === startingCell.id) {
                    delete item.item;
                    // bb[item.id].willMove = true;
                }
                return item;
            });
            cell = cellReached;
            firstMove = lastMoves.pop();
            routeId = firstMove.routeId;
        }
        let data = {
            board,
            cell,
            currentGamer
        }
        newMove = findFrontMove(data);
        let isFrontMove = false;
        if (newMove.isMove) {
            // Bir taş yendi
            newMove.move.sayac = sayac;
            console.log("new move : ", newMove.move)
            if (routeId) {
                routes[routeId].moves.push(newMove.move);
                lastMoves.push({ ...newMove.move, routeId, direction: 'front' });
            }
            else {
                let newRouteId = nanoid();
                routes[newRouteId] = { moves: [newMove.move] };
                lastMoves.push({ ...newMove.move, routeId: newRouteId, direction: 'front' });
            };
            isFrontMove = true;
        }

        // newMove = findLeftMove(data);
        // if (newMove.isMove) {
        //     newMove.move.sayac = sayac;
        //     if (routeId) {
        //         if (isFrontMove) {
        //             let newRouteId = nanoid();
        //             let moves = [...routes[routeId].moves];
        //             moves.length -= 1;
        //             routes[newRouteId] = { moves: [...moves, newMove.move] };
        //             lastMoves.push({ ...newMove.move, routeId: newRouteId, direction: 'left' });
        //         } else {
        //             routes[routeId].moves.push(newMove.move);
        //             lastMoves.push({ ...newMove.move, routeId, direction: 'left' });
        //         }   
        //     } else {
        //         let newRouteId = nanoid();
        //         routes[newRouteId] = { moves: [newMove.move] };
        //         lastMoves.push({ ...newMove.move, routeId: newRouteId, direction: 'left' });
        //     }
        // }
        sayac += 1 // hatalı durumlarda gereksiz döngüyü sonladıracak
        // öne, sola ve sağa hareketlerden sonra bu satır çalışmalı
        if (lastMoves.length <= 0) break; // hareket kalmadı
    }
    return routes;
}

const findAllMandatoryMoves = (b, cs, currentGamer, bb) => {
    // b board, c cells 
    // gelen hücrelerde hareket eden taşlar var

    const board = [...b];
    const cells = [...cs];
    let routes = {};



    // Gelen tüm taşlar için zorunlu hareketleri araştıralım
    cells.forEach(cell => {
        let newRoutes = findAllMoves(board, cell, currentGamer, bb);
        routes = { ...routes, ...newRoutes };
    });

    return routes;
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

    const routes = findAllMandatoryMoves(board, cells, currentGamer, b);
    return routes;
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