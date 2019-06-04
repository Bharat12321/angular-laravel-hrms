<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => [
                'required',
                'max:255'
            ]
        ];
    }

    public function authorize()
    {
        return true;
    }
}
