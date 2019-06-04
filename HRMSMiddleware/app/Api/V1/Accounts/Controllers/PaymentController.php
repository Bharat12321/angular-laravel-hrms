<?php

namespace App\Api\V1\Accounts\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Accounts\Requests\CreatePaymentRequest;
use App\Api\V1\Accounts\Requests\UpdatePaymentRequest;
use App\Models\Accounts\Payment;
use App\Models\Employees\Employee;
use App\Models\Core\Config;
use App\Models\Accounts\Ledger;
use App\Models\Sales\Sale;
use App\Models\Accounts\PaymentCategory;
use Auth;


class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $payment = Payment::with(['taggable','category'])->latest()->get();
            for ($i=0; $i < count($payment); $i++) { 
                $payment[$i]->ledgerName = isset($payment[$i]->taggable->name)?$payment[$i]->taggable->name:'';
                $payment[$i]->code = isset($payment[$i]->taggable->code)?$payment[$i]->taggable->code:'';
                $payment[$i]->taggable_id = isset($payment[$i]->taggable_id)?$payment[$i]->taggable_type.'_'.$payment[$i]->taggable_id:'';
                $payment[$i]->modeName = isset($payment[$i]->mode->name)?$payment[$i]->mode->name:'';
                $payment[$i]->categoryName = isset($payment[$i]->category->name)?$payment[$i]->category->name:'';
                $payment[$i]->paid_date_formatted = date('d-m-Y',strtotime($payment[$i]->paid_date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($payment);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
     
        try {
            $data = [];
            $ledgers = Ledger::where('status',1)->select('id','name')->get();
            $sales = Sale::where('status',1)->select('id','name')->get();
            $employees = Employee::where('status',1)->select('id','name')->get();

            //$result = array_merge_recursive($ledgers,$students,$employees);
            $count = 0;
            if($ledgers){

                foreach ($ledgers as $res ) {
                    $data[$count]['id'] = 'Ledger_'.$res->id;
                    $data[$count]['name'] = $res->name;
                    $count++;
                }
            }
            if($sales){

                foreach ($sales as $res ) {
                    $data[$count]['id'] = 'Sale_'.$res->id;
                    $data[$count]['name'] = $res->name;
                    $count++;
                }
            }
            if($employees){
                
                foreach ($employees as $res ) {
                    $data[$count]['id'] = 'Employee_'.$res->id;
                    $data[$count]['name'] = $res->name;
                    $count++;
                }
            }
            
            
            $categories = PaymentCategory::where('status',1)->where('id','!=',1)->select('id','name')->get();
            $mode = Config::where(['status'=>1,'config_item_id'=>14])->select('name','id')->orderBy('sort')->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json(['ledgers'=>$data,'categories'=>$categories,'mode'=>$mode]);
    }
/**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function search($type)
    {
        try {
            $query = Payment::with(['taggable','category','mode']);
           switch ($type) {
              case 'income':
                $query->whereDate('paid_date',date('Y-m-d'))->where('type_id',1); 
                break;

              case 'expense':
                $query->whereDate('paid_date',date('Y-m-d'))->where('type_id',2); 
                break;

              case 'income_month':
                $query->where('type_id',1)->whereBetween('paid_date', [date('Y-m-01'), date('Y-m-t')]); 
                break;
                
              case 'expense_month':
                $query->where('type_id',2)->whereBetween('paid_date', [date('Y-m-01'), date('Y-m-t')]); 
                break;
              default:
                $searchValues = explode(',',$type);
                $from_date = date('Y-m-d',strtotime(substr($searchValues[1], 0, strpos($searchValues[1], '('))));
                $to_date = date('Y-m-d',strtotime(substr($searchValues[2], 0, strpos($searchValues[2], '('))));
                $query->where('type_id',$searchValues[0])->whereBetween('paid_date', [$from_date, $to_date]); 
                break;
            }
            $payment = $query->latest()->get();
            for ($i=0; $i < count($payment); $i++) { 
                $payment[$i]->code = isset($payment[$i]->taggable->code)?$payment[$i]->taggable->code:'';
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatePaymentRequest $request)
    {
        try {
            $data = $request->all();
            if($data['taggable_id']){
                $taggable = explode('_', $data['taggable_id']);
                $data['taggable_id'] = $taggable[1];
                $data['taggable_type'] = $taggable[0];
            }
            $date = date('Y-m-d',strtotime($data['paid_date']));
            $data['amount_payable'] = $data['amount_paid'];
            $data['payment_date'] = $date;
            $data['paid_date'] = $date;
            $data['type_id'] = $data['type_id'];
            $payment = new Payment($data);
            $payment->save();
            activity()->causedBy(Auth::user())->performedOn($payment)->withProperties($payment)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($payment);
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
            $receipt = Payment::with(['taggable','mode'])->findOrFail($id);
            if($receipt->taggable_type=='Student') // get parent details also
              $receipt = Payment::with(['taggable.parents','mode'])->findOrFail($id);
            if($receipt->taggable->parents && isset($receipt->taggable->parents[0])){
                $parent = $receipt->taggable->parents[0];
                $receipt->toName = $parent->name;
            }else{
                $receipt->toName = $receipt->taggable->name;
            }
            $receipt->total = $receipt->amount_paid;
            $receipt->modeName = $receipt->mode->name;
            $receipt->due_date = date('d-m-Y' , strtotime($receipt->paid_date));
            $f = new \NumberFormatter("en", \NumberFormatter::SPELLOUT);
            $receipt->totalwords = ucfirst($f->format($receipt->total));
            $receipt->feeFor = $receipt->remarks;
            $receipt->receipt_date = date('d-m-Y' , strtotime($receipt->paid_date));
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($receipt);
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
    public function update(UpdatePaymentRequest $request, $id)
    {
        try {
            $data = $request->all();
            $payment = Payment::findOrFail($id);
            if($data['taggable_id']){
                $taggable = explode('_', $data['taggable_id']);
                $data['taggable_id'] = $taggable[1];
                $data['taggable_type'] = $taggable[0];
            }
            $date = date('Y-m-d',strtotime($data['paid_date']));
            $data['amount_payable'] = $data['amount_paid'];
            $data['payment_date'] = $date;
            $data['paid_date'] = $date;
            $data['type_id'] = $data['type_id'];
            $payment->update($data);
            activity()->causedBy(Auth::user())->performedOn($payment)->withProperties($payment)->log('Updated Successfully');
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
    public function destroy($id)
    {
        try {
            $payment = Payment::findOrFail($id);
            $payment->delete();
            activity()->causedBy(Auth::user())->performedOn($payment)->withProperties($payment)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($payment);
    }
}

?>
