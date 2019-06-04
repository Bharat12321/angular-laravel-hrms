<?php

namespace App\Api\V1\Sales\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Sales\Requests\CreatePurchaseRequest;
use App\Api\V1\Sales\Requests\UpdatePurchaseRequest;
use App\Models\Core\OrganizationUnit;
use App\Models\Core\Config;
use App\Models\Core\Items;
use App\Models\Sales\Purchase;
use App\Models\Sales\PurchaseDetail;
use App\Models\Accounts\Payment;
use App\Models\Companies\Company;
use Auth;
use App\User;
use App\Models\Core\Role;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $purchase = Purchase::latest()->get(); 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($purchase);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
  
    public function create()
    {
        
        try {
            $companies = Company::where('status',1)->select('id','name')->get();
            $orgUnit= OrganizationUnit::where('status',1)->select('id','name')->get();
            $items = Items::where('status',1)->select('id','name')->get();
            $modes = Config::where(['status'=>1,'config_item_id'=>14])->select('name','id')->orderBy('sort')->get();
        }catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json([
            'companies' => $companies,
            'modes' => $modes,
            'items' => $items,
            'orgunits'>  $orgUnit,
            'vat' => 0,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatePurchaseRequest $request)
    {
        try {
            $data = $request->all();
            $user = Auth::user();
            if($data['payment_type'] != 'Pay Now'){
                $data['paid_amount'] = 0;
            }
            $data['date'] = date('Y-m-d', strtotime($data['date'])); 
            $data['due_amount'] = $data['total'] - $data['paid_amount'];
          
            $purchase = new Purchase($data);
            $purchase->save();
         
            foreach ($data['purchaseItems'] as $item) {
              
                $details = [
                   'purchase_id' => $purchase->id,
              
                ];           
                $purchaseDetail = new PurchaseDetail($details);
                $purchaseDetail->save();
            }
         
            if($data['payment_type'] == 'Pay Now'){
                $data['taggable_id'] = $purchase->id;
                $data['taggable_type'] = 'Purchase';
                $date = date('Y-m-d',strtotime($data['date']));
                $data['amount_payable'] = $data['paid_amount'];
                $data['amount_paid'] = $data['paid_amount'];
                $data['payment_date'] = $date;
                $data['paid_date'] = $date;
                $data['type_id'] = 2;
                $data['category_id'] = 15;
                $payment = new Payment($data);
                $payment->save();
            }
            activity()->causedBy(Auth::user())->performedOn($purchase)->withProperties($purchase)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($purchase);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function pay(UpdatePurchaseRequest $request, $id)
    {
        try {
            $purchase = Purchase::find($id);
            $data = $request->all();
            $purchase->update(['paid_amount'=> $purchase->paid_amount + $data['paid_amount'] ,'due_amount'=>$purchase->due_amount - $data['paid_amount']]); 
            $data['taggable_id'] = $sale->id;
            $data['taggable_type'] = 'Purchase';
            $date= $data['paid_amount'];
            $data['amount_payable'] = $data['paid_amount'];
            $data['amount_paid'] = $data['paid_amount'];
            $data['payment_date'] = $date;
            $data['paid_date'] = $date;
            $data['type_id'] = 2;
            $data['category_id'] = 15;
            $payment = new Payment($data);
            $payment->save();          
            activity()->causedBy(Auth::user())->performedOn($purchase)->withProperties($purchase)->log('Updated Successfully');

        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($purchase);
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
            $purchase = Purchase::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($purchase);
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
    public function update(UpdatePurchaseRequest $request, $id)
    {
        try {
            $purchase = Purchase::find($id);
            $data = $request->all();
            $update['date'] = date('Y-m-d', strtotime($data['date'])); 
            $update['company_id'] = $data['company_id'];
            $update['name'] = $data['name'];
            $update['remarks'] = $data['remarks'];
            $purchase->update($update);            
            activity()->causedBy(Auth::user())->performedOn($purchase)->withProperties($purchase)->log('Updated Successfully');

        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($purchase);
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
            $purchase = Purchase::findOrFail($id);
            $purchase->delete(); 
            Payment::where('taggable_type','Purchase')->where('taggable_id',$id)->delete();         
            activity()->causedBy(Auth::user())->performedOn($purchase)->withProperties($purchase)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($purchase);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function Purchase($id)
    {
        try {
            $purchase = Payment::with(['taggable','category','mode'])->where('taggable_type','Purchase')->where('taggable_id',$id)->latest()->get();
            for ($i=0; $i < count($purchase); $i++) { 
                $purchase[$i]->ledgerName = isset($purchase[$i]->taggable->name)?$purchase[$i]->taggable->name:'';
                $purchase[$i]->categoryName = isset($purchase[$i]->category->name)?$purchase[$i]->category->name:'';
                $purchase[$i]->paid_date_formatted = date('d-m-Y',strtotime($purchase[$i]->paid_date));
                $purchase[$i]->modeName = isset($purchase[$i]->mode->name)?$purchase[$i]->mode->name:'';
                $purchase[$i]->taggable_id = isset($purchase[$i]->taggable_id)?$purchase[$i]->taggable_type.'_'.$purchase[$i]->taggable_id:'';
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($purchase);
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
  
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
  
   
}