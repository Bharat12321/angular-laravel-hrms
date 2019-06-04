<?php

namespace App\Api\V1\Employees\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Employees\Requests\CreateEmployeeIdRequest;
use App\Api\V1\Employees\Requests\UpdateEmployeeIdRequest;
use App\Models\Employees\Employee;
use App\Models\Employees\EmployeeId;
use App\Models\Core\Config;
use Auth;

class EmployeeIdController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $employeeId = EmployeeId::with(['type'])->latest()->get(); 
            for ($i=0; $i < count($employeeId); $i++) { 
                $employeeId[$i]->typeName = isset($employeeId[$i]->type->name)?$employeeId[$i]->type->name:'';
                $employeeId[$i]->expiry_date_formatted = date('d-m-Y',strtotime($employeeId[$i]->expiry_date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeId);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function employee($id)
    {
        try {
            $employeeId = EmployeeId::with(['type'])->where('taggable_type','Employee')->where('taggable_id',$id)->latest()->get(); 
            for ($i=0; $i < count($employeeId); $i++) { 
                $employeeId[$i]->typeName = isset($employeeId[$i]->type->name)?$employeeId[$i]->type->name:'';
                $employeeId[$i]->expiry_date_formatted = date('d-m-Y',strtotime($employeeId[$i]->expiry_date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeId);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function company($id)
    {
        try {
            $employeeId = EmployeeId::with(['type'])->where('taggable_type','Company')->where('taggable_id',$id)->latest()->get(); 
            for ($i=0; $i < count($employeeId); $i++) { 
                $employeeId[$i]->typeName = isset($employeeId[$i]->type->name)?$employeeId[$i]->type->name:'';
                $employeeId[$i]->expiry_date_formatted = date('d-m-Y',strtotime($employeeId[$i]->expiry_date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeId);
    }



    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function student($id)
    {
        try {
            $employeeId = EmployeeId::with(['type'])->where('taggable_type','Student')->where('taggable_id',$id)->latest()->get(); 
            for ($i=0; $i < count($employeeId); $i++) { 
                $employeeId[$i]->typeName = isset($employeeId[$i]->type->name)?$employeeId[$i]->type->name:'';
                $employeeId[$i]->expiry_date_formatted = date('d-m-Y',strtotime($employeeId[$i]->expiry_date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeId);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        try {
            $types = Config::where(['status'=>1,'config_item_id'=>6])->select('name','id')->orderBy('sort')->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json(['types'=>$types]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateEmployeeIdRequest $request)
    {
        try {
            $data = $request->all();
            $data['expiry_date']  = date('Y-m-d',strtotime($data['expiry_date']));
            $employeeId = new EmployeeId($data);
            if($request->file){
                $image = $request->file;  // your base64 encoded
                $ext = $this->getBetween($image,'data:image/',';');
                $image = str_replace('data:image/'.$ext.';base64,', '', $image);
                $image = str_replace(' ', '+', $image);
                $imageName = str_random(10).'.'.$ext;
                \File::put(public_path('profiles'). '/' . $imageName, base64_decode($image));
                $employeeId->location = 'profiles/'.$imageName;
            }
            $employeeId->save();
            activity()->causedBy(Auth::user())->performedOn($employeeId)->withProperties($employeeId)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeId);
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
            $employeeId = EmployeeId::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeId);
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
    public function update(UpdateEmployeeIdRequest $request, $id)
    {
        try {
            $employeeId = EmployeeId::find($id);
            $data = $request->all();
            $data['expiry_date']  = date('Y-m-d',strtotime($data['expiry_date']));
            if($request->file){
                $image = $request->file;  // your base64 encoded
                $ext = $this->getBetween($image,'data:image/',';');
                $image = str_replace('data:image/'.$ext.';base64,', '', $image);
                $image = str_replace(' ', '+', $image);
                $imageName = str_random(10).'.'.$ext;
                \File::put(public_path('profiles'). '/' . $imageName, base64_decode($image));
                $employeeId->location = 'profiles/'.$imageName;
            }
            $employeeId->update($data);
            activity()->causedBy(Auth::user())->performedOn($employeeId)->withProperties($employeeId)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeId);
    }
    private function getBetween($content,$start,$end){
        $r = explode($start, $content);
        if (isset($r[1])){
            $r = explode($end, $r[1]);
            return $r[0];
        }
        return '';
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
            $employeeId = EmployeeId::findOrFail($id);
            $employeeId->delete();
            activity()->causedBy(Auth::user())->performedOn($employeeId)->withProperties($employeeId)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeId);
    }
}