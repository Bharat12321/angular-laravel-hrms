<?php

namespace App\Api\V1\Companies\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateCompanyLoginRequest extends FormRequest
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
