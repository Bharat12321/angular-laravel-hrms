<?php

namespace App\Api\V1\Accounts\Requests;

use Dingo\Api\Http\FormRequest;

class PayInvoiceRequest extends FormRequest
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
