import { nanoid } from "nanoid";
import React, { useState } from "react";
import TaskCreator from "./TaskCreator";
import TasksBoard from "./TasksBoard";

export default function Kanban() {
    const [groups, setGroups] = useState([
        {
            title: "Бэклог",
            color: "#6A6E6B",
            tasks: [
                { id: nanoid(), content: "Сделать домашку Сделать tretg gdg" },
                { id: nanoid(), content: "Сделать домашку" },
            ],
        },
        {
            title: "В процессе",
            color: "#EB6B50",
            tasks: [
                { id: nanoid(), content: "Сделать домашку" },
                { id: nanoid(), content: "Сделать домашку" },
            ],
        },
        { title: "Завершено", color: "#56BB62", tasks: [{ id: nanoid(), content: "Сделать домашку" }] },
        {
            title: "Корзина",
            color: "#E62E51",
            tasks: [{ id: nanoid(), content: "Сделать домашку" }],
            isTrashBin: true,
        },
    ]);

    return (
        <div className="container mx-auto">
            <TaskCreator setGroups={setGroups} />
            <TasksBoard groups={groups} setGroups={setGroups} />
        </div>
    );
}
