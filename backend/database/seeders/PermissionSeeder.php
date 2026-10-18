<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Entities that exist in this platform scaffold. Projects/Finance/
     * Procurement/HR entities are added here once those modules ship.
     */
    protected array $entities = [
        'company', 'user', 'role', 'branch',
        'backup', 'log', 'trash', 'notification', 'dashboard',
    ];

    protected array $actions = ['list', 'create', 'edit', 'show', 'delete'];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach ($this->entities as $entity) {
            foreach ($this->actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$entity}-{$action}",
                    'guard_name' => 'web',
                ]);
            }
        }

        $admin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $admin->syncPermissions(Permission::all());
    }
}
