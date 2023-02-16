import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult, DraggableLocation } from "react-beautiful-dnd";
import { KanbanStructure, TaskData } from "../../types";
import { hexToRgb } from "../../utility";
import Task from "./Task";

interface TasksBoardProps {
    groups: KanbanStructure[];
    setGroups: React.Dispatch<React.SetStateAction<KanbanStructure[]>>;
}

export default function TasksBoard({ groups, setGroups }: TasksBoardProps) {
    const [isDragging, setIsDragging] = useState(false);

    function onDragStart() {
        setIsDragging(true);
    }

    function onDragEnd(result: DropResult) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = parseInt(source.droppableId);
        const dInd = parseInt(destination.droppableId);

        if (sInd === dInd) {
            const items = reorder(groups[sInd].tasks, source.index, destination.index);
            const newGroups = JSON.parse(JSON.stringify(groups));
            newGroups[sInd].tasks = items;
            setGroups(newGroups);
        } else {
            const result = move(groups[sInd].tasks, groups[dInd].tasks, source, destination);
            const newGroups = JSON.parse(JSON.stringify(groups));
            newGroups[sInd].tasks = result[sInd];
            newGroups[dInd].tasks = result[dInd];

            setGroups(newGroups);
        }
        setIsDragging(false);
    }
    function reorder(list: TaskData[], startIndex: number, endIndex: number) {
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    // Moves an item from one list to another list.
    function move(
        source: TaskData[],
        destination: TaskData[],
        droppableSource: DraggableLocation,
        droppableDestination: DraggableLocation
    ) {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {} as any;
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    }
    function clearTrashBin() {
        setGroups((oldGroups) => {
            const newGroups = JSON.parse(JSON.stringify(oldGroups));
            newGroups[newGroups.length - 1].tasks = [];
            return newGroups;
        });
    }
    return (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <section className="flex gap-12 my-8 flex-1">
                {groups.map((group, groupI) => {
                    const { r, g, b } = hexToRgb(group.color);
                    const textColor =
                        r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#ffffff";
                    return (
                        <div key={groupI} className="flex flex-col flex-1">
                            <h6
                                style={{ background: group.color, color: textColor }}
                                className="py-3 px-4 self-start rounded-md"
                            >
                                {group.title}
                            </h6>
                            <Droppable droppableId={`${groupI}`}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="flex-1"
                                    >
                                        {group.tasks.map((task, taskI) => (
                                            <Task
                                                key={task.id}
                                                task={task}
                                                taskI={taskI}
                                                groupI={groupI}
                                                color={group.color}
                                                groups={groups}
                                                setGroups={setGroups}
                                            />
                                        ))}
                                        {provided.placeholder}
                                        {group.isTrashBin && group.tasks.length !== 0 ? (
                                            <button
                                                disabled={isDragging}
                                                onClick={clearTrashBin}
                                                className="bg-red-600 rounded-lg text-white py-3 mt-4 w-full
                                                 dark:bg-red-800"
                                            >
                                                Очистить
                                            </button>
                                        ) : (
                                            <>{/* TODO: show placeholder */}</>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </section>
        </DragDropContext>
    );
}
