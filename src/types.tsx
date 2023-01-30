export interface KanbanStructure {
    title: string;
    color: string;
    tasks: TaskData[];
    isTrashBin?: boolean;
}

export interface UserData {
    userId: string;
    username: string;
    email: string;
}

export interface KanbanData {
    id: string;
    name: string;
    description: string;
    collaborators: string[];
    host: string;
    kanban: string;
}

export interface TaskData {
    id: string;
    content: string;
}

export interface ContextMenuOption {
    name: string;
    handler: () => void;
}
