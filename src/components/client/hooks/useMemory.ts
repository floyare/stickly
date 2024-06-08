import { useState } from "react";
import type { MemoryObject, StickyNoteType } from "../../../types/StickyBoardTypes";

export const useMemory = (value: any) => {
    const [memory, setMemory] = useState<MemoryObject[]>([]);
    const [currentMemoryStateId, currentMemoryStateIdSet] = useState(0);

    function getPreviousMemoryState(): MemoryObject | null {
        if (memory.length <= 1) return null
        if (currentMemoryStateId < 1) return memory[0]

        return memory.filter(e => e.id === currentMemoryStateId - 1)[0];
    }

    function getForwardMemoryState(): MemoryObject | null {
        if (memory.length <= 1) return null
        if (currentMemoryStateId > memory[memory.length - 1].id) return memory.filter(e => e.id === memory[memory.length - 1].id)[0]

        return memory.filter(e => e.id === currentMemoryStateId + 1)[0];
    }

    function addMemoryState(value: StickyNoteType[]) {
        const id = currentMemoryStateId + 1;
        console.log('addMemoryState', { id: id, data: value })

        const newMemoryState = { id: id, data: JSON.parse(JSON.stringify(value)) };
        const slicedMemory = memory.slice(0, id);

        setMemory([...slicedMemory, newMemoryState])
        currentMemoryStateIdSet(id)
    }

    return { memory, getPreviousMemoryState, getForwardMemoryState, addMemoryState, currentMemoryStateId, currentMemoryStateIdSet };
}