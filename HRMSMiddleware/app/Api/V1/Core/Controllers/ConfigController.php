<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\Core\Config;
use App\Models\Students\Student;
use App\Models\Employees\Employee;
use App\Models\Accounts\Payment;
use App\Api\V1\Core\Requests\CreateConfigRequest;
use App\Api\V1\Core\Requests\UpdateConfigRequest;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Auth;

class ConfigController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $config = Config::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($config);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateConfigRequest $request)
    {
         try {
            $config = new Config($request->all());
            $config->save();
            activity()->causedBy(Auth::user())->performedOn($config)->withProperties($config)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($config);
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
            $config = Config::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($config);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateConfigRequest $request, $id)
    {
        try {
            $config = Config::findOrFail($id);
            $config->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($config)->withProperties($config)->log('Updated Successfully');
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
        try {
            $config = Config::findOrFail($id);
            $config->delete();
            activity()->causedBy(Auth::user())->performedOn($config)->withProperties($config)->log('Deleted Successfully');
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
    public function class()
    {
        try {
            $config = Config::where('status',1)->where('config_item_id',16)->latest()->get();
            for ($i=0; $i < count($config); $i++) { 
                $config[$i]->background = 'linear-gradient(to left, #cbad6d, #d53369)';
                $config[$i]->studentCount = Student::where('status',1)->where('class_id',$config[$i]->id)->count();
                $config[$i]->status = ($config[$i]->status === 1)?'Active':'Inactive';
                $config[$i]->incomeToday  = Payment::whereDate('paid_date',date('Y-m-d'))->where('type_id',1)->sum('amount_paid');
                $config[$i]->incomeMonth  = Payment::where('type_id',1)->whereBetween('paid_date', [date('Y-m-01'), date('Y-m-t')])->sum('amount_paid');
                $config[$i]->employess = Employee::with(['designation'])->where('status',1)->where('class_id',$config[$i]->id)->get();
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($config);
    }

    public function classDetail($id)
    {
        try {
            $config = Config::findOrFail($id);
            $config->background = 'linear-gradient(to left, #cbad6d, #d53369)';
            $config->studentCount = Student::where('status',1)->where('class_id',$config->id)->count();

            $student = Student::with(['country','profiles','course'])->where('status',1)->where('class_id',$config->id)->get(); 
            for ($i=0; $i < count($student); $i++) { 
                $student[$i]->courseName = isset($student[$i]->course->name)?$student[$i]->course->name:'';
                $student[$i]->countryName = isset($student[$i]->country->name)?$student[$i]->country->name:'';
                $student[$i]->age = date_diff(date_create($student[$i]->date_of_birth), date_create('now'))->format('%y Y, %m M');
                $student[$i]->fee_paid_today = ($student[$i]->fee_paid >= date('Y-m-d'))?true:false;
                $student[$i]->fee_paid_formated = date('d-m-Y',strtotime($student[$i]->fee_paid));

            }
            $config->students = $student;

            $config->status = ($config->status === 1)?'Active':'Inactive';
            $config->incomeToday  = Payment::whereDate('paid_date',date('Y-m-d'))->where('type_id',1)->sum('amount_paid');
            $config->incomeMonth  = Payment::where('type_id',1)->whereBetween('paid_date', [date('Y-m-01'), date('Y-m-t')])->sum('amount_paid');
            $config->employess = Employee::with(['designation'])->where('status',1)->where('class_id',$config->id)->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($config);
    }
}
