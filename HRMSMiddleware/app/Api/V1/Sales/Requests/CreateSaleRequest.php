<?php

namespace App\Api\V1\Sales\Requests;

use Dingo\Api\Http\FormRequest;

class CreateSaleRequest extends FormRequest
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
