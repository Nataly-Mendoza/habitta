<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    public function run(): void
    {
        $inquirer = User::where('email', 'user@habitta.mx')->first();
        $properties = Property::with('owner')->active()->take(3)->get();

        foreach ($properties as $property) {
            if ($property->user_id === $inquirer->id) {
                continue;
            }

            $conv = Conversation::firstOrCreate(
                ['property_id' => $property->id, 'inquirer_id' => $inquirer->id],
                ['owner_id' => $property->user_id]
            );

            $messages = [
                ['sender_id' => $inquirer->id,        'content' => "Hola, me interesa el inmueble \"{$property->title}\". ¿Sigue disponible?"],
                ['sender_id' => $property->user_id,   'content' => '¡Claro que sí! Está disponible. ¿Te gustaría agendar una visita para verlo en persona?'],
                ['sender_id' => $inquirer->id,        'content' => 'Sí, me encantaría. ¿Cuándo sería posible visitarlo?'],
                ['sender_id' => $property->user_id,   'content' => 'Podemos coordinar para este fin de semana, ya sea sábado o domingo. ¿Cuál te queda mejor?'],
            ];

            foreach ($messages as $msg) {
                $conv->messages()->create($msg);
            }
        }
    }
}
