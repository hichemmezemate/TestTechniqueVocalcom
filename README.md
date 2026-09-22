# Gestionnaire de Commandes - Application Full-Stack (.NET Core & React)

Ce projet est une mini-application de gestion de commandes clients. Elle comporte un backend API en .NET Core 8.0 avec stockage en mémoire (sans persistance sur disque) et un frontend interactif en React (TypeScript) propulsé par Vite.

---

## Architecture du Projet

Le workspace est structuré comme suit :

```text
TestTechniqueVocalCom/
├── backend/                  # API REST .NET Core 8.0
│   ├── Controllers/          # Contrôleur REST (OrdersController.cs)
│   ├── Dtos/                 # Data Transfer Objects avec validations (OrderDto.cs)
│   ├── Entities/             # Modèles de données & Enums (Order.cs)
│   ├── Repositories/         # Repository Pattern (IOrderRepository, OrderRepository)
│   ├── Properties/           # Fichiers de lancement et ports (launchSettings.json)
│   └── Program.cs            # Configuration du serveur, CORS, DI, et Swagger
│
├── backend.Tests/            # Projet de Tests Unitaires MSTest pour le Backend
│   └── OrdersControllerTests.cs
│
├── frontend/                 # Application Frontend React (Vite + TypeScript)
│   ├── src/
│   │   ├── Components/       # Composants UI (OrderForm, OrderList, OrderStatus)
│   │   ├── Services/         # Service d'API REST (OrderService.ts)
│   │   ├── hooks/            # Hooks de gestion d'état et stats (useOrders.ts)
│   │   ├── types/            # Déclarations des interfaces TS (index.ts)
│   │   ├── tests/            # Tests unitaires Vitest (components, hooks, services)
│   │   ├── App.tsx           # Layout principal (Dashboard & Statistiques)
│   │   ├── index.css         # Design CSS personnalisé Premium (animations, responsive)
│   │   └── main.tsx          # Point d'entrée de l'application React
│   └── vite.config.ts        # Configuration de Vite et Vitest
│
└── README.md                 # Ce guide technique et d'exécution
```

---

## Prérequis

Pour exécuter cette application locale, assurez-vous d'avoir :
1. **Node.js** (version 18 ou supérieure, `v24.12.0` validée).
2. **SDK .NET 8.0** ou supérieur.
   > [!IMPORTANT]
   > Seul le *runtime* .NET 8.0 a été détecté lors de la phase d'analyse de l'environnement. Pour compiler et exécuter le projet backend, vous devez obligatoirement installer le **SDK .NET 8.0** depuis le [portail officiel Microsoft](https://dotnet.microsoft.com/download/dotnet/8.0).

---

## Guide d'Exécution

### 1. Démarrage du Backend (API)
Le backend a été configuré pour démarrer sur le port **5000** afin de s'aligner avec le service frontend.

Dans votre terminal :
```bash
cd backend
dotnet run
```
* **Accès Swagger** : Une fois lancé, l'interface Swagger pour explorer et tester les routes de l'API est disponible à l'adresse suivante : [http://localhost:5000/index.html](http://localhost:5000/index.html).

### 2. Démarrage du Frontend (React)
Dans un autre terminal :
```bash
cd frontend
npm install
npm run dev
```
* **Accès Application** : Ouvrez votre navigateur sur l'adresse fournie par Vite (généralement [http://localhost:5173](http://localhost:5173)).

---

## Exécution des Tests

### Backend (.NET MSTest)
Pour exécuter la suite de tests unitaires du backend :
```bash
cd backend.Tests
dotnet test
```
*Les tests couvrent la validation des données d'entrée, les codes de retour HTTP du contrôleur (200, 201, 204, 400, 404), et le bon fonctionnement des méthodes CRUD.*

### Frontend (Vitest)
Pour lancer la suite de tests unitaires automatisés du frontend :
```bash
cd frontend
npm run test
```
*Les tests couvrent les appels d'API du `OrderService`, l'état et les statistiques calculées par le hook `useOrders`, ainsi que le comportement et la validation en temps réel de `OrderForm`.*

---

## Choix Techniques & Bonnes Pratiques

### Backend
* **Thread-Safety** : Les commandes sont stockées en mémoire à l'aide d'un `ConcurrentDictionary<Guid, Order>`. Cela garantit la sécurité des accès concurrents (lecture/écriture simultanée) sans bloquer les requêtes.
* **Repository Pattern** : Découplage de la persistance à travers l'interface `IOrderRepository` facilitant les tests unitaires et permettant un basculement futur vers une vraie base de données (Entity Framework, PostgreSQL, SQL Server, etc.) sans altérer les contrôleurs.
* **Validations strictes** : Validation des données par *Data Annotations* directement sur les DTOs (`[Required]`, `[Range]`, `[EnumDataType]`). Les erreurs de validation retournent automatiquement un statut `400 Bad Request` au format JSON structuré.

### Frontend
* **Performance (`useMemo`)** : Les indicateurs statistiques du tableau de bord (total des ventes, répartition des statuts) sont mémoïsés dans `useOrders.ts` via `useMemo`. Les calculs ne sont ré-exécutés que si la liste des commandes change, économisant les cycles de rendu React.
* **Validation Réactive** : Le formulaire désactive dynamiquement le bouton de soumission et applique des indicateurs visuels (classes CSS `.input-error` / `.input-success`) dès que les données saisies par l'utilisateur sont invalides.
* **Premium Design (Vanilla CSS)** : Un design moderne, sans dépendance externe Bootstrap lourde. Il utilise le système de variables CSS pour un thème harmonieux (palette Indigo/Emeraude), des ombres portées douces (`box-shadow`), un tableau responsive et des micro-animations interactives lors des survols et des transitions de statuts.
