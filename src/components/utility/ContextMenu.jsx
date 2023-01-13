import React from "react";

export default function ContextMenu({ top, left, setIsShowConfirmationModal }) {
    return (
        <div className="absolute bg-sky-600 rounded" style={{ top: top + "px", left: left + "px" }}>
            <ul className="list-none m-0 p-2 text-white text-sm">
                <li className="py-4 px-3 cursor-pointer hover:bg-sky-700">Редактировать</li>
                <li
                    onClick={() => setIsShowConfirmationModal(true)}
                    className="py-4 px-3 cursor-pointer hover:bg-sky-700"
                >
                    Удалить
                </li>
            </ul>
        </div>
    );
}
