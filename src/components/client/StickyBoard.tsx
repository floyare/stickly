//import Styles from "../../styles/StickyBoard.module.scss"
import { useState, useEffect, useRef } from "react";
// import "../../styles/StickyBoard.scss";
import StickyNote from "./StickyNote";
import type { StickyNoteType } from "../../types/StickyBoardTypes";
import { useMemory } from "./hooks/useMemory";
import BackgroundTip from "./BackgroundTip";
import Modal from "./Modal";
import { ArrowLeftCircle, ArrowRightCircle, Trash } from "react-feather"
import { Transition, TransitionGroup } from "react-transition-group";
import "../../styles/Transitions.scss"
import Animated from "./Animated";
import ContextMenu from "./ContextMenu";
import type { ContextMenuType } from "../../types/ContextMenuTypes";

const StickyBoard = () => {
    const [stickyNotes, stickyNotesSet] = useState<StickyNoteType[]>([]);
    const {memory, getPreviousMemoryState, getForwardMemoryState, addMemoryState} = useMemory([])
    const [clearConfirmation, clearConfirmationSet] = useState(false);

    const defaultContextMenuBoardItems: ContextMenuType[] = [
        {
            button: {
                content: "Undo",
                icon: <ArrowLeftCircle/>
            },
            onClick: () => revertToPreviousState(),
            isDisabled: false
        },
        {
            button: {
                content: "Redo",
                icon: <ArrowRightCircle/>
            },
            onClick: () => redoForwardState(),
            isDisabled: false
        }
    ]

    const contextMenuRef = useRef<HTMLDivElement | null>(null);
    const [contextMenuData, contextMenuDataSet] = useState<{visible: boolean, position: {x: number, y: number}, target: any, menuData: ContextMenuType[]}>
            ({visible: false, position: {x: 0, y: 0}, target: null, menuData: defaultContextMenuBoardItems})

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

        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current /* && !contextMenuRef.current.contains(event.target as Node)*/) {
                contextMenuDataSet({ ...contextMenuData, visible: false });
            }
        };

        const getOffsetParent = (element: HTMLDivElement) => {
            if(element.classList.contains("sticky__board"))
                return "BOARD"
            else if(element.classList.contains("sticky__note"))
                return "NOTE"
            else return "UNKNOWN"
        }

        const getIdFromNote = (element: HTMLDivElement) => {
            return Number(element.id.replace("note__", ""));
        }

        const handleOnContext = (event: MouseEvent) => {
            event.preventDefault()

            let posX = event.pageX;
            let posY = event.pageY;

            const contextMaxWidth = contextMenuRef.current?.clientWidth ? contextMenuRef.current?.clientWidth : 100;
            const contextPadding = 10;
            const windowSize = {width:  window.innerWidth, height:  window.innerHeight};
            console.log(windowSize, {posX, posY})

            if((windowSize.width - posX) < contextMaxWidth)
                posX = (windowSize.width - (contextMaxWidth + contextPadding))

            const contextHeight = contextMenuRef.current?.clientHeight ? contextMenuRef.current?.clientHeight : 300;
            if((windowSize.height - posY) <  contextHeight)
                posY = (windowSize.height - (contextHeight + contextPadding))

            //@ts-ignore
            const originalTarget = event.originalTarget.offsetParent;

            const offsetParent = getOffsetParent(originalTarget)
            let contextMenu = defaultContextMenuBoardItems
            if(offsetParent === "NOTE"){
                const id = getIdFromNote(originalTarget);
                const modifiedContextMenuItems = defaultContextMenuBoardItems
                const contextMenuAction: ContextMenuType = {
                    button: {
                        content: "Delete",
                        className: "cancel",
                        icon: <Trash />
                    },
                    onClick: () => deleteNote(id),
                    isDisabled: false
                }

                modifiedContextMenuItems.splice(0, 0, contextMenuAction)
                contextMenu = modifiedContextMenuItems
            }

            const sameTarget = ((contextMenuData.position.x === posX  && contextMenuData.position.y === posY)) as boolean
            if(sameTarget){
                contextMenuDataSet({visible: false, position: {x: 0, y: 0}, target: null, menuData: contextMenu})
                return
            }

            contextMenuDataSet({visible: true, position: {x: posX, y: posY}, target: event.target, menuData: contextMenu})
        }

        window.addEventListener('keydown', handleUndo);
        window.addEventListener('contextmenu', handleOnContext);
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleUndo);
            window.removeEventListener('contextmenu', handleOnContext);
            window.removeEventListener('click', handleClickOutside);
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

    function deleteNote(noteId: number){
        const updatedNotes = stickyNotes.filter(p => p.id !== noteId)
        addMemoryState(updatedNotes)
        stickyNotesSet(updatedNotes)
    }

    return (
        <>
            {contextMenuData.visible && 
                <ContextMenu items={contextMenuData.menuData} ref={contextMenuRef} style={{top: contextMenuData.position.y, left: contextMenuData.position.x}}/>
            }
            <Transition in={clearConfirmation} timeout={290} mountOnEnter unmountOnExit>
                {(state) => (
                    <Modal 
                        title="Clearing board" 
                        content="Are you sure you want to clear the board?" 
                        confirm={{text: "Cancel", onClick: () => {clearConfirmationSet(false)}}} 
                        cancel={{text: "Clear", onClick: () => {clearBoard(); clearConfirmationSet(false)}}} 
                        className={"modal-transition-" + state}
                    />
                )}
            </Transition>
            <section className="sticky__board">
                <div className="action__menu">
                    <button onClick={addNote} aria-label="Add note">+</button>
                    <button onClick={() => {clearConfirmationSet(true)}} className="cancel" aria-label="Clear the board"><Trash /></button>
                </div>
                {/* <button onClick={revertToPreviousState}>undo</button>
                <button onClick={redoForwardState}>redo</button> */}
                <TransitionGroup className="notes">
                    {stickyNotes && stickyNotes.map(note => {
                        return (
                            <Transition key={note.id} timeout={290} unmountOnExit>
                                {(state) => (
                                    <StickyNote note={note} updateNote={updateNote} key={note.id} className={`note-transition-${state}`}/>
                                )}
                            </Transition>
                        )
                    })}
                </TransitionGroup>
                <BackgroundTip />
            </section>
        </>
    );
}

export default StickyBoard;