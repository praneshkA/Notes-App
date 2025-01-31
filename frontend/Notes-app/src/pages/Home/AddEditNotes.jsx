import React, { useState } from "react"
import { MdClose } from "react-icons/md"
import TagInput from "../../components/Input/TagInput"
import axios from "axios"
import { toast } from "react-toastify"

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "")
  const [content, setContent] = useState(noteData?.content || "")
  const [tags, setTags] = useState(noteData?.tags || [])
  const [error, setError] = useState(null)

  //   Edit Note
  const editNote = async () => {
    const noteId = noteData._id
    try {
      const token = localStorage.getItem('token');
      
      const res = await axios.post(
        `https://notes-app-d4z7.onrender.com/api/note/edit/${noteId}`,
        { title, content, tags },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        if (getAllNotes) {
          getAllNotes();
        }
        if (onClose) {
          onClose();
        }
      } else {
        setError(res.data.message);
        toast.error(res.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to edit note';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  }

  //   Add Note
  const addNewNote = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await axios.post(
        'https://notes-app-d4z7.onrender.com/api/note/add',
        { title, content, tags },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success('Note added successfully!');
        setTitle('');
        setContent('');
        setTags([]);
        if (getAllNotes) {
          getAllNotes();
        }
        if (onClose) {
          onClose();
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add note';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  }

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title")
      return
    }

    if (!content) {
      setError("Please enter the content")
      return
    }

    setError("")

    if (type === "edit") {
      editNote()
    } else {
      addNewNote()
    }
  }

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">Title</label>

        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Wake up at 6 a.m."
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-red-400 uppercase">Content</label>

        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content..."
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label text-red-400 uppercase">tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  )
}

export default AddEditNotes