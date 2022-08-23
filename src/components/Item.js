import React from 'react'; import { useDispatch } from 'react-redux';
import { setSelectedItem } from '../redux/gameSlice';
;

function Item({ item }) {
    const dispatch = useDispatch();
    const handleClick = (e) => {
        if (!item) return;
        dispatch(setSelectedItem(item));
    }
    return (
        <div onClick={e => handleClick(e)} className={`item ${item.color} ${item.isSelected}`}></div>
    );
}

export default Item;