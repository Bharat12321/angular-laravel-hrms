<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Core\Requests\CreateBatchRequest;
use App\Api\V1\Core\Requests\UpdateBatchRequest;
use App\Models\Core\Batch;
use App\Models\Core\Course;
use App\Models\Employees\Employee;
use App\Models\Core\Config;
use Auth;


class BatchController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $batch = Batch::with(['type','course','remark','employee'])->latest()->get();
            for ($i=0; $i < count($batch); $i++) { 
                $batch[$i]->typeName = isset($batch[$i]->type->name)?$batch[$i]->type->name:'';
                $batch[$i]->courseName = isset($batch[$i]->course->name)?$batch[$i]->course->name:'';
                $batch[$i]->remarkName = isset($batch[$i]->remark->name)?$batch[$i]->remark->name:'';
                $batch[$i]->employeeName = isset($batch[$i]->employee->name)?$batch[$i]->employee->name:'';
                $batch[$i]->start_date_formated = date('d-m-Y',strtotime($batch[$i]->start_date));
                $batch[$i]->end_date_formated = date('d-m-Y',strtotime($batch[$i]->end_date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($batch);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        try {
            $types = Config::where(['status'=>1,'config_item_id'=>10])->select('name','id')->orderBy('sort')->get(); 
            $courses = Course::where(['status'=>1])->select('name','id')->get();
            $employees = Employee::where(['status'=>1])->select('name','id')->get();
            $remarks = Config::where(['status'=>1,'config_item_id'=>12])->select('name','id')->orderBy('sort')->get(); 
            $months = array();
            for ($i = 0; $i < 8; $i++) {
                $timestamp = mktime(0, 0, 0, date('n') - $i, 1);
                $months[$i]['id'] = date('F', $timestamp);
                $months[$i]['name'] = date('F', $timestamp);
            }
            $years = array();
            for ($i = 2017; $i <= date('Y'); $i++) {
                $years[$i-2017]['id'] = $i;
                $years[$i-2017]['name'] = $i;
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json([
            'types'=>$types,
            'courses'=>$courses,
            'employees'=>$employees,
            'years'=>$years,
            'months'=>$months,
            'remarks'=>$remarks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateBatchRequest $request)
    {
        try {
            $batch = new Batch($request->all());
            $batch->save();
            activity()->causedBy(Auth::user())->performedOn($batch)->withProperties($batch)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($batch);
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
            $batch = Batch::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($batch);
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
    public function update(UpdateBatchRequest $request, $id)
    {
        try {
            $batch = Batch::findOrFail($id);
            $batch->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($batch)->withProperties($batch)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($batch);
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
            $batch = Batch::findOrFail($id);
            $batch->delete();
            activity()->causedBy(Auth::user())->performedOn($batch)->withProperties($batch)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($batch);
    }
}

?>
