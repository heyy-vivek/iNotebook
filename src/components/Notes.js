import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, getNotes, editNote, shareNote } = context;
    let navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        } else {
            navigate('/login');
        }
        // eslint-disable-next-line
    }, [])

    const ref = useRef(null)
    const refClose = useRef(null)
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });

    const shareRef = useRef(null);
    const shareCloseRef = useRef(null);
    const [shareEmail, setShareEmail] = useState("");
    const [currentNoteId, setCurrentNoteId] = useState("");
    const [shareError, setShareError] = useState(null);

    const updateNote = (currentNote) => {
        ref.current.click()
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
    }

    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click()
        props.showAlert("Updated Successfully", "success");
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    const shareNoteTrigger = (currentNote) => {
        setCurrentNoteId(currentNote._id);
        setShareError(null);
        setShareEmail("");
        shareRef.current.click();
    }

    const handleShareSubmit = async (e) => {
        e.preventDefault();
        setShareError(null);
        const response = await shareNote(currentNoteId, shareEmail);
        if (response.success) {
            shareCloseRef.current.click();
            props.showAlert("Note Shared Successfully", "success");
        } else {
            setShareError(response.error || "User not found");
        }
    }

    return (
        <>
            {/* Floating Sidebar Toggle */}
            <button 
                className="btn btn-primary sidebar-toggle d-flex align-items-center justify-content-center"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-plus'}`}></i>
            </button>

            <div className="workspace-wrapper">
                {/* LEFT PANE: Sticky Sidebar Add Note */}
                <aside className={`left-pane ${isSidebarOpen ? '' : 'closed'}`}>
                    <div className="p-4" style={{ width: "380px" }}>
                        <div className="d-flex align-items-center mb-4">
                            <span className="fs-4 me-2">✍️</span>
                            <h3 className="fw-bold m-0 text-dark">New Note</h3>
                        </div>
                        <AddNote showAlert={props.showAlert} />
                    </div>
                </aside>

                {/* RIGHT PANE: Library Area */}
                <main className="right-pane">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div>
                            <h2 className="fw-bold text-dark m-0">My Library</h2>
                            <p className="text-muted small">Manage and share your personal notes</p>
                        </div>
                        <div className="badge bg-white text-primary border px-3 py-2 rounded-pill shadow-sm">
                            {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                        </div>
                    </div>

                    <div className="row g-4">
                        {notes.length === 0 && (
                            <div className="col-12 text-center mt-5">
                                <div className="text-muted opacity-50 mb-3" style={{fontSize: '3rem'}}>📂</div>
                                <h5 className="text-muted">Your library is empty.</h5>
                                <p className="text-muted small">Click the + button to create your first note.</p>
                            </div>
                        )}
                        {notes.map((note) => {
                            return <Noteitem key={note._id} updateNote={updateNote} shareNote={shareNoteTrigger} note={note} showAlert={props.showAlert} />;
                        })}
                    </div>
                </main>
            </div>

            {/* Edit Modal (Standardized View) */}
            <button ref={ref} type="button" className="btn d-none" data-bs-toggle="modal" data-bs-target="#editModal"></button>
            <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold text-indigo">View / Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            <form>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-uppercase">Title</label>
                                    <input type="text" className="form-control form-control-lg border-0 bg-light" name="etitle" value={note.etitle} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-uppercase">Description</label>
                                    <textarea className="form-control border-0 bg-light" name="edescription" rows="8" value={note.edescription} onChange={onChange} minLength={5} required></textarea>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label fw-bold small text-uppercase">Tag</label>
                                    <input type="text" className="form-control border-0 bg-light" name="etag" value={note.etag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer border-0">
                            <button ref={refClose} type="button" className="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary rounded-pill px-4">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <button ref={shareRef} type="button" className="btn d-none" data-bs-toggle="modal" data-bs-target="#shareModal"></button>
            <div className="modal fade" id="shareModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow rounded-4">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold">Share Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {shareError && <div className="alert alert-danger py-2 small" role="alert">{shareError}</div>}
                            <p className="text-muted small">Enter an email address to share access to this note.</p>
                            <form onSubmit={handleShareSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Email Address</label>
                                    <input type="email" className="form-control" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} placeholder="collaborator@email.com" required />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer border-0">
                            <button ref={shareCloseRef} type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                            <button disabled={shareEmail.length < 5} onClick={handleShareSubmit} type="submit" className="btn btn-primary px-4">Share</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Notes