<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use App\Api\V1\Core\Requests\LoginRequest;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Auth;
use DB;
use App\User;

class LoginController extends Controller
{
    /**
     * Log the user in
     *
     * @param LoginRequest $request
     * @param JWTAuth $JWTAuth
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request, JWTAuth $JWTAuth)
    {
        $credentials = array_merge($request->only(['username', 'password']), ['status' => 1]);
        try {
            $token = Auth::guard()->attempt($credentials); 
            if(!$token) {
                //throw new AccessDeniedHttpException();
                return response()
                    ->json([
                        'status' => 'ok'
                    ]); // for error message
            }
            $user = Auth::user();
            $userDetails = User::with(['taggable','roles.permissions'])->find($user->id);
            $permissions = collect($userDetails->roles[0]->permissions)->pluck('slug'); // we are attaching only one role
            $user->role_id = $userDetails->roles[0]->id;
            /* $permissions =  \DB::table('permissions')
                ->select('permissions.id', 'permissions.name', 'permissions.display_name')
                ->join('permission_role', 'permission_role.permission_id', '=', 'permissions.id')
                ->join('roles', 'permission_role.permission_id', '=', 'roles.id')
                ->join('role_user', 'roles.id', '=', 'role_user.user_id')
                ->where('role_user.user_id',$user->id)->get();*/
               
            activity()->causedBy(Auth::id())->log('User Logged in');

        } catch (JWTException $e) {
            throw new HttpException(500);
        }

        return response()
            ->json([
                'status' => 'ok',
                'token' => $token,
                'user' => $user,
                'permissions' => $permissions,
                'expires_in' => Auth::guard()->factory()->getTTL() * 60
            ]);
    }
}
