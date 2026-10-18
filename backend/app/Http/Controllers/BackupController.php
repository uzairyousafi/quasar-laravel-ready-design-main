<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

/**
 * Backup is a stub in this scaffold — it acknowledges the request so the
 * frontend BackupPage works end-to-end. Real export/backup logic ships
 * alongside the Phase 2 business modules.
 */
class BackupController extends Controller
{
    public function download(): JsonResponse
    {
        return response()->json(['message' => 'Backup requested successfully.']);
    }
}
