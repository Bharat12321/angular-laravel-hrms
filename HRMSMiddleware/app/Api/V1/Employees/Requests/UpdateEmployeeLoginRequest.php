<?php

namespace App\Api\V1\Employees\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateEmployeeLoginRequest extends FormRequest
{
    public function rules()
    {
        return [
          'status' => '',
            
        ];
    }

    public function authorize()
    {
        return true;
    }
}
