import { DeleteConfirmation } from "./DeleteConfirmation";
import { CreateNewKanbanForm } from "./CreateNewKanbanForm";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "./utility/Modal";
import { collection, addDoc, onSnapshot, query, where, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./../firebase";
import kanban_setup from "./../kanban_setup";
import useContextMenu from "./../hooks/useContextMenu";
import ContextMenu from "./utility/ContextMenu";

export default function Dashboard() {
    // TODO: loading, delete/edit kanbans
    const [isShowCreateModal, setIsShowCreateModal] = useState(false);
    const [isShowConfirmationModal, setIsShowConfirmationModal] = useState(false);
    const [kanbanHostList, setKanbanHostList] = useState([]);
    const [kanbanCollabList, setKanbanCollabList] = useState([]);
    const navigate = useNavigate();

    const { clicked, setClicked, points, setPoints, target, setTarget } = useContextMenu();

    async function createKanban(e, title, desc) {
        e.preventDefault();
        const kanbanRef = await addDoc(collection(db, "kanbans"), {
            name: title,
            description: desc,
            host: auth.currentUser.uid,
            collaborators: [],
            kanban: JSON.stringify(kanban_setup),
        });
        console.log("Document written with ID: ", kanbanRef.id);
        navigate(`/kanban/${kanbanRef.id}`);
    }
    async function deleteKanban() {
        setIsShowConfirmationModal(false);
        await deleteDoc(doc(db, "kanbans", target.id));
    }

    // Realtime listening to db changes
    useEffect(() => {
        const q1 = query(collection(db, "kanbans"), where("host", "==", auth.currentUser.uid));
        const q2 = query(
            collection(db, "kanbans"),
            where("collaborators", "array-contains", auth.currentUser.uid)
        );
        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
            setKanbanHostList(querySnapshot.docs);
        });
        const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
            setKanbanCollabList(querySnapshot.docs);
        });
        return () => {
            unsubscribe1();
            unsubscribe2();
        };
    }, []);

    return (
        <div className="flex flex-col gap-4 min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="font-medium text-lg text-center">Добро пожаловать</h1>
            <h4 className="font-medium text-center">Ваши доски</h4>
            <div className="grid gap-4 grid-cols-3">
                {kanbanHostList.map((kanban) => (
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
                            setTarget(kanban);
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
                    onClick={() => setIsShowCreateModal(true)}
                >
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                </button>
            </div>
            <h4 className="font-medium text-cente mt-5">Доски, к которым вам дали доступ</h4>
            {kanbanCollabList.length === 0 && (
                <p>Попросите владельца доски дать вам доступ, после этого вы увидите её тут</p>
            )}
            <div className="grid gap-4 grid-cols-3">
                {kanbanCollabList.map((kanban) => (
                    <Link
                        key={kanban.id}
                        to={`/kanban/${kanban.id}`}
                        className="w-60 h-28 p-6 text-center bg-white border border-yellow-400 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                        <h5 className="mb-2 text-xl truncate font-bold tracking-tight text-gray-900 dark:text-white">
                            {kanban.data().name}
                        </h5>
                        <p className="font-normal truncate text-sm text-gray-700 dark:text-gray-400">
                            {kanban.data().description}
                        </p>
                    </Link>
                ))}
            </div>
            {/* Create new kanban modal */}
            <Modal isShow={isShowCreateModal} setIsShow={setIsShowCreateModal}>
                <CreateNewKanbanForm createKanban={createKanban} />
            </Modal>
            {/* Delete confirmation modal */}
            <Modal isShow={isShowConfirmationModal} setIsShow={setIsShowConfirmationModal}>
                <DeleteConfirmation
                    target={target}
                    deleteKanban={deleteKanban}
                    setIsShowConfirmationModal={setIsShowConfirmationModal}
                />
            </Modal>
            {clicked && (
                <ContextMenu
                    top={points.y}
                    left={points.x}
                    setIsShowConfirmationModal={setIsShowConfirmationModal}
                />
            )}
        </div>
    );
}
