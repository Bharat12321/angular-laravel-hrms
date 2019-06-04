<?php

namespace App\Api\V1\Employees\Requests;

use Dingo\Api\Http\FormRequest;

class CreateEmployeeRequest extends FormRequest
{
    public function rules()
    {
        return [
                'code'=> '', 
                'name'=> 'required|max:255', 
                'arabic_name'=> '', 
                'date_of_birth'=> '', 
                'gender'=> 'required', 
                'email'=> '', 
                'contact_number'=> '', 
                'joining_date'=> 'required', 
                'joining_type_id' => 'integer|nullable', 
                'type_id' => 'integer|nullable', 
                'organization_id' => 'integer|nullable', 
                'department_id' => 'integer|nullable', 
                'designation_id' => 'integer|nullable', 
                'category_id'  => 'integer|nullable',
                'grade_id' => 'integer|nullable',
                'working_status_id' => 'integer|nullable',
                'country_id' => 'integer|nullable',
                'class_id'  => 'integer|nullable',
                'payroll_center_id' => 'integer|nullable',
                'status' => 'integer',
                'remarks' =>''
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
