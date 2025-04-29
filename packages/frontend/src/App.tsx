import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProjectQuestionnaire from "./pages/ProjectQuestionnaire";

import './App.css';
import LoginPageReviewer from "./pages/LoginPageReviewer";
import GiniAIPage from "./pages/AIPage.tsx";
import AdminPage from "./pages/Admin.tsx"
import GeminiPage from "./pages/GeminiPage.tsx";

// import Chat from "./pages/Chat.tsx";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GeminiPage />} />
                <Route path="/genai" element={<GiniAIPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/review" element={<LoginPageReviewer />} />
            </Routes>
        </Router>
    );
}

export default App;
