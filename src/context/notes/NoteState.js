import React from "react";
import noteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial);

  //Get all notes
  const getNotes = async () => {
    //  API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }

    });
    const json= await response.json();
    setNotes(json);

  }

  //Add a note
  const addNote = async (title, description, tag) => {
    //API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const note= await response.json(); 
    setNotes(notes.concat(note));
  }

  // Delete a note
  const deleteNote = async (id) => {
    //API Call
    const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }
      
    });
    const json = await response.json();
    console.log(json);
    
    
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);
  }
  // Edit a note
  const editNote = async (id, title, description, tag) => {
    //API Call
    const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);
    
    let newNotes = JSON.parse(JSON.stringify(notes));

    //Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }

    }
    setNotes(newNotes);
  }

  //share a note
  const shareNote = async (id, emailId) => {
    try {
      //API Call
      const response = await fetch(`${host}/api/notes/sharenotes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ emailId })
      });
      const json = await response.json();
      console.log(json);

      // Update the note in the state
      if (json.success) {
        setNotes(notes.map((n) => (n._id === id ? json.note : n)));
      }

      return json;
    } catch (error) {
      console.error("Error sharing note:", error);
      return { success: false, error: "Failed to share note" };
    }

  }

  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote,getNotes, shareNote }}>
      {props.children}
    </noteContext.Provider>
  )
}

export default NoteState;