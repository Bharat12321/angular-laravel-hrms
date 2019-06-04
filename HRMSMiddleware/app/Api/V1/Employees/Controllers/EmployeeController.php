<?php

namespace App\Api\V1\Employees\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Employees\Requests\CreateEmployeeRequest;
use App\Api\V1\Employees\Requests\UpdateEmployeeRequest;
use App\Api\V1\Employees\Requests\UpdateEmployeeLoginRequest;
use App\Models\Employees\Employee;
use App\Models\Employees\EmployeeId;
use App\Models\Core\Country;
use App\Models\Core\Config;
use App\Models\Core\OrganizationUnit;
use App\Models\Core\Role;
use App\Models\Core\Sponsor;
use App\Models\Core\Bank;
use App\User;
use Auth;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $employee = Employee::with(['country','designation','sponsor'])->latest()->get(); 
            for ($i=0; $i < count($employee); $i++) { 
                $employee[$i]->countryName = isset($employee[$i]->country->name)?$employee[$i]->country->name:'';
                $employee[$i]->designationName = isset($employee[$i]->designation->name)?$employee[$i]->designation->name:'';
                $employee[$i]->sponsorName = isset($employee[$i]->sponsor->name)?$employee[$i]->sponsor->name:'';
                $employee[$i]->date_of_birth_formated = date('d-m-Y',strtotime($employee[$i]->date_of_birth));
                $employee[$i]->joining_date_formated = date('d-m-Y',strtotime($employee[$i]->joining_date));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employee);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        try {
            $countries = Country::select('name', 'id')->orderBy('name')->get();
            $sponsors = Sponsor::select('name', 'id')->orderBy('name')->get();
            $banks = Bank::select('name', 'id')->orderBy('name')->get();
            $departments = Config::where(['status'=>1,'config_item_id'=>1])->select('name','id')->orderBy('sort')->get();
            $designations = Config::where(['status'=>1,'config_item_id'=>2])->select('name','id')->orderBy('sort')->get();
            $categories = Config::where(['status'=>1,'config_item_id'=>3])->select('name','id')->orderBy('sort')->get();
            $workingStatus = Config::where(['status'=>1,'config_item_id'=>5])->select('name','id')->orderBy('sort')->get();
            $employmentTypes = Config::where(['status'=>1,'config_item_id'=>7])->select('name','id')->orderBy('sort')->get();
            $joiningTypes = Config::where(['status'=>1,'config_item_id'=>8])->select('name','id')->orderBy('sort')->get();
            $employeeGrades = Config::where(['status'=>1,'config_item_id'=>10])->select('name','id')->orderBy('sort')->get();
            //$shifts = Shift::select('name', 'id')->where(['status'=>1])->get();
            $payrollCenter = Config::where(['status'=>1,'config_item_id'=>12])->select('name','id')->orderBy('sort')->get();
            $organizations = OrganizationUnit::select('name', 'id')->where('status',1)->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json([
            'countries'=>$countries,
            'sponsors'=>$sponsors,
            'departments'=>$departments,
            'designations'=>$designations,
            'categories'=>$categories,
            'workingStatus'=>$workingStatus,
            'employmentTypes'=>$employmentTypes,
            'joiningTypes'=>$joiningTypes,
            'employeeGrades'=>$employeeGrades,
            'payrollCenter'=>$payrollCenter,
            'organizations'=>$organizations,
            //'shifts'=>$shifts,
            //'banks'=>$banks,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateEmployeeRequest $request)
    {
        try {
            $data = $request->all();
            $data['code'] = time(); // fix the null issue in the unique field
            $data['date_of_birth']  = date('Y-m-d',strtotime($data['date_of_birth']));
            $data['joining_date']  = date('Y-m-d',strtotime($data['joining_date']));
            $employee = new Employee($data);
            $employee->save();
            $employee->update(['code'=>'E00'.$employee->id]);

            $userData = [
                            'taggable_type'=>'Employee',
                            'taggable_id'=>$employee->id,
                            'username'=>$employee->code,
                            'name'=>$employee->name,
                            'password'=>'123456',
                        ];
            $user = new User($userData);
            $user->save();

            $employeeRole = Role::where('slug','admin')->first();

            $user->roles()->attach($employeeRole); 

            activity()->causedBy(Auth::user())->performedOn($employee)->withProperties($employee)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employee);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function search($type)
    {
        try {
            $query = Employee::with(['country','designation','sponsor','bank','salaries']);
           switch ($type) {
              case 'all':
                $employee = Employee::get(); 
                break;
              case 'active':
                $query->where('status',1); 
                break;
              default:
                $query->where('status',1); 
                break;
            } 
            $employee = $query->latest()->get();
            for ($i=0; $i < count($employee); $i++) { 
                $employee[$i]->countryName = isset($employee[$i]->country->name)?$employee[$i]->country->name:'';
                $employee[$i]->designationName = isset($employee[$i]->designation->name)?$employee[$i]->designation->name:'';
                $employee[$i]->sponsorName = isset($employee[$i]->sponsor->name)?$employee[$i]->sponsor->name:'';
                $employee[$i]->bankName = isset($employee[$i]->bank->name)?$employee[$i]->bank->name:'';
                $employee[$i]->date_of_birth_formated = date('d-m-Y',strtotime($employee[$i]->date_of_birth));
                $employee[$i]->joining_date_formated = date('d-m-Y',strtotime($employee[$i]->joining_date));
                $employee[$i]->salary = isset($employee[$i]->salaries[0])?$employee[$i]->salaries[0]->amount:'0';
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employee);
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
            $employee = Employee::with(['country','organization','profiles','users'])->findOrFail($id);
            $employee->date_of_birth  = date('d-m-Y',strtotime($employee->date_of_birth ));
            $employee->joining_date  = date('d-m-Y',strtotime($employee->joining_date ));
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employee);
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
    public function update(UpdateEmployeeRequest $request, $id)
    {
        try {
            $data = $request->all();
            $data['date_of_birth']  = date('Y-m-d',strtotime($data['date_of_birth']));
            $data['joining_date']  = date('Y-m-d',strtotime($data['joining_date']));
            $employee = Employee::find($id);
            $employee->update($data);
            //EmployeeSalary::where('component_id',1)->where('employee_id',$id)->delete();
            // add the basic salary 
            $salaryData = [
                            'component_id'=>1,
                            'employee_id'=>$id,
                        ];
            $salary = EmployeeSalary::updateOrCreate($salaryData,['amount'=>$data['salary']]);

            activity()->causedBy(Auth::user())->performedOn($employee)->withProperties($employee)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employee);
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
            $employee = Employee::findOrFail($id);
            $employee->delete();
            activity()->causedBy(Auth::user())->performedOn($employee)->withProperties($employee)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employee);
    }

    public function user(UpdateEmployeeLoginRequest $request, $id)
    {
        return User::where('taggable_type','Employee')->where('taggable_id',$id)->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function student($id)
    {
        try {
            $student = Student::with(['course','employee'])->where('employee_id',$id)->where('status',1)->latest()->get(); 
            for ($i=0; $i < count($student); $i++) { 
                $student[$i]->courseName = isset($student[$i]->course->name)?$student[$i]->course->name:'';
                $student[$i]->employeeName = isset($student[$i]->employee->name)?$student[$i]->employee->name:'';
                $student[$i]->age = date_diff(date_create($student[$i]->date_of_birth), date_create('now'))->format('%y Y, %m M');
                $student[$i]->joining_date_formated = date('d-m-Y',strtotime($student[$i]->joining_date));
                $student[$i]->date_of_birth_formated = date('d-m-Y',strtotime($student[$i]->date_of_birth));
                $student[$i]->fee_paid_formated = date('d-m-Y',strtotime($student[$i]->fee_paid));
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($student);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function attendance($id)
    {
        try {
            $employeeattendance = EmployeeAttendance::with(['shift','employee'])->where('employee_id',$id)->get();
            for ($i=0; $i < count($employeeattendance); $i++) { 
                $employeeattendance[$i]->code = isset($employeeattendance[$i]->employee->code)?$employeeattendance[$i]->employee->code:'';
                $employeeattendance[$i]->name = isset($employeeattendance[$i]->employee->name)?$employeeattendance[$i]->employee->name:'';
                $employeeattendance[$i]->shiftName = isset($employeeattendance[$i]->shift->name)?$employeeattendance[$i]->shift->name:'';
                $employeeattendance[$i]->deviceName = isset($employeeattendance[$i]->device->name)?$employeeattendance[$i]->device->name:'';
                $employeeattendance[$i]->time_in = date('H:i', strtotime($employeeattendance[$i]->time_in));
                $employeeattendance[$i]->time_out = ($employeeattendance[$i]->time_out)?date('H:i',strtotime($employeeattendance[$i]->time_out)):'';
                $employeeattendance[$i]->hours_worked = gmdate('H:i',$employeeattendance[$i]->hours_worked);
                $employeeattendance[$i]->over_time = gmdate('H:i',$employeeattendance[$i]->over_time);
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($employeeattendance);
    }
}