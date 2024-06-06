export type ContextMenuActionButton = {
    content: string,
    className?: string,
    icon?: any,
}

export type ContextMenuType = {
    button: ContextMenuActionButton,
    onClick?: (noteId?: number) => void,
    isDisabled?: boolean
}