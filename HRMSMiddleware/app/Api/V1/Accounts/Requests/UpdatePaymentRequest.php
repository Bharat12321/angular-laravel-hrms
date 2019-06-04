<?php

namespace App\Api\V1\Accounts\Requests;

use Dingo\Api\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
{
    public function rules()
    {   
        return [
            'taggable_id' => '',
            'taggable_type' => 'max:255',
            'amount_payable' => 'integer',
            'amount_paid' => 'integer|required',
            'type_id' => 'integer',
            'reference' => 'max:255|nullable',
            'payment_date' => 'date|nullable',
            'paid_date' => 'date|nullable',
            'remarks' => 'nullable|max:255',
            'status' => 'integer|nullable',
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
