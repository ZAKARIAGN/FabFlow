<?Php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
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
});