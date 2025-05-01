import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import GiniAIPage from "./pages/AIPage.tsx";
import AdminPage from "./pages/Admin.tsx"



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
