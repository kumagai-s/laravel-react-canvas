import React from 'react';
import ReactDOM from 'react-dom';

function About() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">About Component</div>

                        <div className="card-body">I'm an about component!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;

if (document.getElementById('about')) {
    ReactDOM.render(<About />, document.getElementById('about'));
}
