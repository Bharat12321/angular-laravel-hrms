<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Models\Employees\Employee;
use App\Models\Accounts\Payment;
use App\Models\Sales\Sale;
use App\Models\Core\Course;
use App\Models\Core\Config;
use Auth;
use App\Mail\OrderShipped;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
                try {
            $resut['allEmployeeCount'] = Employee::count();
            $resut['activeEmployeeCount']  = Employee::where('status',1)->count();
            
            $resut['incomeToday']  = Payment::whereDate('paid_date',date('Y-m-d'))->where('type_id',1)->sum('amount_paid');
            $resut['expenceToday']  = Payment::whereDate('paid_date',date('Y-m-d'))->where('type_id',2)->sum('amount_paid');
            $resut['incomeMonth']  = Payment::where('type_id',1)->whereBetween('paid_date', [date('Y-m-01'), date('Y-m-t')])->sum('amount_paid');
            
            $resut['saleToday']  = Sale::whereDate('date',date('Y-m-d'))->count();
            $resut['saleMonth']  = Sale::whereBetween('date', [date('Y-m-01'), date('Y-m-t')])->count();
            //$resut['profitToday']  = Sale::whereDate('date',date('Y-m-d'))->sum('profit');
            //$resut['profitAll']  = Sale::sum('profit');
            $resut['saleMonth']  = Sale::whereBetween('date', [date('Y-m-01'), date('Y-m-t')])->count();
            $resut['dueCount']  = Sale::where('due_amount','>',0)->count();
            $resut['due']  = Sale::where('due_amount','>',0)->sum('due_amount');
            //$resut['profitMonth']  = Sale::whereBetween('date', [date('Y-m-01'), date('Y-m-t')])->sum('profit');
            $resut['expenceMonth']  = Payment::where('type_id',2)->whereBetween('paid_date', [date('Y-m-01'), date('Y-m-t',strtotime('+1 month'))])->sum('amount_paid');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($resut);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function studentCountGraph()
    {
        try {
            $label = [];
            $data = [];
            $today = date('Y-m-d');
            for ($i=0; $i < 10 ; $i++) { 
                $label[] = date('d-m',strtotime($today));
                $dataSale[] = Sale::where('status',1)->where('date', $today)->sum('total');
                //$dataProfit[] = Sale::where('status',1)->where('date', $today)->sum('profit');
                $today = date('Y-m-d',strtotime('-1 day',strtotime($today)));
            }
            $resut = [
                'labels'=>$label,
                'datasets'=>[
                    ['label'=>'Sale','backgroundColor'=>'#1976d2','data'=>$dataSale],
                ]
            ];
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($resut);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function studentGenderGraph()
    {
        try {
            $label = ['Male','Female'];
            $data[0] = Student::where('gender','Male')->count();
            $data[1] = Student::where('gender','Female')->count();
            $resut = [
                'labels'=>$label,
                'datasets'=>[['label'=>'Gender wise Student','backgroundColor'=>'#7cb342','data'=>$data]]
            ];
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($resut);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function studentNationalityGraph()
    {
        try {
            $label = ['Qatari','Non-Qatari'];
            $data[0] = Student::where('country_id',634)->count();
            $data[1] = Student::where('country_id','!=','634')->count();
            $resut = [
                'labels'=>$label,
                'datasets'=>[['label'=>'Nationality wise Student','backgroundColor'=>'#7cb342','data'=>$data]]
            ];
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($resut);
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function studentCourseGraph()
    {
        try {
            $label = [];
            $data = [];
            $courses = Course::where('status',1)->get();
            foreach ($courses as $course) {
                $label[] = $course->name;
                $data[]=Student::where('status',1)->where('course_id',$course->id)->count();
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json(['count'=>$data,'label'=>$label]);
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
    public function store(CreateAgentRequest $request)
    {
        //echo json_encode($request->all());
        try {
            $agent = new Agent($request->all());
            $agent->save();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($agent);
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
            $agent = Agent::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($agent);
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
    public function update(UpdateAgentRequest $request, $id)
    {
        try {
            $agent = Agent::findOrFail($id);
            $agent->update($request->all());
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($agent);
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
            $agent = Agent::findOrFail($id);
            $agent->delete();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($agent);
    }
}
