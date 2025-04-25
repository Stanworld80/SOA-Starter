import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class LoggedHomepage extends StatelessWidget {
  const LoggedHomepage({Key? key}) : super(key: key);

  Future<void> _signOut(BuildContext context) async {
    try {
      await FirebaseAuth.instance.signOut();
      // Après la déconnexion, l'EntryPage (ou StreamBuilder) détectera
      // le changement d'état et redirigera vers la page non connectée.
      // Pas besoin de navigation explicite ici la plupart du temps,
      // sauf si vous avez une structure de navigation complexe.
    } catch (e) {
      print("Error signing out: $e");
      // Afficher une erreur à l'utilisateur si la déconnexion échoue
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error signing out: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser; // Obtenir l'utilisateur connecté

    return Scaffold(
      appBar: AppBar(title: const Text('Logged In Homepage')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Welcome!',
              style: TextStyle(fontSize: 24),
            ),
            if (user != null) // Afficher l'email de l'utilisateur si disponible
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  'You are logged in as: ${user.email}',
                  style: const TextStyle(fontSize: 16),
                  textAlign: TextAlign.center,
                ),
              ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => _signOut(context), // Appeler la fonction de déconnexion
              child: const Text('Sign Out'),
            ),
            // Ajoutez ici d'autres widgets pour votre page d'accueil connectée
          ],
        ),
      ),
    );
  }
}