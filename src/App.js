import Header from "./components/Header";
import Kanban from "./components/Kanban";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

function App() {
    return (
        <div className="App">
            <Header />
            <Kanban />
        </div>
    );
}

export default App;
