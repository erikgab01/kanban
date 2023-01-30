import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useState, useEffect } from "react";
import TaskCreator from "./TaskCreator";
import TasksBoard from "./TasksBoard";
import { auth } from "../../firebase";
import useDebounce from "../../hooks/useDebounce";
import { useParams } from "react-router-dom";
import InviteMenu from "./InviteMenu";
import { KanbanStructure } from "../../types";
import KanbanService from "../../services/KanbanService";
import Modal from "../../components/ui/Modal";
import CollabList from "./CollabList";

type KanbanParams = {
    kanbanId: string;
};

export default function Kanban() {
    const [groups, setGroups] = useState<KanbanStructure[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHost, setIsHost] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const debouncedGroups = useDebounce<KanbanStructure[]>(groups, 1000);

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
            setGroups(JSON.parse(kanbanData.kanban));
        });
        return unsub;
    }, [kanbanId]);

    return loading ? (
        <div className="mt-40 flex justify-center">
            <span className="w-16 h-16">
                <LoadingSpinner />
            </span>
        </div>
    ) : (
        <div className="container mx-auto">
            <div className="flex gap-8">
                <TaskCreator setGroups={setGroups} />
                {isHost && <InviteMenu kanbanId={kanbanId} />}
                <button onClick={() => setIsShow(true)}>Показать список коллабораторов</button>
            </div>
            <TasksBoard groups={groups} setGroups={setGroups} />
            <Modal isShow={isShow} setIsShow={setIsShow}>
                <CollabList kanbanId={kanbanId} isHost={isHost} />
            </Modal>
        </div>
    );
}
