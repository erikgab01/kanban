import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-4 min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="font-medium text-lg text-center">Добро пожаловать</h1>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link
                    to={"/kanban/1"}
                    className="bg-sky-600 text-white rounded-md py-2 px-8 hover:bg-sky-700"
                >
                    Перейти к доске
                </Link>
            </div>
        </div>
    );
}
