<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoomController extends Controller
{
    /**
     * @var Room
     */
    private $room;
    
    public function __construct(Room $room)
    {
        $this->room = $room;
    }
    
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $params['id'] = Str::random(24);
        $this->room->create($params);
        
        return response()->json([
           'id' => $params['id'],
        ]);
    }
}
