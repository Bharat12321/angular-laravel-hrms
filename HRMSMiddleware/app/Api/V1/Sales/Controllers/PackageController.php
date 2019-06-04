<?php

namespace App\Api\V1\Sales\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Sales\Requests\CreatePackageRequst;
use App\Api\V1\Sales\Requests\UpdatePackageRequst;
use App\Models\Sales\Package;
use App\Models\Core\Config;
use Auth;


class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $package = Package::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($package );
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
    public function store(CreatePackageRequst $request)
    {
        try {

            $data = $request->all();
            $package = new Package($data);
            $package->save();
          
           
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($package);
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
                $package_category = Config::where(['status'=>1,'config_item_id'=>22])->select('name','id')->orderBy('name')->get();
                $packages = Package::where(['status'=>1])->select('*')->get();
               
             
            } catch (JWTException $e) {
                throw new HttpException(500);
            }
            return response()->json([
                'packagecategory'=>$package_category,
                'items' => $packages
              
            ]);
    }

    public function show($id)
    {
        try {
            $package = Package::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($package);
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
    public function update(UpdatePackageRequst $request, $id)
    {
        try {
            $package = Package::findOrFail($id);
            $package->update($request->all());
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($package);
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
            $package = Package::findOrFail($id);
            $package->delete();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($package);
    }
}

?>
