<?php

namespace App\Api\V1\Sales\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Sales\Requests\CreateSaleDetailRequest;
use App\Api\V1\Sales\Requests\UpdateSaleDetailRequest;
use App\Api\V1\Sales\Requests\CreateCompanyInvoiceRequest;
use App\Models\Core\OrganizationUnit;
use App\Models\Core\Config;
use App\Models\Employees\Employee;
use App\Models\Core\Items;
use App\Models\Accounts\Invoice;
use App\Models\Sales\SaleDetail;
use App\Models\Sales\Company;

use Auth;

class SaleDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $saleDetail = SaleDetail::with(['course'])->latest()->get();
            for ($i=0; $i < count($saleDetail); $i++) { 
                $saleDetail[$i]->courseName = isset($saleDetail[$i]->course->name)?$saleDetail[$i]->course->name:'';
                $saleDetail[$i]->date_formatted = ($saleDetail[$i]->date)?date('d-m-Y',strtotime($saleDetail[$i]->date)):'None';
            } 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($saleDetail);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function company($id)
    {
        try {
            $saleDetail = SaleDetail::with(['course'])->where('company_id',$id)->whereIn('status',[1,2])->latest()->get();
            for ($i=0; $i < count($saleDetail); $i++) { 
                $saleDetail[$i]->courseName = isset($saleDetail[$i]->course->name)?$saleDetail[$i]->course->name:'';
                $saleDetail[$i]->date_formatted = ($saleDetail[$i]->date)?date('d-m-Y',strtotime($saleDetail[$i]->date)):'None';
                $saleDetail[$i]->status = $saleDetail[$i]->status - 1;
            } 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($saleDetail);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function lead($id)
    {
        try {
            $saleDetail = SaleDetail::with(['course'])->where('company_id',$id)->whereIn('status',[0])->latest()->get();
            for ($i=0; $i < count($saleDetail); $i++) { 
                $saleDetail[$i]->name = isset($saleDetail[$i]->course->name)?$saleDetail[$i]->course->name:'';
                $saleDetail[$i]->date_formatted = ($saleDetail[$i]->date)?date('d-m-Y',strtotime($saleDetail[$i]->date)):'None';
            } 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($saleDetail);
    }
    


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        try {
            
            $items = Items::where('status',1)->latest()->get();
            $employee=Employees::where('status',1)->latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json(['items'=>$items],
        ['employees'=> $employee]
    );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateSaleDetailRequest $request)
    {
        try {
            $data = $request->all();
            $course = Course::where('id',$data['course_id'])->first();
            $data['unit_price'] = $course->discount_price;
            $data['type'] = '1';
            $data['total_price'] = round(($data['unit_price'] * $data['quantity']) - $data['discount']);
            $data['date']  = date('Y-m-d',strtotime($data['date']));
            $saleDetail = new SaleDetail($data);
            $saleDetail->save();

            activity()->causedBy(Auth::user())->performedOn($saleDetail)->withProperties($saleDetail)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($saleDetail);
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
            $saleDetail = SaleDetail::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($saleDetail);
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
    public function update(UpdateSaleDetailRequest $request, $id)
    {
        try {
            $saleDetail = SaleDetail::find($id);
            $saleDetail->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($saleDetail)->withProperties($saleDetail)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($saleDetail);
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
            $saleDetail = SaleDetail::findOrFail($id);
            $saleDetail->delete();
            activity()->causedBy(Auth::user())->performedOn($saleDetail)->withProperties($saleDetail)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($saleDetail);
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
            $courses = SaleDetail::whereIn('id',$data['courses'])->get();
            if($courses){
                $courseId='';
                $total = 0;
                foreach ($courses as $course) {
                    $total += $course->total_price;
                    $courseId .= $course->id.',';
                    SaleDetail::whereId($course->id)->update(['status'=>2]);
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
            $courses = SaleDetail::whereIn('id',$data['lines'])->get();
            if($courses){
                $courseId='';
                $total = 0;
                foreach ($courses as $course) {
                    $total += $course->total_price;
                    $courseId .= $course->id.',';
                    SaleDetail::whereId($course->id)->update(['status'=>1]);
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
            $courses = SaleDetail::whereIn('id',$data['lines'])->get();
            if($courses){
                $courseId='';
                $total = 0;
                foreach ($courses as $course) {
                    $total += $course->total_price;
                    $courseId .= $course->id.',';
                    SaleDetail::whereId($course->id)->update(['status'=>1]);
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