<?php

namespace App\Api\V1\Accounts\Requests;

use Dingo\Api\Http\FormRequest;

class UpdatePaymentCategoryRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required',
            'class' => '',
            'status' => 'integer|nullable',
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
