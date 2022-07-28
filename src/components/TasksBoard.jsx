import React from "react";
import TaskGroup from "./TaskGroup";

export default function TasksBoard(props) {
    return (
        <section className="flex gap-12 mt-8">
            {props.groups.map((row) => (
                <TaskGroup title={row.title} tasks={row.tasks} color={row.color} />
            ))}
        </section>
    );
}
