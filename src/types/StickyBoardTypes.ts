export type StickyNoteType = {
    id: number;
    content?: string;
    color: string;
    x?: number;
    y?: number;
    pinColorHue?: number,
    zIndex?: number
}

export type MemoryObject = {
    id: number,
    data: StickyNoteType[]
}