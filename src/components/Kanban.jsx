import React, { useState } from "react";
import TaskCreator from "./TaskCreator";
import TasksBoard from "./TasksBoard";

export default function Kanban() {
    const [groups, setGroups] = useState([
        { title: "Бэклог", color: "#6A6E6B", tasks: ["Сделать домашку", "Test"] },
        { title: "В процессе", color: "#EB6B50", tasks: ["123", " наш корСломатьабль"] },
        { title: "Завершено", color: "#56BB62", tasks: ["bgfd", "Сломать наш корабль"] },
        { title: "Отложено", color: "#82569C", tasks: ["yrtyrtyrty", "5354353453"] },
    ]);

    return (
        <div className="container mx-auto">
            <TaskCreator setGroups={setGroups} />
            <TasksBoard groups={groups} setGroups={setGroups} />
        </div>
    );
}
