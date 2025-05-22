<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SuscriptionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'fecha' => \Carbon\Carbon::parse($this->fecha)->format('Y-m-d'),
            'rango1' => \Carbon\Carbon::parse($this->fecha)->format('Y-m-d'),
            'rango2' => \Carbon\Carbon::parse($this->fecha)->format('Y-m-d'),
            'total' => number_format($this->total, 2, '.', ''),
            'vigencia' => \Carbon\Carbon::parse($this->fecha)->format('Y-m-d'),
        ];
    }
}
