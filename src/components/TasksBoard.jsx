import React, { useState, useRef } from "react";
import { hexToRgb } from "../utility";

export default function TasksBoard({ groups, setGroups }) {
    const [dragging, setDragging] = useState(false);
    const dragItem = useRef();
    const dragItemNode = useRef();
    function handleDragStart(e, item) {
        dragItemNode.current = e.target;
        dragItemNode.current.addEventListener("dragend", handleDragEnd);
        dragItem.current = item;

        setTimeout(() => {
            setDragging(true);
        }, 0);
    }
    function handleDragEnter(e, targetItem) {
        if (dragItem.current.groupI !== targetItem.groupI || dragItem.current.taskI !== targetItem.taskI) {
            setGroups((oldList) => {
                let newList = JSON.parse(JSON.stringify(oldList));
                newList[targetItem.groupI].tasks.splice(
                    targetItem.taskI,
                    0,
                    newList[dragItem.current.groupI].tasks.splice(dragItem.current.taskI, 1)[0]
                );
                dragItem.current = targetItem;
                return newList;
            });
        }
    }
    function handleDragEnd(e) {
        setDragging(false);
        dragItem.current = null;
        dragItemNode.current.removeEventListener("dragend", handleDragEnd);
        dragItemNode.current = null;
    }
    return (
        <section className="flex gap-12 mt-8">
            {groups.map((group, groupI) => {
                const { r, g, b } = hexToRgb(group.color);
                const textColor = r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#ffffff";
                return (
                    <div
                        key={groupI}
                        onDragEnter={
                            dragging && !group.tasks.length
                                ? (e) => handleDragEnter(e, { groupI, taskI: 0 })
                                : null
                        }
                        className="flex flex-col gap-5"
                    >
                        <h6
                            style={{ background: group.color, color: textColor }}
                            className="py-3 px-4 self-start rounded-md"
                        >
                            {group.title}
                        </h6>
                        {group.tasks.map((task, taskI) => (
                            <div
                                draggable
                                key={task}
                                onDragStart={(e) => handleDragStart(e, { groupI, taskI })}
                                onDragEnter={
                                    dragging
                                        ? (e) => {
                                              handleDragEnter(e, { groupI, taskI });
                                          }
                                        : null
                                }
                                style={{ borderColor: group.color }}
                                className="bg-white border-l-4 p-4 rounded-md"
                            >
                                <p>{task}</p>
                            </div>
                        ))}
                    </div>
                );
            })}
        </section>
    );
}
