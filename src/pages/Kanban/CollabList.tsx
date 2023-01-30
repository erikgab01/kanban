import { useEffect, useState } from "react";
import KanbanService from "../../services/KanbanService";
import { UserData } from "../../types";
import UserService from "./../../services/UserService";
import LoadingSpinner from "./../../components/ui/LoadingSpinner";

interface CollabListProps {
    kanbanId: string;
}

export default function CollabList({ kanbanId }: CollabListProps) {
    const [collabs, setCollabs] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            const kanbanData = await KanbanService.getKanbanData(kanbanId!);
            if (kanbanData) {
                const collabList: UserData[] = [];
                for (const collabId of kanbanData.collaborators) {
                    const collab = await UserService.getUserById(collabId);
                    if (collab) {
                        collabList.push(collab);
                    }
                }
                setCollabs(collabList);
                setLoading(false);
            }
        })();
    }, [kanbanId]);

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
                collabs.map((collab) => <div>{collab.username}</div>)
            )}
        </div>
    );
}
