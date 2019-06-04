<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Core\Requests\CreateOrganizationUnitRequest;
use App\Api\V1\Core\Requests\UpdateOrganizationUnitRequest;
use App\Models\Core\OrganizationUnit;
use App\Models\Core\Country;
use App\Models\Devices\Device;
use Auth;

class OrganizationUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $organization_unit = OrganizationUnit::with(['country'])->latest()->get(); 
            for ($i=0; $i < count($organization_unit); $i++) { 
                $organization_unit[$i]->countryName = isset($organization_unit[$i]->country->name)?$organization_unit[$i]->country->name:'';
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($organization_unit);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        try {
            $countries = Country::select('name', 'id')->orderBy('name')->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json(['countries'=>$countries]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateOrganizationUnitRequest $request)
    {
        try {
            $organization_unit = new OrganizationUnit($request->all());
            $organization_unit->save();
            activity()->causedBy(Auth::user())->performedOn($organization_unit)->withProperties($organization_unit)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($organization_unit);
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
            $organization_unit = OrganizationUnit::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($organization_unit);
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
    public function update(UpdateOrganizationUnitRequest $request, $id)
    {
        try {
            $organization_unit = OrganizationUnit::find($id);
            $organization_unit->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($organization_unit)->withProperties($organization_unit)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($organization_unit);
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
            $organization_unit = OrganizationUnit::findOrFail($id);
            $organization_unit->delete();
            activity()->causedBy(Auth::user())->performedOn($organization_unit)->withProperties($organization_unit)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($organization_unit);
    }
}