import { CSSTransition } from 'react-transition-group';
import "../../styles/Transitions.scss"

type Props = {
    children: any,
    classProp: string,
    inProp: boolean,
    timeout: number,
}

const Animated = ({ children, inProp, timeout, classProp }: Props) => {
    return (
        <CSSTransition in={inProp} timeout={timeout} classNames={
            {
                enter: classProp + "-enter",
                enterDone: classProp + "-enter-done",
                exit: classProp + "-exit",
                exitDone: classProp + "-exit-done"
            }
        }>
            {children}
        </CSSTransition>
    );
}

export default Animated;