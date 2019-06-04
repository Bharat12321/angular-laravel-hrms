<?php

namespace App\Api\V1\Companies\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Companies\Requests\CreateCompanyLpoItemRequest;
use App\Api\V1\Companies\Requests\UpdateCompanyLpoItemRequest;
use App\Api\V1\Companies\Requests\CreateCompanyInvoiceRequest;
use App\Models\Core\OrganizationUnit;
use App\Models\Core\Config;
use App\Models\Core\Course;
use App\Models\Accounts\Invoice;
use App\Models\Companies\CompanyLpoItem;
use App\Models\Companies\Company;

use Auth;

class CompanyLpoItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $companyLpoItem = CompanyLpoItem::latest()->get();
            for ($i=0; $i < count($companyLpoItem); $i++) { 
                $companyLpoItem[$i]->date_formatted = ($companyLpoItem[$i]->date)?date('d-m-Y',strtotime($companyLpoItem[$i]->date)):'None';
            } 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyLpoItem);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function company($id)
    {
        try {
            $companyLpoItem = CompanyLpoItem::where('company_id',$id)->latest()->get();
            for ($i=0; $i < count($companyLpoItem); $i++) { 
                $companyLpoItem[$i]->date_formatted = ($companyLpoItem[$i]->date)?date('d-m-Y',strtotime($companyLpoItem[$i]->date)):'None';
            } 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyLpoItem);
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
    public function store(CreateCompanyLpoItemRequest $request)
    {
        try {
            $data = $request->all();
            $data['type'] = '1';
            $data['total_price'] = round(($data['unit_price'] * $data['quantity']) - $data['discount']);
            $data['date']  = date('Y-m-d',strtotime($data['date']));
            $companyLpoItem = new CompanyLpoItem($data);
            $companyLpoItem->save();
            activity()->causedBy(Auth::user())->performedOn($companyLpoItem)->withProperties($companyLpoItem)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyLpoItem);
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
            $companyLpoItem = CompanyLpoItem::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyLpoItem);
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
    public function update(UpdateCompanyLpoItemRequest $request, $id)
    {
        try {
            $companyLpoItem = CompanyLpoItem::find($id);
            $companyLpoItem->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($companyLpoItem)->withProperties($companyLpoItem)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyLpoItem);
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
            $companyLpoItem = CompanyLpoItem::findOrFail($id);
            $companyLpoItem->delete();
            activity()->causedBy(Auth::user())->performedOn($companyLpoItem)->withProperties($companyLpoItem)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($companyLpoItem);
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function lpo(CreateCompanyInvoiceRequest $request, $id)
    {
         try {
            $data = $request->all();
            $company = Company::findOrFail($id);
            $courses = CompanyLpoItem::whereIn('id',$data['items'])->get();
            if($courses){
                $courseId='';
                $total = 0;
                foreach ($courses as $course) {
                    $total += $course->total_price;
                    $courseId .= $course->id.',';
                    CompanyLpoItem::whereId($course->id)->update(['status'=>1]);
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