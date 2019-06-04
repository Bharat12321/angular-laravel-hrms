<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\Core\Role;
use App\Models\Core\Permission;
use App\Api\V1\Core\Requests\CreateRoleRequest;
use App\Api\V1\Core\Requests\UpdateRoleRequest;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Auth;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $roles = Role::with(['permissions'])->latest()->get();
            for ($i=0; $i < count($roles); $i++) { 
                $permissions = [];
                foreach ($roles[$i]->permissions as $permission) {
                    $permissions[] = $permission->pivot->permission_id;
                }
                unset($roles[$i]->permissions);
                $roles[$i]->permissions = $permissions;
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }

        return response()->json($roles);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        try {
            $permissions = Permission::latest()->get();
            for ($i=0; $i < count($permissions); $i++) { 
                $permissions[$i]->access = false;
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json([
            'permissions' =>$permissions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateRoleRequest $request)
    {
        try {
            $data = $request->all();
            $role = new Role();
            $role->name = $data['name'];
            $role->slug = time();
            $role->save();
            $permissions = Permission::latest()->get();
            $perm = [];
            foreach ($permissions as $key => $value) {
                if($data['permissions'][$key]){
                    $perm[] = $value->id;
                }
            }
            $role->permissions()->attach($perm);
            activity()->causedBy(Auth::user())->performedOn($role)->withProperties($role)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($role);
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
        try {
            $role = Role::with(['permissions'])->find($id);
            $rolePermission = array_column(json_decode(json_encode($role->permissions),true), 'id');
            $permissions = Permission::latest()->get();
            for ($i=0; $i < count($permissions); $i++) { 
                if(array_search($permissions[$i]->id, $rolePermission) !== false){
                    $permissions[$i]->access = true;
                }else{
                    $permissions[$i]->access = false;
                }
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json([
            'permissions' =>$permissions
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateRoleRequest $request, $id)
    {
        try {
            $data = $request->all();
            $role = Role::find($id);
            $role->update($data);

            $permissions = Permission::latest()->get();
            $perm = [];
            foreach ($permissions as $key => $value) {
                if($data['permissions'][$key]){
                    $perm[] = $value->id;
                }
            }
            $role->permissions()->detach();
            $role->permissions()->attach($perm);
            activity()->causedBy(Auth::user())->performedOn($role)->withProperties($role)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($role);
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
}
