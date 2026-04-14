<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('price_estimates', function (Blueprint $table) {
            $table->id();
            $table->string('status')->default('OK'); // OK | INSUFFICIENT_DATA | NO_MARKET_DATA
            $table->string('product_name')->nullable();
            $table->string('category')->nullable();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('variant')->nullable();
            $table->string('condition')->nullable(); // new | used
            $table->string('market_context')->nullable(); // souk | modern
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('currency_code')->default('MAD');
            $table->float('price_median')->nullable();
            $table->float('price_min')->nullable();
            $table->float('price_max')->nullable();
            $table->float('confidence_identification')->nullable();
            $table->float('confidence_price')->nullable();
            $table->integer('evidence_count')->default(0);
            $table->string('strategy')->nullable(); // marketplace | crowd | internal
            $table->text('missing_info')->nullable();
            $table->timestamps();
        });

        Schema::create('price_reports', function (Blueprint $table) {
            $table->id();
            $table->string('country');
            $table->string('city')->nullable();
            $table->string('category');
            $table->string('product_name');
            $table->float('price');
            $table->string('currency_code')->default('MAD');
            $table->string('condition')->nullable(); // new | used
            $table->string('market_context')->nullable(); // souk | modern
            $table->string('shop_name')->nullable();
            $table->ipAddress('reporter_ip')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_reports');
        Schema::dropIfExists('price_estimates');
    }
};
