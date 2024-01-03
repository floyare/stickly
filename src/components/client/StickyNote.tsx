import { useState } from "react";
import Draggable from 'react-draggable';
import type { StickyNoteType } from "../../types/StickyBoardTypes";

const StickyNote = ({note, updateNote}: {note: StickyNoteType, updateNote: (note: StickyNoteType) => void}) => {
    const [position, positionSet] = useState<{x: number, y: number}>({x: note.x ? note.x : 0, y: note.y ? note.y : 0})
    const onStop = () => {
        updateNote({...note, x: position.x, y: position.y})
    }

    const onDrag = (e: any, position: any) => {
        //console.log(e, ui)
        positionSet({x: position.x, y: position.y})
    }

    return (
        <Draggable onStop={onStop} onDrag={onDrag} handle=".dragger" position={{x: position.x, y: position.y}}>
            <div className="sticky__note">
                <div className="dragger"></div>
                <p>{note.content}</p>
            </div>
        </Draggable>
    );
}
 
export default StickyNote;