import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedItem, moveItem } from '../redux/gameSlice';
import Item from './Item';

function Cell({cell}) {
    const dispatch = useDispatch();
    const selectedItem = useSelector(selectSelectedItem);

    const handleClick = (e) => {
        if(!selectedItem) return;
        dispatch(moveItem(cell));
    }
  return (
    <div data-id={cell.id} onClick={e => handleClick(e)} className={`cell ${cell.color} ${cell.navigable ? 'navigable' : ''}`}>{cell.x} {cell.y} {cell.item && <Item item={cell.item} />}</div>
  );
}

export default Cell;