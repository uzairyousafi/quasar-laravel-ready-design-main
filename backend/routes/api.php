<?php

use App\Http\Controllers\Admin\SuperAdminController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\Branch\BranchController;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Role\RoleController;
use App\Http\Controllers\TrashController;
use App\Http\Controllers\User\UserController;
use App\Models\ActivityLog;
use App\Support\Tenant;
use Illuminate\Support\Facades\Route;

// Public auth
Route::post('login', [AuthController::class, 'login']);
Route::get('auth', [AuthController::class, 'check']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('admin')->middleware(['super_admin'])->group(function () {
        Route::get('companies', [SuperAdminController::class, 'companies']);
        Route::get('companies/{company}/stats', [SuperAdminController::class, 'companyStats']);
        Route::get('users', [SuperAdminController::class, 'users']);
        Route::put('users/{user}/toggle-super-admin', [SuperAdminController::class, 'toggleSuperAdmin']);
        Route::delete('companies/{company}', [SuperAdminController::class, 'destroyCompany']);
    });

    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);

    // Company management (master scope, no tenant required)
    Route::get('company', [CompanyController::class, 'index']);
    Route::post('company/store', [CompanyController::class, 'store']);
    Route::get('company/select/{company}', [CompanyController::class, 'select']);
    Route::get('company/{company}', [CompanyController::class, 'show']);
    Route::put('company/{company}', [CompanyController::class, 'update']);
    Route::delete('company/{company}', [CompanyController::class, 'destroy']);

    // Tenant-scoped routes
    Route::middleware('tenant')->group(function () {
        Route::get('dashboard_data', [DashboardController::class, 'dashboard']);

        Route::apiResource('users', UserController::class);

        Route::get('roles', [RoleController::class, 'index']);
        Route::get('permissions', [RoleController::class, 'permissions']);
        Route::post('roles', [RoleController::class, 'store']);
        Route::put('roles/{role}', [RoleController::class, 'update']);
        Route::delete('roles/{role}', [RoleController::class, 'destroy']);

        Route::apiResource('branches', BranchController::class);

        // System
        Route::get('activity-logs', function () {
            return response()->json(
                ActivityLog::with('user')
                    ->where('company_id', Tenant::id())
                    ->latest()->limit(50)->get()
            );
        });
        Route::get('trash-counts', [TrashController::class, 'counts']);
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/mark-read', [NotificationController::class, 'markRead']);
        Route::get('backup/download', [BackupController::class, 'download']);
    });
});
