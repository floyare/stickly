//import Styles from "../../styles/StickyBoard.module.scss"
import { useState, useEffect } from "react";
import "../../styles/StickyBoard.scss";
import StickyNote from "./StickyNote";
import type { StickyNoteType } from "../../types/StickyBoardTypes";
import { useMemory } from "./hooks/useMemory";

const StickyBoard = () => {
    const [stickyNotes, stickyNotesSet] = useState<StickyNoteType[]>([]);
    const {memory, getPreviousMemoryState, getForwardMemoryState, addMemoryState} = useMemory([])

    
    function revertToPreviousState(){
        const previousMemoryState = getPreviousMemoryState()
        if(!previousMemoryState) return
        
        console.log('undo to:', previousMemoryState)
        stickyNotesSet(previousMemoryState)
    }
    
    function redoForwardState(){
        const forwardMemoryState = getForwardMemoryState()
        if(!forwardMemoryState) return
        
        console.log('redo to:', forwardMemoryState)
        stickyNotesSet(forwardMemoryState)
    }

    useEffect(() => {
        const handleUndo = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'z') {
                //event.preventDefault()
                revertToPreviousState();
            }else if(event.ctrlKey && event.key === 'y'){
                //event.preventDefault()
                redoForwardState()
            }
        };

        const handleOnContext = (event: MouseEvent) => {
            event.preventDefault()
        }

        window.addEventListener('keydown', handleUndo);
        window.addEventListener('contextmenu', handleOnContext);

        return () => {
            window.removeEventListener('keydown', handleUndo);
            window.removeEventListener('contextmenu', handleOnContext);
        };
    }, [revertToPreviousState, redoForwardState]);


    async function loadSavedBoard(){
        const storage = await localStorage.getItem("board");
        if(!storage){
            localStorage.setItem("board", JSON.stringify([]))
            return
        }

        const items = JSON.parse(storage) as StickyNoteType[]
        console.log('Received board', items)
        addMemoryState(items)
        stickyNotesSet(items)
    }

    async function saveBoard(stickyNotesList: StickyNoteType[]){
        localStorage.setItem("board", JSON.stringify(stickyNotesList))
        console.log('Saved board', stickyNotesList)
    }

    function addNote(){
        const id = stickyNotes[stickyNotes.length - 1] ? stickyNotes[stickyNotes.length - 1].id + 1 : 0;
        const pinColorHue = Math.floor(Math.random() * (360 - 0 + 1) + 0)
        stickyNotesSet([...stickyNotes, {id: id, content: "", color: "yellow", pinColorHue: pinColorHue}])
    }

    function updateNote(updatedNote: StickyNoteType){
        const updatedNotes = stickyNotes.map(item => (item.id === updatedNote.id ? updatedNote : item));

        addMemoryState(updatedNotes)
        stickyNotesSet(updatedNotes)
    }

    useEffect(() => {
        loadSavedBoard()
    }, [])

    useEffect(() => {
        if(stickyNotes)
            saveBoard(stickyNotes)
    }, [stickyNotes])

    return (
        <section className="sticky__board">
            <h1>Sticky Board</h1>
            <p>Use <kbd>Ctrl</kbd> + <kbd>Z</kbd> to undo and <kbd>Ctrl</kbd> + <kbd>Y</kbd> to redo!</p>
            <button onClick={addNote}>Add note</button>
            <button onClick={revertToPreviousState}>undo</button>
            <button onClick={redoForwardState}>redo</button>
            <button onClick={() => {stickyNotesSet([]); localStorage.setItem("board", JSON.stringify([]))}}>Clear board</button>
            {stickyNotes && stickyNotes.map(note => {
                return (
                    <StickyNote key={note.id} note={note} updateNote={updateNote} />
                )
            })}
        </section>
    );
}

export default StickyBoard;