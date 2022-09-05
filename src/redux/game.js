import { nanoid } from "@reduxjs/toolkit";

export const createItem = (y_line) => {
    if (y_line === 2 || y_line === 3) return { id: nanoid(), dama: false, color: 'white', isSelected: '', forcedMove: false, willDelete: false };
    else if (y_line === 6 || y_line === 7) return { id: nanoid(), dama: false, color: 'black', isSelected: '', forcedMove: false, willDelete: false };
    return;
}

export const createBoard = () => {
    const board = {};
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
                startingCell: false,
                reached: false,
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

const findRightMove = (data) => {
    /* Sağa Hareket Var mı? */
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
            (cell.x === cellFirst.x + 1)
            && cell.item && (cell.item.color !== currentGamer.color)
            && cell.y === cellFirst.y
        ) {
            startingCell = cellFirst;
            deletedItemCell = cell;
            deletedItem = cell.item;

        } else if ( // hareket edilecek hücreyi bulalım
            ((cell.x === cellFirst.x + 2))
            && cell.y === cellFirst.y
            && !cell.item
        ) {
            cellReached = cell;
        }
        if (cellReached && deletedItem && deletedItemCell) isMove = true;
    });
    // Sağa hareket var mı?
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
            // console.log("FRONT ")
            // routeId && console.log("routeId : ", routeId)
            // console.log("isFrontMove : ", isFrontMove)
            // routeId && console.log("routes[routeId] : ", routes[routeId])
            // console.log("newMove : ", newMove)
            // console.log("lastMoves : ", lastMoves)
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

        newMove = findLeftMove(data);
        let isLeftMove = false;
        if (newMove.isMove) {
            newMove.move.sayac = sayac;
            // console.log("LEFT ")
            // routeId && console.log("routeId : ", routeId)
            // console.log("isFrontMove : ", isFrontMove)
            // routeId && console.log("routes[routeId] : ", routes[routeId])
            // console.log("newMove : ", newMove)
            // console.log("lastMoves : ", lastMoves)
            if (isFrontMove && !routeId) {
                let newRouteId = nanoid();
                routes[newRouteId] = { moves: [newMove.move] };
                lastMoves.push({ ...newMove.move, routeId: newRouteId, direction: 'left' });
            } else if (isFrontMove && routeId) {
                let newRouteId = nanoid();
                let moves = [...routes[routeId].moves];
                moves.length -= 1;
                routes[newRouteId] = { moves: [...moves, newMove.move] };
                lastMoves.push({ ...newMove.move, routeId: newRouteId, direction: 'left' });
            } else if (!routeId && !isFrontMove) {
                let newRouteId = nanoid();
                routes[newRouteId] = { moves: [newMove.move] };
                lastMoves.push({ ...newMove.move, routeId: newRouteId, direction: 'left' });
            }
            isLeftMove = true;
        }

        newMove = findRightMove(data);
        if (newMove.isMove) {
            newMove.move.sayac = sayac;
            // console.log("RIGHT ")
            // routeId && console.log("routeId : ", routeId)
            // console.log("isFrontMove : ", isFrontMove)
            // routeId && console.log("routes[routeId] : ", routes[routeId])
            // console.log("newMove : ", newMove)
            // console.log("lastMoves : ", lastMoves)
            if ((isFrontMove || isLeftMove) && !routeId) {
                let newRouteId = nanoid();
                routes[newRouteId] = { moves: [newMove.move] };
                lastMoves.push({ ...newMove.move, routeId: newRouteId, direction: 'right' });
            } else if ((isFrontMove || isLeftMove) && routeId) {
                let newRouteId = nanoid();
                let moves = [...routes[routeId].moves];
                moves.length -= 1;
                routes[newRouteId] = { moves: [...moves, newMove.move] };
                lastMoves.push({ ...newMove.move, routeId: newRouteId, direction: 'right' });
            } else if (!routeId && !isFrontMove) {
                let newRouteId = nanoid();
                routes[newRouteId] = { moves: [newMove.move] };
                lastMoves.push({ ...newMove.move, routeId: newRouteId, direction: 'right' });
            }
        }

        sayac += 1 // hatalı durumlarda gereksiz döngüyü sonladıracak

        // öne, sola ve sağa hareketlerden sonra bu satır çalışmalı
        if (!lastMoves.length) break; // hareket kalmadı
    }
    return routes;
}

const findDamaAllMoves = (b, c, cg, bb) => {
    let board = [...b];
    let cell = { ...c };
    let currentGamer = { ...cg };
    let routes = {};
    let newMove = {};
    let routeId = null;

    console.log("dama find all moves")

    const findDamaFrontMoves = (col_one, cell, currentGamer) => {
        // Dama taşının üstünde kalan bölüm
        // Önde doğru hareket var mı? Bunun için
        // hemen damanın önünde en az bir rakip
        // taş olmalı ve o taşın arkasında en az
        // boş bir kare bulunmalıdır.
        let deletedItem = null;
        let deletedItemCell = null;
        let startingCell = { ...cell };
        let move = {
            isMove: false,
            move: {
                startingCell: null,
                deletedItemCell: null,
                cellsReached: [],
                deletedItem: null,
            }
        };
        let isStone = false;
        let isOwnStone = false;

        for (let i = col_one.length - 1; i >= 0; i--) {
            let cell = col_one[i];
            console.log("damaFront")
            console.log(cell.x, cell.y, cell.item)
            if (cell.item && cell.item.color === currentGamer.color) isOwnStone = true;
            if (isOwnStone) break;
            if(isStone && cell.item) break;
            if (cell.item && cell.item.color !== currentGamer.color) {
                isStone = true;
                deletedItem = cell.item;
                deletedItemCell = cell;
                continue; // İlk taş bulundu, başa dönelim
            }
            if (isStone && !cell.item) {
                // Taş var ve önü boş
                move.isMove = true;
                move.move.startingCell = startingCell;
                move.move.deletedItemCell = deletedItemCell;
                move.move.cellsReached.push(cell);
                move.move.deletedItem = deletedItem;
            } else if (isStone) {
                // Eğer peşpeşe iki adet rakip taş varsa
                // Hareketi durdurmak için eklendi
                break;
            }
        }
        console.log("damaFront : ", move);
        return move;
    }

    const findDamaBackMoves = (col_two, cell, currentGamer) => {
        // Dama taşının arkasında kalan bölüm
        // arkaya doğru hareket var mı? Bunun için
        // hemen damanın akrasında en az bir rakip
        // taş olmalı ve o taşın arkasında en az
        // boş bir kare bulunmalıdır.
        let deletedItem = null;
        let deletedItemCell = null;
        let startingCell = { ...cell };
        let move = {
            isMove: false,
            move: {
                startingCell: null,
                deletedItemCell: null,
                cellsReached: [],
                deletedItem: null,
            }
        };
        let isStone = false;
        let isOwnStone = false;

        for (let i = 0; i < col_two.length; i++) {
            let cell = col_two[i];
            console.log("damaBack")
            console.log(cell.x, cell.y, cell.item)
            if (cell.item && cell.item.color === currentGamer.color) isOwnStone = true;
            if (isOwnStone) break;
            if(isStone && cell.item) break;
            if (isStone && !cell.item) {
                // Taş var ve önü boş
                move.isMove = true;
                move.move.startingCell = startingCell;
                move.move.deletedItemCell = deletedItemCell;
                move.move.cellsReached.push(cell);
                move.move.deletedItem = deletedItem;
            } 
            if (cell.item && cell.item.color !== currentGamer.color) {
                isStone = true;
                deletedItem = cell.item;
                deletedItemCell = cell;
                continue; // İlk taş bulundu, başa dönelim
            }
        }
        return move;
    }

    const findDamaLeftMoves = (row_one, cell, currentGamer) => {
        let deletedItem = null;
        let deletedItemCell = null;
        let startingCell = { ...cell };
        let move = {
            isMove: false,
            move: {
                startingCell: null,
                deletedItemCell: null,
                cellsReached: [],
                deletedItem: null,
            }
        };
        let isStone = false;
        let isOwnStone = false;
        for (let i = row_one.length - 1; i >= 0; i--) {
            let cell = row_one[i];
            if (cell.item && cell.item.color === currentGamer.color) isOwnStone = true;
            if (isOwnStone) break;
            if (cell.item && cell.item.color !== currentGamer.color) {
                isStone = true;
                deletedItem = cell.item;
                deletedItemCell = cell;
                continue; // İlk taş bulundu, başa dönelim
            }
            if (isStone && !cell.item) {
                // Taş var ve önü boş
                move.isMove = true;
                move.move.startingCell = startingCell;
                move.move.deletedItemCell = deletedItemCell;
                move.move.cellsReached.push(cell);
                move.move.deletedItem = deletedItem;
            }
        }
        return move;
    }

    const findDamaRightMoves = (row_two, cell, currentGamer) => {
        let deletedItem = null;
        let deletedItemCell = null;
        let startingCell = { ...cell };
        let move = {
            isMove: false,
            move: {
                startingCell: null,
                deletedItemCell: null,
                cellsReached: [],
                deletedItem: null,
            }
        };
        let isStone = false;
        let isOwnStone = false;
        for (let i = 0; i < row_two.length; i++) {
            let cell = row_two[i];
            if (cell.item && cell.item.color === currentGamer.color) isOwnStone = true;
            if (isOwnStone) break;
            if (cell.item && cell.item.color !== currentGamer.color) {
                isStone = true;
                deletedItem = cell.item;
                deletedItemCell = cell;
                continue; // İlk taş bulundu, başa dönelim
            }
            if (isStone && !cell.item) {
                // Taş var ve önü boş
                move.isMove = true;
                move.move.startingCell = startingCell;
                move.move.deletedItemCell = deletedItemCell;
                move.move.cellsReached.push(cell);
                move.move.deletedItem = deletedItem;
            }
        }
        return move;
    }

    // Dama olan taş öne, arkaya, sağa ve sola hareket edebilir
    // Dama olan taş dikey veya yatay istediği kadar gidebilir
    const x = cell.x;
    const y = cell.y;
    const row = [];
    const col = [];

    // Damanın olduğu satır ve sütündaki hücreleri bulalım
    for (let key in board) {
        let cell = board[key];
        if (cell.y === y) row.push(cell);
        if (cell.x === x) col.push(cell);
    }

    const row_one = row.splice(0, x - 1);
    const row_two = row.splice(1);

    col.reverse()
    const col_one = col.splice(0, y - 1);
    const col_two = col.splice(1);
    newMove = findDamaFrontMoves(col_one, cell, currentGamer);
    if (newMove.isMove) {
        routeId = nanoid();
        routes[routeId] = {
            // id: nanoid(),
            moves: [newMove.move],
            isDama: true,
        }
    }

    newMove = findDamaBackMoves(col_two, cell, currentGamer);
    if (newMove.isMove) {
        routeId = nanoid();
        routes[routeId] = {
            // id: nanoid(),
            moves: [newMove.move],
            isDama: true,
        }
    }

    newMove = findDamaLeftMoves(row_one, cell, currentGamer);
    if (newMove.isMove) {
        routeId = nanoid();
        routes[routeId] = {
            // id: nanoid(),
            moves: [newMove.move],
            isDama: true,
        }
    }

    newMove = findDamaRightMoves(row_two, cell, currentGamer);

    if (newMove.isMove) {
        routeId = nanoid();
        routes[routeId] = {
            // id: nanoid(),
            moves: [newMove.move],
            isDama: true,
        }
    }

    return routes;
}

const findAllMandatoryMoves = (b, cs, currentGamer, bb) => {
    // b board, c cells 
    // gelen hücrelerde hareket eden taşlar var

    const board = [...b];
    const cells = [...cs];
    let cellsMoves = [];



    // Gelen tüm taşlar için zorunlu hareketleri araştıralım
    cells.forEach(cell => {
        let newRoutes = null;
        if (cell.item && cell.item.dama) newRoutes = findDamaAllMoves(board, cell, currentGamer, bb);
        else newRoutes = findAllMoves(board, cell, currentGamer, bb);
        cellsMoves.push({ cellId: cell.id, routes: { ...newRoutes } });
    });

    return cellsMoves;
}

const markMovedItems = (cellMoves, b) => {
    // Eğer zorunlu hareket eden taş varsa onları işaretle
    // her item için forcedMove özelliği zorunlu hareket
    // için kullanılır

    const markTheCell = (route, b) => {
        console.log(route)
        // b[route.moves[0].cellReached.id].reached = true;
        if (!route.isDama) {
            b[route.moves[0].cellReached.id].navigable = true;
            b[route.moves[0].cellReached.id].deletedItem = b[route.moves[0].deletedItemCell.id].item;
        } else {
            route.moves[0].cellsReached.forEach(cell => {
                b[cell.id].navigable = true;
                b[cell.id].deletedItem = b[route.moves[0].deletedItemCell.id].item;
            });
        }

        b[route.moves[0].deletedItemCell.id].item.willDelete = true;
        b[route.moves[0].startingCell.id].startingCell = true;
        b[route.moves[0].startingCell.id].item.forcedMove = true;
    }

    cellMoves.forEach(cell => {
        // Hücre için bulunan routeları alalım

        for (let key in cell.routes) {
            // hareketleri alalım;
            let route = cell.routes[key];
            markTheCell(route, b);
        };
    });
    let isMove = false;

    if (cellMoves.length && Object.keys(cellMoves[0].routes).length) isMove = true;
    return isMove;
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
            && ((board.filter(cell1 => cell1.y === cell.y + 1 // beyaz taş öne
                && cell1.x === cell.x
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
                || (board.filter(cell3 => cell3.x === cell.x + 1 // sola hareket
                    && cell3.y === cell.y
                    && cell3.item
                    && cell3.item.color !== currentGamer.color).length > 0)
                || cell.item.dama
            )
            && ((board.filter(cell1 => cell1.y === cell.y + 2 // beyaz 2 ön
                && cell1.x === cell.x
                && !cell1.item))
                || (board.filter(cell3 => cell3.y === cell.y - 2 // siyah 2 ön
                    && cell3.x === cell.x
                    && !cell3.item))
            )
    });

    // Taşa basan taşlar bulundu. Şimdi bu taşların hareketleni bulalım

    const routes = findAllMandatoryMoves(board, cells, currentGamer, b);
    const isMove = markMovedItems(routes, b);
    return isMove;
}

export const gameFindWhiteDamaMoves = (data) => {
    // Dama olan taş öne, arkaya, sağa ve sola hareket edebilir
    // Dama olan taş dikey veya yatay istediği kadar gidebilir
    const board = data.board;
    const selectedCell = board[data.selectedCell.id];
    const x = selectedCell.x;
    const y = selectedCell.y;
    const row = [];
    const col = [];

    // Damanın olduğu satır ve sütündaki hücreleri bulalım
    for (let key in board) {
        let cell = board[key];
        if (cell.y === y) row.push(cell);
        if (cell.x === x) col.push(cell);
    }

    // Satır üzerinde (x ekseni) hareket var mı?
    // Damanın olduğu yerden elimizdeki satırı dizisini
    // ikiye bölelim
    const row_one = row.splice(0, x - 1);
    const row_two = row.splice(1);

    let isStone = false;
    for (let i = row_one.length - 1; i >= 0; i--) {
        let cell = row_one[i];
        if (!isStone && !cell.item) cell.navigable = true;
        else isStone = true;
    }
    isStone = false;
    for (let i = 0; i < row_two.length; i++) {
        let cell = row_two[i];
        if (!isStone && !cell.item) cell.navigable = true;
        else isStone = true;
    }

    // Sütun üzerinde (y ekseni) hareket var mı?
    // Damanın olduğu yerden elimizdeki col dizisini
    // ikiye bölelim
    col.reverse()
    const col_one = col.splice(0, y - 1);
    const col_two = col.splice(1);

    isStone = false;
    for (let i = col_one.length - 1; i >= 0; i--) {
        let cell = col_one[i];
        if (!isStone && !cell.item) cell.navigable = true;
        else isStone = true;
    }
    isStone = false;
    for (let i = 0; i < col_two.length; i++) {

        let cell = col_two[i];
        if (cell.item) console.log(cell.item.id, cell.item.color)
        if (!isStone && !cell.item) cell.navigable = true;
        else isStone = true;
    }

}

export const gameFindBlackDamaMoves = (data) => {
    const board = data.board;
    const selectedCell = board[data.selectedCell.id];
    const x = selectedCell.x;
    const y = selectedCell.y;
    const row = [];
    const col = [];

    // Damanın olduğu satır ve sütündaki hücreleri bulalım
    for (let key in board) {
        let cell = board[key];
        if (cell.y === y) row.push(cell);
        if (cell.x === x) col.push(cell);
    }

    // Satır üzerinde (x ekseni) hareket var mı?
    // Damanın olduğu yerden elimizdeki satırı dizisini
    // ikiye bölelim
    const row_one = row.splice(0, x - 1);
    const row_two = row.splice(1);

    let isStone = false;
    for (let i = row_one.length - 1; i >= 0; i--) {
        let cell = row_one[i];
        if (!isStone && !cell.item) cell.navigable = true;
        else isStone = true;
    }
    isStone = false;
    for (let i = 0; i < row_two.length; i++) {
        let cell = row_two[i];
        if (!isStone && !cell.item) cell.navigable = true;
        else isStone = true;
    }

    // Sütun üzerinde (y ekseni) hareket var mı?
    // Damanın olduğu yerden elimizdeki col dizisini
    // ikiye bölelim
    col.reverse()
    const col_one = col.splice(0, y - 1);
    const col_two = col.splice(1);

    isStone = false;
    for (let i = col_one.length - 1; i >= 0; i--) {
        let cell = col_one[i];
        console.log("part 1 ", cell.x, cell.y)
        if (!isStone && !cell.item) cell.navigable = true;
        else isStone = true;
    }
    isStone = false;
    for (let i = 0; i < col_two.length; i++) {

        let cell = col_two[i];
        if (cell.item) console.log(cell.item.id, cell.item.color)
        if (!isStone && !cell.item) cell.navigable = true;
        else isStone = true;
    }
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