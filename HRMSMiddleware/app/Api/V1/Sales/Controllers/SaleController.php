<?php

namespace App\Api\V1\Sales\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Sales\Requests\CreateSaleRequest;
use App\Api\V1\Sales\Requests\UpdateSaleRequest;
use App\Api\V1\Sales\Requests\UpdateSaleLoginRequest;
use App\Api\V1\Sales\Requests\UpdateSaleTypeRequest;
use App\Models\Core\OrganizationUnit;
use App\Models\Sales\Item;
use App\Models\Core\Config;
use App\Models\Sales\Sale;
use App\Models\Employees\Employee;
use App\Models\Sales\SaleDetail;
use App\Models\Accounts\Payment;
use App\Models\Companies\Company;
use Auth;
use App\User;
use App\Models\Core\Role;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $sale = Sale::latest()->get(); 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($sale);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function type($type)
    {
        try {
            $sale = Sale::where('type',$type)->latest()->get(); 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($sale);
    }
/**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function search($type)
    {
        try {
            $query = Sale::with(['company']);
           switch ($type) {
              case 'today':
                $query->whereDate('date',date('Y-m-d'));
                break;
              case 'month':
                $query->whereBetween('date', [date('Y-m-01'), date('Y-m-t')]); 
                break;
              case 'due':
                $query->where('due_amount','>',0); 
                break;
              default:
                $searchValues = explode(',',$type);
                $from_date = date('Y-m-d',strtotime(substr($searchValues[1], 0, strpos($searchValues[1], '('))));
                $to_date = date('Y-m-d',strtotime(substr($searchValues[2], 0, strpos($searchValues[2], '('))));
                $query->whereBetween('date', [$from_date, $to_date]); 
                break;
            }
            $sale = $query->latest()->get();
            for ($i=0; $i < count($sale); $i++) {
                // var_dump($sale[$i]);

                $saledetail = SaleDetail::where('sale_id', $sale[$i]->id)->get();
                $rr = [];
                $rr = Sale::where('id', $sale[$i]->id)->get();
                // $sale['sale_detail'] = $saledetail;

               // $sale[$i]->employeeName = isset($sale[$i]->employee->code)?$sale[$i]->employee->name:'';
                $sale[$i]->companyName = isset($sale[$i]->company->name)?$sale[$i]->company->name:'';
                $sale[$i]->date_formatted = date('d-m-Y',strtotime($sale[$i]->date));
                
                $mm = [];
                foreach ( $saledetail as $k) {
                    $items_chk = Item::where('id', $k['item_id'])->select('id','itemname as name')->get();
                    $sale_type_chk = Config::where('id', $k['sale_type_id'])->select('name','id')->get();

                    $dd = [
                       // 'sale_id' => $k['id'],
                       'item_id' => $k['item_id'],
                       'employee_id' => $k['employee_id'],
                       // 'quantity'  => $k['quantity'],
                       'qty'  => $k['quantity'],
                       'cost' => $k['price'],
                       'total' => $k['total_price'],

                       // 'sale_type' => $sale_type_chk[0]
                       // 'item' => $items_chk[0],
                       // 0=>$k['sale_type_id'],
                       'sale_type_id'=>$k['sale_type_id']
                    ];
                    array_push($mm, $dd);
                }
                $sale[$i]->details = $mm; //working
            }
            // die;
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($sale);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
           
        try {
            $companies = Company::where('status',1)->select('id','name')->get();
            $employees = Employee::where('status',1)->select('id','name')->get();
            $orgUnit= OrganizationUnit::where('status',1)->select('id','name')->get();
            $items = Item::where('status',1)->select('id','itemname')->get();
            $modes = Config::where(['status'=>1,'config_item_id'=>14])->select('name','id')->orderBy('sort')->get();
            $saletype = Config::where(['status'=>1,'config_item_id'=>29])->select('name','id')->orderBy('sort')->get();

        }catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json([
            'companies' => $companies,
            'modes' => $modes,
            'items' => $items,
            'orgUnit'=>$orgUnit,
            'employees' =>$employees,
            'saletype' =>$saletype
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateSaleRequest $request)
    {
        try {
            $data = $request->all();
            $user = Auth::user();
            if($data['payment_type'] != 'Pay Now'){
                $data['paid_amount'] = 0;
            }
            $data['date'] = date('Y-m-d', strtotime($data['date'])); 
            $data['due_amount'] = $data['total'] - $data['paid_amount'];
            $data['organization_id'] =1;
            $sale = new Sale($data);
            $sale->save();
            foreach ($data['invoiceItems'] as $item) {
              //  $it = Item::findOrFail($item['item_id']);
                $details = [
                   'sale_id' => $sale->id,
                   'item_id' => $item['item_id'],
                   'employee_id' => $item['employee_id'],
                   'quantity'  => $item['qty'],
                   'price' => $item['cost'],
                   'total_price' => $item['cost'] * $item['qty'],
                   'sale_type_id'=>$item['sale_type_id'] 
                ];
             //   $profit =+ ($it->original_price * $item['qty']) - ($it->discount_price * $item['qty']) ;
                $saleDetail = new SaleDetail($details );
                $saleDetail->save();
            }
           // $sale->update(['profit'=>$profit]);
            if($data['payment_type'] == 'Pay Now'){
                $data['taggable_id'] = $sale->id;
                $data['taggable_type'] = 'Sale';
                $date = date('Y-m-d',strtotime($data['date']));
                $data['amount_payable'] = $data['paid_amount'];
                $data['amount_paid'] = $data['paid_amount'];
                $data['payment_date'] = $date;
                $data['paid_date'] = $date;
                $data['type_id'] = 1;
                $data['category_id'] = 1;
                $payment = new Payment($data);
                $payment->save();
            }
            activity()->causedBy(Auth::user())->performedOn($sale)->withProperties($sale)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($sale);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function pay(UpdateSaleRequest $request, $id)
    {
        try {
            $sale = Sale::find($id);
            $data = $request->all();
            $sale->update(['paid_amount'=> $sale->paid_amount + $data['paid_amount'] ,'due_amount'=>$sale->due_amount - $data['paid_amount']]); 
            $data['taggable_id'] = $sale->id;
            $data['taggable_type'] = 'Sale';
            $date = $data['paid_amount'];
            $data['amount_payable'] = $data['paid_amount'];
            $data['amount_paid'] = $data['paid_amount'];
            $data['payment_date'] = $date;
            $data['paid_date'] = $date;
            $data['type_id'] = 1;
            $data['category_id'] = 1;
            $payment = new Payment($data);
            $payment->save();          
            activity()->causedBy(Auth::user())->performedOn($sale)->withProperties($sale)->log('Updated Successfully');

        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($sale);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // var_dump($id);
        // die;


        try {
            $saledetail = SaleDetail::where('sale_id', $id)->get();
            $rr = [];
            $rr = Sale::findOrFail($id);
            $rr['sale_detail'] = $saledetail;
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($rr);
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
    public function update(UpdateSaleRequest $request, $id)
    {
        // echo "In Update Request";
        // echo $id;
        // var_dump($request);

        try {
            $sale = Sale::find($id);
            $data = $request->all();
            $update['date'] = date('Y-m-d', strtotime($data['date'])); 
            $update['company_id'] = $data['company_id'];
            $update['name'] = $data['name'];
            $update['remarks'] = $data['remarks'];
            $sale->update($update);            

            SaleDetail::where('sale_id', $sale->id)->delete();

            foreach ($data['invoiceItems'] as $item) {
                $details = [
                   'sale_id' => $sale->id,
                   'item_id' => $item['item_id'],
                   'employee_id' => $item['employee_id'],
                   'quantity'  => $item['qty'],
                   'price' => $item['cost'],
                   'total_price' => $item['cost'] * $item['qty'],
                   'sale_type_id'=>$item['sale_type_id'] 
                ];
                $saleDetail = new SaleDetail($details );
                $saleDetail->save();
            }

            activity()->causedBy(Auth::user())->performedOn($sale)->withProperties($sale)->log('Updated Successfully');

        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($sale);
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
            $sale = Sale::findOrFail($id);
            $sale->delete(); 
            Payment::where('taggable_type','Sale')->where('taggable_id',$id)->delete();         
            activity()->causedBy(Auth::user())->performedOn($sale)->withProperties($sale)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($sale);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function sale($id)
    {
        try {
            $sale = Payment::with(['taggable','category','mode'])->where('taggable_type','Sale')->where('taggable_id',$id)->latest()->get();
            for ($i=0; $i < count($sale); $i++) { 
                $sale[$i]->ledgerName = isset($sale[$i]->taggable->name)?$sale[$i]->taggable->name:'';
                $sale[$i]->categoryName = isset($sale[$i]->category->name)?$sale[$i]->category->name:'';
                $sale[$i]->paid_date_formatted = date('d-m-Y',strtotime($sale[$i]->paid_date));
                $sale[$i]->modeName = isset($sale[$i]->mode->name)?$sale[$i]->mode->name:'';
                $sale[$i]->taggable_id = isset($sale[$i]->taggable_id)?$sale[$i]->taggable_type.'_'.$sale[$i]->taggable_id:'';
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($sale);
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
            $sale = Sale::findOrFail($id);
            $fees = SaleCourse::where('sale_id',$id)->where('status',0)->get();
            if($fees){
                $feeId='';
                $total = 0;
                foreach ($fees as $fee) {
                    $total += ($fee->amount - $fee->discount_amount);
                    $feeId .= $fee->id.',';
                    SaleCourse::whereId($fee->id)->update(['status'=>1]);
                }
                if($total){
                $feeId = rtrim($feeId,',');
                $data = ['taggable_type'=> 'Sale',
                         'taggable_id'=> $id,
                         'address'=> $sale->address,
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
    public function invoiceFee(CreateSaleInvoiceRequest $request, $id)
    {
         try {
            $sale = Sale::findOrFail($id);
            $data = $request->all();
            $fees = SaleCourse::where('sale_id',$id)->whereIn('id',$data['fees'])->get();
            if($fees){
                $feeId='';
                $total = 0;
                foreach ($fees as $fee) {
                    $total += ($fee->amount - $fee->discount_amount);
                    $feeId .= $fee->id.',';
                    SaleCourse::whereId($fee->id)->update(['status'=>1]);
                }
                if($total){
                    $feeId = rtrim($feeId,',');
                    $data = ['taggable_type'=> 'Sale',
                             'taggable_id'=> $id,
                             'address'=> $sale->address,
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

    public function user(UpdateSaleLoginRequest $request, $id)
    {
        return User::where('taggable_type','Sale')->where('taggable_id',$id)->update($request->all());
    }

    public function updateType(UpdateSaleTypeRequest $request,$id)
    {
        return Sale::where('id',$id)->update(['type'=>2]);
    }
}   