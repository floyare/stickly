import { forwardRef } from "react";
import type { ContextMenuType } from "../../types/ContextMenuTypes";

type Props = {
    style?: React.CSSProperties,
    ref?: React.LegacyRef<HTMLDivElement>,
    items: ContextMenuType[],
    className?: string
}

const ContextMenu = forwardRef<HTMLDivElement, Props>((props, forwardRef) => {
    return (
        <div className={"context__menu " + props.className} style={props.style} tabIndex={0} ref={forwardRef}>
            {props.items.length <= 0 ? <p>No content</p> : 
                props.items.map(item => {
                    return(
                        <button onClick={() => {item.onClick ? item.onClick() : undefined}} disabled={item.isDisabled} className={item.button.className}>{item.button.icon} {item.button.content}</button>
                    )
                })
            }
        </div>
    );
});
 
export default ContextMenu;