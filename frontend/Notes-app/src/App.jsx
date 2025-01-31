import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home.jsx"
import Login from "./pages/Login/Login.jsx"
import Signup from "./pages/Signup/Signup.jsx"
import Navbar from "./components/Navbar"
import ViewNotes from "./pages/ViewNotes/ViewNotes.jsx"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AddEditNotes from "./pages/Home/AddEditNotes.jsx"

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addeditnotes" element={<AddEditNotes />} />
        <Route path="/view-notes" element={<ViewNotes />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  )
}

export default App