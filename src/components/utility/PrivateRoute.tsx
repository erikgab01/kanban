import { Navigate, useLocation, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import { useState } from "react";
import { PropsWithChildren } from "../../types";
import KanbanService from "./../../services/KanbanService";
import { toast } from "react-toastify";
import Header from "../Header";

export default function PrivateRoute({ children }: PropsWithChildren) {
    let location = useLocation();
    const { kanbanId } = useParams();
    const [status, setStatus] = useState<"allow" | "unknown" | "forbid">("unknown");

    // Auth.currentUser is updated immediately after signup/login function is called
    if (!auth.currentUser) {
        toast.error("Необходимо войти в аккаунт");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Check if user is a host/collaborator of this kanban
    // Need a better implementation of this
    KanbanService.getKanbanData(kanbanId!).then((kanban) => {
        if (!kanban) {
            toast.error("Доска не существует");
            setStatus("forbid");
            return;
        }
        const isUserHost = kanban.host === auth.currentUser!.uid;
        const isUserCollaborator = kanban.collaborators.includes(auth.currentUser!.uid);
        if (!isUserHost && !isUserCollaborator) {
            toast.error("У вас нет прав для посещения данной доски");
            setStatus("forbid");
        } else {
            setStatus("allow");
        }
    });

    switch (status) {
        case "allow":
            return <>{children}</>;

        case "unknown":
            return <Header />;

        case "forbid":
            return <Navigate to="/" />;
    }
}
