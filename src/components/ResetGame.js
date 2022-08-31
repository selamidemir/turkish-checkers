import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetGame, selectCurrentGamer } from '../redux/gameSlice';

function ResetGame() {
    const currentGamer = useSelector(selectCurrentGamer);
    const dispatch = useDispatch();
    const handleReset = (e) => {
        e.preventDefault();
        dispatch(resetGame());
    }
    
    return (
        <div className='reset-game' onClick={(e) => handleReset(e)}>{ currentGamer ? 'ResetGame' : 'Start Game' }</div>
    );
}

export default ResetGame;