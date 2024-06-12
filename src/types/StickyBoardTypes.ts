import type { NoteColors } from "./AppTypes";

export type StickyNoteType = {
    id: number;
    content?: string;
    color?: NoteColors;
    x?: number;
    y?: number;
    pinColorHue?: number,
    zIndex?: number,
}

export type MemoryObject = {
    id: number,
    data: StickyNoteType[]
}