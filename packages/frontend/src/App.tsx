import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectQuestionnaire from "./pages/ProjectQuestionnaire";
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProjectQuestionnaire />} />
            </Routes>
        </Router>
    );
}

export default App;
