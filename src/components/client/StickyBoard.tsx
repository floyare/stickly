//import Styles from "../../styles/StickyBoard.module.scss"
import "../../styles/StickyBoard.scss";
import StickyNote from "./StickyNote";

const StickyBoard = () => {
    return (
        <section className="sticky__board"/*className={Styles.sticky__board}*/>
            <h1>Sticky Board</h1>
            <StickyNote />
        </section>
    );
}

export default StickyBoard;