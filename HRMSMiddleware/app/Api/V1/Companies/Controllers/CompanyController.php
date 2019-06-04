<?php

namespace App\Api\V1\Companies\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Companies\Requests\CreateCompanyRequest;
use App\Api\V1\Companies\Requests\UpdateCompanyRequest;
use App\Api\V1\Companies\Requests\UpdateCompanyLoginRequest;
use App\Api\V1\Companies\Requests\UpdateCompanyTypeRequest;
use App\Models\Core\OrganizationUnit;
use App\Models\Core\Config;
use App\Models\Core\Country;
use App\Models\Companies\Company;
use App\Models\Students\Student;
use App\Models\Accounts\Payment;
use Auth;
use App\User;
use App\Models\Core\Role;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $company = Company::latest()->get(); 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($company);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function type($type)
    {
        try {
            $company = Company::where('type',$type)->latest()->get(); 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($company);
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
        return response()->json([
            'countries' => $countries
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCompanyRequest $request)
    {
        try {
            $data = $request->all();
            $data['code'] = time(); 
            $company = new Company($data );
            $company->save();
            $company->update(['code'=>'C00'.$company->id]);

            $userData = [
                            'taggable_type'=>'Company',
                            'taggable_id'=>$company->id,
                            'username'=>$company->code,
                            'name'=>$company->name,
                            'owner_id'  => Auth::user()->id,
                            'password'=>'123456',
                        ];
            $user = new User($userData);
            $user->save();

            $companyRole = Role::where('slug','company')->first();

            $user->roles()->attach($companyRole); 

            activity()->causedBy(Auth::user())->performedOn($company)->withProperties($company)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($company);
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
            $company = Company::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($company);
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
    public function update(UpdateCompanyRequest $request, $id)
    {
        try {
            $company = Company::find($id);
            $company->update($request->all());            
            activity()->causedBy(Auth::user())->performedOn($company)->withProperties($company)->log('Updated Successfully');

        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($company);
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
            $company = Company::findOrFail($id);
            $company->delete();          
            activity()->causedBy(Auth::user())->performedOn($company)->withProperties($company)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($company);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function payment($id)
    {
        try {
            $payment = Payment::with(['taggable','category','mode'])->where('taggable_type','Company')->where('taggable_id',$id)->latest()->get();
            for ($i=0; $i < count($payment); $i++) { 
                $payment[$i]->ledgerName = isset($payment[$i]->taggable->name)?$payment[$i]->taggable->name:'';
                $payment[$i]->categoryName = isset($payment[$i]->category->name)?$payment[$i]->category->name:'';
                $payment[$i]->paid_date_formatted = date('d-m-Y',strtotime($payment[$i]->paid_date));
                $payment[$i]->modeName = isset($payment[$i]->mode->name)?$payment[$i]->mode->name:'';
                $payment[$i]->taggable_id = isset($payment[$i]->taggable_id)?$payment[$i]->taggable_type.'_'.$payment[$i]->taggable_id:'';
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($payment);
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function invoice($id)
    {
         try {
            $company = Company::findOrFail($id);
            $fees = CompanyCourse::where('company_id',$id)->where('status',0)->get();
            if($fees){
                $feeId='';
                $total = 0;
                foreach ($fees as $fee) {
                    $total += ($fee->amount - $fee->discount_amount);
                    $feeId .= $fee->id.',';
                    CompanyCourse::whereId($fee->id)->update(['status'=>1]);
                }
                if($total){
                $feeId = rtrim($feeId,',');
                $data = ['taggable_type'=> 'Company',
                         'taggable_id'=> $id,
                         'address'=> $company->address,
                         'fees'=> $feeId,
                         'date'=> date('Y-m-d'),
                         'due_date'=> date('Y-m-d'),
                         'remarks'=> 'Invoice Generated',
                         'total'=> $total
                        ];

                $invoice = Invoice::create($data);
            }
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($fees);
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function invoiceFee(CreateCompanyInvoiceRequest $request, $id)
    {
         try {
            $company = Company::findOrFail($id);
            $data = $request->all();
            $fees = CompanyCourse::where('company_id',$id)->whereIn('id',$data['fees'])->get();
            if($fees){
                $feeId='';
                $total = 0;
                foreach ($fees as $fee) {
                    $total += ($fee->amount - $fee->discount_amount);
                    $feeId .= $fee->id.',';
                    CompanyCourse::whereId($fee->id)->update(['status'=>1]);
                }
                if($total){
                    $feeId = rtrim($feeId,',');
                    $data = ['taggable_type'=> 'Company',
                             'taggable_id'=> $id,
                             'address'=> $company->address,
                             'fees'=> $feeId,
                             'date'=> date('Y-m-d'),
                             'due_date'=> date('Y-m-d',strtotime('+5 days')),
                             'remarks'=> 'Invoice Generated',
                             'total'=> $total,
                             'paid'=> 0,
                             'status'=> 0,
                            ];

                    $invoice = Invoice::create($data);
                }
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($fees);
    }

    public function user(UpdateCompanyLoginRequest $request, $id)
    {
        return User::where('taggable_type','Company')->where('taggable_id',$id)->update($request->all());
    }

    public function updateType(UpdateCompanyTypeRequest $request,$id)
    {
        return Company::where('id',$id)->update(['type'=>2]);
    }
}