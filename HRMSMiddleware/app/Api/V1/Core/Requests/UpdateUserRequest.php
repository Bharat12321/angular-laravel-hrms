<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'username' => [
                'required',
                'unique:users,username,' . $this->id,
                'max:255'
            ],
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
