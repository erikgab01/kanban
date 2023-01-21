import { addDoc, arrayRemove, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import kanban_setup from "../kanban_setup";
import { KanbanData } from "../types";

//TODO: Make a more generic interface for kanbans (without firebase docs)
export default class KanbanService {
    static async getKanbanData(kanbanId: string): Promise<KanbanData | null> {
        try {
            const docSnap = await getDoc(doc(db, "kanbans", kanbanId));
            if (docSnap.exists()) {
                return docSnap.data() as KanbanData;
            }
            return null;
        } catch (error) {
            console.error("Error reading a document: ", error);
            return null;
        }
    }
    static async updateKanbanData(kanbanId: string, data: any): Promise<void> {
        try {
            const kanbanRef = doc(db, "kanbans", kanbanId);
            await updateDoc(kanbanRef, {
                kanban: JSON.stringify(data),
            });
            console.log("Document saved");
        } catch (error) {
            console.error("Error adding a document: ", error);
        }
    }
    static async createNewKanban(title: string, desc: string): Promise<string | null> {
        if (!auth.currentUser) {
            return null;
        }
        const kanbanRef = await addDoc(collection(db, "kanbans"), {
            name: title,
            description: desc,
            host: auth.currentUser.uid,
            collaborators: [],
            kanban: JSON.stringify(kanban_setup),
        });
        return kanbanRef.id;
    }

    static async deleteKanban(kanbanId: string): Promise<void> {
        await deleteDoc(doc(db, "kanbans", kanbanId));
    }

    static async updateKanbanInfo(kanbanId: string, newName: string, newDesc: string): Promise<void> {
        const kanbanRef = doc(db, "kanbans", kanbanId);
        await updateDoc(kanbanRef, {
            name: newName,
            description: newDesc,
        });
    }

    static async removeCollaborator(kanbanId: string, userId: string): Promise<void> {
        const kanbanRef = doc(db, "kanbans", kanbanId);
        await updateDoc(kanbanRef, {
            collaborators: arrayRemove(userId),
        });
    }
}
