import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const ViewNotes = () => {
  const [notes, setNotes] = useState([])
  const [editingNote, setEditingNote] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getAllNotes()
  }, [])

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

  const handleEdit = async (noteId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`https://notes-app-d4z7.onrender.com/api/note/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })

      if (res.data.success) {
        navigate('/addeditnotes', { 
          state: { 
            noteData: res.data.note,
            type: 'edit'
          }
        })
      }
    } catch (error) {
      toast.error('Failed to fetch note details')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Notes</h2>
        <button
          onClick={() => navigate('/addeditnotes')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Note
        </button>
      </div>
      <div className="grid gap-6">
        {notes.map((note) => (
          <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{note.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(note._id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
            {note.tags && note.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 text-sm text-gray-500">
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewNotes 