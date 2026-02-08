<?Php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\QuoteController;
Route::post("/login", [AuthController::class, "login"]);


Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post("/register", [AuthController::class, "register"]);
});

Route::middleware(["auth:sanctum", "role:commercial,admin"])->group(function () {
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


    Route::post("/quotes", [QuoteController::class, "store"]);  
    Route::get("/quotes", [QuoteController::class, "getAllQuotes"]);
    Route::put("/update-quote/{id}", [QuoteController::class, "update"]);
    Route::patch("/update-quoteStatus/{id}", [QuoteController::class, "updateStatus"]);
    Route::get("/quotes/search", [QuoteController::class, "search"]);
});

Route::middleware(['auth:sanctum', 'role:atelier,admin'])->group(function () {
    Route::post("/delivery/{id}", [DeliveryController::class, "store"]);
    Route::patch("/update-deliveryStatus/{id}", [DeliveryController::class, "updateStatus"]);
    Route::get("/deliveries", [DeliveryController::class, "getAllDeliveries"]);
    Route::get("/deliveries/search", [DeliveryController::class, "search"]);
    Route::get("/quote-valider", [QuoteController::class, "getvalidateQuotes"]);
    Route::get("/quote-valider/search", [QuoteController::class, "searchValidatedQuotes"]);

});


Route::middleware(['auth:sanctum', 'role:comptable,admin'])->group(function () {
    Route::post("/invoice-from-bl/{id}", [InvoiceController::class, "generateInvoiceFromBL"]);
    Route::patch("/update-invoiceStatus/{id}", [InvoiceController::class, "updateInvoiceStatus"]);
    Route::get("/invoices", [InvoiceController::class, "getAllInvoices"]);
    Route::get("/invoices/search", [InvoiceController::class, "search"]);
    Route::get("/deliveries-livré", [DeliveryController::class, "getValidateLiveries"]);
    Route::get("/deliveries-livré/search", [DeliveryController::class, "searchValidateDeliveries"]);
});