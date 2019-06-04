<?php

namespace App\Api\V1\Employees\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Employees\Requests\CreateEmployeeDetailRequest;
use App\Api\V1\Employees\Requests\UpdateEmployeeDetailRequest;
use App\Models\Employees\Employee;
use App\Models\Employees\EmployeeDetail;
use Auth;

class EmployeeDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $employeeDetail = EmployeeDetail::latest()->get(); 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeDetail);
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
    public function store(CreateEmployeeDetailRequest $request)
    {
        try {
            $employeeDetail = new EmployeeDetail($request->all());
            $employeeDetail->save();
            activity()->causedBy(Auth::user())->performedOn($employeeDetail)->withProperties($employeeDetail)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeDetail);
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
            $employeeDetail = EmployeeDetail::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeDetail);
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
    public function update(UpdateEmployeeDetailRequest $request, $id)
    {
        try {
            $employeeDetail = EmployeeDetail::find($id);
            $employeeDetail->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($employeeDetail)->withProperties($employeeDetail)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeDetail);
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
            $employeeDetail = EmployeeDetail::findOrFail($id);
            $employeeDetail->delete();
            activity()->causedBy(Auth::user())->performedOn($employeeDetail)->withProperties($employeeDetail)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeDetail);
    }
}