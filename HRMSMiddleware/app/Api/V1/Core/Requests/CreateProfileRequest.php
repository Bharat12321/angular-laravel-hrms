<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class CreateProfileRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => '',
            'taggable_type' => 'required|max:255',
            'taggable_id' => 'required|max:255',
            'file' => 'required|image|mimes:jpg,png,jpeg,gif,svg|max:2048',
        ];
    }

    public function authorize()
    {
        return true;
    }
}
