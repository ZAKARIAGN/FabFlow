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
    Route::get('/documents', [QuoteController::class, 'index']);
    Route::get('/documents/search', [QuoteController::class, 'searchDocument']);
    Route::get('/users', [AuthController::class, 'Users']);
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
});

Route::middleware(["auth:sanctum", "role:commercial,admin"])->group(function () {
    Route::post("/clients", [ClientController::class, "store"]);
    Route::get('/clients/search', [ClientController::class, 'search']);
    Route::put('/clients/{id}', [ClientController::class, 'update']);
    Route::delete('/clients/{id}', [ClientController::class, 'destroy']);
    Route::get('/clients/{id}', [ClientController::class, 'show']);



    Route::post("/produits", [ProduitController::class, "store"]);
    Route::get('/produits/search', [ProduitController::class, 'search']);
    Route::put('/produits/{id}', [ProduitController::class, 'update']);
    Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);
    Route::get('/produits/{id}', [ProduitController::class, 'show']);


    Route::post("/quotes", [QuoteController::class, "store"]);

    Route::put("/quotes/{id}", [QuoteController::class, "update"]);
    Route::patch("/quotesStatus/{id}", [QuoteController::class, "updateStatus"]);
    Route::get("/quotes/search", [QuoteController::class, "search"]);
});

Route::middleware(['auth:sanctum', 'role:atelier,admin'])->group(function () {
    Route::post("/deliveries/{id}", [DeliveryController::class, "store"]);
    Route::patch("/deliveriesStatus/{id}", [DeliveryController::class, "updateStatus"]);

    Route::get("/deliveries/search", [DeliveryController::class, "search"]);
    Route::get("/quotes-valider", [QuoteController::class, "getvalidateQuotes"]);
    Route::get("/quotes-valider/search", [QuoteController::class, "searchValidatedQuotes"]);

});


Route::middleware(['auth:sanctum', 'role:comptable,admin'])->group(function () {
    Route::post("/invoice-from-bl/{id}", [InvoiceController::class, "generateInvoiceFromBL"]);
    Route::patch("/invoicesStatus/{id}", [InvoiceController::class, "updateInvoiceStatus"]);

    Route::get("/invoices/search", [InvoiceController::class, "search"]);
    Route::get("/deliveries-livré", [DeliveryController::class, "getValidateLiveries"]);
    Route::get("/deliveries-livré/search", [DeliveryController::class, "searchValidateDeliveries"]);
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get("/documents/{id}", [QuoteController::class, "show"]);
    Route::get('/clients', [ClientController::class, 'index']);
    Route::get("/invoices", [InvoiceController::class, "getAllInvoices"]);
    Route::get("/deliveries", [DeliveryController::class, "getAllDeliveries"]);
    Route::get("/quotes", [QuoteController::class, "getAllQuotes"]);
    Route::get('/produits', [ProduitController::class, 'index']);
    Route::get('/invoices/total-paid', [InvoiceController::class, 'getTotalPaidInvoices']);
    Route::get('/clients/top-paid', [ClientController::class, 'topClientsByPaidInvoices']);
});



