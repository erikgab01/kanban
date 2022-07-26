import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./../Contexts/AuthContext";

export default function Header() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    async function signOut() {
        await logout();
        navigate("/");
    }
    return (
        <nav className="text-white bg-sky-600 py-4">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-medium">Канбан-доска</h1>
                {currentUser && (
                    <div>
                        Добро пожаловать, {currentUser.displayName}
                        <button className="ml-4" onClick={signOut}>
                            Выйти
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
