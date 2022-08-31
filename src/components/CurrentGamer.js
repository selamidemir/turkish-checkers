import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentGamer } from '../redux/gameSlice';

function CurrentGamer() {
    const currentGamer = useSelector(selectCurrentGamer);
  return (
    <div className='current-gamer'>{currentGamer && currentGamer.name} Plays</div>
  );
}

export default CurrentGamer;