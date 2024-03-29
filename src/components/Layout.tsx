import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../Contexts/ThemeContext";

export default function Layout() {
    const { currentUser, logout } = useAuth();
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    async function signOut() {
        await logout();
        navigate("/");
    }
    return (
        <div className="flex flex-col min-h-screen bg-light-blue dark:bg-dark-blue-800 transition-colors ease-linear duration-200">
            <nav className="text-white py-4 shadow-md bg-sky-600 dark:bg-dark-purple">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-medium">
                        <Link to={"/"}>Канбан-доска</Link>
                    </h1>
                    {currentUser && (
                        <div className="ml-auto mr-12">
                            Добро пожаловать, {currentUser.displayName}
                            <button className="ml-4" onClick={signOut}>
                                Выйти
                            </button>
                        </div>
                    )}
                    <FontAwesomeIcon
                        className="cursor-pointer"
                        onClick={toggleTheme}
                        icon={dark ? ["fas", "sun"] : ["fas", "moon"]}
                    />
                </div>
                <ToastContainer position="bottom-right" newestOnTop />
            </nav>
            <Outlet />
        </div>
    );
}
