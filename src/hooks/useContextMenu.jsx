import { useState, useEffect } from "react";
const useContextMenu = () => {
    const [clicked, setClicked] = useState(false);
    const [target, setTarget] = useState(0);
    const [points, setPoints] = useState({
        x: 0,
        y: 0,
    });
    useEffect(() => {
        const handleClick = () => {
            setClicked(false);
            setTarget(0);
        };
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
        target,
        setTarget,
    };
};
export default useContextMenu;
