import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { UserData } from "../types";

export default class UserService {
    static async addUserToFirestore(
        uid: string,
        displayName: string,
        email: string
    ): Promise<void> {
        await addDoc(collection(db, "users"), {
            userId: uid,
            username: displayName,
            email: email,
        });
    }

    static async getUserByEmail(email: string): Promise<UserData | null> {
        const q = query(collection(db, "users"), where("email", "==", email));
        const userRef = await getDocs(q);
        if (userRef.docs.length === 0) {
            console.log("User not found");
            return null;
        }
        const newUser = userRef.docs[0].data() as UserData;
        return newUser;
    }
}
