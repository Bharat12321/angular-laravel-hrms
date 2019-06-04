<?php

namespace App\Api\V1\Accounts\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Accounts\Requests\PayInvoiceRequest;
use App\Models\Accounts\Invoice;
use App\Models\Accounts\Payment;
use App\Models\Students\StudentFee;
use App\Models\Companies\CompanyCourse;
use App\Models\Students\Student;
use Auth;


class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $invoice = Invoice::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($invoice);
    }

    public function student($id)
    {
        try {
            $invoice = Invoice::where('taggable_type','Student')->where('taggable_id',$id)->get();
            for ($i=0; $i < count($invoice); $i++) { 
                $invoice[$i]->date = date('d-m-Y',strtotime($invoice[$i]->date));
                $invoice[$i]->amount = $invoice[$i]->total - $invoice[$i]->paid;
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($invoice);
    }

    public function company($type,$id)
    {
        try {
            $invoice = Invoice::where('taggable_type','Company')->where('taggable_id',$id)->where('type',$type)->get();
            for ($i=0; $i < count($invoice); $i++) { 
                $invoice[$i]->date = date('d-m-Y',strtotime($invoice[$i]->date));
                $invoice[$i]->amount = $invoice[$i]->total - $invoice[$i]->paid;
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($invoice);
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
            $invoice = @Invoice::with(['taggable'])->findOrFail($id);
            $fees_ids = $invoice->fees;
            $feeArray = explode(',', $fees_ids);
            $fees = CompanyCourse::with('course')->whereIn('id',$feeArray)->get();
            $totalFee = 0;
            $totalDiscount = 0;
            $feeFor = '';
            for ($i=0; $i < count($fees); $i++) { 
                $fees[$i]->name = $fees[$i]->course->name;
                $totalFee += $fees[$i]->amount;
                $totalDiscount += $fees[$i]->discount_amount;
                $feeFor .= $fees[$i]->remarks. ' and ';
            } 
            $invoice->feeFor = rtrim($feeFor,' and ');
            $f = new \NumberFormatter("en", \NumberFormatter::SPELLOUT);
            $invoice->fees = $fees;
            $invoice->totalFee = $totalFee;
            $invoice->toName = $invoice->taggable->name;
            $invoice->totalwords = ucfirst($f->format($invoice->total));
            $invoice->totalDiscount = $totalDiscount;
            $invoice->invoice_date = date('d-m-Y' , strtotime($invoice->invoice_date));
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($invoice);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function invoicePay(PayInvoiceRequest $request, $id)
    {
        try {

            $invoice = Invoice::findOrFail($id);
            $data = $request->all();
            $invoice->paid += $data['amount'];
            $invoice->status = 1;
            $invoice->update();

            $pay = ['taggable_type'=> 'Student',
                     'taggable_id'=> $invoice->taggable_id,
                     'category_id'=> 1, // Student Fees
                     'amount_payable'=> $data['amount'],
                     'amount_paid'=> $data['amount'],
                     'mode_id'=> $data['mode_id'],
                     'type_id'=> 1, // fees
                     'payment_date'=> $invoice->date,
                     'paid_date'=> date('Y-m-d',strtotime($data['date'])),
                     'reference' => $invoice->id,
                     'remarks'=> $data['remarks'],
                    ];

            $payment = Payment::create($pay);

            //update fee paid on the function 
            $fees_ids = $invoice->fees;
            $feeArray = explode(',', $fees_ids);
            $fees = StudentFee::whereIn('id',$feeArray)->oldest('fee_to')->get();

            foreach ($fees as $fee) {
                if($fee->fee_to && $fee->fee_to >0){
                    $student = Student::findOrFail($fee->student_id);
                    $studentUpdate = $student->update(['fee_paid'=>$fee->fee_to]);
                }
            }

            activity()->causedBy(Auth::user())->performedOn($payment)->withProperties($payment)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($payment);
  }
  public function approve($id){

    $invoice = Invoice::findOrFail($id);
    $invoice->status = 1;
    $invoice->update();
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
            $invoice = Invoice::findOrFail($id);
            $fees_ids = $invoice->fees;
            $feeArray = explode(',', $fees_ids);
            $fees = StudentFee::whereIn('id',$feeArray)->update(['status'=>1]);
            $invoice->delete();
            activity()->causedBy(Auth::user())->performedOn($invoice)->withProperties($invoice)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($invoice);
    }
                
}

?>
