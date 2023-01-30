import { setDoc, doc, collection, getDocs, query, where, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserData } from "../types";

export default class UserService {
    static async addUserToFirestore(
        uid: string,
        displayName: string,
        email: string
    ): Promise<void> {
        await setDoc(doc(db, "users", uid), {
            username: displayName,
            email: email,
        });
    }

    static async getUserByEmail(email: string): Promise<UserData | null> {
        const q = query(collection(db, "users"), where("email", "==", email));
        const userSnap = await getDocs(q);
        if (userSnap.docs.length === 0) {
            console.log("User not found");
            return null;
        }
        const user = { userId: userSnap.docs[0].id, ...userSnap.docs[0].data() } as UserData;
        return user;
    }

    static async getUserById(id: string): Promise<UserData | null> {
        const userSnap = await getDoc(doc(db, "users", id));
        if (userSnap.exists()) {
            console.log("Document data:", userSnap.data());
            const user = { userId: userSnap.id, ...userSnap.data() } as UserData;
            return user;
        } else {
            console.log("No such document!");
            return null;
        }
    }
}
