import React, { useRef } from "react";
export function CreateNewKanbanForm({ createKanban }) {
    const titleRef = useRef(null);
    const descRef = useRef(null);
    return (
        <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Создание новой доски</h3>
            <form
                className="space-y-6"
                onSubmit={(e) => createKanban(e, titleRef.current.value, descRef.current.value)}
            >
                <div>
                    <label
                        htmlFor="title"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Название
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                        placeholder="Моя доска"
                        ref={titleRef}
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Краткое описание
                    </label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                        placeholder="Для работы над проектом"
                        ref={descRef}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    Создать
                </button>
            </form>
        </div>
    );
}
