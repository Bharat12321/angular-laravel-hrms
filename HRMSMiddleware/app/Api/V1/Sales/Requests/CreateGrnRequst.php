<?php

namespace App\Api\V1\Sales\Requests;

use Dingo\Api\Http\FormRequest;

class CreateGrnRequst extends FormRequest
{
    public function rules()
    {   
        return [
            'pono' => 'required',
            'grnno'=>'required',
            'status' => 'integer|nullable'
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
