<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\Core\ConfigItem;
use App\Models\Core\Permission;
use App\Api\V1\Core\Requests\UpdateConfigItemRequest;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Auth;

class ConfigItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $config = ConfigItem::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($config);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateRoleRequest $request)
    {
        // store the values for the system and make the use of it
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
    public function update(UpdateConfigItemRequest $request, $id)
    {
        try {
            $config = ConfigItem::find($id);
            $config->update($request->all());
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($config);
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

    public function getConfig($id)
    {
        try {
            $config = ConfigItem::find($id)->configs;
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($config);
    }
}
