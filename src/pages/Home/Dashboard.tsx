import { DeleteConfirmation } from "../../components/ui/DeleteConfirmation";
import { KanbanForm } from "./KanbanForm";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../components/ui/Modal";
import { auth } from "../../firebase";
import useContextMenu from "../../hooks/useContextMenu";
import ContextMenu from "../../components/ui/ContextMenu";
import { ContextMenuOption } from "../../types";
import KanbanSkeleton from "./KanbanSkeleton";
import KanbanService from "../../services/KanbanService";
import { KanbanData } from "../../types";
import KanbanCard from "./KanbanCard";

export default function Dashboard() {
    const [isLoadingHostKanbans, setIsLoadingHostKanbans] = useState(true);
    const [isLoadingCollabKanbans, setIsLoadingCollabKanbans] = useState(true);
    const [isShowCreateModal, setIsShowCreateModal] = useState(false);
    const [isShowEditModal, setIsShowEditModal] = useState(false);
    const [isShowConfirmationModal, setIsShowConfirmationModal] = useState(false);
    const [kanbanHostList, setKanbanHostList] = useState<KanbanData[]>([]);
    const [kanbanCollabList, setKanbanCollabList] = useState<KanbanData[]>([]);
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
        const kanbanId = await KanbanService.createNewKanban(title, desc);
        console.log("Document written with ID: ", kanbanId);
        navigate(`/kanban/${kanbanId}`);
    }
    async function handleDeleteKanban() {
        setIsShowConfirmationModal(false);
        if (contextMenuTarget) {
            await KanbanService.deleteKanban(contextMenuTarget.id);
        }
    }

    async function handleEditKanban(newName: string, newDesc: string) {
        setIsShowEditModal(false);
        if (contextMenuTarget) {
            await KanbanService.updateKanbanInfo(contextMenuTarget.id, newName, newDesc);
        }
    }

    async function handleLeaveCollabKanban() {
        if (contextMenuTarget && auth.currentUser) {
            await KanbanService.removeCollaborator(contextMenuTarget.id, auth.currentUser.uid);
        }
    }

    function handleContextMenu(
        e: React.MouseEvent,
        kanban: KanbanData,
        options: ContextMenuOption[]
    ) {
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
        const unsubscribe1 = KanbanService.setHostKanbansListener((kanbans) => {
            setKanbanHostList(kanbans);
            setIsLoadingHostKanbans(false);
        });
        const unsubscribe2 = KanbanService.setCollabKanbansListener((kanbans) => {
            setKanbanCollabList(kanbans);
            setIsLoadingCollabKanbans(false);
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
                            <KanbanCard
                                key={kanban.id}
                                kanban={kanban}
                                contextMenuHandler={(e) =>
                                    handleContextMenu(e, kanban, [
                                        {
                                            name: "Редактировать",
                                            handler: () => setIsShowEditModal(true),
                                        },
                                        {
                                            name: "Удалить",
                                            handler: () => setIsShowConfirmationModal(true),
                                        },
                                    ])
                                }
                            />
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
                        <KanbanCard
                            key={kanban.id}
                            kanban={kanban}
                            contextMenuHandler={(e) =>
                                handleContextMenu(e, kanban, [
                                    {
                                        name: "Покинуть",
                                        handler: () => handleLeaveCollabKanban(),
                                    },
                                ])
                            }
                        />
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
                    initialName={contextMenuTarget?.name}
                    initialDesc={contextMenuTarget?.description}
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
