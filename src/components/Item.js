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
        <div onClick={e => handleClick(e)} className={`item ${item.color} ${item.isSelected}`}>
            { item.dama && <div className={`item-dama ${item.color === 'white' ? 'white' : 'black'}`}></div> }
            </div>
    );
}

export default Item;