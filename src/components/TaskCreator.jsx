import React, { useState } from "react";
import { nanoid } from "nanoid";

export default function TaskCreator({ setGroups }) {
    const [taskName, setTaskName] = useState("");
    function addTask(e) {
        e.preventDefault();
        setGroups((oldGroups) => {
            let newGroups = JSON.parse(JSON.stringify(oldGroups));
            newGroups[0].tasks.push({ id: nanoid(), content: taskName });
            return newGroups;
        });
        setTaskName("");
    }
    return (
        <section className="bg-white mt-8 rounded-lg w-fit p-4">
            <h4 className="mb-2">Новая задача</h4>
            <form onSubmit={addTask} className="flex justify-between gap-6">
                <input
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    type="text"
                    placeholder="Название задачи"
                    className="border-2 rounded-md border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 indent-2 py-1"
                />
                <button className="bg-sky-600 text-white rounded-md py-2 px-8 hover:bg-sky-700">
                    Добавить
                </button>
            </form>
        </section>
    );
}
