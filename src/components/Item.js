import React from 'react'; import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentGamer, selectIsForcedMove, setSelectedItem } from '../redux/gameSlice';
;

function Item({ item }) {
    const dispatch = useDispatch();
    const currentGamer = useSelector(selectCurrentGamer);
    const isForcedMove = useSelector(selectIsForcedMove);

    const handleClick = (e) => {
        if (!item) return;
        if (!currentGamer) return;
        if (isForcedMove && !item.forcedMove) return;

        dispatch(setSelectedItem(item));
    }
    return (
        <div onClick={e => handleClick(e)} className={`item ${item.color} ${item.isSelected}`}>
            {item.dama && <div className={`item-dama ${item.color === 'white' ? 'white' : 'black'}`}></div>}
        </div>
    );
}

export default Item;