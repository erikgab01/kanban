import { Navigate, useLocation, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import { useState } from "react";
import { PropsWithChildren } from "../../types";
import KanbanService from "./../../services/KanbanService";

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
    KanbanService.getKanbanData(kanbanId!).then((kanban) => {
        if (!kanban) {
            setIsAllowed(false);
            return;
        }
        const isUserHost = kanban.host === auth.currentUser!.uid;
        const isUserCollaborator = kanban.collaborators.includes(auth.currentUser!.uid);
        if (!isUserHost && !isUserCollaborator) {
            setIsAllowed(false);
        }
    });

    return isAllowed ? <>{children}</> : <Navigate to="/" />;
}
