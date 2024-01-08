import "../../styles/Modal.scss"

type Props = {
    title: string,
    content: string,
    confirm?: {text: string, onClick: () => void},
    cancel?: {text: string, onClick: () => void},
    className?: string
}

const Modal = (props: Props) => {
    return (
        <div className={"modal__wrapper " + props.className}>
            <div className="modal__box">
                <h2 className="modal__title">{props.title}</h2>
                <div className="content">
                    <p>{props.content}</p>
                </div>
                <div className="actions">
                    <button className="confirm" onClick={props.confirm?.onClick}>{props.confirm?.text}</button>
                    <button className="cancel" onClick={props.cancel?.onClick}>{props.cancel?.text}</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;