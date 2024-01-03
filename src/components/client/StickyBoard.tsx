//import Styles from "../../styles/StickyBoard.module.scss"
import { useState, useEffect } from "react";
import "../../styles/StickyBoard.scss";
import StickyNote from "./StickyNote";
import type { StickyNoteType } from "../../types/StickyBoardTypes";

const StickyBoard = () => {
    const [stickyNotes, stickyNotesSet] = useState<StickyNoteType[]>([
        {
          "id": 38,
          "content": "38",
          "color": "yellow",
          "x": -973,
          "y": 300
        },
        {
          "id": 88,
          "content": "88",
          "color": "yellow",
          "x": -1181,
          "y": 646
        },
        {
          "id": 59,
          "content": "59",
          "color": "yellow",
          "x": 1094,
          "y": 283
        },
        {
          "id": 24,
          "content": "24",
          "color": "yellow",
          "x": 34,
          "y": 58
        }
      ]);

    async function loadSavedBoard(){
        const storage = await localStorage.getItem("board");
        if(!storage){
            localStorage.setItem("board", JSON.stringify([]))
            return
        }

        const items = JSON.parse(storage) as StickyNoteType[]
        console.log('Received board', items)
        stickyNotesSet(items)
    }

    async function saveBoard(stickyNotesList: StickyNoteType[]){
        localStorage.setItem("board", JSON.stringify(stickyNotesList))
        console.log('Saved board', stickyNotesList)
    }

    function addNote(){
        const n = Math.floor(Math.random() * (100 - 1 + 1) + 1);
        stickyNotesSet([...stickyNotes, {id: n, content: n.toString(), color: "yellow"}])
    }

    function updateNote(note: StickyNoteType){
        const items = stickyNotes.map(item => {
            if(item.id === note.id)
                return note;
            else
                return item
        })

        stickyNotesSet(items)
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
            <button onClick={addNote}>Add note</button>
            {stickyNotes && stickyNotes.map(note => {
                return (
                    <StickyNote key={note.id} note={note} updateNote={updateNote} />
                )
            })}
        </section>
    );
}

export default StickyBoard;