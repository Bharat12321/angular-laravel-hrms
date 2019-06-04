<?php

namespace App\Api\V1\Accounts\Requests;

use Dingo\Api\Http\FormRequest;

class CreateLedgerRequest extends FormRequest
{
    public function rules()
    {   
        return [
            'name' => 'required|max:255',
            'remarks' => 'nullable|max:255',
            'address' => 'nullable|max:255',
            'status' => 'integer|nullable',
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
