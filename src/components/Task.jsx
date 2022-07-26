import React from "react";

export default function Task(props) {
    return (
        <div style={{ borderColor: props.color }} className="bg-white border-l-4 p-4 rounded-md">
            <p>{props.taskName}</p>
        </div>
    );
}
