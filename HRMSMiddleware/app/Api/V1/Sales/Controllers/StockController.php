<?php

namespace App\Api\V1\Sales\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Sales\Requests\CreateStockRequst;
use App\Api\V1\Sales\Requests\UpdateStockRequst;
use App\Models\Core\OrganizationUnit;
use App\Models\Sales\Item;
use App\Models\Sales\Stock;

use Auth;


class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $stock = Stock::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
           return response()->json($stock);
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
    public function store(CreateStockRequst $request)
    {
        try {

            $data = $request->all();
            $stock = new Item($data);
            $stock->save();
          
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($stock);
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
            $organizations = OrganizationUnit::select('name', 'id')->where('status',1)->get();
            $items =  \DB::table('stock')
                ->leftJoin('items', 'stock.item_id', '=', 'items.id')
                ->select(\DB::raw('items.id, items.itemname as name, status'))
                ->get();
            } catch (JWTException  $e) {
                throw new HttpException(500);
            }
            return response()->json([
                'organizations'=>$organizations,
                'items'=>$items
            ]);
    }

    public function show($id)
    {
        try {
            $stock = Stock::with(['item'])->where('item_id',$id)->latest()->get();
            $stock = $stock[0];
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($stock);
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
    public function update(UpdateStockRequst $request, $id)
    {
        try {
            $stock = Stock::findOrFail($id);
            $stock->update($request->all());
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($stock);
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
            $stock = Item::findOrFail($id);
            $stock->delete();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($stock);
    }
}


