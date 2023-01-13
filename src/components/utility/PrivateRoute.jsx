import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import { useState } from "react";

export default function PrivateRoute({ children }) {
    let location = useLocation();
    const { kanbanId } = useParams();
    const [isAllowed, setIsAllowed] = useState(true);

    // Auth.currentUser is updated immediately after signup/login function is called
    if (!auth.currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Check if user is a host/collaborator of this kanban
    // Need a better implementation of this
    const docRef = doc(db, "kanbans", kanbanId);
    getDoc(docRef).then((doc) => {
        const isUserHost = doc.data().host === auth.currentUser.uid;
        const isUserCollaborator = doc.data().collaborators.includes(auth.currentUser.uid);
        if (!isUserHost && !isUserCollaborator) {
            setIsAllowed(false);
        }
    });

    return isAllowed ? children : <Navigate to="/" />;
}