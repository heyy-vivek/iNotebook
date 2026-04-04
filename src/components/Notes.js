import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote, shareNote } = context;
  let navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();
      //eslint-disable-next-line
    }
    else {
      navigate('/login');
      //eslint-disable-next-line
    }
  }, [])

  const ref = useRef(null)
  const refClose = useRef(null)
  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });

  const updateNote = (currentNote) => {
    ref.current.click()
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })

  }

  

  const handleClick = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.etag)
    console.log("updating the note...", note)
    refClose.current.click()
    props.showAlert("Updated Successfully", "success");
    // addNote(note.title,note.description,note.tag);
  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  }

  const shareRef = useRef(null);
  const shareCloseRef = useRef(null);
  const [shareEmail, setShareEmail] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState("");

  const shareNoteTrigger = (currentNote) => {
    setCurrentNoteId(currentNote._id);
    shareRef.current.click(); // Open the share modal
    setShareEmail(""); // Reset email field
  }

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    const response = await shareNote(currentNoteId, shareEmail);
    if (response.success) {
      shareCloseRef.current.click();
      props.showAlert("Note Shared Successfully", "success");
    } else {
      props.showAlert(response.error || "Failed to share", "danger");
    }
    
  }
  return (
    <>
      <AddNote showAlert={props.showAlert} />


      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>


      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" onChange={onChange} value={note.etitle} minLength={5} required />

                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" name="edescription" onChange={onChange} value={note.edescription} minLength={5} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="etag" name="etag" onChange={onChange} value={note.etag} />
                </div>

                <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
            </div>

          </div>
        </div>
      </div>
      <button ref={shareRef} type="button" className="btn d-none" data-bs-toggle="modal" data-bs-target="#shareModal"></button>

      <div className="modal fade" id="shareModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Share Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="shareEmail" className="form-label">Recipient's Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="shareEmail"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="enteruser@email.com"
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={shareCloseRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button disabled={shareEmail.length < 5} onClick={handleShareSubmit} type="button" className="btn btn-primary">Share</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container my-2">
          {(notes.length === 0) && 'No notes to display'}
        </div>
        {notes.map((note) => {
          return <Noteitem key={note._id} updateNote={updateNote} shareNote={shareNoteTrigger} note={note} showAlert={props.showAlert} />;
        })}
      </div>
    </>
  )
}

export default Notes