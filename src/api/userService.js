import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

async function addUserToFirestore(uid, displayName, email) {
    await addDoc(collection(db, "users"), {
        user_id: uid,
        username: displayName,
        email: email,
    });
}

export { addUserToFirestore };
