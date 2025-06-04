<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        // gilt für alle methoden außer login methode, weil da noch keine authentifizierung nötig
        $this->middleware('auth:api', ['except' => ['login']]);
    }


    public function login()
    {
        $credentials = request(['email', 'password']);
        // schaut über OR mapper ob es den user mit daten gibt
        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // diesen token speichert dann der browser
        return $this->respondWithToken($token);
    }


    protected function respondWithToken($token)
    {
        // time to leave = ttl
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }


    public function me()
    {
        return response()->json(auth()->user());
    }


    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }


    // refresh token, client kann sich neuen token holen
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }


}
