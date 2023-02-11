import { useEffect, useState } from "react";
import KanbanService from "../../services/KanbanService";
import { UserData } from "../../types";
import UserService from "./../../services/UserService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "react-toastify";

interface CollabListProps {
    kanbanId: string;
    isHost: boolean;
}

export default function CollabList({ kanbanId, isHost }: CollabListProps) {
    const [collabs, setCollabs] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsub = KanbanService.setKanbanListener(kanbanId, async (kanbanData) => {
            const collabList: UserData[] = [];
            for (const collabId of kanbanData.collaborators) {
                const collab = await UserService.getUserById(collabId);
                if (collab) {
                    collabList.push(collab);
                }
            }

            setCollabs(collabList);
            setLoading(false);
        });
        return unsub;
    }, [kanbanId]);

    //TODO: need to redirect to home page after deleting collab
    //TODO: improve styles
    function removeCollaborator(id: string) {
        if (isHost) {
            KanbanService.removeCollaborator(kanbanId, id);
            setCollabs((prev) => prev.filter((collab) => collab.userId !== id));
            toast.info("Пользователь удален");
        } else {
            toast.error("Только хост может удалять пользователей");
        }
    }

    return (
        <div className="p-6 text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Cписок коллабораторов
            </h3>
            {loading ? (
                <div className="flex justify-center">
                    <span className="w-16 h-16">
                        <LoadingSpinner />
                    </span>
                </div>
            ) : collabs.length === 0 ? (
                <p>Здесь никого нет :(</p>
            ) : (
                collabs.map((collab) => (
                    <div key={collab.userId}>
                        <span>{collab.username}</span>
                        {isHost && (
                            <button onClick={() => removeCollaborator(collab.userId)}>
                                Удалить
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
