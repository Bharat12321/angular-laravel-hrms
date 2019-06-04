<?php

namespace App\Api\V1\Sales\Requests;

use Dingo\Api\Http\FormRequest;

class CreateStockRequst extends FormRequest
{
    public function rules()
    {   
        return [
            'item_id' => 'required',
            'organization_id'=>'required',
            'quantity'=>'required',
            'price' => 'required'
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
