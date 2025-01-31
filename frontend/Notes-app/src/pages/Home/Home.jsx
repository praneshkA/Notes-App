import { useState, useEffect } from "react"
import NoteCard from "../../components/Cards/NoteCard"
import { MdAdd } from "react-icons/md"
import Modal from "react-modal"
import AddEditNotes from "./AddEditNotes"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import EmptyCard from "../../components/EmptyCard/EmptyCard"

const Home = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [userInfo, setUserInfo] = useState(null)
  const [notes, setNotes] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [editNote, setEditNote] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate("/login")
    } else {
      setUserInfo(currentUser?.rest || currentUser)
      getAllNotes()
    }
  }, [currentUser])

  const getAllNotes = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('https://notes-app-d4z7.onrender.com/api/note/all', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })

      if (res.data.success) {
        setNotes(res.data.notes)
      }
    } catch (error) {
      toast.error('Failed to fetch notes')
    }
  }

  const handleDelete = async (noteId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`https://notes-app-d4z7.onrender.com/api/note/delete/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })

      if (res.data.success) {
        toast.success('Note deleted successfully')
        getAllNotes()
      }
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

  const onSearchNote = async (query) => {
    try {
      const res = await axios.get("https://notes-app-d4z7.onrender.com/api/note/search", {
        params: { query },
        withCredentials: true,
      })

      if (!res.data.success) {
        toast.error(res.data.message)
        return
      }

      setIsSearch(true)
      setNotes(res.data.notes)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const updateIsPinned = async (noteData) => {
    try {
      const res = await axios.put(
        `https://notes-app-d4z7.onrender.com/api/note/update-note-pinned/${noteData._id}`,
        { isPinned: !noteData.isPinned },
        { withCredentials: true }
      )

      if (!res.data.success) {
        toast.error(res.data.message)
        return
      }

      toast.success(res.data.message)
      getAllNotes()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <button 
        onClick={() => setShowAddNote(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Note
      </button>

      {showAddNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <AddEditNotes 
              onClose={() => setShowAddNote(false)}
              getAllNotes={getAllNotes}
            />
          </div>
        </div>
      )}

      {editNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <AddEditNotes 
              noteData={editNote}
              type="edit"
              onClose={() => setEditNote(null)}
              getAllNotes={getAllNotes}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note._id} className="border p-4 rounded-lg">
            <h3 className="text-xl font-bold">{note.title}</h3>
            <p className="mt-2">{note.content}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditNote(note)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
