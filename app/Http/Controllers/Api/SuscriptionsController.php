<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suscription;
use Illuminate\Http\Request;
use App\Models\Suscription as SuscriptionModel;

class SuscriptionsController extends Controller
{
    //obtener todas las suscripciones
    public function index(){
        $suscriptions = SuscriptionModel::all();
        return response()->json($suscriptions);
    }

    //creaer una suscripcion
    public function store(Request $request){

        $request->validate([
            'fecha' => 'required|date',
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'colonia' => 'required|string|max:255',
            'repartidor' => 'required|string|max:255',
            'ruta' => 'required|string|max:255',
            'cantidad' => 'required|integer',
            'producto' => 'required|string|max:255',
            'rango1' => 'required|date',
            'rango2' => 'required|date',
            'total' => 'required|numeric',
            'folio' => 'required|string|max:255',
            'vigencia' => 'required|date'
        ]);

        $suscription = SuscriptionModel::create($request->all());

        return response()->json([
            'message' => 'Suscripcion creada correctamente',
            'suscription' => $suscription
        ], 201);

    }

    //obtner una suscripcion por id

    public function show($id){
        $suscription = SuscriptionModel::find($id);

        if(!$suscription){
            return response()->json([
                'message' => 'Suscripcion no encontrada'
            ], 404);
        }

        return response()->json($suscription);
    }

    //eliminar una suscripcion por id
    public function destroy($id){
        $suscription = SuscriptionModel::find($id);

        if(!$suscription){
            return response()->json([
                'message' => 'Suscripcion no encontrada'
            ], 404);
        }

        $suscription->delete();

        return response()->json([
            'message' => 'Suscripcion eliminada correctamente'
        ]);
    }

    //actualizar una suscripcion por id
    public function update(Request $request, $id){
        $suscription = SuscriptionModel::find($id);

        if(!$suscription){
            return response()->json([
                'message' => 'Suscripcion no encontrada'
            ], 404);
        }

        $data = $request->validate([
            'fecha' => 'required|date',
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'colonia' => 'required|string|max:255',
            'repartidor' => 'required|string|max:255',
            'ruta' => 'required|string|max:255',
            'cantidad' => 'required|integer',
            'producto' => 'required|string|max:255',
            'rango1' => 'required|date',
            'rango2' => 'required|date',
            'total' => 'required|numeric',
            'folio' => 'required|string|max:255',
            'vigencia' => 'required|date'
        ]);

        $suscription->update($data);
        return response()->json([
            'message' => 'Suscripcion actualizada correctamente',
            'suscription' => $suscription
        ]);
    }

    public function updateAll(Request $request){

        $data = $request->validate([
            'fecha' => 'required|date',
            'rango1' => 'required|date',
            'rango2' => 'required|date',
            'vigencia' => 'required|date'
        ]);

       SuscriptionModel::query()->update($data);

       $suscripciones = SuscriptionModel::all();

       foreach ($suscripciones as $suscripcion) {
        // Extrae solo los números del folio actual, por ejemplo "folio:7781" => 7781
        $folioActual = intval(preg_replace('/\D/', '', $suscripcion->folio));

        // Suma 1 al folio
        $nuevoFolio = ($folioActual + 1);

        // Actualiza el folio
        $suscripcion->folio = $nuevoFolio;
        $suscripcion->save();
    }

        return response()->json([
            'message' => 'Suscripciones actualizadas correctamente'
        ]);

    }

}
