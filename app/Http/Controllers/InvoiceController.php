<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Services\DocumentService;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InvoiceController extends Controller
{
    public function generateInvoiceFromBL($blId, DocumentService $documentService)
    {
        try {
            return DB::transaction(function () use ($blId, $documentService) {
                $bl = Document::with('items.produit', 'client')->findOrFail($blId);

                if ($bl->type !== 'delivery') {
                    throw new \Exception("Ce document n'est pas un bon de livraison");
                }

                if ($bl->status !== 'livré') {
                    throw new \Exception("Le bon de livraison doit être livré pour générer une facture");
                }

                // Générer le numéro avec le même shared_id que le BL
                $numberData = $documentService->generateNumberFromParent("invoice", $bl);

                $invoice = Document::create([
                    'type' => 'invoice',
                    'number' => $numberData['number'],
                    'shared_id' => $numberData['shared_id'],
                    'status' => 'en_attente',
                    'client_id' => $bl->client_id,
                    'totale' => $bl->totale,
                    'parent_id' => $bl->id,
                ]);

                foreach ($bl->items as $blItem) {
                    $invoice->items()->create([
                        'produit_id' => $blItem->produit_id,
                        'qtte' => $blItem->qtte,
                        'unit_price' => $blItem->unit_price,
                        'tax_rate' => $blItem->tax_rate,
                    ]);
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Facture créée avec succès à partir du BL',
                    'invoice' => $invoice->load('client', 'items.produit')
                ]);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function updateInvoiceStatus(Request $request, $invoiceID)
    {
        $invoice = Document::where('type', 'invoice')->findOrFail($invoiceID);

        $request->validate([
            'status' => ['required', Rule::in(['payée', 'en_attente'])]
        ]);
        
        $invoice->update([
            'status' => $request->status
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Statut de la facture mis à jour vers ' . $request->status,
            'invoice' => $invoice
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
        $invoices = Document::where(function ($q) use ($query) {
            $q->where('number', 'LIKE', "%{$query}%")
                ->orWhere('shared_id', 'LIKE', "%{$query}%");
        })
            ->where("type", "invoice")
            ->get();
        return response()->json([
            "status" => true,
            "invoices" => $invoices->load(["client", "items.produit"])
        ], 200);
    }

    public function getAllInvoices()
    {
        $invoices = Document::where("type", "invoice")->with(['client', "items.produit"])->get();
        return response()->json([
            'status' => true,
            "invoices" => $invoices
        ]);
    }

    public function getTotalPaidInvoices()
    {
        $total = Document::where('type', 'invoice')
            ->where('status', 'payée')
            ->sum('totale');

        return response()->json([
            'status' => true,
            'total_paid_invoices' => $total
        ]);
    }

    /**
     * Récupérer tous les documents liés par shared_id
     */
    public function getRelatedDocuments($sharedId)
    {
        $documents = Document::where('shared_id', $sharedId)
            ->with(['client', 'items.produit'])
            ->orderBy('created_at', 'asc')
            ->get();

        if ($documents->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Aucun document trouvé avec cet identifiant'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'shared_id' => $sharedId,
            'documents' => $documents
        ]);
    }
}