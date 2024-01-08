import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import Draggable from 'react-draggable';
import type { StickyNoteType } from "../../types/StickyBoardTypes";
import Animated from "./Animated";

const StickyNote = ({note, updateNote}: {note: StickyNoteType, updateNote: (note: StickyNoteType) => void}) => {
    const [position, positionSet] = useState<{x: number, y: number}>({x: note.x ? note.x : 0, y: note.y ? note.y : 0})
    const [content, contentSet] = useState(note.content)
    const [editMode, editModeSet] = useState(false)
    const textRef = useRef<any>();
    const isContentUpdated = useRef(false);

    const [showPin, showPinSet] = useState(true)

    useEffect(() => {
        positionSet({
            x: note.x !== undefined ? note.x : 0,
            y: note.y !== undefined ? note.y : 0,
        });
        contentSet(note.content);
    }, [note])

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

    function updateTextHeight(e: any){
        textRef.current.style.height = e.target.scrollHeight + 'px';
    }

    useEffect(() => {
        if (isContentUpdated.current) {
            //TODO: DEBOUNCE
            updateNote({...note, content: content})
            isContentUpdated.current = false;
        }
    }, [content])

    return (
        <Draggable /*grid={[100,100]}*/ bounds="parent" onStop={onStop} onDrag={onDrag} onStart={onStart} handle=".dragger" position={{x: position.x, y: position.y}}>
            {/* @ts-ignore */}
            <div className="sticky__note" style={{'--initial-transform': `translate(${position.x}px, ${position.y}px)`}}>
                <Animated classProp="pin-transition" inProp={showPin} timeout={0}>
                    <img className="pin" style={{filter: `hue-rotate(${note.pinColorHue}deg)`,}} src="./pin3.png" />
                </Animated>

                <div className="dragger"></div>
                <div className="content">
                    {!editMode && <p onDoubleClick={() => {editModeSet(true)}}>
                        {content ? content : <span>Double click here to change content of this note...</span>}
                    </p>}
                    {editMode && <textarea 
                        value={content} 
                        ref={textRef}
                        onMouseEnter={updateTextHeight}
                        spellCheck="false"
                        onChange={(e) => {
                            updateTextHeight(e)
                            contentSet(e.target.value)
                            isContentUpdated.current = true;
                        }} 
                        onBlur={() => editModeSet(false)}>
                    </textarea>}
                </div>
            </div>            
        </Draggable>
    );
}
 
export default StickyNote;