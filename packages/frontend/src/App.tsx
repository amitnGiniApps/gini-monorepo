import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectQuestionnaire from "./pages/ProjectQuestionnaire";
import './App.css';
import LoginPageReviewer from "./pages/LoginPageReviewer";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProjectQuestionnaire />} />
                <Route path="/review" element={<LoginPageReviewer />} />
            </Routes>
        </Router>
    );
}

export default App;
