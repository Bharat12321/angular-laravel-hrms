<?php

namespace App\Api\V1\Employees\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Employees\Requests\CreateEmployeeActivityRequest;
use App\Api\V1\Employees\Requests\UpdateEmployeeActivityRequest;
use App\Models\Employees\Employee;
use App\Models\Core\Config;
use App\Models\Employees\EmployeeActivity;
use Auth;

class EmployeeActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $employeeActivity = EmployeeActivity::with(['type'])->latest()->get(); 
            for ($i=0; $i < count($employeeActivity); $i++) { 
                $employeeActivity[$i]->typeName = isset($employeeActivity[$i]->type->name)?$employeeActivity[$i]->type->name:'';
                $employeeActivity[$i]->date_formatted = date('d-m-Y',strtotime($employeeActivity[$i]->date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeActivity);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function employee($id)
    {
        try {
            $employeeActivity = EmployeeActivity::with(['type'])->where('taggable_type','Employee')->where('taggable_id',$id)->latest()->get(); 
            for ($i=0; $i < count($employeeActivity); $i++) { 
                $employeeActivity[$i]->typeName = isset($employeeActivity[$i]->type->name)?$employeeActivity[$i]->type->name:'';
                $employeeActivity[$i]->date_formatted = date('d-m-Y',strtotime($employeeActivity[$i]->date));
                $employeeActivity[$i]->notification_date_formatted = date('d-m-Y',strtotime($employeeActivity[$i]->notification_date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeActivity);
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function company($id)
    {
        try {
            $employeeActivity = EmployeeActivity::with(['type'])->where('taggable_type','Company')->where('taggable_id',$id)->latest()->get(); 
            for ($i=0; $i < count($employeeActivity); $i++) { 
                $employeeActivity[$i]->typeName = isset($employeeActivity[$i]->type->name)?$employeeActivity[$i]->type->name:'';
                $employeeActivity[$i]->date_formatted = date('d-m-Y',strtotime($employeeActivity[$i]->date));
                $employeeActivity[$i]->notification_date_formatted = date('d-m-Y',strtotime($employeeActivity[$i]->notification_date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeActivity);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function student($id)
    {
        try {
            $employeeActivity = EmployeeActivity::with(['type'])->where('taggable_type','Student')->where('taggable_id',$id)->latest()->get(); 
            for ($i=0; $i < count($employeeActivity); $i++) { 
                $employeeActivity[$i]->typeName = isset($employeeActivity[$i]->type->name)?$employeeActivity[$i]->type->name:'';
                $employeeActivity[$i]->date_formatted = date('d-m-Y',strtotime($employeeActivity[$i]->date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeActivity);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
        try {
            $types = Config::where(['status'=>1,'config_item_id'=>20])->select('name','id')->orderBy('sort')->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json(['types'=>$types]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateEmployeeActivityRequest $request)
    {
        try {
            $data = $request->all();
            $data['date']  = date('Y-m-d',strtotime($data['date']));
            $data['owner_id']  = Auth::user()->id;
            $employeeActivity = new EmployeeActivity($data);
            $employeeActivity->save();
            activity()->causedBy(Auth::user())->performedOn($employeeActivity)->withProperties($employeeActivity)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeActivity);
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
            $employeeActivity = EmployeeActivity::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeActivity);
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
    public function update(UpdateEmployeeActivityRequest $request, $id)
    {
        try {
            $data = $request->all();
            $data['date']  = date('Y-m-d',strtotime($data['date']));
            $employeeActivity = EmployeeActivity::find($id);
            $employeeActivity->update($data);
            activity()->causedBy(Auth::user())->performedOn($employeeActivity)->withProperties($employeeActivity)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeActivity);
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
            $employeeActivity = EmployeeActivity::findOrFail($id);
            $employeeActivity->delete();
            activity()->causedBy(Auth::user())->performedOn($employeeActivity)->withProperties($employeeActivity)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeActivity);
    }
}