import { useAuth } from "./../../Contexts/AuthContext";
import Dashboard from "./Dashboard";
import Welcome from "./Welcome";

export default function Home() {
    let { currentUser } = useAuth();
    return !currentUser ? <Welcome /> : <Dashboard />;
}
