<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Produit;
use App\Services\DocumentService;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class QuoteController extends Controller
{
    public function store(Request $request, DocumentService $documentService)
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'totale' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            "items.*.produit_id" => "required|exists:produits,id",
            "items.*.qtte" => function ($attribute, $value, $fail) use ($request) {
                $index = explode('.', $attribute)[1];
                $produit_id = $request->items[$index]['produit_id'] ?? null;

                if ($produit_id) {
                    $produit = Produit::find($produit_id);
                    if ($produit && $produit->type === 'fabriqué') {
                        if ($value === null || !is_int($value) || $value < 1) {
                            $fail("La quantité est obligatoire et doit être ≥ 1 pour le produit fabriqué {$produit->label}.");
                        }
                    }
                }
            },
            "items.*.tax_rate" => "required|integer|min:0|max:100"
        ], [
            'totale.required' => 'Le champ totale est obligatoire.',
            'totale.numeric' => 'Le champ totale doit être un nombre.',
            'totale.min' => 'Le champ totale doit être supérieur ou égal à 0.',
            'client_id.required' => 'Le client est obligatoire.',
            'client_id.exists' => 'Le client sélectionné n\'existe pas.',
            'items.required' => 'Vous devez ajouter au moins un article.',
            'items.array' => 'Les articles doivent être un tableau.',
            'items.min' => 'Vous devez ajouter au moins un article.',
            'items.*.produit_id.required' => 'Chaque article doit avoir un produit sélectionné.',
            'items.*.produit_id.exists' => 'Le produit sélectionné \'existe pas.',
            'items.*.qtte.required' => 'La quantité de chaque article est obligatoire.',
            'items.*.qtte.integer' => 'La quantité doit être un nombre entier.',
            'items.*.qtte.min' => 'La quantité doit être au moins 1.',
            'items.*.tax_rate.required' => 'Le taux de taxe est obligatoire pour chaque article.',
            'items.*.tax_rate.integer' => 'Le taux de taxe doit être un nombre entier.',
            'items.*.tax_rate.min' => 'Le taux de taxe ne peut pas être négatif.',
            'items.*.tax_rate.max' => 'Le taux de TVA ne peut pas dépasser 100%.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request, $documentService) {
                // Générer le numéro et l'ID partagé
                $numberData = $documentService->generateNumber("quote");

                $quote = Document::create([
                    'type' => "quote",
                    'number' => $numberData['number'],
                    'shared_id' => $numberData['shared_id'],
                    'status' => 'validé',
                    'client_id' => $request->client_id,
                    'totale' => $request->totale,
                    'parent_id' => null
                ]);

                foreach ($request->items as $itemData) {
                    $produit = Produit::findOrFail($itemData['produit_id']);

                    $qtteToInsert = $produit->type === "fabriqué" ? $itemData["qtte"] : 1;

                    $quote->items()->create([
                        'produit_id' => $produit->id,
                        'qtte' => $qtteToInsert,
                        'unit_price' => $produit->prix,
                        'tax_rate' => $itemData['tax_rate'],
                    ]);
                }

                $user = auth()->user();

                if ($user->role && $user->role->roleName === "admin") {
                    $redirect = "/admin/documents";
                } else if ($user->role && $user->role->roleName === "commercial") {
                    $redirect = "/commercial/devis";
                }

                return response()->json(['status' => true, 'document' => $quote->load('client', 'items.produit'), 'redirect_to' => $redirect], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $quote = Document::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'totale' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            "items.*.produit_id" => "required|exists:produits,id",
            "items.*.qtte" => function ($attribute, $value, $fail) use ($request) {
                $index = explode('.', $attribute)[1];
                $produit_id = $request->items[$index]['produit_id'] ?? null;

                if ($produit_id) {
                    $produit = Produit::find($produit_id);
                    if ($produit && $produit->type === 'fabriqué') {
                        if ($value === null || !is_int($value) || $value < 1) {
                            $fail("La quantité est obligatoire et doit être ≥ 1 pour le produit fabriqué {$produit->label}.");
                        }
                    }
                }
            },
            "items.*.tax_rate" => "required|integer|min:0"
        ], [
            'totale.required' => 'Le champ totale est obligatoire.',
            'totale.numeric' => 'Le champ totale doit être un nombre.',
            'totale.min' => 'Le champ totale doit être supérieur ou égal à 0.',
            'client_id.required' => 'Le client est obligatoire.',
            'client_id.exists' => 'Le client sélectionné n\'existe pas.',
            'items.required' => 'Vous devez ajouter au moins un article.',
            'items.array' => 'Les articles doivent être un tableau.',
            'items.min' => 'Vous devez ajouter au moins un article.',
            'items.*.produit_id.required' => 'Chaque article doit avoir un produit sélectionné.',
            'items.*.produit_id.exists' => 'Le produit sélectionné n\'existe pas.',
            'items.*.qtte.required' => 'La quantité de chaque article est obligatoire.',
            'items.*.qtte.integer' => 'La quantité doit être un nombre entier.',
            'items.*.qtte.min' => 'La quantité doit être au moins 1.',
            'items.*.tax_rate.required' => 'Le taux de taxe est obligatoire pour chaque article.',
            'items.*.tax_rate.integer' => 'Le taux de taxe doit être un nombre entier.',
            'items.*.tax_rate.min' => 'Le taux de taxe ne peut pas être négatif.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request, $quote) {

                $quote->update([
                    "client_id" => $request->client_id,
                    'totale' => $request->totale,
                ]);

                $quote->items()->delete();

                foreach ($request->items as $itemData) {
                    $produit = Produit::findOrFail($itemData['produit_id']);
                    $qtteToInsert = $produit->type === "fabriqué" ? $itemData["qtte"] : 1;

                    $quote->items()->create([
                        'produit_id' => $produit->id,
                        'qtte' => $qtteToInsert,
                        'unit_price' => $produit->prix,
                        'tax_rate' => $itemData['tax_rate'],
                    ]);
                }

                $user = auth()->user();

                if ($user->role && $user->role->roleName === "admin") {
                    $redirect = "/admin/documents";
                } else if ($user->role && $user->role->roleName === "commercial") {
                    $redirect = "/commercial/devis";
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Document mis à jour avec succès',
                    'document' => $quote->load(['client', 'items.produit']),
                    'redirect_to' => $redirect
                ], 200);
            });

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Erreur technique: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $quote = Document::findOrFail($id);

        $request->validate([
            'status' => ['required', Rule::in(['validé', 'annulé'])]
        ]);

        $quote->update([
            "status" => $request->status
        ]);

        return response()->json([
            "status" => true,
            'message' => 'Statut mis à jour vers ' . $request->status,
        ]);
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
        $quotes = Document::where('number', 'LIKE', "%{$query}%")
            ->orWhere('shared_id', 'LIKE', "%{$query}%")
            ->where("type", "quote")
            ->get();
        return response()->json([
            "status" => true,
            "quotes" => $quotes->load(['client', 'items.produit'])
        ], 200);
    }

    public function searchValidatedQuotes(Request $request)
    {
        $query = trim($request->query('q'));
        if (empty($query)) {
            return response()->json([
                "status" => false,
                "message" => "Veuillez saisir un terme de recherche"
            ], 400);
        }
        $quotes = Document::where(function ($q) use ($query) {
            $q->where('number', 'LIKE', "%{$query}%")
                ->orWhere('shared_id', 'LIKE', "%{$query}%");
        })
            ->where("type", "quote")
            ->where("status", "validé")
            ->get();
        return response()->json([
            "status" => true,
            "quotes" => $quotes->load(["client", "items.produit"])
        ], 200);
    }

    public function getAllQuotes()
    {
        $quotes = Document::where("type", "quote")->with(['client', "items.produit"])->get();
        return response()->json([
            'status' => true,
            "quotes" => $quotes
        ]);
    }

    public function getvalidateQuotes()
    {
        $quotes = Document::where("type", "quote")->where("status", "validé")->with(['client', 'items.produit'])->get();
        return response()->json([
            'status' => true,
            "quotes" => $quotes
        ]);
    }

    public function index()
    {
        $documents = Document::with(['client', 'items.produit'])->get();
        return response()->json([
            'status' => true,
            "documents" => $documents
        ]);
    }

    public function show($id)
    {
        $document = Document::find($id);

        if (!$document) {
            return response()->json([
                'status' => false,
                'message' => "Produit introuvable"
            ], 404);
        }

        return response()->json([
            'status' => true,
            'document' => $document->load(['client', 'items.produit'])
        ], 200);
    }

    public function searchDocument(Request $request)
    {
        $query = trim($request->query('q'));
        if (empty($query)) {
            return response()->json([
                "status" => false,
                "message" => "Veuillez saisir un terme de recherche"
            ], 400);
        }
        $quotes = Document::where('number', 'LIKE', "%{$query}%")
            ->orWhere('shared_id', 'LIKE', "%{$query}%")
            ->get();
        return response()->json([
            "status" => true,
            "documents" => $quotes->load(['client', 'items.produit'])
        ], 200);
    }
}