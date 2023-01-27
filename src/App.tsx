import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import KanbanPage from "./pages/KanbanPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./Contexts/AuthContext";
import PrivateRoute from "./components/utility/PrivateRoute";
import KanbanService from "./services/KanbanService";

library.add(fas);

//TODO: Prettier config

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/kanban/:kanbanId",
        loader: async ({ params }) => {
            return KanbanService.getKanbanData(params.kanbanId!);
        },
        element: (
            <PrivateRoute>
                <KanbanPage />
            </PrivateRoute>
        ),
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
]);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
