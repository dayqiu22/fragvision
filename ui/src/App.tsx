import { Routes, Route } from "react-router";
import Nav from "./components/Nav";
import HomeRoute from "./routes/HomeRoute";
import FragranceRoute from "./routes/FragranceRoute";

function App() {

  return (
    <Routes>
      <Route element={<Nav />} >
        <Route path="/" element={<HomeRoute />} />
        <Route path="fragrances/:id" element={<FragranceRoute />} />
      </Route>
    </Routes>
  )
}

export default App
