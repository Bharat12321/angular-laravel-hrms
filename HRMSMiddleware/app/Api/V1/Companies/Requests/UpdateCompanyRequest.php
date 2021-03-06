<?php

namespace App\Api\V1\Companies\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
{
    public function rules()
    {
        return [
          'name' => '', 
          'address' => '', 
          'discount' => '', 
          'status' => 'integer',
        ];
    }

    public function authorize()
    {
        return true;
    }
}
