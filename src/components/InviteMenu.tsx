import React, { useState } from "react";
import { getDoc, getDocs, doc, updateDoc, query, collection, where, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";
import { KanbanDoc } from "./Dashboard";

interface InviteMenuProps {
    kanbanId: string;
}

export default function InviteMenu({ kanbanId }: InviteMenuProps) {
    // TODO: display errors and success messages
    const [email, setEmail] = useState("");
    async function inviteUser(e: React.FormEvent) {
        e.preventDefault();
        try {
            const q = query(collection(db, "users"), where("email", "==", email));
            const userRef = await getDocs(q);
            if (userRef.docs.length === 0) {
                console.log("User not found");
                return;
            }
            const newUser = userRef.docs[0];
            const kanbanRef = doc(db, "kanbans", kanbanId);
            const kanban = (await getDoc(kanbanRef)) as unknown as KanbanDoc;
            const isHost = kanban.data().host === auth.currentUser?.uid;
            const invitedUserIsHost = kanban.data().host === newUser.data().user_id;
            const invitedUserIsAlreadyCollaborator = kanban
                .data()
                .collaborators.includes(newUser.data().user_id);
            if (!isHost) {
                console.log("You are not a host");
                return;
            }
            if (invitedUserIsHost || invitedUserIsAlreadyCollaborator) {
                console.log("User is already invited to this kanban");
                return;
            }

            await updateDoc(kanbanRef, {
                collaborators: arrayUnion(newUser.data().user_id),
            });
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
