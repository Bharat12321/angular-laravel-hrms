<?php

namespace App\Api\V1\Sales\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateItemRequst extends FormRequest
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
