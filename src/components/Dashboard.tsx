import { DeleteConfirmation } from "./DeleteConfirmation";
import { KanbanForm } from "./KanbanForm";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "./utility/Modal";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import useContextMenu from "../hooks/useContextMenu";
import ContextMenu from "./utility/ContextMenu";
import { createNewKanban, deleteKanban, removeCollaborator, updateKanbanInfo } from "../api/kanbanService";
import { ContextMenuOption, KanbanDoc } from "../types";
import KanbanSkeleton from "./utility/KanbanSkeleton";

export default function Dashboard() {
    // TODO: decompose
    const [isLoadingHostKanbans, setIsLoadingHostKanbans] = useState(true);
    const [isLoadingCollabKanbans, setIsLoadingCollabKanbans] = useState(true);
    const [isShowCreateModal, setIsShowCreateModal] = useState(false);
    const [isShowEditModal, setIsShowEditModal] = useState(false);
    const [isShowConfirmationModal, setIsShowConfirmationModal] = useState(false);
    const [kanbanHostList, setKanbanHostList] = useState<KanbanDoc[]>([]);
    const [kanbanCollabList, setKanbanCollabList] = useState<KanbanDoc[]>([]);
    const navigate = useNavigate();

    const {
        clicked,
        setClicked,
        points,
        setPoints,
        contextMenuTarget,
        setContextMenuTarget,
        contextMenuOptions,
        setContextMenuOptions,
    } = useContextMenu();

    async function handleCreateKanban(title: string, desc: string) {
        const kanbanId = await createNewKanban(title, desc);
        console.log("Document written with ID: ", kanbanId);
        navigate(`/kanban/${kanbanId}`);
    }
    async function handleDeleteKanban() {
        setIsShowConfirmationModal(false);
        if (contextMenuTarget) {
            await deleteKanban(contextMenuTarget.id);
        }
    }

    async function handleEditKanban(newName: string, newDesc: string) {
        setIsShowEditModal(false);
        if (contextMenuTarget) {
            await updateKanbanInfo(contextMenuTarget.id, newName, newDesc);
        }
    }

    async function handleLeaveCollabKanban() {
        if (contextMenuTarget && auth.currentUser) {
            await removeCollaborator(contextMenuTarget.id, auth.currentUser.uid);
        }
    }

    function handleContextMenu(e: React.MouseEvent, kanban: KanbanDoc, options: ContextMenuOption[]) {
        e.preventDefault();
        setContextMenuOptions(options);
        setClicked(true);
        setPoints({
            x: e.pageX,
            y: e.pageY,
        });
        setContextMenuTarget(kanban);
    }

    // Realtime listening to db changes
    useEffect(() => {
        const q1 = query(collection(db, "kanbans"), where("host", "==", auth.currentUser?.uid));
        const q2 = query(
            collection(db, "kanbans"),
            where("collaborators", "array-contains", auth.currentUser?.uid)
        );
        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
            setIsLoadingHostKanbans(false);
            setKanbanHostList(querySnapshot.docs as unknown as KanbanDoc[]);
        });
        const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
            setIsLoadingCollabKanbans(false);
            setKanbanCollabList(querySnapshot.docs as unknown as KanbanDoc[]);
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
                {isLoadingHostKanbans ? (
                    <>
                        <KanbanSkeleton />
                        <KanbanSkeleton />
                        <KanbanSkeleton />
                    </>
                ) : (
                    <>
                        {kanbanHostList.map((kanban) => (
                            <Link
                                key={kanban.id}
                                to={`/kanban/${kanban.id}`}
                                className="w-60 h-28 p-6 text-center bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                onContextMenu={(e) =>
                                    handleContextMenu(e, kanban, [
                                        { name: "Редактировать", handler: () => setIsShowEditModal(true) },
                                        { name: "Удалить", handler: () => setIsShowConfirmationModal(true) },
                                    ])
                                }
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
                            <FontAwesomeIcon icon={["fas", "plus"]} />
                        </button>
                    </>
                )}
            </div>
            <h4 className="font-medium text-cente mt-5">Доски, к которым вам дали доступ</h4>
            {kanbanCollabList.length === 0 && !isLoadingCollabKanbans && (
                <p>Попросите владельца доски дать вам доступ, после этого вы увидите её тут</p>
            )}
            <div className="grid gap-4 grid-cols-3">
                {isLoadingCollabKanbans ? (
                    <>
                        <KanbanSkeleton />
                        <KanbanSkeleton />
                        <KanbanSkeleton />
                    </>
                ) : (
                    kanbanCollabList.map((kanban) => (
                        <Link
                            key={kanban.id}
                            to={`/kanban/${kanban.id}`}
                            className="w-60 h-28 p-6 text-center bg-white border border-yellow-400 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            onContextMenu={(e) =>
                                handleContextMenu(e, kanban, [
                                    { name: "Покинуть", handler: () => handleLeaveCollabKanban() },
                                ])
                            }
                        >
                            <h5 className="mb-2 text-xl truncate font-bold tracking-tight text-gray-900 dark:text-white">
                                {kanban.data().name}
                            </h5>
                            <p className="font-normal truncate text-sm text-gray-700 dark:text-gray-400">
                                {kanban.data().description}
                            </p>
                        </Link>
                    ))
                )}
            </div>
            {/* Create new kanban modal */}
            <Modal isShow={isShowCreateModal} setIsShow={setIsShowCreateModal}>
                <KanbanForm
                    handler={handleCreateKanban}
                    formTitle={"Создать новую доску"}
                    buttonText={"Создать"}
                />
            </Modal>
            {/* Edit kanban modal */}
            <Modal isShow={isShowEditModal} setIsShow={setIsShowEditModal}>
                <KanbanForm
                    handler={handleEditKanban}
                    formTitle={"Редактировать доску"}
                    buttonText={"Редактировать"}
                    initialName={contextMenuTarget?.data().name}
                    initialDesc={contextMenuTarget?.data().description}
                />
            </Modal>
            {/* Delete confirmation modal */}
            <Modal isShow={isShowConfirmationModal} setIsShow={setIsShowConfirmationModal}>
                <DeleteConfirmation
                    target={contextMenuTarget}
                    deleteKanban={handleDeleteKanban}
                    setIsShowConfirmationModal={setIsShowConfirmationModal}
                />
            </Modal>
            {clicked && <ContextMenu top={points.y} left={points.x} options={contextMenuOptions} />}
        </div>
    );
}
