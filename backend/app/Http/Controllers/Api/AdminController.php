<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users()
    {
        return User::all();
    }

    public function brands()
    {
        return Brand::all();
    }

    public function storeBrand(Request $req)
    {
        return Brand::create($req->validate(['name' => 'required']));
    }

    public function products()
    {
        return Product::with('brand')->get();
    }

    public function storeProduct(Request $req)
    {
        return Product::create($req->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'brand_id' => 'required|exists:brands,id',
            'description' => 'nullable'
        ]));
    }
}

