<?php

namespace App\Api\V1\Sales\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Sales\Requests\CreateGrnRequest;
use App\Api\V1\Sales\Requests\UpdateGrnRequest;
use App\Models\Core\OrganizationUnit;
use App\Models\Core\Config;
use App\Models\Core\Item;
use App\Models\Sales\Grn;
use App\Models\Accounts\Stock;
use App\Models\Companies\Company;
use Auth;
use App\User;
use App\Models\Core\Role;

class GrnController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $grn = Grn::latest()->get(); 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($grn);
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
            $items = Item::where('status',1)->select('id','name')->get();
            $uom = Config::where(['status'=>1,'config_item_id'=>26])->select('name','id')->orderBy('sort')->get();
        }catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json([
            'companies' => $companies,
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
    public function store(CreateGrnRequest $request)
    {
        try {
            $data = $request->all();    
            $data['date'] = date('Y-m-d', strtotime($data['date'])); 
                   
            $grn = new Grn($data);
            $grn->save();
         
            foreach ($data['grnitems'] as $item) {
              
                $details = [
                   'grn_id' => $grn->id,
                   'item_id'=>$item['item_id'],
                   'uom'=>$item['uom'],
                   'quantity'=>$item['quantity'],
                   'price'=>$item['price'],
                   'selling_price'=>$item['selling_price'],
                    ];    

                $grndetail = new GrnDetail($details);
                $grndetail->save();
                $stockitem = Stock::findOrFail($item['item_id']);
                if($stockitem )
                {
                $stock = [ 
                   'item_id' => $item['item_id'],
                   'organization_id'=>$data['organization_id'],
                   'quantity'=>$item['quantity']+$stockitem['quantity'],
                   'price' => $stockitem['price']+$item['selling_price']/$stockitem['quantity']+$item['quantity'],
                   'oldprice' => $stockitem['price']
                ];
                $stockupdate = new Stock($stock);
                $stockupdate->update();
                }
                else
                {
                    $data['oldprice'] = $data['price'];
                    $data['item_id'] = $data['item_id'];
                    $data['organization_id'] = $data['organization_id'];
                    $data['quantity'] = $data['quantity'];
                    $data['price'] = $data['price'];
                    $stock = new Stock($data);
                    $stock->save();

                }

            }
         
         activity()->causedBy(Auth::user())->performedOn($grn)->withProperties($grn)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($grn);
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
            $grn = Grn::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($grn);
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
    public function update(UpdateGrnRequest $request, $id)
    {
        try {
            $grn = Grn::find($id);
            $data = $request->all();
            $update['date'] = date('Y-m-d', strtotime($data['date'])); 
            $update['company_id'] = $data['company_id'];
            $update['name'] = $data['name'];
            $update['remarks'] = $data['remarks'];
            $grn->update($update);            
            activity()->causedBy(Auth::user())->performedOn($grn)->withProperties($grn)->log('Updated Successfully');

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
          
            $grn = Grn::findOrFail($id);
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