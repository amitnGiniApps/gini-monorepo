import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPageReviewer from "./pages/LoginPageReviewer";
import GiniAIPage from "./pages/AIPage.tsx";
import AdminPage from "./pages/Admin.tsx";
import GeminiPage from "./pages/GeminiPage.tsx";
import ServicesGrid from "./components/Services.tsx";

import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GeminiPage />} />
                <Route path="/gini-ai" element={<GiniAIPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/services" element={<ServicesGrid />} />
                <Route path="/review" element={<LoginPageReviewer />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
