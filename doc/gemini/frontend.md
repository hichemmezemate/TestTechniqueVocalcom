# specification & bonne pratiques react

## 1. architecture frontend

frontend/
├── src/
│   ├── Components/
│   │   ├── OrderList.tsx
│   │   ├── OrderForm.tsx
│   │   └── OrderStatus.tsx
│   ├── Services/
│   │   └── OrderService.ts
│   ├── types/
│   │   └── index.ts
│   ├── hooks/
│   │   └── useOrders.ts
│   └── App.tsx


## 2. Gestion des hooks  
- useState
- useEffect
    - chargement des donnees au demarrage
- useMemo
- 

## 3. Gestion de l'UI et erreurs
- desactiver les boutons si les données sont pas valides
- afficher des messages d'erreur clairs
- validation des données : 
    - clientName ne doit pas etre vide
    - totalAmount doit etre superieur a 0
    - status : doit etre un valeur de enum (Pending, Completed, Cancelled)
- UI simple, pas de design avancé (Bootstrap).