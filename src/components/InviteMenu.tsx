import React, { useState } from "react";
import { auth } from "../firebase";
import KanbanService from "./../services/KanbanService";
import UserService from "./../services/UserService";

interface InviteMenuProps {
    kanbanId: string;
}

export default function InviteMenu({ kanbanId }: InviteMenuProps) {
    // TODO: display errors and success messages
    const [email, setEmail] = useState("");
    async function inviteUser(e: React.FormEvent) {
        e.preventDefault();
        try {
            const newUser = await UserService.getUserByEmail(email);
            const kanban = await KanbanService.getKanbanData(kanbanId);
            if (!newUser) {
                console.log("User does not exist");
                return;
            }
            if (!kanban) {
                console.log("Kanban does not exist");
                return;
            }
            const isHost = kanban.host === auth.currentUser?.uid;
            const invitedUserIsHost = kanban.host === newUser.id;
            const invitedUserIsAlreadyCollaborator = kanban.collaborators.includes(newUser.id);
            if (!isHost) {
                console.log("You are not a host");
                return;
            }
            if (invitedUserIsHost || invitedUserIsAlreadyCollaborator) {
                console.log("User is already invited to this kanban");
                return;
            }
            KanbanService.addCollaborator(kanbanId, newUser.id);
            console.log("User invited");
        } catch (error) {
            console.error("Error inviting a user: ", error);
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
