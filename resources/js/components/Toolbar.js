import React, {useEffect} from 'react'
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

function ToolbarComponent(props) {
    useEffect(() => {
        let drawingButton = document.getElementById("drawingButton"),
            eraserButton = document.getElementById("eraserButton"),
            imageButton = document.getElementById("imageButton"),
            upload = document.getElementById('upload');

        drawingButton.addEventListener('click', handleDrawingButton);
        eraserButton.addEventListener('click', handleEraserButton);
        imageButton.addEventListener('click', handleImageButton);
        upload.addEventListener('change', handleUploadChange);

        function handleDrawingButton(e) {
            props.changeToolType('drawing');
            selectButton(e);
        }

        function handleEraserButton(e) {
            props.changeToolType('eraser');
            selectButton(e);
        }

        function handleImageButton(e) {
            upload.click();
            selectButton(e);
        }

        function handleUploadChange(e) {
            let file = e.target.files[0],
                formData = new FormData();
            formData.append('file', file);
            axios.post('/api/upload', { id: props.id, formData }, {
                headers: {
                    'content-type': 'multipart/form-data',
                }
            });
        }

        function selectButton(e) {
            let target = e.currentTarget,
                toolbarButton = Array.from(document.getElementsByClassName("toolbar-button-inner"));
            toolbarButton.forEach(function(element) {
                element.classList.remove('rounded-circle', 'bg-dark');
                element.firstElementChild.removeAttribute('color');
            });
            target.classList.add('rounded-circle', 'bg-dark');
            target.firstElementChild.setAttribute('color', 'white');
        }
    });

    return (
        <div className="toolbar border rounded-pill bg-white">
            <div className="toolbar-inner d-flex align-items-center justify-content-between">
                <div className="toolbar-button m-1">
                    <div id="drawingButton" className="toolbar-button-inner p-3">
                        <i className="fas fa-pen fa-lg"/>
                    </div>
                </div>
                <div className="toolbar-button m-1">
                    <div id="eraserButton" className="toolbar-button-inner p-3">
                        <i className="fas fa-eraser fa-lg"/>
                    </div>
                </div>
                <div className="toolbar-button m-1">
                    <div id="imageButton" className="toolbar-button-inner p-3">
                        <i className="fas fa-image fa-lg"/>
                    </div>
                    <input id="upload" className="d-none" type="file" name="file" accept=".png, .jpg, .jpeg"/>
                </div>
                <div className="toolbar-button m-1">
                    <div id="undoButton" className="toolbar-button-inner p-3">
                        <i className="fas fa-undo fa-lg"/>
                    </div>
                </div>
                <div className="toolbar-button m-1">
                    <div id="redoButton" className="toolbar-button-inner p-3">
                        <i className="fas fa-redo fa-lg"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToolbarComponent;
