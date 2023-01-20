import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { KanbanDoc, PropsWithChildren } from "../../types";

export default function PrivateRoute({ children }: PropsWithChildren) {
    let location = useLocation();
    const { kanbanId } = useParams();
    const [isAllowed, setIsAllowed] = useState(true);

    // Auth.currentUser is updated immediately after signup/login function is called
    if (!auth.currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Check if user is a host/collaborator of this kanban
    // Need a better implementation of this
    const docRef = doc(db, "kanbans", kanbanId!);
    getDoc(docRef).then((doc) => {
        const kanbanDoc = doc as unknown as KanbanDoc;
        const isUserHost = kanbanDoc.data().host === auth.currentUser!.uid;
        const isUserCollaborator = kanbanDoc.data().collaborators.includes(auth.currentUser!.uid);
        if (!isUserHost && !isUserCollaborator) {
            setIsAllowed(false);
        }
    });

    return isAllowed ? <>{children}</> : <Navigate to="/" />;
}
