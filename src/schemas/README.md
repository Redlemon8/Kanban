# Schémas de Validation

Ce dossier contient les schémas de validation Joi pour l'API Kanban, refactorisés avec une approche conditionnelle pour éviter la duplication de code.

## Structure

```
src/
├── schemas/
│   ├── cardSchemas.js      # Schémas pour les cartes
│   ├── listSchemas.js      # Schémas pour les listes
│   ├── tagSchemas.js       # Schémas pour les tags
│   └── README.md          # Cette documentation
└── utils/
    ├── schema.js          # Utilitaires pour créer des schémas
    ├── error.js           # Gestion des erreurs
    └── ...
```

## Approche Refactorisée

### Avant (Duplication)
```javascript
// ❌ Duplication de code
const createCardSchema = Joi.object({
  content: Joi.string().min(3).required(),
  position: Joi.number().integer().greater(0),
  // ...
});

const updateCardSchema = Joi.object({
  content: Joi.string().min(3), // Même validation, pas required
  position: Joi.number().integer().greater(0), // Duplication
  // ...
});
```

### Après (Approche Conditionnelle)
```javascript
// ✅ Code DRY (Don't Repeat Yourself)
const cardBaseSchema = {
  content: Joi.string().min(3),
  position: Joi.number().integer().greater(0),
  // ...
};

const createCardSchema = createSchema(cardBaseSchema, ['content']);
const updateCardSchema = createSchema(cardBaseSchema);
```

## Utilisation

### Import des schémas
```javascript
import { createCardSchema, updateCardSchema } from '../schemas/cardSchemas.js';
import { createListSchema, updateListSchema } from '../schemas/listSchemas.js';
import { createTagSchema, updateTagSchema } from '../schemas/tagSchemas.js';
```

### Validation avec le middleware Express
Les schémas sont utilisés avec le middleware `validate` dans le router :

```javascript
// Dans router.js
import { validate } from './middlewares/validation.js';
import { createCardSchema, updateCardSchema } from './schemas/cardSchemas.js';

router.post("/cards/", validate(createCardSchema), cw(cardController.create));
router.patch("/cards/:id", validate(updateCardSchema), cw(cardController.update));
```

### Dans les contrôleurs
Le middleware `validate` s'occupe automatiquement de la validation et nettoie `req.body` :

```javascript
// Dans cardController.js
const create = async (req, res) => {
  // req.body est déjà validé et nettoyé par le middleware validate
  const card = await cardService.createCard(req.body);
  res.status(201).json(card);
};
```

## Fonction `createSchema`

La fonction `createSchema` se trouve dans `src/utils/schema.js` et prend deux paramètres :
- `baseSchema` : Le schéma de base avec toutes les validations communes
- `requiredFields` : Un tableau des champs qui doivent être requis

```javascript
import { createSchema } from '../utils/schema.js';

// Exemple d'utilisation
const myBaseSchema = {
  name: Joi.string().min(3),
  email: Joi.string().email(),
  age: Joi.number().min(18)
};

// Schéma de création (name et email requis)
const createSchema = createSchema(myBaseSchema, ['name', 'email']);

// Schéma de mise à jour (aucun champ requis)
const updateSchema = createSchema(myBaseSchema);
```

## Avantages de cette approche

1. **DRY (Don't Repeat Yourself)** : Évite la duplication de code
2. **Maintenabilité** : Un seul endroit pour modifier les validations communes
3. **Flexibilité** : Facile d'ajouter de nouveaux schémas avec des champs requis différents
4. **Lisibilité** : Code plus clair et plus facile à comprendre
5. **Cohérence** : Garantit que les validations sont identiques entre création et mise à jour
6. **Séparation des responsabilités** : Validation dans le middleware, logique métier dans les contrôleurs
7. **Organisation claire** : Utilitaires dans `utils/`, schémas spécifiques dans `schemas/`

## Gestion des erreurs

Le middleware `validate` gère automatiquement les erreurs de validation :
- Collecte toutes les erreurs (`abortEarly: false`)
- Supprime les champs non définis (`stripUnknown: true`)
- Lance une `ValidationError` avec les détails des erreurs
- Les erreurs sont gérées par le middleware d'erreur global

## Ajout de nouveaux schémas

Pour ajouter un nouveau schéma :

1. Créer un fichier `newEntitySchemas.js` dans `src/schemas/`
2. Définir le schéma de base
3. Utiliser `createSchema` de `src/utils/schema.js` pour créer les schémas finaux
4. Exporter les schémas
5. Les utiliser dans le router avec le middleware `validate`

```javascript
import Joi from "joi";
import { createSchema } from "../utils/schema.js";

const newEntityBaseSchema = {
  field1: Joi.string().min(3),
  field2: Joi.number().integer(),
  // ...
};

const createNewEntitySchema = createSchema(newEntityBaseSchema, ['field1']);
const updateNewEntitySchema = createSchema(newEntityBaseSchema);

export { createNewEntitySchema, updateNewEntitySchema };
``` 