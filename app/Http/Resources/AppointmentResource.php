<?php

namespace App\Http\Resources;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
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
            'client' => $this->metadata['client'] ?? null,
            'services' => $this->metadata['services'] ?? null,
            'price' => $this->when(isset($this->metadata['price']), $this->metadata['price']),
            'status' => $this->when(isset($this->metadata['status']), $this->metadata['status']),
            'date' => $this->start_date,
            'periods' => $this->periods->first() ? [
                'start_time' => $this->periods->first()->start_time,
                'end_time' => $this->periods->first()->end_time,
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
            ];
    }
}
