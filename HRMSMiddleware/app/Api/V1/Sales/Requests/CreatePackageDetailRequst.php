<?php

namespace App\Api\V1\Sales\Requests;

use Dingo\Api\Http\FormRequest;

class CreatePackageDetailRequst extends FormRequest
{
    public function rules()
    {   
        return [
            'name' => 'required',
            'service_id'=>'required',
            'status' => 'integer|nullable'
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
