<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Produit;
use App\Services\DocumentService;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class DeliveryController extends Controller
{
    public function store(Request $request, DocumentService $documentService, $quoteID)
    {
        $validator = Validator::make($request->all(), [
            'totale' => 'required|numeric|min:0',
            'items' => 'required|array',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.qtte' => function ($attribute, $value, $fail) use ($request) {
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
        ], [
            'totale.required' => 'Le champ totale est obligatoire.',
            'totale.numeric' => 'Le champ totale doit être un nombre.',
            'totale.min' => 'Le champ totale doit être supérieur ou égal à 0.',
            'items.required' => 'Vous devez ajouter au moins un article',
            'items.array' => 'Les articles doivent être un tableau',
            'items.*.produit_id.required' => 'Chaque article doit avoir un produit',
            'items.*.produit_id.exists' => 'Le produit sélectionné n’existe pas',
            'items.*.qtte.required' => 'La quantité est obligatoire',
            'items.*.qtte.integer' => 'La quantité doit être un nombre entier',
            'items.*.qtte.min' => 'La quantité doit être au moins 1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ]);
        }

        try {
            return DB::transaction(function () use ($request, $documentService, $quoteID) {
                $quote = Document::with('items')->findOrFail($quoteID);

                if ($quote->status !== "validé") {
                    throw new \Exception("cette devis n'est pad validé");
                };

                $delivery = Document::create([
                    'type' => 'delivery',
                    'number' => $documentService->generateNumber("delivery"),
                    'status' => 'livré',
                    'totale' => $request->totale,
                    'client_id' => $quote->client_id,
                    'parent_id' => $quote->id
                ]);


                foreach ($request->items as $itemData) {
                    $produit = Produit::findOrFail($itemData['produit_id']);

                    $quoteItem = $quote->items->firstWhere('produit_id', $itemData['produit_id']);

                    if (!$quoteItem) {
                        throw new \Exception("Le produit {$produit->label} n'existe pas dans le devis d'origine.");
                    }

                    $qtteToInsert = 1;

                    if ($produit->type === "fabriqué") {
                        $userQtte = $itemData['qtte'] ?? 1;

                        if ($userQtte < 1) {
                            throw new \Exception("La quantité est obligatoire pour le produit fabriqué {$produit->label}.");
                        }

                        if ($userQtte > $quoteItem->qtte) {
                            throw new \Exception("Quantité non autorisée pour {$produit->label}. Le maximum est: {$quoteItem->qtte}");
                        }

                        if ($produit->stock < $userQtte) {
                            throw new \Exception("Stock insuffisant pour {$produit->label} (Disponible: {$produit->stock})");
                        }

                        $qtteToInsert = $userQtte;
                        if ($delivery->status === 'livré') {
                            $produit->decrement('stock', $userQtte);
                            $quoteItem->decrement('qtte', $userQtte);
                        } elseif ($delivery->status === 'annulé') {
                            $produit->increment('stock', $userQtte);
                            $quoteItem->increment('qtte', $userQtte);

                        }
                    }

                    $delivery->items()->create([
                        'produit_id' => $produit->id,
                        'qtte' => $qtteToInsert,
                        'unit_price' => $quoteItem->unit_price,
                        'tax_rate' => $quoteItem->tax_rate,
                    ]);
                }
                return response()->json([
                    'status' => true,
                    'message' => 'BL créé avec succès',
                    'delivery' => $delivery->load("client", "items.produit")
                ]);
            });

        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 400);
        }


    }


    public function updateStatus(Request $request, $id)
    {
        $delivery = Document::with('items.produit', 'parent.items')->findOrFail($id);
        $request->validate([
            'status' => ['required', Rule::in(['livré', 'annulé'])]
        ]);

        $oldStatus = $delivery->status;
        $newStatus = $request->status;

        if ($oldStatus === $newStatus) {
            return response()->json([
                "status" => true,
                'message' => 'Le statut est déjà ' . $newStatus
            ]);
        }

        DB::transaction(function () use ($delivery, $newStatus, $oldStatus) {
            foreach ($delivery->items as $item) {
                $produit = $item->produit;
                $quoteItem = $delivery->parent->items->firstWhere('produit_id', $produit->id);

                if ($produit->type === 'fabriqué') {
                    if ($oldStatus === 'livré' && $newStatus === 'annulé') {
                        $produit->increment('stock', $item->qtte);
                        $quoteItem->increment('qtte', $item->qtte);
                    } elseif ($oldStatus === 'annulé' && $newStatus === 'livré') {
                        if ($produit->stock < $item->qtte) {
                            throw new \Exception("Stock insuffisant pour {$produit->label}");
                        }
                        $produit->decrement('stock', $item->qtte);
                        $quoteItem->decrement('qtte', $item->qtte);
                    }
                }
            }

            // Update status
            $delivery->update(['status' => $newStatus]);
        });

        return response()->json([
            "status" => true,
            'message' => 'Statut mis à jour vers ' . $newStatus
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
        $deliveries = Document::where('number', 'LIKE', "%{$query}%")
            ->where("type", "delivery")
            ->get();
        return response()->json([
            "status" => true,
            "deliveries" => $deliveries->load(["client", "items.produit"])
        ], 200);
    }



    public function searchValidateDeliveries(Request $request)
    {
        $query = trim($request->query('q'));
        if (empty($query)) {
            return response()->json([
                "status" => false,
                "message" => "Veuillez saisir un terme de recherche"
            ], 400);
        }
        $deliveries = Document::where('number', 'LIKE', "%{$query}%")
            ->where("type", "delivery")
            ->where("status", "livré")
            ->get();
        return response()->json([
            "status" => true,
            "deliveries" => $deliveries->load(["client", "items.produit"])
        ], 200);
    }


    public function getAllDeliveries()
    {
        $deliveries = Document::where("type", "delivery")->with(['client', "items.produit"])->get();
        return response()->json([
            'status' => true,
            "deliveries" => $deliveries
        ]);
    }

    public function getValidateLiveries()
    {
        $deliveries = Document::where("type", "delivery")->with(['client', "items.produit"])->where("status", "livré")->get();
        return response()->json([
            'status' => true,
            "deliveries" => $deliveries
        ]);
    }

}
