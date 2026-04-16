<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_event_participants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('community_event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('joined_at')->useCurrent();

            $table->unique(['community_event_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_event_participants');
    }
};
