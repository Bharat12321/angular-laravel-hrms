<?php

namespace App\Api\V1\Core\Requests;

use Dingo\Api\Http\FormRequest;

class UpdatePromotionRequest extends FormRequest
{
    public function rules()
    {
        return [
            
            
        ];
    }

    public function authorize()
    {
        return true;
    }
}
