import { useState, useEffect } from "react";
import { ContextMenuOption } from "../types";
import { KanbanData } from "./../types";

const useContextMenu = () => {
    const [clicked, setClicked] = useState(false);
    const [contextMenuTarget, setContextMenuTarget] = useState<KanbanData | null>(null);
    const [contextMenuOptions, setContextMenuOptions] = useState<ContextMenuOption[]>([]);
    const [points, setPoints] = useState({
        x: 0,
        y: 0,
    });
    useEffect(() => {
        const handleClick = () => setClicked(false);
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);
    return {
        clicked,
        setClicked,
        points,
        setPoints,
        contextMenuTarget,
        setContextMenuTarget,
        contextMenuOptions,
        setContextMenuOptions,
    };
};
export default useContextMenu;
