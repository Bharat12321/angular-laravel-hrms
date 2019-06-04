<?php

namespace App\Api\V1\Sales\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Sales\Requests\CreateItemRequst;
use App\Api\V1\Sales\Requests\UpdateItemRequst;
use App\Models\Sales\Item;
use App\Models\Core\Config;
use Auth;


class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $item = Item::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
           return response()->json($item);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
  

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateItemRequst $request)
    {
        try {

            $data = $request->all();
            $item = new Item($data);
            $item->save();
          
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($item);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */


    public function create()
    {
         try {
                $item_category = Config::where(['status'=>1,'config_item_id'=>28])->select('name','id')->orderBy('name')->get();
                $item_manufacturar = Config::where(['status'=>1,'config_item_id'=>27])->select('name','id')->orderBy('name')->get();
                $item_shelf = Config::where(['status'=>1,'config_item_id'=>23])->select('name','id')->orderBy('name')->get();
                $item_row = Config::where(['status'=>1,'config_item_id'=>24])->select('name','id')->orderBy('name')->get();
                $item_col = Config::where(['status'=>1,'config_item_id'=>25])->select('name','id')->orderBy('name')->get();
                $item_uom = Config::where(['status'=>1,'config_item_id'=>26])->select('name','id')->orderBy('name')->get();
                $items = Item::where(['status'=>1])->select('*')->get();
              

            } catch (JWTException  $e) {
                throw new HttpException(500);
            }
            return response()->json([
                'item_Category'=>$item_category,
                'item_manufcaturer'=>$item_manufacturar,
                'item_shelf'=>$item_shelf,
                'item_row'=>$item_row,
                'item_col'=>$item_col,
                'item_uom'=>$item_uom,
                'items' => $items
            ]);
    }

    public function show($id)
    {
        try {
            $item = Item::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($item);
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
    public function update(UpdateItemRequst $request, $id)
    {
        try {
            $item = Item::findOrFail($id);
            $item->update($request->all());
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($item);
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
            $item = Item::findOrFail($id);
            $item->delete();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($item);
    }
}


