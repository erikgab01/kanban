import React, { useContext, useState, useEffect, PropsWithChildren } from "react";
import { auth } from "../firebase";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    User,
    UserCredential,
    sendPasswordResetEmail,
} from "firebase/auth";

interface CurrentUserContextType {
    currentUser: User | null;
    signup: (email: string, password: string) => Promise<UserCredential>;
    login: (email: string, password: string, remember?: boolean) => Promise<UserCredential>;
    logout: () => void;
    updateProfileName: (name: string) => void;
    resetPassword: (email: string) => void;
}

const AuthContext = React.createContext<CurrentUserContextType>({} as CurrentUserContextType);

export function useAuth() {
    return useContext(AuthContext);
}

//TODO: Google auth option
export function AuthProvider({ children }: PropsWithChildren) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Observer is called after the redirect, so user ends up in the login page again
    // Observer can be used to handle initial loading
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    function signup(email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    async function login(email: string, password: string, remember = false) {
        if (remember) {
            await setPersistence(auth, browserLocalPersistence);
            return signInWithEmailAndPassword(auth, email, password);
        } else {
            await setPersistence(auth, browserSessionPersistence);
            return signInWithEmailAndPassword(auth, email, password);
        }
    }

    function logout() {
        return signOut(auth);
    }

    function updateProfileName(name: string) {
        if (auth.currentUser) {
            return updateProfile(auth.currentUser, {
                displayName: name,
            });
        }
    }

    function resetPassword(email: string) {
        return sendPasswordResetEmail(auth, email);
    }

    const value = {
        currentUser,
        signup,
        login,
        logout,
        updateProfileName,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
