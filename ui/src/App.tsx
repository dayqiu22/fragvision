import { Routes, Route } from "react-router";
import Nav from "./components/Nav";
import Home from "./routes/Home";
import Fragrance from "./routes/Fragrance";

function App() {

  return (
    <Routes>
      <Route element={<Nav />} >
        <Route path="/" element={<Home />} />
        <Route path="fragrances/:id" element={<Fragrance />} />
      </Route>
    </Routes>
  )
}

export default App
