<?php

namespace App\Http\Controllers\API;

use App\Events\DrawEvent;
use App\Events\UploadEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WebSocketController extends Controller
{
    public function draw(Request $request)
    {
        [$channel, $data] = $request->only('id', 'data');
        broadcast(new DrawEvent($channel, $data))->toOthers();
    }
    
    public function upload(Request $request)
    {
        [$channel, $file] = $request->only('id', 'file');
        $filename = time() . '.png';
        $file->storeAs('/public/uploads', $filename);
        broadcast(new UploadEvent($channel, $filename));
    }
}
