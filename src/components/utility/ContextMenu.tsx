import React from "react";
import { ContextMenuOption } from "../../types";

interface ContextMenuProps {
    top: number;
    left: number;
    options: ContextMenuOption[];
}

export default function ContextMenu({ top, left, options }: ContextMenuProps) {
    return (
        <div className="absolute bg-sky-600 rounded" style={{ top: top + "px", left: left + "px" }}>
            <ul className="list-none m-0 p-2 text-white text-sm">
                {options.map((option) => (
                    <li
                        key={option.name}
                        onClick={option.handler}
                        className="py-4 px-3 cursor-pointer hover:bg-sky-700"
                    >
                        {option.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
