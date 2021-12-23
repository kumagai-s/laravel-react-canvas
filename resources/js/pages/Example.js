import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom";

function Example() {
    const [message, setMessage] = useState('test');

    useEffect(() => {
        window.Echo.channel('public-event')
            .listen('PublicEvent', (e) => {
                console.log(e);
            });
    },[message]);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Example Component</div>

                        <div className="card-body">
                            {message}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Example;

if (document.getElementById('example')) {
    ReactDOM.render(<Example/>, document.getElementById('example'));
}
