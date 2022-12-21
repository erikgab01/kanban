import React, { useContext, useState, useEffect } from "react";
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
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

//TODO: Google auth option
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
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

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    async function login(email, password, remember = false) {
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

    function updateProfileName(name) {
        return updateProfile(auth.currentUser, {
            displayName: name,
        });
    }

    const value = {
        currentUser,
        signup,
        login,
        logout,
        updateProfileName,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
