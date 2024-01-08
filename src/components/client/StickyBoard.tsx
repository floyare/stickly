//import Styles from "../../styles/StickyBoard.module.scss"
import { useState, useEffect } from "react";
// import "../../styles/StickyBoard.scss";
import StickyNote from "./StickyNote";
import type { StickyNoteType } from "../../types/StickyBoardTypes";
import { useMemory } from "./hooks/useMemory";
import BackgroundTip from "./BackgroundTip";
import Modal from "./Modal";
import { Trash } from "react-feather"

const StickyBoard = () => {
    const [stickyNotes, stickyNotesSet] = useState<StickyNoteType[]>([]);
    const {memory, getPreviousMemoryState, getForwardMemoryState, addMemoryState} = useMemory([])
    const [clearConfirmation, clearConfirmationSet] = useState(false);

    // ? MEMORY ?
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
                revertToPreviousState();
            }else if(event.ctrlKey && event.key === 'y'){
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

    //? BOARD ?
    function clearBoard(){
        stickyNotesSet([]); 
        localStorage.setItem("board", JSON.stringify([]))
    }
    
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

    useEffect(() => {
        loadSavedBoard()
    }, [])

    useEffect(() => {
        if(stickyNotes)
            saveBoard(stickyNotes)
    }, [stickyNotes])

    //? NOTES ?
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

    return (
        <>
            {clearConfirmation && <Modal 
                title="Clearing board" 
                content="Are you sure you want to clear the board?" 
                confirm={{text: "Clear", onClick: () => {clearBoard(); clearConfirmationSet(false)}}} 
                cancel={{text: "Cancel", onClick: () => {clearConfirmationSet(false)}}} 
            />}
            <section className="sticky__board">
                <div className="action__menu">
                    <button onClick={addNote} aria-label="Add note">+</button>
                    <button onClick={() => {clearConfirmationSet(true)}} className="cancel" aria-label="Clear the board"><Trash /></button>
                </div>
                {/* <button onClick={revertToPreviousState}>undo</button>
                <button onClick={redoForwardState}>redo</button> */}
                <div className="notes" >
                    {stickyNotes && stickyNotes.map(note => {
                        return (
                            <StickyNote key={note.id} note={note} updateNote={updateNote} />
                        )
                    })}
                </div>
                <BackgroundTip />
            </section>
        </>
    );
}

export default StickyBoard;