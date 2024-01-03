import { useEffect, useRef, useState } from "react";
import Draggable from 'react-draggable';

const StickyNote = () => {
    return (
        <Draggable>
            <div className="sticky__note" >
                <p>Example note</p>
            </div>
        </Draggable>
    );
}
 
export default StickyNote;