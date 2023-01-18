import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import kanban_setup from "../kanban_setup";

async function getKanbanData(kanbanId) {
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

async function updateKanbanData(kanbanId, data) {
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

async function createNewKanban(title, desc) {
    const kanbanRef = await addDoc(collection(db, "kanbans"), {
        name: title,
        description: desc,
        host: auth.currentUser.uid,
        collaborators: [],
        kanban: JSON.stringify(kanban_setup),
    });
    return kanbanRef.id;
}

async function deleteKanban(kanbanId) {
    await deleteDoc(doc(db, "kanbans", kanbanId));
}

async function updateKanbanInfo(kanbanId, newName, newDesc) {
    const kanbanRef = doc(db, "kanbans", kanbanId.id);
    await updateDoc(kanbanRef, {
        name: newName,
        description: newDesc,
    });
}

export { getKanbanData, updateKanbanData, updateKanbanInfo, createNewKanban, deleteKanban };
