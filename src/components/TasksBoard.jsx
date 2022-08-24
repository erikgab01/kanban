import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { hexToRgb } from "../utility";
import Task from "./Task";

export default function TasksBoard({ groups, setGroups }) {
    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

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
    }
    function reorder(list, startIndex, endIndex) {
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    /**
     * Moves an item from one list to another list.
     */
    function move(source, destination, droppableSource, droppableDestination) {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
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
        <DragDropContext onDragEnd={onDragEnd}>
            <section className="flex gap-12 mt-8">
                {groups.map((group, groupI) => {
                    const { r, g, b } = hexToRgb(group.color);
                    const textColor = r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#ffffff";
                    return (
                        <div key={groupI} className="flex flex-col max-w-md">
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
                                        className="min-h-[70px] relative mb-4"
                                    >
                                        {group.tasks.map((task, taskI) => (
                                            <Task
                                                task={task}
                                                taskI={taskI}
                                                groupI={groupI}
                                                color={group.color}
                                                groups={groups}
                                                setGroups={setGroups}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            {group.isTrashBin && group.tasks.length !== 0 ? (
                                <button
                                    onClick={clearTrashBin}
                                    className="bg-red-600 rounded-lg text-white py-3"
                                >
                                    Очистить
                                </button>
                            ) : (
                                <></>
                            )}
                        </div>
                    );
                })}
            </section>
        </DragDropContext>
    );
}
