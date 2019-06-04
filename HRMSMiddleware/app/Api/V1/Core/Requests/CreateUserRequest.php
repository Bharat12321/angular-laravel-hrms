<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'username' => 'required|max:255|unique:users',
            'name' => 'required|max:255',
            'password' => 'required|max:255',
            'role_id' => 'required',
        ];
    }

    public function authorize()
    {
        return true;
    }
}
