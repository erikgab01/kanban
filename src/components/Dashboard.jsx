import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "./utility/Modal";

export default function Dashboard() {
    const [isShow, setIsShow] = useState(false);
    return (
        <div className="flex flex-col gap-4 min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="font-medium text-lg text-center">Добро пожаловать</h1>
            <div className="grid gap-4 grid-cols-3">
                <Link
                    to={"/kanban/1"}
                    class="w-60 h-28 p-6 text-center bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                    <h5 class="mb-2 text-xl truncate font-bold tracking-tight text-gray-900 dark:text-white">
                        Kanban name
                    </h5>
                    <p class="font-normal truncate text-sm text-gray-700 dark:text-gray-400">
                        Kanban description
                    </p>
                </Link>

                <button
                    class="w-60 h-28 p-6 text-2xl bg-white border border-dashed border-gray-600 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    onClick={() => setIsShow(true)}
                >
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                </button>
                <Modal isShow={isShow} setIsShow={setIsShow}>
                    <div className="px-6 py-6 lg:px-8">
                        <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                            Создание новой доски
                        </h3>
                        <form className="space-y-6" action="#">
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
                                    placeholder="Для работы над проектом"
                                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Создать
                            </button>
                        </form>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
