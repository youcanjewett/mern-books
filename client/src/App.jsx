import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home/home";
import About from "./routes/About/about";

function App() {
  return (
    <>
      <Router>
        Header
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/about" element={<About />}/>
        </Routes>
        Footer
      </Router>
    </>
  );
}

export default App;
