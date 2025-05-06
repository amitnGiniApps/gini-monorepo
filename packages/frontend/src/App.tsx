import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AppDiagnostic from "./pages/AppDiagnostic.tsx";
import ChatPage from "./pages/./ChatPage.tsx";
import AdminPage from "./pages/Admin.tsx";
import GeminiPage from "./pages/GeminiPage.tsx";
import ServicesGrid from "./components/Services.tsx";

import './App.css';
import SummaryPage from "./pages/SummaryPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GeminiPage />} />
                <Route path="/gini-ai" element={<ChatPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/services" element={<ServicesGrid />} />
                <Route path="/review" element={<AppDiagnostic />} />
                <Route path="/admin/summaries" element={<SummaryPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
