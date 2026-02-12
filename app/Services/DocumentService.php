<?php

namespace App\Services;

use App\Models\Document;
use Illuminate\Support\Str;

class DocumentService
{
    /**
     * Générer un numéro de document avec un identifiant unique partagé
     * 
     * @param string $type Type de document (quote, delivery, invoice)
     * @param string|null $sharedId Identifiant partagé (si null, un nouveau sera généré)
     * @return array ['number' => 'DEV-123ABC', 'shared_id' => '123ABC']
     */
    public function generateNumber($type, $sharedId = null)
    {
        // Générer un nouvel identifiant unique si non fourni
        if ($sharedId === null) {
            $sharedId = strtoupper(Str::random(6));
            
            // Vérifier l'unicité de l'identifiant
            while (Document::where('shared_id', $sharedId)->exists()) {
                $sharedId = strtoupper(Str::random(6));
            }
        }

        // Définir les préfixes selon le type
        $prefixes = [
            'quote' => 'DEV',
            'delivery' => 'BL',
            'invoice' => 'FAC',
        ];

        $prefix = $prefixes[$type] ?? 'DOC';
        
        return [
            'number' => "{$prefix}-{$sharedId}",
            'shared_id' => $sharedId
        ];
    }

    /**
     * Générer un numéro de document à partir d'un document parent
     * Supporte plusieurs BL et factures avec des suffixes uniques
     * 
     * @param string $type Type du nouveau document
     * @param Document $parentDocument Document parent
     * @return array ['number' => 'BL-123ABC-01', 'shared_id' => '123ABC']
     */
    public function generateNumberFromParent($type, Document $parentDocument)
    {
        // Utiliser le shared_id du parent
        $sharedId = $parentDocument->shared_id;
        
        // Si le parent n'a pas de shared_id (anciens documents), en créer un
        if (!$sharedId) {
            // Extraire l'ID depuis l'ancien format si possible
            $parts = explode('-', $parentDocument->number);
            if (count($parts) >= 2) {
                $sharedId = $parts[1];
            } else {
                $sharedId = strtoupper(Str::random(6));
            }
            
            // Mettre à jour le parent avec le shared_id
            $parentDocument->update(['shared_id' => $sharedId]);
        }
        
        // Définir les préfixes selon le type
        $prefixes = [
            'quote' => 'DEV',
            'delivery' => 'BL',
            'invoice' => 'FAC',
        ];

        $prefix = $prefixes[$type] ?? 'DOC';
        
        // Compter combien de documents de ce type existent déjà avec ce shared_id
        $count = Document::where('shared_id', $sharedId)
            ->where('type', $type)
            ->count();
        
        // Incrémenter pour le nouveau document
        $suffix = str_pad($count + 1, 2, '0', STR_PAD_LEFT);
        
        return [
            'number' => "{$prefix}-{$sharedId}-{$suffix}",
            'shared_id' => $sharedId
        ];
    }
}