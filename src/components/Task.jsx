import React, { useRef, useEffect } from "react";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

// Move groups to context
export default function Task({ task, taskI, groupI, color, groups, setGroups }) {
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);
    useEffect(() => {
        textareaRef.current.style.height = "0px";
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + "px";
        console.log(textareaRef);
    }, [task.content]);

    const getItemStyle = (isDragging, draggableStyle, draggingOver, defaultColor) => ({
        // some basic styles to make the items look a bit nicer
        borderColor: draggingOver ? groups[draggingOver].color : defaultColor,
        // change background colour if dragging

        // styles we need to apply on draggables
        ...draggableStyle,
    });
    const updateTask = (e) => {
        setGroups((oldGroups) => {
            const newGroups = JSON.parse(JSON.stringify(oldGroups));
            newGroups[groupI].tasks[taskI].content = e.target.value;
            return newGroups;
        });
    };
    return (
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
                        color
                    )}
                    className="bg-white border-l-4 p-4 rounded-md mt-4"
                >
                    {isEditing ? (
                        <textarea
                            className="w-full resize-none overflow-hidden"
                            value={task.content}
                            onChange={updateTask}
                            ref={textareaRef}
                        />
                    ) : (
                        <textarea
                            className="w-full resize-none overflow-hidden"
                            value={task.content}
                            disabled
                            ref={textareaRef}
                        />
                    )}
                    <button className="ml-4" onClick={() => setIsEditing(!isEditing)}>
                        R
                    </button>
                </div>
            )}
        </Draggable>
    );
}
