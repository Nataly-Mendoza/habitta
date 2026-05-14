<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CambiarContraseñaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contraseña_actual' => 'required|string|min:8',
            'contraseña_nueva' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'contraseña_nueva.confirmed' => 'Las nuevas contraseñas no coinciden',
        ];
    }
}
