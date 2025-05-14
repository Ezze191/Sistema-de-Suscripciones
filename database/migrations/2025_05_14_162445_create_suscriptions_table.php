<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('suscriptions', function (Blueprint $table) {
            $table->id();
            $table->dateTime('fecha');
            $table->string('nombre', 255);
            $table->string('direccion', 255);
            $table->string('colonia', 255);
            $table->string('repartidor', 255);
            $table->string('ruta', 255);
            $table->bigInteger('cantidad');
            $table->string('producto', 255);
            $table->dateTime('rango1');
            $table->dateTime('rango2');
            $table->double('total');
            $table->string('folio', 255);
            $table->dateTime('vigencia');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suscriptions');
    }
};
