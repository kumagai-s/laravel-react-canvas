import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Example from "./pages/Example";
import About from "./pages/About";
import Room from "./pages/Room";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Example/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/room" element={<Room/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Router>
    );
}

function NotFound() {
    return <h2 className={'d-flex align-items-center justify-content-center'}>This page could not be found</h2>;
}

if (document.getElementById('app')) {
    ReactDOM.render(<App/>, document.getElementById('app'));
}
