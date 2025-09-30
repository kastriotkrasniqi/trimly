<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployeeController extends Controller
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

        return Inertia::render('employees/index');
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

        // Assign employee role
        $user->assignRole('employee');

        // Create employee record
        $employee = Employee::create([
            'user_id' => $user->id,
            'phone' => $validated['phone'] ?? null,
            'avatar' => $avatarPath,
        ]);

        return redirect()->back()->with('success', 'Employee created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        // Check if user has admin role
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized access.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $employee->user_id,
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
            if ($employee->avatar && \Storage::disk('public')->exists($employee->avatar)) {
                \Storage::disk('public')->delete($employee->avatar);
            }
            $updateData['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        // Update user
        $employee->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        // Update password if provided
        if (!empty($validated['password'])) {
            $employee->user->update([
                'password' => bcrypt($validated['password']),
            ]);
        }

        // Update employee record
        $employee->update($updateData);

        return redirect()->back()->with('success', 'Employee updated successfully.');
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

        $employeeIds = $request->input('ids', []);

        // Get employees with their avatars and users before deletion
        $employees = Employee::with('user')->whereIn('id', $employeeIds)->get();

        // Delete avatar files and users
        foreach ($employees as $employee) {
            if ($employee->avatar && Storage::disk('public')->exists($employee->avatar)) {
                Storage::disk('public')->delete($employee->avatar);
            }
            // Delete the associated user as well
            if ($employee->user) {
                $employee->user->delete();
            }
        }

        Employee::whereIn('id', $employeeIds)->delete();
        return redirect()->back()->with('success', 'Employee(s) deleted successfully.');
    }
}
