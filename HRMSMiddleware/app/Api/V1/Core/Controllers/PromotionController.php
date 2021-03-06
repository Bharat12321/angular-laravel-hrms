<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Core\Requests\CreatePromotionRequest;
use App\Api\V1\Core\Requests\UpdatePromotionRequest;
use App\Models\Core\Promotion;
use Auth;


class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $promotion = Promotion::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($promotion);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatePromotionRequest $request)
    {
        try {
            $data = $request->all();
            $data['to'] = implode(',',$data['to']);
            $promotion = new Promotion($data);
            $promotion->save();
            activity()->causedBy(Auth::user())->performedOn($promotion)->withProperties($promotion)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($promotion);
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
            $promotion = Promotion::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($promotion);
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
    public function update(UpdatePromotionRequest $request, $id)
    {
        try {
            $promotion = Promotion::findOrFail($id);
            $promotion->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($promotion)->withProperties($promotion)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($promotion);
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
            $promotion = Promotion::findOrFail($id);
            $promotion->delete();
            activity()->causedBy(Auth::user())->performedOn($promotion)->withProperties($promotion)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($promotion);
    }
}
