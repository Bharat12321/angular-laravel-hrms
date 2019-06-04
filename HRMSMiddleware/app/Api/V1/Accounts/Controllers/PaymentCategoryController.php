<?php

namespace App\Api\V1\Accounts\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Accounts\Requests\CreatePaymentCategoryRequest;
use App\Api\V1\Accounts\Requests\UpdatePaymentCategoryRequest;
use App\Models\Accounts\PaymentCategory;
use Auth;


class PaymentCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $paymentCategory = PaymentCategory::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($paymentCategory);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
     
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatePaymentCategoryRequest $request)
    {
        try {
            $paymentCategory = new PaymentCategory($request->all());
            $paymentCategory->save();
            activity()->causedBy(Auth::user())->performedOn($paymentCategory)->withProperties($paymentCategory)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($paymentCategory);
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
            $paymentCategory = PaymentCategory::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($paymentCategory);
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
    public function update(UpdatePaymentCategoryRequest $request, $id)
    {
        try {
            $paymentCategory = PaymentCategory::findOrFail($id);
            $paymentCategory->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($paymentCategory)->withProperties($paymentCategory)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($paymentCategory);
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
            $paymentCategory = PaymentCategory::findOrFail($id);
            $paymentCategory->delete();
            activity()->causedBy(Auth::user())->performedOn($paymentCategory)->withProperties($paymentCategory)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($paymentCategory);
    }
}

?>
