<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // GET all users
    public function index()
    {
        return User::latest()->get();
    }

    // UPDATE role or name
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'name' => $request->name ?? $user->name,
            'role' => $request->role ?? $user->role,
        ]);

        return response()->json(['message' => 'User updated']);
    }

    // DELETE user
    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
