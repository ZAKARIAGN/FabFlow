<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'
            ],
            'password' => 'required|string|min:8|confirmed',
        ], [
            'first_name.required' => 'Le prénom est obligatoire.',
            'first_name.string' => 'Le prénom doit être une chaîne de caractères.',
            'first_name.max' => 'Le prénom ne doit pas dépasser 255 caractères.',
            'last_name.required' => 'Le nom est obligatoire.',
            'last_name.string' => 'Le nom doit être une chaîne de caractères.',
            'last_name.max' => 'Le nom ne doit pas dépasser 255 caractères.',
            'email.required' => 'L’adresse email est obligatoire.',
            'email.email' => 'Le format de l’email est invalide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'email.max' => 'L’email ne doit pas dépasser 255 caractères.',
            'email.regex' => 'Le format de l’email est invalide.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ], 422);
        }

        $role = Role::where("roleName", $request->role)->first();

        if (!$role) {
            return response()->json([
                'status' => false,
                'message' => 'Rôle invalide'
            ], 400);
        }
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $role->id
        ]);

        return response()->json([
            'status' => true,
            "message" => "Inscription réussie avec succès",
            "user" => $user
        ]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8',
        ], [
            'email.required' => 'L’adresse email est obligatoire.',
            'email.email' => 'Le format de l’email est invalide.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ], 422);
        }



        if (!Auth::attempt($request->only("email", "password"))) {
            return response()->json([
                "status" => false,
                "errors" => [
                    "incorrect" => ["Email ou mot de passe incorrect"]
                ]
            ], 401);
        }
        ;

        $user = Auth::user()->load('role');
        $token = $user->createToken("App")->plainTextToken;

        $input = [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'role_id' => $user->role_id,
            'role' => $user->role->roleName,
            'token' => $token,
        ];

        if ($user->role && $user->role->roleName === "admin") {
            $redirect = "/admin/dashboard";
        } else if ($user->role && $user->role->roleName === "commercial") {
            $redirect = "/commercial/dashboard";
        } else if ($user->role && $user->role->roleName === "atelier") {
            $redirect = "/atelier/dashboard";
        } else {
            $redirect = "/comptable/dashboard";
        }

        return response()->json([
            'status' => true,
            'user' => $input,
            'message' => "login successful",
            'redirect_to' => $redirect
        ], 200);
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Déconnexion réussie'
        ], 200);
    }




    public function Users()
    {
        $users = User::get();
        return response()->json([
            "status" => false,
            "users" => $users
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => "user introuvable"
            ], 404);
        }
        ;

        $user->delete();
        return response()->json([
            "status" => true,
            "message" => "utilisateur supprimé avec succés"
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Utilisateur introuvable'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
            ],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|string'
        ], [
            'first_name.required' => 'Le prénom est obligatoire.',
            'last_name.required' => 'Le nom est obligatoire.',
            'email.required' => 'L’adresse email est obligatoire.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'role.required' => 'Le rôle est obligatoire.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $role = Role::where('roleName', $request->role)->first();

        if (!$role) {
            return response()->json([
                'status' => false,
                'message' => 'Rôle invalide'
            ], 400);
        }

        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->role_id = $role->id;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user
        ], 200);
    }

    public function getUserById($id)
    {
        $user = User::with('role')->find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Utilisateur introuvable'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'user' => $user
        ], 200);
    }


}


