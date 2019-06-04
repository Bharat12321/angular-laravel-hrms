<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateBankRequest extends FormRequest
{
    public function rules()
    {
        return [
            'code' => [
                'required',
                'unique:banks,code,' . $this->id,
                'max:255'
            ],
            'name' => 'required|max:255',
            'status' =>'integer',
        ];
    }

    public function authorize()
    {
        return true;
    }
}
