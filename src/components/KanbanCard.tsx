import { Link } from "react-router-dom";
import { KanbanData } from "./../types";

interface KanbanCardProps {
    kanban: KanbanData;
    contextMenuHandler: (e: React.MouseEvent) => void;
}

export default function KanbanCard({ kanban, contextMenuHandler }: KanbanCardProps) {
    return (
        <Link
            key={kanban.id}
            to={`/kanban/${kanban.id}`}
            className="w-60 h-28 p-6 text-center bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            onContextMenu={contextMenuHandler}
        >
            <h5 className="mb-2 text-xl truncate font-bold tracking-tight text-gray-900 dark:text-white">
                {kanban.name}
            </h5>
            <p className="font-normal truncate text-sm text-gray-700 dark:text-gray-400">
                {kanban.description}
            </p>
        </Link>
    );
}
