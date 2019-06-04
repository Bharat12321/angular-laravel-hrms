<?php

namespace App\Api\V1\Employees\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateEmployeeActivityRequest extends FormRequest
{
    public function rules()
    {
        return [
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
