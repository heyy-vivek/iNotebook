import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext';

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote, shareNote } = props;

    return (
        <div className="col-xl-4 col-md-6">
            <div className="card my-3 note-card shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                    {/* Header: Title and Actions */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold text-truncate" style={{ maxWidth: '70%' }}>
                            {note.title}
                        </h5>
                        <div className="d-flex align-items-center">
                            <i
                                className="fa-solid fa-share-nodes mx-2 text-primary cursor-pointer"
                                title="Share Note"
                                onClick={() => shareNote(note)}
                            ></i>
                            <i
                                className="fa-regular fa-pen-to-square mx-2 text-secondary cursor-pointer"
                                title="Edit Note"
                                onClick={() => updateNote(note)}
                            ></i>
                            <i
                                className="fa-solid fa-trash mx-2 text-danger cursor-pointer"
                                title="Delete Note"
                                onClick={async () => {
                                    // 1. Wait for the delete operation to finish
                                    const res = await deleteNote(note._id);

                                    // 2. Check the response before alerting
                                    if (res.success) {
                                        props.showAlert("Deleted Successfully", "success");
                                    } else {
                                        // 3. Show the actual error message (e.g., "Cannot delete shared notes")
                                        props.showAlert(res.message, "danger");
                                    }
                                }}
                            ></i>
                        </div>
                    </div>

                    {/* Badge/Tag */}
                    <div className="mb-3">
                        <span className="badge rounded-pill bg-light text-primary border px-2 py-1" style={{ fontSize: '0.7rem' }}>
                            {note.tag || "General"}
                        </span>
                    </div>

                    {/* Trimmed Description */}
                    <p className="card-text card-content-trim">
                        {note.description}
                    </p>

                    {/* Footer: Date and View Full Button */}
                    <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {new Date(note.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </small>
                        <button
                            className="btn btn-link btn-sm text-decoration-none fw-bold p-0"
                            style={{ color: 'var(--primary)' }}
                            onClick={() => updateNote(note)}
                        >
                            View Full →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Noteitem