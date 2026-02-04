<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "company_name" => "required|string|max:255",
            "address" => "required|string|max:255",
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'
            ],
            'tel' => [
                'required',
                'regex:/^([0-9\s\-\+\(\)]*)$/',
                'min:10'
            ],
        ], [
            "company_name.required" => "Le nom de l'entreprise est obligatoire.",
            "company_name.string" => "Le nom de l'entreprise doit être une chaîne de caractères.",
            "company_name.max" => "Le nom de l'entreprise ne doit pas dépasser 255 caractères.",
            "address.required" => "L'adresse est obligatoire.",
            "address.string" => "L'adresse doit être une chaîne de caractères.",
            "address.max" => "L'adresse ne doit pas dépasser 255 caractères.",
            "email.required" => "L'adresse email est obligatoire.",
            "email.email" => "L'adresse email doit être valide.",
            "email.unique" => "Cet email est déjà utilisé.",
            "email.regex" => "Le format de l'email est invalide.",

            "tel.required" => "Le numéro de téléphone est obligatoire.",
            "tel.regex" => "Le format du numéro de téléphone est invalide.",
            "tel.min" => "Le numéro de téléphone doit contenir au moins 10 chiffres.",
        ]);


        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ], 422);
        }

        $random_number = mt_rand(10000000, 99999999);


        $client = Client::create([
            "company_name" => $request->company_name,
            "address" => $request->address,
            "vat_number" => $random_number,
            "email" => $request->email,
            "tel" => $request->tel
        ]);

        return response()->json([
            "status" => true,
            "message" => "Client créé avec succès",
            "client" => $client
        ], 201);
    }


    public function index()
    {
        $clients = Client::latest()->get();
        return response()->json([
            "status" => true,
            "clients" => $clients
        ], 200);
    }

    public function update(Request $request, $id)
    {

        $client = Client::find($id);

        if (!$client) {
            return response()->json([
                'status' => false,
                'message' => "Client introuvable"
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            "company_name" => "required|string|max:255",
            "address" => "required|string|max:255",
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:clients,email,' . $id,
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'
            ],
            'tel' => [
                'required',
                'regex:/^([0-9\s\-\+\(\)]*)$/',
                'min:10'
            ],
        ], [
            "company_name.required" => "Le nom de l'entreprise est obligatoire.",
            "company_name.string" => "Le nom de l'entreprise doit être une chaîne de caractères.",
            "company_name.max" => "Le nom de l'entreprise ne doit pas dépasser 255 caractères.",
            "address.required" => "L'adresse est obligatoire.",
            "address.string" => "L'adresse doit être une chaîne de caractères.",
            "address.max" => "L'adresse ne doit pas dépasser 255 caractères.",
            "email.unique" => "Cet email est déjà utilisé par un autre client.",
            "tel.regex" => "Le format du téléphone est invalide.",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ]);
        }


        $client->update([
            "company_name" => $request->company_name,
            "address" => $request->address,
            "email" => $request->email,
            "tel" => $request->tel,
        ]);

        return response()->json([
            'status' => true,
            'message' => "Le client a été mis à jour avec succès.",
            'client' => $client
        ], 200);
    }




    public function destroy($id)
    {
        $client = Client::find($id);
        if (!$client) {
            return response()->json([
                'status' => false,
                'message' => "Client introuvable"
            ], 404);
        }
        $client->delete();
        return response()->json([
            "status" => true,
            "message" => "Le client a été supprimé avec succès."
        ], 200);
    }



    public function search(Request $request){
        $query = $request->query('q');
        if (empty($query)) {
        return response()->json([
            "status" => false,
            "message" => "Veuillez saisir un terme de recherche"
        ], 400);
    }

        $clients = Client::where('company_name', 'LIKE', "%{$query}%")
                    ->orWhere('vat_number', 'LIKE', "%{$query}%")
                    ->get();


        return response()->json([
        "status" => true,
        "clients" => $clients
    ], 200);
    }

}
