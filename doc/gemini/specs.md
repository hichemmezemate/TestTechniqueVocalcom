# specification fonctionnelles & user stories

1. **modele de données**
### order 
- 'id' : guid
- 'clientName' : string
- 'totalAmount' : double
- 'status' : enum (Pending, Completed, Cancelled)

2. **les regles d'api** : 
- "GET /api/orders" : Recuperer toutes les commandes
- "POST /api/orders" : Ajouter une nouvelle commande
- "PUT /api/orders/{id}" : Modifier le statut d'une commande
- "DELETE /api/orders/{id}" : Supprimer une commande

3. **validation** : 
- clientName ne doit pas etre vide
- totalAmount doit etre superieur a 0
- status : doit etre un valeur de enum (Pending, Completed, Cancelled)

4. **stockage** : 
- en memoire (ajouter une table en memoire)
- pas de persistance sur disque

5. **gestion d'erreur** : 
- gestion des erreurs 404, 400, 500
- gestion des erreurs 404 pour les commandes inexistantes
- gestion des erreurs 400 pour les commandes invalides
- gestion des erreurs 500 pour les erreurs serveur

6. **conventions de code** : 
- respecter les conventions de code 
- code propre et commenté
- code testable