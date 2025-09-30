<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Check if user has admin role
        if (!auth()->user() || !auth()->user()->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        $query = Client::with('user');

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('phone', 'like', "%{$search}%");
        }

        // Pagination
        $perPage = $request->get('per_page', 10);
        $clients = $query->paginate($perPage);

        return ClientResource::collection($clients);
    }
}
