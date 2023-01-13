import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "./utility/Modal";
import { useRef } from "react";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "./../firebase";
import { useEffect } from "react";
import kanban_setup from "./../kanban_setup";
import useContextMenu from "./../hooks/useContextMenu";
import ContextMenu from "./utility/ContextMenu";

export default function Dashboard() {
    // TODO: loading, delete/edit kanbans
    // TODO: display collaborators kanbans
    const [isShow, setIsShow] = useState(false);
    const [kanbanList, setKanbanList] = useState([]);
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const navigate = useNavigate();

    const { clicked, setClicked, points, setPoints, target, setTarget } = useContextMenu();

    async function createKanban(e) {
        e.preventDefault();
        const kanbanRef = await addDoc(collection(db, "kanbans"), {
            name: titleRef.current.value,
            description: descRef.current.value,
            host: auth.currentUser.uid,
            collaborators: [],
            kanban: JSON.stringify(kanban_setup),
        });
        console.log("Document written with ID: ", kanbanRef.id);
        navigate(`/kanban/${kanbanRef.id}`);
    }

    // Realtime listening to db changes
    useEffect(() => {
        const q = query(collection(db, "kanbans"), where("host", "==", auth.currentUser.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setKanbanList(querySnapshot.docs);
        });
        return unsubscribe;
    }, []);

    return (
        <div className="flex flex-col gap-4 min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="font-medium text-lg text-center">Добро пожаловать</h1>
            <div className="grid gap-4 grid-cols-3">
                {kanbanList.map((kanban) => (
                    <Link
                        key={kanban.id}
                        to={`/kanban/${kanban.id}`}
                        className="w-60 h-28 p-6 text-center bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setClicked(true);
                            setPoints({
                                x: e.pageX,
                                y: e.pageY,
                            });
                            setTarget(kanban.id);
                        }}
                    >
                        <h5 className="mb-2 text-xl truncate font-bold tracking-tight text-gray-900 dark:text-white">
                            {kanban.data().name}
                        </h5>
                        <p className="font-normal truncate text-sm text-gray-700 dark:text-gray-400">
                            {kanban.data().description}
                        </p>
                    </Link>
                ))}

                <button
                    className="w-60 h-28 p-6 text-2xl bg-white border border-dashed border-gray-600 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    onClick={() => setIsShow(true)}
                >
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                </button>
                <Modal isShow={isShow} setIsShow={setIsShow}>
                    <div className="px-6 py-6 lg:px-8">
                        <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                            Создание новой доски
                        </h3>
                        <form className="space-y-6" onSubmit={createKanban}>
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
                </Modal>
            </div>
            {clicked && <ContextMenu top={points.y} left={points.x} target={target} />}
        </div>
    );
}
