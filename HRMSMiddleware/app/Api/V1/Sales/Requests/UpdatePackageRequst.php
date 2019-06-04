<?php

namespace App\Api\V1\Sales\Requests;

use Dingo\Api\Http\FormRequest;

class UpdatePackageRequst extends FormRequest
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
