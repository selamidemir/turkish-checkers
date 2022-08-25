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


export const findCellWithXAndY = (board, x, y) => {
    /* kordinat bilgileri gelen hücreyi bulalım */
    let foundCell = null;
    for (let key in board) {
        if (board[key].x === x && board[key].y === y) {
            foundCell = board[key];
        }
    }
    return foundCell;
}

export const findFrontMoves = (board, itemCell, currentGamer) => {
    /* Ön tarafa yapılabilecek hamleleri bulmak için kullanıyoruz
    Bu hamleleri yaparken dama olan taş da hesaba katılmak zorunda.
    Gelen taş yoz bir taş ise, önde bir taş var mı kontrol et.
    Eğer taş varsa, onun arkasında boşluk var mı diye kontrol et.
    Taşın arkasında boşluk varsa, zorunlu yapılacak bir hamle var
    demektir. 
    Bunu moves dizisine ekleyelim.
    Zorunlu hamle yakalandığında, başka bir hamle olup olmadığını
    ki bu hamle öne, sağa, sola ve dama için geriye olabilir, bulmak
    için tekrar findMandatoryMoves fonksiyonunu çağıracağız.
    */
    let cells = [];

    if (itemCell === undefined) return;

    if (currentGamer.color === 'white') {
        /* İlk Olarak Beyaz Taşları Hedefleyelim */
        let nextCell = null;
        let nextEmptyCell = null;
        for (let cell in board) {
            if (!board[cell].item) continue;
            if (board[cell].item.color !== 'white') continue
            nextCell = null;
            nextEmptyCell = null;
            nextCell = findCellWithXAndY(board, board[cell].x, board[cell].y + 1);
            if (nextCell && !nextCell.item) continue; // sonraki hücrede taş yok
            nextEmptyCell = findCellWithXAndY(board, board[cell].x, board[cell].y + 2); // Yenilecek taşdan sonraki boş hücre

            if (!nextEmptyCell || nextEmptyCell.item) continue;
            if (!nextCell.item) continue;
            if (board[cell].x !== nextCell.x) continue;
            if (nextCell.item.color !== 'black') continue;
            if (!board[cell].item.dama) {
                // hareket var taş dama değil
                nextEmptyCell.navigable = true;
            } else {
                // taş dama önce tüm kolonu bir diziye atalım
            }
            cells.push({
                nextEmptyCell: nextEmptyCell.id,
                nextCell: nextCell.id
            });
        }
    } else { /* İkinci Olarak Siyah Taşları Hedefleyelim */
        for (let cell in board) {
            if (!board[cell].item) continue;
            if (board[cell].item.color !== 'black') continue
            let nextCell = null;
            let nextEmptyCell = null;
            nextCell = findCellWithXAndY(board, board[cell].x, board[cell].y - 1);
            if (nextCell && !nextCell.item) continue; // sonraki hücrede taş yok
            nextEmptyCell = findCellWithXAndY(board, board[cell].x, board[cell].y - 2); // Yenilecek taşdan sonraki boş hücre

            if (!nextEmptyCell || nextEmptyCell.item) continue;
            if (!nextCell.item) continue;
            if (board[cell].x !== nextCell.x) continue;
            if (nextCell.item.color !== 'white') continue;

            // hareket var. Bilgileri cells dizisine ekleyelim
            // itemi sonraki boş hücreye taşıyalım
            // sonra yenilen taşı silelim
            // farklı bir hareket var mı denetleyelim
            cells.push({
                nextCell: nextCell.id,
                cell: board[cell].id
            });
            nextEmptyCell.navigable = true;
        }
        // if (item.dama && !cells.length) break; // Taş dama ve hareket bulunamadı.
    }

    return cells;
}

export const findRihgtMoves = () => {

}

export const findLeftMoves = () => {

}

export const findBackMoves = () => {

}

export const gameFindMandatoryMoves = (board, itemCell, currentGamer) => {
    /* Buraya gelen taşın bastığı taşlar var mı? 
    Eğer bastığı taşlar varsa, her taş için
    sonrasında basılan taşlar dahil edilecek şekilde
    bir yol oluşturulacak ve bu bir dizi haline getirilecek.
    Sonrasında bu dizi geri dönderilerek nextMoves dizisine
    eklenecek. Buradaki mantık, tüm hareketleri bir arada tutarak
    yapılması zorunlu olan en çok taş alan hamlenin yapılmasını sağlamak. 
    
    Yapılacak işlemleri çoğaltarak, yapım işlemini basitleştirme
    şeklinde hareket edeceğiz.
    */
    let moves = [];
    if (!itemCell) return
    moves = [...moves, findFrontMoves(board, itemCell, currentGamer)];
    // moves = [...moves, findRihgtMoves()];
    // moves = [...moves, findLeftMoves()];
    // moves = [...moves, findBackMoves()];
    return moves;
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
        // Öndeki kare boş mu? x + 1
        if (((selectedCell.y - 1) === board[cell].y)
            && selectedCell.x === board[cell].x
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        } else if ((selectedCell.x + 1) === board[cell].x
            && selectedCell.y === board[cell].y
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        } else if ((selectedCell.x - 1) === board[cell].x
            && selectedCell.y === board[cell].y
            && !board[cell].item
        ) {
            board[cell].navigable = true;
        }
    }
}