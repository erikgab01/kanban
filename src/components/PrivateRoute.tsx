import { Navigate, useLoaderData, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { PropsWithChildren } from "../types";
import { toast } from "react-toastify";
import { KanbanData } from "../types";

export default function PrivateRoute({ children }: PropsWithChildren) {
    const location = useLocation();
    const kanban = useLoaderData() as KanbanData;

    // Auth.currentUser is updated immediately after signup/login function is called
    if (!auth.currentUser) {
        toast.error("Необходимо войти в аккаунт");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!kanban) {
        toast.error("Доска не существует");
        return <Navigate to="/" />;
    }
    const isUserHost = kanban.host === auth.currentUser!.uid;
    const isUserCollaborator = kanban.collaborators.includes(auth.currentUser!.uid);
    if (!isUserHost && !isUserCollaborator) {
        toast.error("У вас нет прав для посещения данной доски");
        return <Navigate to="/" />;
    } else {
        return <>{children}</>;
    }
}
