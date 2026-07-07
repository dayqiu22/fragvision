import { Routes, Route } from "react-router";
import Nav from "./components/Nav";
import Home from "./routes/Home";
import Fragrance from "./routes/Fragrance";
import './App.css'

function App() {

  return (
    <Routes>
      <Route element={<Nav />} >
        <Route path="/" element={<Home />} />
        <Route path="fragrance/:id" element={<Fragrance />} />
      </Route>
    </Routes>
  )
}

export default App
