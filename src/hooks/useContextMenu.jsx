import { useState, useEffect } from "react";
const useContextMenu = () => {
    const [clicked, setClicked] = useState(false);
    const [contextMenuTarget, setContextMenuTarget] = useState(null);
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
    };
};
export default useContextMenu;
