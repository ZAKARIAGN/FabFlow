<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProduitController extends Controller
{


    public function index()
    {
        $produits = Produit::latest()->get();
        return response()->json([
            "status" => true,
            "produits" => $produits
        ], 200);
    }
    public function store(Request $request)
    {

        if ($request->type !== 'fabriqué') {
            $request->merge(['stock' => 0]);
        }



        $validator = Validator::make($request->all(), [
            "label" => "required|string|max:255",
            "type" => "required|in:fabriqué,opération,service",
            "prix" => "required|numeric|min:0",
            "unite" => "required|string|max:255",
            "stock" => [
                "required",
                "numeric",
                $request->type === 'fabriqué' ? "min:0" : "in:0"
            ],
        ], [
            "label.required" => "Le libellé est obligatoire.",
            "label.string" => "Le libellé doit être une chaîne de caractères.",
            "label.max" => "Le libellé ne doit pas dépasser 255 caractères.",
            "type.required" => "Le type est obligatoire.",
            "type.in" => "Le type choisi est invalide. Les options sont: fabriqué, opération ou service.",
            "prix.required" => "Le prix est obligatoire.",
            "prix.numeric" => "Le prix doit être un nombre valide (ex: 100 ou 99.99).",
            "prix.min" => "Le prix ne peut pas être inférieur à 0.",
            "unite.required" => "L'unité de mesure est obligatoire.",
            "unite.string" => "L'unité doit être une chaîne de caractères.",
            "unite.max" => "L'unité ne doit pas dépasser 255 caractères.",
            "stock.required" => "Le stock est obligatoire.",
            "stock.numeric" => "Le stock doit être un nombre valide",
            "stock.in" => "Le stock doit être 0 pour les services ou opérations.",
            "stock.min" => "Le stock ne peut pas être inférieur à 0.",
        ]);


        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ],422);
        }




        $produit = Produit::create([
            "label" => $request->label,
            "type" => $request->type,
            "prix" => $request->prix,
            "unite" => $request->unite,
            "stock" => $request->type === "fabriqué" ? $request->stock : 0
        ]);

        $user = auth()->user();

        if ($user->role && $user->role->roleName === "admin") {
            $redirect = "/admin/produits";
        } else if ($user->role && $user->role->roleName === "commercial") {
            $redirect = "/commercial/produits";
        }

        return response()->json([
            "status" => true,
            "message" => "Produit créé avec succès",
            "redirect_to" => $redirect,
            "produit" => $produit
        ]);
    }

    public function update(Request $request, $id)
    {
        $produit = Produit::find($id);

        if (!$produit) {
            return response()->json([
                'status' => false,
                'message' => "produit introuvable"
            ], 404);
        }

        if ($request->type !== 'fabriqué') {
            $request->merge(['stock' => 0]);
        }

        $validator = Validator::make($request->all(), [
            "label" => "required|string|max:255",
            "type" => "required|in:fabriqué,opération,service",
            "prix" => "required|numeric|min:0",
            "unite" => "required|string|max:255",
            "stock" => [
                "required",
                "numeric",
                $request->type === 'fabriqué' ? "min:0" : "in:0"
            ],
        ], [
            "label.required" => "Le libellé est obligatoire.",
            "label.string" => "Le libellé doit être une chaîne de caractères.",
            "label.max" => "Le libellé ne doit pas dépasser 255 caractères.",
            "type.required" => "Le type est obligatoire.",
            "type.in" => "Le type choisi est invalide. Les options sont: fabriqué, opération ou service.",
            "prix.required" => "Le prix est obligatoire.",
            "prix.numeric" => "Le prix doit être un nombre valide (ex: 100 ou 99.99).",
            "prix.min" => "Le prix ne peut pas être inférieur à 0.",
            "unite.required" => "L'unité de mesure est obligatoire.",
            "unite.string" => "L'unité doit être une chaîne de caractères.",
            "unite.max" => "L'unité ne doit pas dépasser 255 caractères.",
            "stock.required" => "Le stock est obligatoire.",
            "stock.numeric" => "Le stock doit être un nombre valide",
            "stock.min" => "Le stock ne peut pas être inférieur à 0.",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ],422);
        }


        $produit->update([
            "label" => $request->label,
            "type" => $request->type,
            "prix" => $request->prix,
            "unite" => $request->unite,
            "stock" => $request->type === 'fabriqué' ? $request->stock : 0,
        ]);


        $user = auth()->user();

        if ($user->role && $user->role->roleName === "admin") {
            $redirect = "/admin/produits";
        } else if ($user->role && $user->role->roleName === "commercial") {
            $redirect = "/commercial/produits";
        }


        return response()->json([
            "status" => true,
            "redirect_to" => $redirect,
            'message' => "Le produit a été mis à jour avec succès.",
            "produit" => $produit
        ]);

    }


    public function destroy($id)
    {
        $produit = Produit::find($id);
        if (!$produit) {
            return response()->json([
                'status' => false,
                'message' => "Produit introuvable"
            ], 404);
        }
        $produit->delete();
        return response()->json([
            "status" => true,
            "message" => "Le produit a été supprimé avec succès."
        ], 200);
    }


    public function search(Request $request)
    {
        $query = trim($request->query('q'));
        if (empty($query)) {
            return response()->json([
                "status" => false,
                "message" => "Veuillez saisir un terme de recherche"
            ], 400);
        }
        $produits = Produit::where('label', 'LIKE', "%{$query}%")
            ->get();
        return response()->json([
            "status" => true,
            "produits" => $produits
        ], 200);
    }


    public function show($id)
    {
        $produit = Produit::find($id);

        if (!$produit) {
            return response()->json([
                'status' => false,
                'message' => "Produit introuvable"
            ], 404);
        }

        return response()->json([
            'status' => true,
            'produit' => $produit
        ], 200);
    }


}
