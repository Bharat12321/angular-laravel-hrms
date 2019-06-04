<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function rules()
    {
        return [
            'old_password' => 'required|max:255',
            'new_password' => 'required|max:255|confirmed',
        ];
    }

    public function authorize()
    {
        return true;
    }
}
