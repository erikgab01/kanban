import Header from "../components/Header";
import Home from "../components/Home";
import { useAuth } from "../Contexts/AuthContext";
import Dashboard from "../components/Dashboard";

export default function HomePage() {
    let { currentUser } = useAuth();
    return (
        <>
            <Header />
            {!currentUser ? <Home /> : <Dashboard />}
        </>
    );
}
