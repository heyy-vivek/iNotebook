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
    try {
       const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }

    });
    const json = await response.json();
    if (response.ok) {
      setNotes(json);
    }else {
      return { success: false, message: "Failed to fetch notes" || json.error };
    }
      

    } catch (error) {
      console.error("Error fetching notes:", error);
      return { success: false, message: "Failed to fetch notes" || error.message };
    }
   

  }

  //Add a note
  const addNote = async (title, description, tag) => {
    //API Call
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, tag })
      });
      const note = await response.json();
      console.log(note);
        
      if (response.ok) {
        setNotes(notes.concat(note));
        return { success: true, message: "Note added successfully" };
      } else {
        return { success: false, message: "Failed to add note" || note.error };
      }

      

    } catch (error) {
      console.error("Error adding note:", error);
      return { success: false, message: "Failed to add note" || error.message };
    }

  }

  // Delete a note
  const deleteNote = async (id) => {
    //API Call
    try {
      const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        }

      });
      const json = await response.json();
      console.log(json);

      if (response.ok) {
        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);
        return { success: true, message: "Note deleted successfully" };
      } else {
        props.showAlert("Failed to delete note", "danger");
        return { success: false, message: "Failed to delete note" || json.error };
      }

    }
    catch (error) {
      console.error("Error deleting note:", error);
      return { success: false, message: "Failed to delete note" || error.message };
    }

  }

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    //API Call
    try {
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

      if (response.ok) {
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

        return { success: true, message: "Note updated successfully" };
      } else {

        return { success: false, message: "Failed to update note" || json.error };
      }



    } catch (error) {
      console.error("Error editing note:", error);
      return { success: false, message: "Failed to edit note" || error.message };
    }

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

      if(response.ok) {
        // Update the note in the state
      
        setNotes(notes.map((n) => (n._id === id ? json.note : n)));
    
        return { success: true, message: "Note shared successfully" };
      }else {
        return { success: false, message: "Failed to share note"  || json.error };
      }
      
    } catch (error) {
      console.error("Error sharing note:", error);
      return { success: false, message: "Failed to share note" || error.message };
    }

  }

  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes, shareNote }}>
      {props.children}
    </noteContext.Provider>
  )
}

export default NoteState;