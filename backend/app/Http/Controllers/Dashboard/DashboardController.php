<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\ActivityLog;
use App\Support\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Construction-domain dashboard. Projects/Finance/Procurement/HR modules
 * don't exist yet (Phase 2), so those figures are honestly zeroed rather
 * than faked.
 */
class DashboardController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $companyId = Tenant::id();

        $totalBranches = Branch::where('company_id', $companyId)->count();

        $recentActivity = ActivityLog::with('user')
            ->where('company_id', $companyId)
            ->latest()
            ->limit(10)
            ->get(['id', 'user_id', 'action', 'module', 'description', 'created_at']);

        return response()->json([
            // Phase 2 modules — zeroed until Projects/Finance/Procurement/HR ship
            'active_projects'      => 0,
            'contract_value_total' => 0,
            'collected_month'      => 0,
            'outstanding_balance'  => 0,
            'total_employees'      => 0,
            'total_suppliers'      => 0,
            'total_equipment'      => 0,

            // Real, already-working platform data
            'total_branches'  => $totalBranches,
            'recent_activity' => $recentActivity,
        ]);
    }
}
