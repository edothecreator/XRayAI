# XRayAI  
Plateforme d’analyse automatisée de radiographies thoraciques par IA

**XRayAI** est une application moderne d’analyse de radiographies thoraciques basée sur l’intelligence artificielle. Elle aide les professionnels de santé à obtenir une **analyse préliminaire rapide**, avec des scores de probabilité, des niveaux de risque et des rapports exportables.

> **Avertissement médical** : XRayAI est un outil d’aide à la décision. Il **ne remplace pas un diagnostic médical** et doit être utilisé sous la supervision de professionnels de santé qualifiés.

---

## Fonctionnalités principales

- Analyse automatique de radiographies thoraciques  
- Détection de **18 pathologies pulmonaires et thoraciques**  
- Scores de probabilité et pourcentages de confiance  
- Classification du risque : **Faible / Modéré / Élevé**  
- Tableau de bord des risques avec statistiques  
- Résumé patient généré par IA (langage simple)  
- Mode clair / sombre  
- Interface moderne et responsive  

---

## Pathologies analysées

Atelectasie, Consolidation, Infiltration, Pneumothorax, Œdème, Emphysème, Fibrose, Épanchement pleural, Pneumonie, Épaississement pleural, Cardiomégalie, Nodule, Masse, Hernie, Lésion pulmonaire, Fracture, Opacité pulmonaire, Médiastin élargi.  

Chaque pathologie inclut :  
- Probabilité  
- Pourcentage de confiance  
- Niveau de risque  

---

## Authentification & Comptes

- Inscription et connexion par email/mot de passe  
- Sessions persistantes via `localStorage`  
- Routes protégées (upload, historique)  
- Application 100 % frontend (sans base de données)  

---

## Système de crédits

- **1 crédit = 1 analyse**  
- **3 crédits gratuits** à l’inscription  
- Déduction uniquement après analyse réussie  
- Historique d’utilisation et d’achats  

---

## Upload & Historique

- Glisser-déposer ou sélection de fichier  
- Aperçu avant analyse  
- Barre de progression  
- Sauvegarde automatique de l’historique  
- Jusqu’à **100 analyses** par utilisateur  

---

## Export des résultats

Formats disponibles : PDF, CSV, Excel, JSON  

Les exports incluent les résultats, le résumé IA, les métadonnées et les avertissements médicaux.

---

## Internationalisation

- Anglais (par défaut)  
- Français  
- Espagnol  

La langue est mémorisée automatiquement.

---

## Stack technique

- React 19 + TypeScript  
- Vite  
- TailwindCSS 4  
- React Router v7  
- Framer Motion  
- Axios, jsPDF, xlsx, i18next  

---

## Lancement du projet

```bash
npm install
npm run dev
