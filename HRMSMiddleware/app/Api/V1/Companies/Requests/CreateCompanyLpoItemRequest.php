<?php

namespace App\Api\V1\Companies\Requests;

use Dingo\Api\Http\FormRequest;

class CreateCompanyLpoItemRequest extends FormRequest
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
