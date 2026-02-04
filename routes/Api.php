<?Php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProduitController;
Route::post("/login", [AuthController::class, "login"]);


Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post("/register", [AuthController::class, "register"]);
});


Route::middleware(["auth:sanctum", "role:commercial"])->group(function () {
    Route::post("/clients", [ClientController::class, "store"]);
    Route::get('/clients', [ClientController::class, 'index']);
    Route::get('/clients/search', [ClientController::class, 'search']);
    Route::put('/clients/{id}', [ClientController::class, 'update']);
    Route::delete('/clients/{id}', [ClientController::class, 'destroy']);


    Route::post("/produits", [ProduitController::class, "store"]);
    Route::get('/produits', [ProduitController::class, 'index']);
    Route::get('/produits/search', [ProduitController::class, 'search']);
    Route::put('/produits/{id}', [ProduitController::class, 'update']);
    Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);
});