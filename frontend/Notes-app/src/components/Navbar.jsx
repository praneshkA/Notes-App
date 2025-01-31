import React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import {
  signInSuccess,
  signoutFailure,
  signoutStart,
} from "../redux/user/userSlice"
import axios from "axios"

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // Check if we're on login or signup page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  const handleLogout = async () => {
    try {
      dispatch(signoutStart())

      const res = await axios.post("http://localhost:4000/api/auth/signout", {}, {
        withCredentials: true,
      })

      // Clear token and user data regardless of response
      localStorage.removeItem('token')
      dispatch(signInSuccess(null))
      navigate("/login")

      if (res.data.success === false) {
        toast.error(res.data.message)
        return
      }

      toast.success("Logged out successfully")
    } catch (error) {
      toast.error(error.message)
      dispatch(signoutFailure(error.message))
      // Still navigate to login even if API call fails
      navigate("/login")
    }
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <Link to={"/"}>
        <h2 className="text-xl font-medium text-black py-2">
          <span className="text-slate-500">Good</span>
          <span className="text-slate-900">Notes</span>
        </h2>
      </Link>

      {currentUser && !isAuthPage && (
        <div className="flex items-center gap-4">
          <Link
            to="/view-notes"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Notes
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar