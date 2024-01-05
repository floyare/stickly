import { useState } from "react";
import Draggable from 'react-draggable';
import type { StickyNoteType } from "../../types/StickyBoardTypes";

const StickyNote = ({note, updateNote}: {note: StickyNoteType, updateNote: (note: StickyNoteType) => void}) => {
    const [position, positionSet] = useState<{x: number, y: number}>({x: note.x ? note.x : 0, y: note.y ? note.y : 0})
    const [content, contentSet] = useState(note.content)

    const [showPin, showPinSet] = useState(true)

    const onStop = () => {
        updateNote({...note, x: position.x, y: position.y})
        showPinSet(true)
    }

    const onStart = () => {
        showPinSet(false)
    }

    const onDrag = (e: any, position: any) => {
        //console.log(e, ui)
        positionSet({x: position.x, y: position.y})
    }

    return (
        <Draggable onStop={onStop} onDrag={onDrag} onStart={onStart} handle=".dragger" position={{x: position.x, y: position.y}}>
            <div className="sticky__note">
                {showPin && 
                    <img className="pin" src="./pin3.png"></img>
                }
                <div className="dragger"></div>
                <div className="content">
                    <p>{content}</p>
                </div>
            </div>
        </Draggable>
    );
}
 
export default StickyNote;