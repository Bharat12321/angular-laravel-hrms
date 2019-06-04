<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class UpdateBatchRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|max:255',
            'status' => 'integer|nullable',
        ];
    }

    public function authorize()
    {
        return true;
    }
}

?>
