import "../../styles/Modal.scss"

type Props = {
    title: string,
    content: any,
    confirm?: { text: string, onClick: () => void },
    cancel?: { text: string, onClick: () => void },
    className?: string
}

const Modal = (props: Props) => {
    return (
        <div className={"modal__wrapper " + props.className}>
            <div className="modal__box">
                <h2 className="modal__title">{props.title}</h2>
                <div className="content">
                    {props.content}
                </div>
                <div className="actions">
                    {props.confirm && <button className="confirm" onClick={props.confirm?.onClick}>{props.confirm?.text}</button>}
                    {props.cancel && <button className="cancel" onClick={props.cancel?.onClick}>{props.cancel?.text}</button>}
                </div>
            </div>
        </div>
    );
}

export default Modal;