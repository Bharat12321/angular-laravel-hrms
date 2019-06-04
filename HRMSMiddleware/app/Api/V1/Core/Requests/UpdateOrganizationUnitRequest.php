<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateOrganizationUnitRequest extends FormRequest
{
    public function rules()
    {
        return [
            'code' => [
                'required',
                'unique:organization_units,code,' . $this->id,
                'max:255'
            ],
            'name' => 'required|max:255',
            'company_name' => 'max:255',
            'country_id' => 'integer',
            'city' => 'max:255',
            'address' => 'max:255',
            'pin_code' => 'max:255',
            'status' => 'integer',
            'remarks' => 'max:255',
            
        ];
    }

    public function authorize()
    {
        return true;
    }
}
