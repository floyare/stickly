import { useState } from "react";

export const useMemory = (value: any) => {
    const [memory, setMemory] = useState([{id: 0, data: value}]);
    const [currentMemoryStateId, currentMemoryStateIdSet] = useState(0);

    function getPreviousMemoryState() {
        if(memory.length <= 1) return
        if(currentMemoryStateId <= 1) return memory.filter(e => e.id === 1)[0].data

        const currentMemoryId = currentMemoryStateId - 1;
        currentMemoryStateIdSet(currentMemoryId)
        return memory.filter(e => e.id === currentMemoryId)[0].data;
    }

    function getForwardMemoryState(){
        if(memory.length <= 1) return
        if(currentMemoryStateId >= memory[memory.length - 1].id) return memory.filter(e => e.id === memory[memory.length - 1].id)[0].data

        const currentMemoryId = currentMemoryStateId + 1;
        currentMemoryStateIdSet(currentMemoryId)
        return memory.filter(e => e.id === currentMemoryId)[0].data;
    }

    function addMemoryState(value: any) {
        const id = memory[memory.length - 1].id + 1;
        console.log('addMemoryState', {id: id, data: value})
        setMemory([...memory, {id: id, data: value}])
        currentMemoryStateIdSet(id)
    }

    return {memory, getPreviousMemoryState, getForwardMemoryState, addMemoryState};
}