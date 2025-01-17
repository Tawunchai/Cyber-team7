import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Challenge2 from "./Page/Exam/Challenge2";
import Challenge3 from "./Page/Exam/Challenge3";
import Home from "./Page/Home/Home";
import "./App.css"

function App() {
  return (
    <Router>
      <div className="flex">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/challenge2" element={<Challenge2 />} />
            <Route path="/challenge3" element={<Challenge3 />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
