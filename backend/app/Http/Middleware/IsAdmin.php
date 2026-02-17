<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
  public function getUsers(Request $request)
{
    if (!$request->user()->is_admin) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $users = User::latest()->get();
    return response()->json($users);
}


}
