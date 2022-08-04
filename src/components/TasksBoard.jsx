import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { hexToRgb } from "../utility";

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
    const getItemStyle = (isDragging, draggableStyle, draggingOver, defaultColor) => ({
        // some basic styles to make the items look a bit nicer
        borderColor: draggingOver ? groups[draggingOver].color : defaultColor,
        // change background colour if dragging

        // styles we need to apply on draggables
        ...draggableStyle,
    });
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <section className="flex gap-12 mt-8">
                {groups.map((group, groupI) => {
                    const { r, g, b } = hexToRgb(group.color);
                    const textColor = r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#ffffff";
                    return (
                        <div key={groupI} className="flex flex-col">
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
                                        className="min-h-[100px] relative"
                                    >
                                        {group.tasks.map((task, taskI) => (
                                            <Draggable key={task.id} draggableId={task.id} index={taskI}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style,
                                                            snapshot.draggingOver,
                                                            group.color
                                                        )}
                                                        className="bg-white border-l-4 p-4 rounded-md mt-4"
                                                    >
                                                        <p>{task.content}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
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
