//import Styles from "../../styles/StickyBoard.module.scss"
import { useState, useEffect } from "react";
import "../../styles/StickyBoard.scss";
import StickyNote from "./StickyNote";

const StickyBoard = () => {
    const [stickyNotes, stickyNotesSet] = useState<any[]>([]);

    function addNote(){
        stickyNotesSet([...stickyNotes, {id: 0}])
    }

    useEffect(() => {
        console.log(stickyNotes)
    }, [stickyNotes])

    return (
        <section className="sticky__board"/*className={Styles.sticky__board}*/>
            <h1>Sticky Board</h1>
            <button onClick={addNote}>Add note</button>
            {stickyNotes && stickyNotes.map(note => {
                return (
                    <StickyNote key={note.id}/>
                )
            })}
        </section>
    );
}

export default StickyBoard;