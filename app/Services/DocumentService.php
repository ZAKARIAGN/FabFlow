<?php

namespace App\Services;

use App\Models\Document;

class DocumentService
{
    public function generateNumber(string $type): string
    {
        $prefix = match ($type) {
            'quote' => 'DEV',
            'delivery' => 'BL',
            'invoice' => 'FAC',
            default => 'DOC'
        };

        $year = now()->format('Y');

        $lastDocument = Document::where('type', $type)
            ->whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastDocument
            ? str_pad((int) substr($lastDocument->number, -4) + 1, 4, '0', STR_PAD_LEFT)
            : '0001';

        return "{$prefix}-{$year}-{$sequence}";
    }
}
