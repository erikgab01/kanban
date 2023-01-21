import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export default class UserService {
    static async addUserToFirestore(uid: string, displayName: string, email: string): Promise<void> {
        await addDoc(collection(db, "users"), {
            user_id: uid,
            username: displayName,
            email: email,
        });
    }
}
