import LoadingSpinner from "../../components/LoadingSpinner";
import { useState, useEffect } from "react";
import TaskCreator from "./TaskCreator";
import TasksBoard from "./TasksBoard";
import { auth } from "../../firebase";
import useDebounce from "../../hooks/useDebounce";
import { useParams, useNavigate } from "react-router-dom";
import InviteMenu from "./InviteMenu";
import { KanbanStructure } from "../../types";
import KanbanService from "../../services/KanbanService";
import Modal from "../../components/Modal";
import CollabList from "./CollabList";
import { toast } from "react-toastify";

type KanbanParams = {
    kanbanId: string;
};

export default function Kanban() {
    const [groups, setGroups] = useState<KanbanStructure[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHost, setIsHost] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const debouncedGroups = useDebounce<KanbanStructure[]>(groups, 1000);
    const navigate = useNavigate();
    // Kanban id is always present, but typescript doesn't know that
    // Either use ! or cast it to kanbanParams
    const { kanbanId } = useParams() as KanbanParams;

    //TODO: improve design, make separators for columns in kanban, a tick to move to "done", rename columns

    //Read from db
    useEffect(() => {
        (async () => {
            const kanbanData = await KanbanService.getKanbanData(kanbanId);
            if (kanbanData) {
                setGroups(JSON.parse(kanbanData.kanban));
                setIsHost(kanbanData.host === auth.currentUser?.uid);
                setLoading(false);
            }
        })();
    }, [kanbanId]);

    // Write to db
    useEffect(() => {
        if (debouncedGroups.length > 0) {
            KanbanService.updateKanbanData(kanbanId, debouncedGroups);
        }
    }, [debouncedGroups, kanbanId]);

    // Realtime listening to db changes
    useEffect(() => {
        const unsub = KanbanService.setKanbanListener(kanbanId, (kanbanData) => {
            // leave page if not in collab list and not host
            if (
                !kanbanData.collaborators.includes(auth.currentUser!.uid) &&
                kanbanData.host !== auth.currentUser?.uid
            ) {
                toast.info("Вы были удалены из коллабораторов");
                navigate("/");
            }
            setGroups(JSON.parse(kanbanData.kanban));
        });
        return unsub;
    }, [kanbanId, navigate]);

    return loading ? (
        <div className="mt-40 flex justify-center">
            <span className="w-16 h-16">
                <LoadingSpinner />
            </span>
        </div>
    ) : (
        <div className="container mx-auto flex flex-col flex-1">
            <div className="flex gap-8">
                <TaskCreator setGroups={setGroups} />
                {isHost && <InviteMenu kanbanId={kanbanId} />}
                <button className="dark:text-white" onClick={() => setIsShow(true)}>
                    Показать список коллабораторов
                </button>
            </div>
            <TasksBoard groups={groups} setGroups={setGroups} />
            <Modal isShow={isShow} setIsShow={setIsShow}>
                <CollabList kanbanId={kanbanId} isHost={isHost} />
            </Modal>
        </div>
    );
}
