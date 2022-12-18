import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const value = {
        currentUser,
        signup,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
