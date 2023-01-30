import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    Unsubscribe,
    updateDoc,
    where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import kanban_setup from "../kanban_setup";
import { KanbanData } from "../types";

export default class KanbanService {
    static async getKanbanData(kanbanId: string): Promise<KanbanData | null> {
        try {
            const docSnap = await getDoc(doc(db, "kanbans", kanbanId));
            if (docSnap.exists()) {
                const kanbanData = {
                    id: docSnap.id,
                    ...docSnap.data(),
                } as KanbanData;
                return kanbanData;
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

    static async updateKanbanInfo(
        kanbanId: string,
        newName: string,
        newDesc: string
    ): Promise<void> {
        const kanbanRef = doc(db, "kanbans", kanbanId);
        await updateDoc(kanbanRef, {
            name: newName,
            description: newDesc,
        });
    }

    static async addCollaborator(kanbanId: string, userId: string): Promise<void> {
        const kanbanRef = doc(db, "kanbans", kanbanId);
        await updateDoc(kanbanRef, {
            collaborators: arrayUnion(userId),
        });
    }

    static async removeCollaborator(kanbanId: string, userId: string): Promise<void> {
        const kanbanRef = doc(db, "kanbans", kanbanId);
        await updateDoc(kanbanRef, {
            collaborators: arrayRemove(userId),
        });
    }

    static setKanbanListener(kanbanId: string, callback: (value: KanbanData) => void): Unsubscribe {
        const unsubscribe = onSnapshot(doc(db, "kanbans", kanbanId), (doc) => {
            // Listener is invoked even on local changes
            // State is changed twice(here and in kanban component), and data saved to db twice
            // So we will ignore local changes, only handle server changes
            const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            if (source === "Local") {
                return;
            }
            console.log("listener");
            callback(doc.data() as KanbanData);
        });
        return unsubscribe;
    }

    // TODO: remove loading callbacks
    static setHostKanbansListener(
        callback: (value: KanbanData[]) => void,
        loadingCallback: (value: boolean) => void
    ): Unsubscribe {
        const q = query(collection(db, "kanbans"), where("host", "==", auth.currentUser?.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            loadingCallback(false);
            const kanbanData = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as KanbanData;
            });
            callback(kanbanData);
        });
        return unsubscribe;
    }

    static setCollabKanbansListener(
        callback: (value: KanbanData[]) => void,
        loadingCallback: (value: boolean) => void
    ): Unsubscribe {
        const q = query(
            collection(db, "kanbans"),
            where("collaborators", "array-contains", auth.currentUser?.uid)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            loadingCallback(false);
            const kanbanData = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as KanbanData;
            });
            callback(kanbanData);
        });
        return unsubscribe;
    }
}
