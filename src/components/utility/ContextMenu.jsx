import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./../../firebase";

export default function ContextMenu({ top, left, target }) {
    // TODO: confirm deletion
    async function deleteKanban() {
        await deleteDoc(doc(db, "kanbans", target));
    }

    return (
        <div className="absolute w-40 bg-sky-600 rounded" style={{ top: top + "px", left: left + "px" }}>
            <ul className="list-none m-0 p-2 text-white">
                <li className="py-4 px-3 cursor-pointer hover:bg-sky-700">Редактировать</li>
                <li onClick={deleteKanban} className="py-4 px-3 cursor-pointer hover:bg-sky-700">
                    Удалить
                </li>
            </ul>
        </div>
    );
}
