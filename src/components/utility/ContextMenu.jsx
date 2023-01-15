import React from "react";

export default function ContextMenu({ top, left, deleteHandler, editHandler }) {
    return (
        <div className="absolute bg-sky-600 rounded" style={{ top: top + "px", left: left + "px" }}>
            <ul className="list-none m-0 p-2 text-white text-sm">
                <li onClick={editHandler} className="py-4 px-3 cursor-pointer hover:bg-sky-700">
                    Редактировать
                </li>
                <li onClick={deleteHandler} className="py-4 px-3 cursor-pointer hover:bg-sky-700">
                    Удалить
                </li>
            </ul>
        </div>
    );
}
