<?php

namespace App\Api\V1\Accounts\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Accounts\Requests\CreateLedgerRequest;
use App\Api\V1\Accounts\Requests\UpdateLedgerRequest;
use App\Models\Accounts\Ledger;
use Auth;


class LedgerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $ledger = Ledger::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($ledger);
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
    public function store(CreateLedgerRequest $request)
    {
        try {
            $ledger = new Ledger($request->all());
            $ledger->save();
            activity()->causedBy(Auth::user())->performedOn($ledger)->withProperties($ledger)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($ledger);
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
            $ledger = Ledger::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($ledger);
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
    public function update(UpdateLedgerRequest $request, $id)
    {
        try {
            $ledger = Ledger::findOrFail($id);
            $ledger->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($ledger)->withProperties($ledger)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($ledger);
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
            $ledger = Ledger::findOrFail($id);
            $ledger->delete();
            activity()->causedBy(Auth::user())->performedOn($ledger)->withProperties($ledger)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($ledger);
    }
}

?>
