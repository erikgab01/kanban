import React from "react";

export default function TaskCreator() {
    return (
        <section className="bg-white mt-8 rounded-lg w-fit p-4">
            <h4 className="mb-2">Новая задача</h4>
            <div className="flex justify-between gap-6">
                <input
                    type="text"
                    placeholder="Название задачи"
                    className="border-2 rounded-md border-slate-300 placeholder-slate-400                        focus:outline-none focus:border-sky-500 indent-2 py-1"
                />
                <button className="bg-sky-600 text-white rounded-md py-2 px-8 hover:bg-sky-700">
                    Добавить
                </button>
            </div>
        </section>
    );
}
