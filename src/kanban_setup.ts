import { nanoid } from "nanoid";

export interface KanbanStructure {
    title: string;
    color: string;
    tasks: {
        id: string;
        content: string;
    }[];
    isTrashBin?: boolean;
}

const kanban_setup: KanbanStructure[] = [
    {
        title: "Бэклог",
        color: "#6A6E6B",
        tasks: [{ id: nanoid(), content: "Задача" }],
    },
    {
        title: "В процессе",
        color: "#EB6B50",
        tasks: [],
    },
    {
        title: "Завершено",
        color: "#56BB62",
        tasks: [],
    },
    {
        title: "Корзина",
        color: "#E62E51",
        tasks: [],
        isTrashBin: true,
    },
];

export default kanban_setup;
