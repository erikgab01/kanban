import { useEffect, useState } from "react";
import { KanbanStructure } from "../types";

export default function useDebounce(value: KanbanStructure[], delay: number = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
