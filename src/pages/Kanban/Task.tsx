import React, { useRef, useEffect } from "react";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { KanbanStructure, TaskData } from "../../types";

interface TaskProps {
    task: TaskData;
    taskI: number;
    groupI: number;
    color: string;
    groups: KanbanStructure[];
    setGroups: React.Dispatch<React.SetStateAction<KanbanStructure[]>>;
}

export default function Task({ task, taskI, groupI, color, groups, setGroups }: TaskProps) {
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // Autoresize textarea
    useEffect(() => {
        if (textareaRef.current) {
            // TODO: figure out why this is needed
            //textareaRef.current.style.height = "0px";
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = scrollHeight + "px";
            //console.log(textareaRef);
        }
    }, [task.content]);

    const getItemStyle = (
        isDragging: boolean,
        draggableStyle: any,
        draggingOver: any,
        defaultColor: string
    ) => ({
        // some basic styles to make the items look a bit nicer
        borderColor: draggingOver ? groups[draggingOver].color : defaultColor,
        // change background colour if dragging

        // styles we need to apply on draggables
        ...draggableStyle,
    });
    const updateTask = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setGroups((oldGroups) => {
            const newGroups = JSON.parse(JSON.stringify(oldGroups));
            newGroups[groupI].tasks[taskI].content = e.target.value;
            return newGroups;
        });
    };
    return (
        <Draggable draggableId={task.id} index={taskI}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        snapshot.draggingOver,
                        color
                    )}
                    className="bg-white border-l-4 p-4 rounded-md mt-4 flex items-center gap-4 dark:bg-dark-blue-400 dark:text-white"
                    onDoubleClick={() => setIsEditing(true)}
                >
                    {isEditing ? (
                        <textarea
                            className="w-full resize-none overflow-hidden outline-none bg-inherit border-b-2 border-blue-400 dark:border-dark-purple"
                            value={task.content}
                            onChange={updateTask}
                            onKeyDown={(e) => (e.key === "Enter" ? setIsEditing(!isEditing) : 0)}
                            rows={1}
                            ref={textareaRef}
                        />
                    ) : (
                        <textarea
                            className="w-full resize-none overflow-hidden bg-inherit pointer-events-none"
                            value={task.content}
                            disabled
                            rows={1}
                            ref={textareaRef}
                        />
                    )}
                    <button
                        className={
                            isEditing
                                ? "bg-blue-100 text-blue-400 rounded-md p-1 outline-none dark:text-dark-purple dark:bg-inherit"
                                : "bg-inherit p-1 outline-none"
                        }
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <FontAwesomeIcon icon={["fas", "pen-to-square"]} />
                    </button>
                </div>
            )}
        </Draggable>
    );
}
