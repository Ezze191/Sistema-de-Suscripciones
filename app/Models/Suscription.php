<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suscription extends Model
{
    use HasFactory;

    protected $table = 'suscriptions';

    protected $fillable = [
        'fecha',
        'nombre',
        'direccion',
        'colonia',
        'repartidor',
        'ruta',
        'cantidad',
        'producto',
        'rango1',
        'rango2',
        'total',
        'folio',
        'vigencia',
    ];
}
