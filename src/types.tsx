export interface KanbanStructure {
    title: string;
    color: string;
    tasks: TaskData[];
    isTrashBin?: boolean;
}

export interface KanbanDoc {
    id: string;
    data: () => KanbanData;
}

export interface KanbanData {
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

export interface PropsWithChildren {
    children: React.ReactNode;
}
