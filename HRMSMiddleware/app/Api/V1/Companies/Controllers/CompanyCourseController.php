<?php

namespace App\Api\V1\Companies\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Companies\Requests\CreateCompanyCourseRequest;
use App\Api\V1\Companies\Requests\UpdateCompanyCourseRequest;
use App\Api\V1\Companies\Requests\CreateCompanyInvoiceRequest;
use App\Models\Core\OrganizationUnit;
use App\Models\Core\Config;
use App\Models\Core\Course;
use App\Models\Accounts\Invoice;
use App\Models\Companies\CompanyCourse;
use App\Models\Companies\Company;

use Auth;

class CompanyCourseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $companyCourse = CompanyCourse::with(['course'])->latest()->get();
            for ($i=0; $i < count($companyCourse); $i++) { 
                $companyCourse[$i]->courseName = isset($companyCourse[$i]->course->name)?$companyCourse[$i]->course->name:'';
                $companyCourse[$i]->date_formatted = ($companyCourse[$i]->date)?date('d-m-Y',strtotime($companyCourse[$i]->date)):'None';
            } 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyCourse);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function company($id)
    {
        try {
            $companyCourse = CompanyCourse::with(['course'])->where('company_id',$id)->whereIn('status',[1,2])->latest()->get();
            for ($i=0; $i < count($companyCourse); $i++) { 
                $companyCourse[$i]->courseName = isset($companyCourse[$i]->course->name)?$companyCourse[$i]->course->name:'';
                $companyCourse[$i]->date_formatted = ($companyCourse[$i]->date)?date('d-m-Y',strtotime($companyCourse[$i]->date)):'None';
                $companyCourse[$i]->status = $companyCourse[$i]->status - 1;
            } 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyCourse);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function lead($id)
    {
        try {
            $companyCourse = CompanyCourse::with(['course'])->where('company_id',$id)->whereIn('status',[0])->latest()->get();
            for ($i=0; $i < count($companyCourse); $i++) { 
                $companyCourse[$i]->name = isset($companyCourse[$i]->course->name)?$companyCourse[$i]->course->name:'';
                $companyCourse[$i]->date_formatted = ($companyCourse[$i]->date)?date('d-m-Y',strtotime($companyCourse[$i]->date)):'None';
            } 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyCourse);
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        try {
            
            $courses = Course::where('status',1)->latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json(['courses'=>$courses]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCompanyCourseRequest $request)
    {
        try {
            $data = $request->all();
            $course = Course::where('id',$data['course_id'])->first();
            $data['unit_price'] = $course->discount_price;
            $data['type'] = '1';
            $data['total_price'] = round(($data['unit_price'] * $data['quantity']) - $data['discount']);
            $data['date']  = date('Y-m-d',strtotime($data['date']));
            $companyCourse = new CompanyCourse($data);
            $companyCourse->save();

            activity()->causedBy(Auth::user())->performedOn($companyCourse)->withProperties($companyCourse)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyCourse);
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
            $companyCourse = CompanyCourse::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyCourse);
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
    public function update(UpdateCompanyCourseRequest $request, $id)
    {
        try {
            $companyCourse = CompanyCourse::find($id);
            $companyCourse->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($companyCourse)->withProperties($companyCourse)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyCourse);
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
            $companyCourse = CompanyCourse::findOrFail($id);
            $companyCourse->delete();
            activity()->causedBy(Auth::user())->performedOn($companyCourse)->withProperties($companyCourse)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyCourse);
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function invoice(CreateCompanyInvoiceRequest $request, $id)
    {
         try {
            $data = $request->all();
            $company = Company::findOrFail($id);
            $courses = CompanyCourse::whereIn('id',$data['courses'])->get();
            if($courses){
                $courseId='';
                $total = 0;
                foreach ($courses as $course) {
                    $total += $course->total_price;
                    $courseId .= $course->id.',';
                    CompanyCourse::whereId($course->id)->update(['status'=>2]);
                }
                if($total){
                    $courseId = rtrim($courseId,',');
                    $data = ['taggable_type'=> 'Company',
                             'taggable_id'=> $id,
                             'address'=> $company->address,
                             'fees'=> $courseId, // using the same item of Fees as Course
                             'date'=> date('Y-m-d'),
                             'due_date'=> date('Y-m-d',strtotime('+5 days')),
                             'remarks'=> 'Invoice Generated',
                             'total'=> $total,
                             'paid'=> 0,
                             'status'=> 0,
                             'type'=> 2,
                            ];

                    $invoice = Invoice::create($data);
                }
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($courses);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function quotation(CreateCompanyInvoiceRequest $request, $id)
    {
         try {
            $data = $request->all();
            $company = Company::findOrFail($id);
            $courses = CompanyCourse::whereIn('id',$data['lines'])->get();
            if($courses){
                $courseId='';
                $total = 0;
                foreach ($courses as $course) {
                    $total += $course->total_price;
                    $courseId .= $course->id.',';
                    CompanyCourse::whereId($course->id)->update(['status'=>1]);
                }
                if($total){
                    $courseId = rtrim($courseId,',');
                    $data = ['taggable_type'=> 'Company',
                             'taggable_id'=> $id,
                             'address'=> $company->address,
                             'fees'=> $courseId, // using the same item of Fees as Course
                             'date'=> date('Y-m-d'),
                             'due_date'=> date('Y-m-d',strtotime('+5 days')),
                             'remarks'=> 'Quotation Generated',
                             'total'=> $total,
                             'paid'=> 0,
                             'type'=> 1,
                             'status'=> 0,
                            ];

                    $invoice = Invoice::create($data);
                }
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($courses);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function lop(CreateCompanyInvoiceRequest $request, $id)
    {
         try {
            $data = $request->all();
            $company = Company::findOrFail($id);
            $courses = CompanyCourse::whereIn('id',$data['lines'])->get();
            if($courses){
                $courseId='';
                $total = 0;
                foreach ($courses as $course) {
                    $total += $course->total_price;
                    $courseId .= $course->id.',';
                    CompanyCourse::whereId($course->id)->update(['status'=>1]);
                }
                if($total){
                    $courseId = rtrim($courseId,',');
                    $data = ['taggable_type'=> 'Company',
                             'taggable_id'=> $id,
                             'address'=> $company->address,
                             'fees'=> $courseId, // using the same item of Fees as Course
                             'date'=> date('Y-m-d'),
                             'due_date'=> date('Y-m-d',strtotime('+5 days')),
                             'remarks'=> 'LPO Generated',
                             'total'=> $total,
                             'paid'=> 0,
                             'type'=> 3,
                             'status'=> 0,
                            ];

                    $invoice = Invoice::create($data);
                }
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($courses);
    }
}