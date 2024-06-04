export type StickyNoteType = {
    id: number;
    content?: string;
    color: string;
    x?: number;
    y?: number;
    pinColorHue?: number
}

export type MemoryObject = {
    id: number,
    data: StickyNoteType[]
}