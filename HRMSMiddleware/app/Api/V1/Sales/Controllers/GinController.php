<?php

namespace App\Api\V1\Sales\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Sales\Requests\CreateGinRequest;
use App\Api\V1\Sales\Requests\UpdateGinRequest;
use App\Models\Core\OrganizationUnit;
use App\Models\Core\Config;
use App\Models\Core\Item;
use App\Models\Sales\Gin;
use App\Models\Accounts\Stock;
use Auth;
use App\User;
use App\Models\Core\Role;

class GinController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $gin = Gin::latest()->get(); 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($gin);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
  
    public function create()
    {
        
        try {
         
            $orgUnit= OrganizationUnit::where('status',1)->select('id','name')->get();
            $items = Item::where('status',1)->select('id','name')->get();
            $uom = Config::where(['status'=>1,'config_item_id'=>26])->select('name','id')->orderBy('sort')->get();
        }catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json([
          
            'uom' => $uom,
            'items' => $items,
            'orgunits'>  $orgUnit,
          
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateGinRequest $request)
    {
        try {
            $data = $request->all();    
            $data['date'] = date('Y-m-d', strtotime($data['date'])); 
                   
            $grn = new Grn($data);
            $grn->save();
         
            foreach ($data['ginitems'] as $item) {
              
                $details = [
                   'gin_id' => $grn->id,
                   'item_id'=>$item['item_id'],
                   'uom'=>$item['uom'],
                   'quantity'=>$item['quantity'],
                    ];    

                $gindetail = new GinDetail($details);
                $gindetail->save();
                $stockitem = Stock::findOrFail($item['item_id']);
                if($stockitem )
                {
                $stock = [ 
                   'item_id' => $item['item_id'],
                   'organization_id'=>$data['organization_id'],
                   'quantity'=>$stockitem['quantity']-$item['quantity']
                ];
                $stockupdate = new Stock($stock);
                $stockupdate->update();
                }
              

            }
         
         activity()->causedBy(Auth::user())->performedOn($gin)->withProperties($gin)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($gin);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $gin = Gin::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($gin);
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
    public function update(UpdateGinRequest $request, $id)
    {
        try {
            $grn = Gin::find($id);
            $data = $request->all();
            $update['date'] = date('Y-m-d', strtotime($data['date'])); 
            $gin->update($update);            
            activity()->causedBy(Auth::user())->performedOn($gin)->withProperties($grn)->log('Updated Successfully');

        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($grn);
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
          
            $grndetail=GrnDetail::where('grn_id', $id)->get();
            foreach ($grndetail as $item) 
            {
                $it = Stock::findOrFail($item['item_id']);

               $stocks = [
                'quantity' => $it->quanity- $item['quantity'],
                'price' => $it['oldprice']
             ];
             $stockDeduction = new Stock($stockDeduction);
             $stockDeduction->update();
            }

            $grn->delete();      
            activity()->causedBy(Auth::user())->performedOn($grn)->withProperties($grn)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($grn);
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
  
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
  
   
}