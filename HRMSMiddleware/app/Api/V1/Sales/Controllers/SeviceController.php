<?php

namespace App\Api\V1\Sales\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Sales\Requests\CreateServiceRequst;
use App\Api\V1\Sales\Requests\UpdateServiceRequst;
use App\Models\Sales\Service;
use App\Models\Core\Config;
use Auth;


class SeviceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $service = Service::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($service);
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
    public function store(CreateServiceRequst $request)
    {
        try {
            $service = new Service($request->all());
            $service->save();
          
           
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($service);
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
                $servicemaster_category = Config::where(['status'=>1,'config_item_id'=>21])->select('name','id')->orderBy('name')->get();
                $services = Service::where('status',1)->select('*')->get();
               
             
            } catch (JWTException $e) {
                throw new HttpException(500);
            }
            return response()->json([
                'servicemastercategory'=>$servicemaster_category,
                'items' => $services
              
             
            ]);
    }

    public function show($id)
    {
        try {
            $service = Service::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($service);
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
    public function update(UpdateServiceRequst $request, $id)
    {
        try {
            $service = Service::findOrFail($id);
            $service->update($request->all());
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($service);
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
            $service = Service::findOrFail($id);
            $service->delete();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($service);
    }
}

?>
