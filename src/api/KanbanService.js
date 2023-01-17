import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

async function getKanbanDataById(kanbanId) {
    try {
        const docSnap = await getDoc(doc(db, "kanbans", kanbanId));
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error("Error reading a document: ", error);
        return null;
    }
}

async function updateKanbanDataById(kanbanId, data) {
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

export { getKanbanDataById, updateKanbanDataById };
