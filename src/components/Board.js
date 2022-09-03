import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findBlackDamaMoves, findBlackMoves, findWhiteDamaMoves, findWhiteMoves, initGame, selectBoard, selectSelectedItem } from '../redux/gameSlice';
import Cell from './Cell';

function Board() {
    const dispatch = useDispatch();
    const board = useSelector(selectBoard);
    const selectedItem = useSelector(selectSelectedItem);

    useEffect(() => {
        if(selectedItem === null) return; // Seçili item yok
        else if(selectedItem.color === 'white' && selectedItem.dama) dispatch(findWhiteDamaMoves());
        else if(selectedItem.color === 'white' && !selectedItem.dama) dispatch(findWhiteMoves());
        else if(selectedItem.color === 'black' && selectedItem.dama) dispatch(findBlackDamaMoves());
        else if(selectedItem.color === 'black' && !selectedItem.dama) dispatch(findBlackMoves())
    },[selectedItem, dispatch]);
    
    const boardList = [];
    for(let key in board) boardList.push(board[key]);

    useEffect(() => {
        dispatch(initGame());

    }, [dispatch]);

    return (
        <div className="board">
            {
                boardList && boardList.map((cell, index) => <Cell key={index} cell={cell}></Cell>)
            }
        </div>
    );
}

export default Board;