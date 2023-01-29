import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Kanban from "./pages/Kanban";
import LoginForm from "./pages/Login";
import RegisterForm from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./Contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import KanbanService from "./services/KanbanService";
import Layout from "./components/Layout";

library.add(fas);

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "kanban/:kanbanId",
                loader: async ({ params }) => {
                    return KanbanService.getKanbanData(params.kanbanId!);
                },
                element: (
                    <PrivateRoute>
                        <Kanban />
                    </PrivateRoute>
                ),
            },
            {
                path: "login",
                element: <LoginForm />,
            },
            {
                path: "register",
                element: <RegisterForm />,
            },
        ],
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
