# Simuler une réservation client (salon test Toulouse)

## Données de test

Un **salon test** est créé en base pour simuler le parcours complet d’un client qui réserve un rendez-vous.

### Salon : **Salon Test Réservation Toulouse**

- **Adresse** : 7 Place du Capitole, 31000 Toulouse  
- **Slug** : `salon-test-reservation-toulouse`  
- **Horaires** : lundi → samedi, **9h–19h** (pas le dimanche)  
- **Staff** : Julie (Styliste), Marc (Coiffeur)  
- **Prestations** :
  - **Coupe** : Coupe femme (45 min, 45 €), Coupe homme (30 min, 28 €)  
  - **Coloration** : Coloration complète (90 min, 72 €)  
  - **Brushing** : Brushing (30 min, 20 €)  

### Compte client

- **Email** : `client@planity.com`  
- **Mot de passe** : `client123`  

---

## Créer les données (seed)

À la racine du monorepo ou dans `apps/api` :

```bash
cd apps/api
npx prisma db seed
```

Cela crée (ou met à jour) le salon test Toulouse, les 3 autres salons Toulouse, les salons Paris/Lyon et les comptes admin / provider / client.

---

## Parcours de réservation (app mobile)

1. **Connexion**  
   Se connecter avec `client@planity.com` / `client123`.

2. **Trouver le salon**  
   - Soit : Recherche par adresse « Toulouse » puis choix du salon **Salon Test Réservation Toulouse**.  
   - Soit : Aller directement sur le détail du salon si vous avez son ID (ex. après une recherche).

3. **Réserver**  
   - Ouvrir la fiche du salon **Salon Test Réservation Toulouse**.  
   - Choisir **Réserver** (ou équivalent).  
   - Sélectionner une **prestation** (ex. Coupe femme).  
   - Choisir une **date** parmi les 14 prochains jours (un jour **lundi–samedi** pour avoir des créneaux).  
   - Choisir un **créneau** dans la liste (ex. 09:00, 09:15, …).  
   - Valider la réservation.

4. **Vérification**  
   La réservation apparaît côté client (ex. « Mes rendez-vous ») et peut être vue côté API (table `appointments`).

---

## Vérifier en base (optionnel)

```bash
cd apps/api
npx prisma studio
```

- **businesses** : filtrer par `slug = salon-test-reservation-toulouse`.  
- **availability_rules** : vérifier les lignes pour ce `businessId` (lun–sam 09:00–19:00).  
- **appointments** : après une réservation, une ligne avec `client_user_id` = ID du user `client@planity.com`.
