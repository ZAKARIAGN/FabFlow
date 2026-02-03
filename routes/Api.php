<?Php
use App\Http\Controllers\AuthController;
Route::post("/login",[AuthController::class,"login"]);
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
Route::post("/register",[AuthController::class,"register"]);
});