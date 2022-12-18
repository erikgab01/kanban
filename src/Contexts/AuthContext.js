import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    function signup(email, password) {
        return auth.CreateUserWithEmailAndPassword(email, password);
    }

    auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
    });

    const value = {
        currentUser,
        signup,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
