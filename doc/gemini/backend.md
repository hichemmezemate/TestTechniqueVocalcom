# specification & bonne pratiques .net core 

## 1. architecture backend

backend/
├── Controllers/
│   └── OrdersController.cs
├── Repositories/
│   └── OrderRepository.cs
├── Entities/
│   └── Order.cs
└── Dtos/
    └── OrderDto.cs

## 2. exigences techniques
- stockage en memoire  
- pas de persistance sur disque  
- validation des donnees:
    data annotations (required, stringlength) sur les DTOs
    retour automatique en general au format json
- activer le CORS 
