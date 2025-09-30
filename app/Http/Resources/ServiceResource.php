<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
          return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => number_format($this->price, 2),
            'duration' => $this->duration,
            'employees' => $this->when($this->relationLoaded('employees'),
                $this->employees->map(function ($employee) {
                    return [
                        'id' => $employee->id,
                        'name' => $employee->user->name ?? null,
                        'phone' => $employee->phone ?? null,
                        'avatar' => $employee->avatar ?? null,
                        'specialties' => $employee->specialties ?? null,
                        'user' => $this->when($employee->relationLoaded('user'), [
                            'id' => $employee->user->id,
                            'name' => $employee->user->name,
                            'email' => $employee->user->email,
                        ]),
                    ];
                })
            ),
        ];
    }
}
