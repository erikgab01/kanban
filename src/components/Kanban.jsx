import React, { useState } from "react";
import TaskCreator from "./TaskCreator";
import Tasks from "./Tasks";

export default function Kanban() {
    const [groups, setGroups] = useState([
        { title: "Бэклог", color: "#6A6E6B", tasks: ["Сделать домашку", "Test"] },
        { title: "В процессе", color: "#EB6B50", tasks: ["Помочь Карену", "Сломать наш корабль"] },
        { title: "Завершено", color: "#56BB62", tasks: ["Помочь Карену", "Сломать наш корабль"] },
        { title: "Отложено", color: "#82569C", tasks: ["Помочь Карену", "Сломать наш корабль"] },
    ]);
    return (
        <div className="container mx-auto">
            <TaskCreator />
            <Tasks groups={groups} />
        </div>
    );
}
