import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProjectQuestionnaire from "./pages/ProjectQuestionnaire";

import './App.css';
import GiniAIPage from "./pages/AIPage.tsx";
import AdminPage from "./pages/Admin.tsx"

// import Chat from "./pages/Chat.tsx";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GiniAIPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}

export default App;
