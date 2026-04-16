<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tourist_profiles', function (Blueprint $table): void {
            $table->string('phone', 30)->nullable()->after('passport_country');
        });
    }

    public function down(): void
    {
        Schema::table('tourist_profiles', function (Blueprint $table): void {
            $table->dropColumn('phone');
        });
    }
};
