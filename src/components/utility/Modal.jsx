import React from "react";

export default function Modal({ isShow, setIsShow, children }) {
    return isShow ? (
        <div
            className="fixed inset-0 z-50 p-4 overflow-x-hidden overflow-y-auto bg-black/50 flex items-center justify-center"
            onClick={() => setIsShow(false)}
        >
            <div
                className="flex justify-center items-center flex-col bg-white rounded-lg border shadow py-10 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    ) : null;
}
