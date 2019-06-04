<?php

namespace App\Api\V1\Employees\Requests;

use Dingo\Api\Http\FormRequest;

class CreateEmployeeContractRequest extends FormRequest
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
