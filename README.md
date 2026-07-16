# ThusL8 - Plateforme d'Audit et de Décryptage de Contrats et de Documents

**ThusL8** est une application full-stack moderne permettant d'analyser, de vulgariser, de résumer et d'auditer des contrats complexes ainsi que tous types de documents professionnels (commerciaux, techniques, administratifs ou juridiques). En s'appuyant sur l'API de Gemini (modèle `gemini-3.5-flash`), l'application extrait automatiquement les informations essentielles, identifie les clauses à risques et évalue la conformité des pièces téléversées.

## Architecture Générale

Le projet adopte une architecture full-stack unifiée avec une séparation claire des responsabilités :

1. **Serveur Express (Backend)** :
   - Point d'entrée : `server.ts`
   - Gère les requêtes d'analyse de contrats et de traduction.
   - Communique de manière sécurisée avec le SDK officiel `@google/genai` en utilisant le modèle de langage performant `gemini-3.5-flash`.
   - Définit un schéma de réponse JSON rigoureux pour garantir la structure et la validité des données retournées au client.
   - Intègre le middleware Vite pour le développement local et sert les fichiers statiques de production.

2. **Application React & Vite (Frontend)** :
   - Point d'entrée : `src/main.tsx` et `src/App.tsx`
   - Interface utilisateur réactive construite avec Tailwind CSS.
   - Gère le téléversement de documents (fichiers PDF et texte brut) via glisser-déposer ou sélection manuelle.
   - Offre des tableaux de bord interactifs avec filtres de risques, listes de contrôle pour le suivi des obligations et gestionnaires d'exportation.

## Fonctionnalités Clés

- **Téléversement Multi-Format** : Prise en charge native de tous types de documents professionnels, administratifs ou juridiques (fichiers PDF et texte brut `.txt`), avec conversion sécurisée.
- **Synthèse de Document & Contrat** : Résumé exhaustif rédigé de manière claire, identifiant l'objet principal, les parties prenantes et les engagements clés.
- **Détection des Risques & Points de Vigilance** : Identification automatisée des clauses ou paragraphes présentant des risques opérationnels, légaux ou financiers, classés par niveau de gravité avec des recommandations d'action claires.
- **Extraction des Obligations & Actions** : Modélisation des engagements sous forme de tâches de suivi exploitables avec échéances.
- **Analyse des Conditions d'Engagement et Rupture** : Décryptage des durées d'engagement, préavis de résiliation et pénalités éventuelles.
- **Audit de Conformité** : Évaluation du document au regard de normes clés (RGPD, réglementations courantes, clauses abusives).
- **Traduction Instantanée** : Traduction à la demande des éléments analysés dans plusieurs langues cibles (anglais, espagnol, allemand, italien).
- **Exportation des Rapports** : Téléchargement instantané des analyses consolidées sous forme de fichiers éditables Markdown (.md) et Texte Brut (.txt).

## Sécurité et Confidentialité

- **Pas d'Exposition de Clés** : Toutes les requêtes vers l'API Gemini sont gérées côté serveur. La clé d'API reste totalement invisible pour le client web.
- **Traitement en Mémoire** : Les fichiers téléversés sont convertis en flux et envoyés à l'API de traitement sans stockage persistant ou base de données intermédiaire, garantissant une confidentialité absolue pour les informations confidentielles.
- **Limites de Charge** : Configuration d'Express pour accepter des charges de données volumineuses (jusqu'à 50 Mo) pour soutenir les longs documents contractuels.

## Scripts de Démarrage et Construction

Les scripts de l'application sont déclarés dans le fichier `package.json` :

- `npm run dev` : Démarre le serveur Express de développement qui intègre le middleware d'actifs à la volée de Vite.
- `npm run build` : Lance la compilation des fichiers statiques de l'application cliente dans le dossier `/dist` et compile le serveur TypeScript `server.ts` en un fichier autonome CommonJS `dist/server.cjs` à l'aide d'esbuild.
- `npm run start` : Exécute le serveur de production compilé.
- `npm run lint` : Effectue la vérification des types TypeScript du projet pour s'assurer de l'absence d'erreurs statiques.

## Variables d'Environnement

L'application requiert les variables d'environnement suivantes, configurables via un fichier `.env` ou les paramètres secrets de la plateforme :

- `GEMINI_API_KEY` : Clé secrète d'accès aux services de l'API Google GenAI.
- `APP_URL` : URL publique d'hébergement de l'application.

## Perspectives & Feuille de Route

L'ambition de **Thus L8** ne s'arrête pas au diagnostic ponctuel. Nous projetons de bâtir un véritable écosystème d'intelligence juridique et documentaire centré sur la précision, la rapidité et la souveraineté des données. Notre feuille de route s'organise autour de trois horizons majeurs :

1. **Horizon 1 : Intelligence Artificielle & Personnalisation** (Modèles régionaux spécialisés et génération de clauses correctives).
2. **Horizon 2 : Collaboration & CLM** (Espaces partagés et suivi automatique des échéances contractuelles).
3. **Horizon 3 : Intégrations & Connecteurs API** (Extensions de messagerie/traitement de texte, API Enterprise et signature électronique).

👉 **Pour découvrir le détail de notre vision stratégique, consultez notre [Feuille de Route Complète](./docs/perspectives.md).**

## 🤝 Contributions

Nous sommes particulièrement ouverts et accueillants aux contributions de la communauté pour faire grandir et évoluer **Thus L8** ! Que vous soyez développeur, juriste, designer ou simple utilisateur passionné, votre aide est précieuse.

### Comment contribuer ?

1. **Signaler des anomalies ou proposer des évolutions** : Créez une demande d'amélioration (issue) décrivant clairement votre cas d'usage ou le bug rencontré.
2. **Soumettre des modifications de code** :
   - Créez une branche de travail descriptive (ex: `feature/nouvelle-langue-traduction` ou `fix/resolution-overflow-mobile`).
   - Assurez-vous de respecter le typage strict TypeScript et de valider votre code à l'aide de `npm run lint` avant de soumettre.
   - Soumettez une Pull Request (PR) claire détaillant les changements apportés et leurs bénéfices.
3. **Enrichir le dictionnaire et les cas pratiques** : Proposez de nouveaux termes juridiques vulgarisés ou des exemples de contrats types pour étoffer les fonctionnalités d'assistance de la plateforme.

### Directives de Développement
- **Modularité** : Séparez les responsabilités. Évitez de surcharger `App.tsx` ; créez de nouveaux composants dans `/src/components`.
- **Sécurité** : Ne placez jamais de clés ou d'appels d'API sensibles côté client. Tout le traitement cognitif doit être délégué de façon éphémère au serveur via `server.ts`.
- **Aesthetic** : Conservez la direction artistique de l'application : minimaliste, aérée, accessible, avec des contrastes soignés et des interactions fluides.

