<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\Core\Profile;
use App\Api\V1\Core\Requests\CreateProfileRequest;
use App\Api\V1\Core\Requests\UpdateProfileRequest;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Auth;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $profile = Profile::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($profile);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateProfileRequest $request)
    {
         try {
            $getimageName = time().'.'.$request->file->getClientOriginalExtension();
            $request->file->move(public_path('profiles'), $getimageName);
            $profile = new Profile($request->all());
            $profile->location = 'profiles/'.$getimageName;
            $profile->save();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($profile);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $profile = Profile::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($profile);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProfileRequest $request, $id)
    {
        try {
            $profile = Profile::findOrFail($id);
            $profile->update($request->all());
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($profile);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $profile = Profile::findOrFail($id);
            $profile->delete();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($profile);
    }
}
