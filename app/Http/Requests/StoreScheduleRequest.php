<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'availability' => 'required|array',
            'availability.*.enabled' => 'boolean',
            'availability.*.startTime' => 'required_if:availability.*.enabled,true|date_format:H:i',
            'availability.*.endTime' => 'required_if:availability.*.enabled,true|date_format:H:i|after:availability.*.startTime',
            'lunch_break' => 'nullable|array',
            'lunch_break.start' => 'required_with:lunch_break|date_format:H:i',
            'lunch_break.end' => 'required_with:lunch_break|date_format:H:i|after:lunch_break.start',
        ];
    }
}
