<?php

namespace App\Api\V1\Accounts\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateDueRequest extends FormRequest
{
    public function rules()
    {
        return [
            'payment_id' => 'integer|required|',
            'amount' => 'required',
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
