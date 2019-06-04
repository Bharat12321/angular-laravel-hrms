<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class CreateBankRequest extends FormRequest
{
    public function rules()
    {
        return [
            'code' => 'required|max:255|unique:banks',
            'name' => 'required|max:255',
            'status' =>'integer',
            
            
        ];
    }

    public function authorize()
    {
        return true;
    }
}
