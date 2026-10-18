<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(PermissionSeeder::class);

        $company = Company::firstOrCreate(
            ['name_en' => 'Aria Herat Mohandes Zada'],
            [
                'name_fa' => 'شرکت ساختمانی و سرک سازی هرات آریا مهندس زاده',
                'abbreviation' => 'AHMZ',
                'business_type' => 'construction',
                'is_main' => true,
                'lang' => 'en',
                'calendar_type' => 'en',
                'currency' => 'AFN',
                'city' => 'Herat',
                'country' => 'Afghanistan',
            ]
        );

        Branch::withoutGlobalScopes()->firstOrCreate(
            ['company_id' => $company->id, 'name' => 'Kabul Head Office'],
            ['active' => true]
        );
        Branch::withoutGlobalScopes()->firstOrCreate(
            ['company_id' => $company->id, 'name' => 'Herat Site Office'],
            ['active' => true]
        );

        $admin = User::withTrashed()->firstOrCreate(
            ['email' => 'admin@ariaherat.af'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'current_company' => $company->id,
                'type' => 'admin',
            ]
        );

        $admin->companies()->syncWithoutDetaching([$company->id]);
        $admin->assignRole('Super Admin');
    }
}
