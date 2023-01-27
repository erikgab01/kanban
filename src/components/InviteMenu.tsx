import React, { useState } from "react";
import { auth } from "../firebase";
import KanbanService from "./../services/KanbanService";
import UserService from "./../services/UserService";
import { toast } from "react-toastify";

interface InviteMenuProps {
    kanbanId: string;
}

export default function InviteMenu({ kanbanId }: InviteMenuProps) {
    const [email, setEmail] = useState("");
    async function inviteUser(e: React.FormEvent) {
        e.preventDefault();
        try {
            const newUser = await UserService.getUserByEmail(email);
            const kanban = await KanbanService.getKanbanData(kanbanId);
            if (!newUser) {
                toast.error("Пользователь не существует");
                return;
            }
            if (!kanban) {
                toast.error("Доска не существует");
                return;
            }
            const isHost = kanban.host === auth.currentUser?.uid;
            const invitedUserIsHost = kanban.host === newUser.userId;
            const invitedUserIsAlreadyCollaborator = kanban.collaborators.includes(newUser.userId);
            if (!isHost) {
                toast.error("Вы не являетесь владельцем доски");
                return;
            }
            if (invitedUserIsHost || invitedUserIsAlreadyCollaborator) {
                toast.error("Пользователь уже приглашен");
                return;
            }
            KanbanService.addCollaborator(kanbanId, newUser.userId);
            toast.info("Пользователь приглашен");
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
        setEmail("");
    }
    return (
        <section className="bg-white mt-8 rounded-lg w-fit p-4">
            <h4 className="mb-2">Пригласить пользователя</h4>
            <form onSubmit={inviteUser} className="flex justify-between gap-6">
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    placeholder="Почта пользователя"
                    className="border-2 rounded-md border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 indent-2 py-1"
                />
                <button className="bg-sky-600 text-white rounded-md py-2 px-8 hover:bg-sky-700">
                    Пригласить
                </button>
            </form>
        </section>
    );
}
