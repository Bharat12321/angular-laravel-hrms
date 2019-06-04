<?php

namespace App\Api\V1\Sales\Requests;

use Dingo\Api\Http\FormRequest;

class CreateGinRequst extends FormRequest
{
    public function rules()
    {   
        return [
           
            'ginno'=>'required',
            'status' => 'integer|nullable'
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
