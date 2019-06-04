<?php

namespace App\Api\V1\Employees\Requests;

use Dingo\Api\Http\FormRequest;

class CreateEmployeeTransferRequest extends FormRequest
{
    public function rules()
    {
        return [
            'employee_id' => 'required|integer',
            'current_organization_id' => 'integer|required|',
            'new_organization_id' => 'integer|required',
            'remarks' => 'nullable|max:255',
            'mobilisation_date' => 'integer|required',
            'status' => 'integer|nullable',
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
