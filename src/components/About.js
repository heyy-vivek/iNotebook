// About.js

import React from 'react';

const About = () => {
    return (
        <div className="container-fluid bg-light p-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="display-4 text-center mb-4">About iNotebook</h1>
                    <p className="lead text-center">
                        Welcome to iNotebook, your personal digital companion for organizing, managing, and capturing your ideas and thoughts. We designed iNotebook to be your go-to platform for effortlessly taking notes and staying organized in today's fast-paced world.
                    </p>
                    <div className="card mb-4">
                        <div className="card-header">
                            <h2>Key Features</h2>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Create and manage multiple notebooks</li>
                            <li className="list-group-item">Update or edit your notes</li>
                            <li className="list-group-item">Tagging system for easy categorization</li>

                            <li className="list-group-item">Secure and private note storage</li>
                        </ul>
                    </div>
                    <div className="card mb-4">
                        <div className="card-header">
                            <h2>User Benefits</h2>
                        </div>
                        <div className="card-body">
                            <p className="card-text">
                                Say goodbye to scattered notes and the frustration of searching for crucial information. With iNotebook, you can effortlessly organize your notes, quickly search through your collection, and find what you need in seconds. Whether you're a student, professional, or creative mind, iNotebook adapts to your workflow, making sure no brilliant idea goes unnoticed.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <p>
                            Ready to unleash the power of organization and creativity? Sign up for iNotebook today and experience the joy of effortless note-taking.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
