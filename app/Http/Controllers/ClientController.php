<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Check if user has admin role
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized access.');
        }

        return Inertia::render('clients/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check if user has admin role
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized access.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:255',
            'password' => 'required|string|min:8',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle avatar upload
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        // Create user first
        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        // Assign client role
        $user->assignRole('client');

        // Create client record
        $client = Client::create([
            'user_id' => $user->id,
            'phone' => $validated['phone'] ?? null,
            'avatar' => $avatarPath,
        ]);

        return redirect()->back()->with('success', 'Client created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        // Check if user has admin role
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized access.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $client->user_id,
            'phone' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:8',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle avatar upload
        $updateData = [
            'phone' => $validated['phone'] ?? null,
        ];

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($client->avatar && Storage::disk('public')->exists($client->avatar)) {
                Storage::disk('public')->delete($client->avatar);
            }
            $updateData['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        // Update user
        $client->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        // Update password if provided
        if (!empty($validated['password'])) {
            $client->user->update([
                'password' => bcrypt($validated['password']),
            ]);
        }

        // Update client record
        $client->update($updateData);

        return redirect()->back()->with('success', 'Client updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        // Check if user has admin role
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized access.');
        }

        $clientIds = $request->input('ids', []);

        // Get clients with their avatars and users before deletion
        $clients = Client::with('user')->whereIn('id', $clientIds)->get();

        // Delete avatar files and users
        foreach ($clients as $client) {
            if ($client->avatar && Storage::disk('public')->exists($client->avatar)) {
                Storage::disk('public')->delete($client->avatar);
            }
            // Delete the associated user as well
            if ($client->user) {
                $client->user->delete();
            }
        }

        Client::whereIn('id', $clientIds)->delete();
        return redirect()->back()->with('success', 'Client(s) deleted successfully.');
    }
}
