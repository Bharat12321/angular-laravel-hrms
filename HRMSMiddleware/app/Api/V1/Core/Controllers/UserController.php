<?php

namespace App\Api\V1\Core\Controllers;

use Hash;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use App\Api\V1\Core\Requests\CreateUserRequest;
use App\Api\V1\Core\Requests\UpdateUserRequest;
use App\Api\V1\Core\Requests\ChangePasswordRequest;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Support\Facades\Gate;
use Auth;
use App\User;
use DB;
use App\Models\Core\Role;
use App\Models\Core\Permission;

class UserController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', []);
        /*if (! Gate::allows('Create User','Update User','Delete User')) {
            throw new AccessDeniedHttpException();
        }*/
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $users = User::with(['roles'])->latest()->get(); 
            for ($i=0; $i < count($users); $i++) { 
                $users[$i]->roleName = isset($users[$i]->roles[0]->name)?$users[$i]->roles[0]->name:'';
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }

        return response()->json($users);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        try {
            $roles = Role::select('name', 'id')->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json(['roles'=>$roles]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateUserRequest $request)
    {
        try {
            $data = $request->all();
            $user = new User($data);
            $user->save();
            $user->roles()->attach($data['role_id']);
            activity()->causedBy(Auth::user())->performedOn($user)->withProperties($user)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($user);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, $id)
    {

        try {
            $user = User::find($id);
            $data = $request->all();
            $user->update($data);
            $user->roles()->detach();
            $user->roles()->attach($data['role_id']);
            activity()->causedBy(Auth::user())->performedOn($user)->withProperties($user)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($user);
       
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Get the authenticated User
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(Auth::guard()->user());
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $user = Auth::user();
        $data = $request->all();
        try {
            $token = Auth::guard()->attempt(['username'=>$user->username, 'password'=>$data['old_password'],'status' => 1]);
            if(!$token) {
                throw new AccessDeniedHttpException();
            }else{
                User::where('id',$user->id)->update(['password'=>Hash::make($data['new_password'])]);
            }
            activity()->causedBy(Auth::id())->log('User Password Changed Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
    }
}
