import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Kanban from "./pages/Kanban";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./Contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import KanbanService from "./services/KanbanService";
import Layout from "./components/Layout";
import { ThemeProvider } from "./Contexts/ThemeContext";
import ForgetPassword from "./pages/Login/ForgetPassword";

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
                element: <Login />,
            },
            {
                path: "reset",
                element: <ForgetPassword />,
            },
            {
                path: "register",
                element: <Register />,
            },
        ],
    },
]);

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <RouterProvider router={router} />
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
