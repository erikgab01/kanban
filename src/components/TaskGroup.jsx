import React from "react";
import { hexToRgb } from "../utility";
import Task from "./Task";

export default function Row(props) {
    const { r, g, b } = hexToRgb(props.color);
    const textColor = r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#ffffff";
    return (
        <div className="flex flex-col gap-5">
            <h6
                style={{ background: props.color, color: textColor }}
                className="py-3 px-4 self-start rounded-md"
            >
                {props.title}
            </h6>
            {props.tasks.map((task) => (
                <Task taskName={task} color={props.color} />
            ))}
        </div>
    );
}
