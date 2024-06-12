import React, { useState } from 'react'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    button: any,
    children?: any
}

const Selectable = (props: Props) => {
    const [showChildren, showChildrenSet] = useState(false)
    return (
        <div className='selectable'>
            {showChildren && <div className="items">
                {props.children}
            </div>}
            <button {...props} onClick={(e) => { props.onClick && props.onClick(e); showChildrenSet(p => !p) }}>{props.button}</button>
        </div>
    )
}

export default Selectable