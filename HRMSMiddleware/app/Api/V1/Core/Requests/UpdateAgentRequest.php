<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateAgentRequest extends FormRequest
{
    public function rules()
    {
        return [
            'code' => [
                'required',
                'unique:agents,code,' . $this->id,
                'max:255'
            ],
            'name' => 'required|max:255',
            'company_name' => 'max:255',
            'id_expiry_date' => 'date',
            'status' => 'integer',
            'remarks' => 'max:255',
            
        ];
    }

    public function authorize()
    {
        return true;
    }
}
