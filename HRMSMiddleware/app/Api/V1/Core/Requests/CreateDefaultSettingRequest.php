<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class CreateDefaultSettingRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|max:255',
            'value' => 'required|max:255',
            'editable' => 'integer',
            'visible' => 'integer',
            'status' => 'integer',
        ];
    }

    public function authorize()
    {
        return true;
    }
}
