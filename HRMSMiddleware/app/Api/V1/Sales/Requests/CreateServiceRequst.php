<?php

namespace App\Api\V1\Sales\Requests;

use Dingo\Api\Http\FormRequest;

class CreateServiceRequst extends FormRequest
{
    public function rules()
    {   
        return [
            'name' => 'required',
            'service_category'=>'required',
            'status' => 'integer|nullable'
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
