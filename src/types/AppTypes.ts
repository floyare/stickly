export const DefaultNoteColors = ["red", "yellow", "green", "blue"] as const;
export type NoteColors = typeof DefaultNoteColors[number];

export type ChangelogVersionType = {
    version: string,
    description: string,
    image?: string,
    changes: string[]
}

export type BoardOptionsType = {
    defaultNoteColor: NoteColors,
}