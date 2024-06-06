import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import Draggable from 'react-draggable';
import type { StickyNoteType } from "../../types/StickyBoardTypes";
import Animated from "./Animated";

type Props = {
    note: StickyNoteType,
    updateNote: (note: StickyNoteType) => void,
    className?: string,
    currentHighestZIndex: number,
    currentHighestZIndexSet: React.Dispatch<React.SetStateAction<number>>,
}

const StickyNote = ({ note, updateNote, className, currentHighestZIndex, currentHighestZIndexSet }: Props) => {
    const [position, positionSet] = useState<{ x: number, y: number }>({ x: note.x ? note.x : 0, y: note.y ? note.y : 0 });
    const [content, contentSet] = useState(note.content);
    const [editMode, editModeSet] = useState(false);
    const textRef = useRef<any>();
    const isContentUpdated = useRef(false);
    const [showPin, showPinSet] = useState(true);

    const localZIndex = useRef(note.zIndex ? note.zIndex : currentHighestZIndex + 1);

    useEffect(() => {
        positionSet({
            x: note.x !== undefined ? note.x : 0,
            y: note.y !== undefined ? note.y : 0,
        });
        contentSet(note.content);
    }, [note]);

    const onStop = () => {
        updateNote({ ...note, x: position.x, y: position.y });
        showPinSet(true);
    };

    const onStart = () => {
        showPinSet(false);
    };

    const onDrag = (e: any, position: any) => {
        positionSet({ x: position.x, y: position.y });
    };

    function updateTextHeight(e: any) {
        textRef.current.style.height = e.target.scrollHeight + 'px';
    }

    const handleFocus = () => {
        const currentHighest = currentHighestZIndex
        if (currentHighest !== localZIndex.current || currentHighest == 1) {
            currentHighestZIndexSet(p => {
                const newZIndex = p + 1;
                updateNote({
                    ...note,
                    zIndex: newZIndex
                });
                localZIndex.current = newZIndex;
                return newZIndex;
            });
        }
    };

    useEffect(() => {
        if (isContentUpdated.current) {
            updateNote({ ...note, content: content });
            isContentUpdated.current = false;
        }
    }, [content]);

    return (
        <Draggable bounds="parent" onStop={onStop} onDrag={onDrag} onStart={onStart} onMouseDown={handleFocus} handle=".dragger" position={{ x: position.x, y: position.y }}>
            {/* @ts-ignore */}
            <div className={"sticky__note " + className} style={{ '--initial-transform': `translate(${position.x}px, ${position.y}px)`, zIndex: localZIndex.current }} id={"note__" + note.id}>
                <Animated classProp="pin-transition" inProp={showPin} timeout={0}>
                    <img className="pin" style={{ filter: `hue-rotate(${note.pinColorHue}deg)`, }} src="./pin3.png" />
                </Animated>

                <div className="dragger"></div>
                <div className="content">
                    {!editMode && <p onDoubleClick={() => { editModeSet(true) }}>
                        {content ? content : <span>Double click here to change content of this note...</span>}
                    </p>}
                    {editMode && <textarea
                        value={content}
                        ref={textRef}
                        onMouseEnter={updateTextHeight}
                        spellCheck="false"
                        onChange={(e) => {
                            updateTextHeight(e);
                            contentSet(e.target.value);
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
