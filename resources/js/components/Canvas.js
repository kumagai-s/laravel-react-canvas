import React, {useEffect, useRef} from 'react'
import axios from "axios";
import {Canvas} from "../lib/canvas";
import ToolbarComponent from "./Toolbar";

function CanvasComponent() {
    const canvasRef = useRef(null),
        toolType = useRef(''),
        undoStack = useRef([]),
        redoStack = useRef([]),
        socketStack = useRef([]);

    useEffect(() => {
        canvasRef.current = new Canvas();
        let canvas = canvasRef.current;

        let canvasContainer = document.getElementById('canvas-container'),
            width = canvasContainer.clientWidth,
            height = canvasContainer.clientHeight;
        canvas.resize(width, height);

        window.Echo.channel("public-event")
            .listen("PublicEvent", e => {
                handleEvent(e);
            })
            .listen("ImageUploadedEvent", e => {
                let url = 'http://localhost/storage/uploads/' + e.data.filename;
                canvasContainer.setAttribute('style', 'background-image: url(' + url + '); background-size: 100%;');
            })
            .listen('UndoEvent', e => {
                socketStack.current.pop();
                canvas.clear();
                if (socketStack.current.length !== 0) {
                    socketStack.current.forEach(obj => {
                        let type = obj.type,
                            offset = obj.offset;
                        obj.points.forEach(point => {
                            if (type === 'drawing') {
                                canvas.draw(point.fx, point.fy, point.tx, point.ty, offset);
                            } else if (type === 'eraser') {
                                canvas.erase(point.fx, point.fy, point.tx, point.ty, offset);
                            }
                        });
                    });
                }
                if (undoStack.current.length !== 0) {
                    undoStack.current.forEach(obj => {
                        let type = obj.type;
                        obj.points.forEach(point => {
                            if (type === 'drawing') {
                                canvas.draw(point.fx, point.fy, point.tx, point.ty);
                            } else if (type === 'eraser') {
                                canvas.erase(point.fx, point.fy, point.tx, point.ty);
                            }
                        });
                    });
                }
            })
            .listen('RedoEvent', e => {
                handleEvent(e);
            });

        function handleEvent(e) {
            let type = e.data.type,
                offset = canvas.element.height / e.data.height;

            socketStack.current.push({ type: type, points: e.data.points, offset: offset });

            e.data.points.forEach(function (obj, i) {
                setTimeout(function () {
                    if (type === 'drawing') {
                        canvas.draw(obj.fx, obj.fy, obj.tx, obj.ty, offset);
                    } else if (type === 'eraser') {
                        canvas.erase(obj.fx, obj.fy, obj.tx, obj.ty, offset);
                    }
                }, i * 10);
            });
        }

        // canvas処理
        let _mousedown = (window.ontouchstart === undefined) ? 'mousedown' : 'touchstart',
            _mousemove = (window.ontouchmove === undefined) ? 'mousemove' : 'touchmove',
            _mouseup = (window.ontouchend === undefined) ? 'mouseup' : 'touchend';

        canvas.element.addEventListener(_mousedown, handleMouseDown);
        canvas.element.addEventListener(_mousemove, handleMouseMove);
        canvas.element.addEventListener(_mouseup, handleMouseUp);
        canvas.element.addEventListener('mouseleave', e => { isDragging = false });

        let pointData = [],
            isDragging = false,
            fromX,
            fromY;

        function scrollX() { return document.documentElement.scrollLeft || document.body.scrollLeft; }
        function scrollY() { return document.documentElement.scrollTop || document.body.scrollTop; }
        function handleMouseDown(e) {
            if (toolType.current === 'drawing' || toolType.current === 'eraser') {
                isDragging = true;
                if (_mousedown === 'touchstart') {
                    fromX = e.touches[0].clientX - canvas.element.getBoundingClientRect().left + scrollX();
                    fromY = e.touches[0].clientY - canvas.element.getBoundingClientRect().top + scrollY();
                } else {
                    fromX = e.offsetX;
                    fromY = e.offsetY;
                }
            }
        }

        function handleMouseMove(e) {
            if (!isDragging) return false;

            let toX,
                toY;
            if (_mousemove === 'touchmove') {
                toX = e.touches[0].clientX - canvas.element.getBoundingClientRect().left + scrollX();
                toY = e.touches[0].clientY - canvas.element.getBoundingClientRect().top + scrollY();
            } else {
                toX = e.offsetX;
                toY = e.offsetY;
            }

            if (toolType.current === 'drawing') {
                canvas.draw(fromX, fromY, toX, toY);
            } else if (toolType.current === 'eraser') {
                canvas.erase(fromX, fromY, toX, toY);
            }

            pointData.push({ tx: toX, ty: toY, fx: fromX, fy: fromY });

            fromX = toX;
            fromY = toY;
        }

        function handleMouseUp(e) {
            if (!isDragging) return false;
            isDragging = false;

            undoStack.current.push({ type: toolType.current, points: pointData });

            axios.post('/api/draw', {
                data: {
                    type: toolType.current,
                    points: pointData,
                    height: canvas.element.height
                }
            });

            pointData = [];
        }

        return() => {
            canvas.element.removeEventListener(_mousedown, handleMouseDown);
            canvas.element.removeEventListener(_mousemove, handleMouseMove);
            canvas.element.removeEventListener(_mouseup, handleMouseUp);
            canvas.element.removeEventListener('mouseleave', e => { isDragging = false });
        }
    }, []);

    function changeToolType(type) {
        toolType.current = String(type);
    }

    function undo() {
        let stackData = undoStack.current.pop();
        if (stackData === undefined) return false;

        let canvas = canvasRef.current;
        canvas.clear();
        if (socketStack.current.length !== 0) {
            socketStack.current.forEach(obj => {
                let type = obj.type,
                    offset = obj.offset;
                obj.points.forEach(point => {
                    if (type === 'drawing') {
                        canvas.draw(point.fx, point.fy, point.tx, point.ty, offset);
                    } else if (type === 'eraser') {
                        canvas.erase(point.fx, point.fy, point.tx, point.ty, offset);
                    }
                });
            });
        }
        if (undoStack.current.length !== 0) {
            undoStack.current.forEach(obj => {
                let type = obj.type;
                obj.points.forEach(point => {
                    if (type === 'drawing') {
                        canvas.draw(point.fx, point.fy, point.tx, point.ty);
                    } else if (type === 'eraser') {
                        canvas.erase(point.fx, point.fy, point.tx, point.ty);
                    }
                });
            });
        }

        redoStack.current.push(stackData);

        axios.post('/api/undo', {
            data: {
                height: canvas.element.height
            }
        });
    }

    function redo() {
        let stackData = redoStack.current.pop();
        if (stackData === undefined) return false;

        let canvas = canvasRef.current,
            type = stackData.type;
        stackData.points.forEach(point => {
            if (type === 'drawing') {
                canvas.draw(point.fx, point.fy, point.tx, point.ty);
            } else if (type === 'eraser') {
                canvas.erase(point.fx, point.fy, point.tx, point.ty);
            }
        });

        undoStack.current.push(stackData);

        axios.post('/api/draw', {
            data: {
                type: type,
                points: stackData.points,
                height: canvas.element.height
            }
        });

    }

    return (
        <div className="vh-100 position-relative d-flex align-items-center">
            <div id="canvas-container" className="canvas-container ratio ratio-16x9 border">
                <canvas id="canvas"/>
            </div>
            <ToolbarComponent
                changeToolType={changeToolType}
                undo={undo}
                redo={redo}
            />
        </div>
    );
}

export default CanvasComponent;
