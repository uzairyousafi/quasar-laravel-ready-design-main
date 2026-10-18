<?php

namespace App\Http\Controllers\Branch;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Branch::orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:50'],
            'active' => ['boolean'],
        ]);

        $branch = Branch::create($data);

        ActivityLog::log('created', 'Branch', "Created branch \"{$branch->name}\"");

        return response()->json($branch, 201);
    }

    public function show(Branch $branch): JsonResponse
    {
        return response()->json($branch);
    }

    public function update(Request $request, Branch $branch): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:50'],
            'active' => ['boolean'],
        ]);

        $branch->update($data);

        ActivityLog::log('updated', 'Branch', "Updated branch \"{$branch->name}\"");

        return response()->json($branch);
    }

    public function destroy(Branch $branch): JsonResponse
    {
        $name = $branch->name;
        $branch->delete();

        ActivityLog::log('deleted', 'Branch', "Deleted branch \"{$name}\"");

        return response()->json(['message' => 'Deleted.']);
    }
}
