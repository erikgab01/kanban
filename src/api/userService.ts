import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

async function addUserToFirestore(uid: string, displayName: string, email: string) {
    await addDoc(collection(db, "users"), {
        user_id: uid,
        username: displayName,
        email: email,
    });
}

export { addUserToFirestore };
