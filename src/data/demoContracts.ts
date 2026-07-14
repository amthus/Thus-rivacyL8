export interface DemoContract {
  id: string;
  title: string;
  type: string;
  parties: string;
  text: string;
}

export const DEMO_CONTRACTS: DemoContract[] = [
  {
    id: "saas_enterprise",
    title: "Contrat de Licence SaaS Entreprise (30 Articles)",
    type: "Licence SaaS & Maintenance",
    parties: "CloudMax Systems & RetailCorp Europe",
    text: `CONTRAT DE LICENCE ET DE PRESTATION DE SERVICES SAAS ENTREPRISE

ENTRE LES SOUSSIGNÉS :
La société CLOUDMAX SYSTEMS, SAS au capital de 250 000 €, immatriculée au RCS de Paris sous le numéro 111 222 333, dont le siège social est situé au 45 Avenue de la République, 75011 Paris, représentée par M. Alexandre Dumas, Président (ci-après le "Prestataire").

ET :
La société RETAILCORP EUROPE, SA au capital de 500 000 €, immatriculée au RCS de Lyon sous le numéro 444 555 666, dont le siège social est situé au 12 Rue de la Bourse, 69002 Lyon, représentée par Mme Valérie Pécresse, Directrice des Systèmes d'Information (ci-après le "Client").

IL A ÉTÉ ARRÊTÉ ET CONVENU CE QUI SUIT :

Article 1 - Objet du Contrat
Le présent contrat a pour objet de définir les conditions juridiques, techniques et financières dans lesquelles le Prestataire concède au Client un droit d'accès et d'utilisation de sa solution logicielle en mode SaaS, et fournit les services d'accompagnement associés.

Article 2 - Définitions
- "SaaS" : Software as a Service, logiciel hébergé et accessible à distance.
- "Données Client" : toutes les données, fichiers et contenus saisis par le Client sur la Plateforme.
- "SLA" : Service Level Agreement, engagements de niveau de service.
- "Anomalie" : tout dysfonctionnement reproductible empêchant l'utilisation normale de la Plateforme.

Article 3 - Droits d'Accès et Licence
Le Prestataire concède au Client une licence d'utilisation personnelle, non exclusive, non cessible et mondiale de la Plateforme pour ses seuls besoins internes, pour la durée du présent contrat.

Article 4 - Niveau de Service (SLA)
Le Prestataire garantit un taux de disponibilité mensuel de la Plateforme de 99,9%, calculé 24h/24 et 7j/7, hors fenêtres de maintenance planifiée d'un commun accord ou urgentes.

Article 5 - Maintenance corrective
Les anomalies signalées par le Client font l'objet d'une prise en charge prioritaire selon leur gravité : blocante (résolution sous 4h ouvrées), majeure (résolution sous 24h ouvrées), mineure (résolution sous 5 jours ouvrés).

Article 6 - Maintenance évolutive
Le Client bénéficie automatiquement de toutes les mises à jour mineures et correctives de la Plateforme sans surcoût. Les évolutions majeures ou modules optionnels feront l'objet de devis séparés.

Article 7 - Propriété des Données
Le Client reste l'unique propriétaire de l'ensemble des Données saisies ou importées sur la Plateforme. Le Prestataire s'interdit d'utiliser ces données pour son propre compte ou de les divulguer à des tiers.

Article 8 - Sécurité et Chiffrement
Le Prestataire s'engage à mettre en œuvre des mesures de sécurité physiques et logiques conformes à l'état de l'art, incluant le chiffrement des données au repos (AES-256) et en transit (TLS 1.3).

Article 9 - Protection des Données Personnelles (RGPD)
Les Parties s'engagent à respecter la réglementation sur la protection des données personnelles (RGPD). Le Prestataire agit en tant que sous-traitant et le Client en tant que responsable de traitement.

Article 10 - Hébergement et Localisation
L'ensemble des Données Client et de la Plateforme est hébergé sur le territoire de l'Union Européenne, spécifiquement dans des centres de données hautement sécurisés situés en France.

Article 11 - Audit de Sécurité
Le Client a le droit d'effectuer ou de faire effectuer par un tiers indépendant, une fois par an et à ses frais, un audit complet de la sécurité de l'infrastructure d'hébergement, sous réserve d'un préavis de 30 jours.

Article 12 - Conditions Financières (Redevances)
En contrepartie des services SaaS, le Client s'engage à payer une redevance mensuelle forfaitaire de 5 000 € HT. Les redevances d'intégration initiale sont fixées à un montant unique de 15 000 € HT.

Article 13 - Indexation des Tarifs
Les redevances d'abonnement SaaS seront révisées chaque année à la date anniversaire du contrat selon la formule d'indexation basée sur l'évolution de l'indice Syntec officiel.

Article 14 - Modalités de Facturation
La redevance SaaS est facturée trimestriellement à terme échoir. Les factures sont payables à 30 jours fin de mois à compter de leur date d'émission par virement bancaire uniquement.

Article 15 - Pénalités de Retard
Tout retard de paiement à l'échéance entraînera de plein droit des pénalités de retard d'un montant de trois fois le taux d'intérêt légal, plus l'indemnité forfaitaire de 40 € pour frais de recouvrement.

Article 16 - Suspension des Services
En cas de défaut de paiement persistant 15 jours après l'envoi d'une lettre de mise en demeure restée infructueuse, le Prestataire pourra suspendre immédiatement l'accès à la Plateforme.

Article 17 - Propriété Intellectuelle du Prestataire
La structure générale, les logiciels, codes, interfaces, marques et designs de la Plateforme sont la propriété exclusive du Prestataire. Aucune cession de droit de propriété intellectuelle n'est opérée par ce contrat.

Article 18 - Garantie d'Éviction
Le Prestataire garantit qu'il est titulaire des droits de propriété intellectuelle sur la Plateforme et qu'il garantira le Client contre toute action en contrefaçon intentée par un tiers.

Article 19 - Collaboration des Parties
Les Parties s'engagent à collaborer activement et de bonne foi à la réussite du déploiement de la solution, notamment en désignant un chef de projet dédié dans chaque entité.

Article 20 - Obligation de Moyens et de Résultat
Le Prestataire est tenu à une obligation de résultat concernant la disponibilité de la Plateforme (SLA) et à une obligation de moyens pour les prestations d'accompagnement et de conseil.

Article 21 - Limitation Globale de Responsabilité
Le montant total des indemnités cumulées dues par le Prestataire pour tous manquements contractuels est strictement limité au montant annuel des redevances SaaS effectivement payées par le Client.

Article 22 - Assurance Responsabilité Civile
Le Prestataire certifie avoir souscrit une assurance responsabilité civile professionnelle couvrant les risques technologiques majeurs auprès d'une compagnie notoirement solvable.

Article 23 - Force Majeure
Aucune des parties ne sera tenue pour responsable de l'inexécution de ses obligations en cas de survenance d'un cas de force majeure tel que défini par l'article 1218 du Code Civil.

Article 24 - Confidentialité des Informations
Les Parties s'engagent réciproquement à garder strictement confidentielles toutes les informations commerciales, financières ou techniques échangées durant l'exécution du contrat.

Article 25 - Durée Initiale et Renouvellement
Le présent contrat est conclu pour une durée ferme de 36 mois à compter de sa signature. Il se renouvelle tacitement par périodes de 12 mois, sauf résiliation notifiée avec un préavis de 6 mois.

Article 26 - Résiliation pour Manquement
En cas de manquement grave par l'une des parties à ses obligations fondamentales, l'autre partie pourra résilier le contrat 30 jours après mise en demeure par lettre recommandée restée infructueuse.

Article 27 - Réversibilité et Restitution
En cas de fin de contrat, le Prestataire assurera les opérations de réversibilité permettant au Client de récupérer l'ensemble de ses Données sous un format standard (JSON ou CSV) sous 30 jours.

Article 28 - Non-Sollicitation de Personnel
Chaque partie renonce à embaucher ou à faire travailler directement ou indirectement tout collaborateur de l'autre partie pendant toute la durée du contrat et les 12 mois suivant sa fin.

Article 29 - Indépendance des Parties
Chaque partie agit en son nom propre et pour son propre compte. Le présent contrat ne crée aucune relation d'exclusivité, de mandat, d'association ou de filiale commune entre le Prestataire et le Client.

Article 30 - Droit Applicable et Attribution de Juridiction
Le présent contrat est régi par la loi française. En cas de litiste persistant après tentative de médiation, compétence exclusive est attribuée aux tribunaux compétents du ressort de la Cour d'Appel de Paris.`
  },
  {
    id: "partenariat_technologique",
    title: "Partenariat et Co-développement (30 Articles)",
    type: "Partenariat de Recherche",
    parties: "MegaTech Labs & Robotix Solutions",
    text: `CONTRAT DE PARTENARIAT ET DE CO-DÉVELOPPEMENT TECHNOLOGIQUE

ENTRE LES SOUSSIGNÉS :
La société MEGATECH LABS, SAS au capital de 150 000 €, immatriculée au RCS de Grenoble sous le numéro 222 333 444, dont le siège social est situé au 15 Avenue des Alpes, 38000 Grenoble, représentée par M. Pierre Dubois, Directeur de la Recherche (ci-après la "Partie A").

ET :
La société ROBOTIX SOLUTIONS, SAS au capital de 200 000 €, immatriculée au RCS de Toulouse sous le numéro 555 666 777, dont le siège social est situé au 88 Rue de l'Espace, 31000 Toulouse, représentée par Mme Amélie Nothomb, Présidente (ci-après la "Partie B").

IL A ÉTÉ ARRÊTÉ ET CONVENU CE QUI SUIT :

Article 1 - Objet du Partenariat
Le présent contrat a pour objet d'établir un partenariat de recherche et de co-développement pour concevoir et tester un prototype de bras robotique intelligent guidé par vision artificielle.

Article 2 - Définitions du Co-développement
- "Projet" : l'ensemble des travaux de recherche, de conception, de développement et d'essais décrits aux spécifications.
- "Livrables" : l'ensemble des codes sources, schémas mécaniques et documentations produits.
- "Connaissances Antérieures" : technologies et brevets détenus par une Partie avant le Projet.
- "Connaissances Nouvelles" : résultats issus des travaux communs du Projet.

Article 3 - Gouvernance et Comité de Pilotage
Un Comité de Pilotage composé de deux représentants de chaque Partie se réunira mensuellement pour valider l'avancement des tâches, arbitrer les choix techniques et décider des budgets.

Article 4 - Spécifications Techniques Communes
Les spécifications techniques détaillées du prototype sont annexées au présent contrat et ne peuvent être modifiées que par décision unanime du Comité de Pilotage consignée par écrit.

Article 5 - Calendrier et Jalons de Livraison
Le Projet est structuré en quatre jalons principaux : J1 (Étude d'architecture - Mois 3), J2 (Modélisation logicielle - Mois 6), J3 (Assemblage matériel - Mois 9) et J4 (Validation finale - Mois 12).

Article 6 - Procédure de Recette Technique
Chaque livrable intermédiaire ou final fera l'objet d'une recette technique contradictoire dans un délai de 15 jours ouvrés suivant sa livraison par la partie responsable du développement.

Article 7 - Propriété Industrielle Antérieure
Chaque Partie conserve la propriété exclusive de ses Connaissances Antérieures. Aucune cession de brevet ou de droit d'auteur n'est consentie au titre de l'accès à ces connaissances.

Article 8 - Propriété Industrielle Commune
Les Connaissances Nouvelles développées conjointement par les ingénieurs des deux Parties seront la propriété commune et indivise des deux Parties au prorata de leurs contributions intellectuelles.

Article 9 - Dépôt de Brevets Communs
Toute invention issue des travaux du Projet susceptible d'être brevetée fera l'objet d'un dépôt conjoint au nom des deux Parties, les frais de dépôt et d'entretien étant partagés à parts égales.

Article 10 - Droits d'Exploitation Commerciale
La Partie A dispose d'un droit exclusif d'exploitation commerciale de la technologie commune dans le secteur de l'automobile, tandis que la Partie B dispose d'un droit similaire dans le secteur aéronautique.

Article 11 - Répartition des Revenus (Royalties)
En cas d'exploitation directe ou de concession de licence des Connaissances Nouvelles à des tiers en dehors des secteurs réservés, les revenus seront répartis à hauteur de 50% pour chaque Partie.

Article 12 - Financement et Budgétisation du Projet
Chaque Partie financera ses propres équipes et ressources affectées au Projet. Le coût des matériels communs achetés pour le prototype sera pris en charge de moitié par chaque Partie.

Article 13 - Ressources Humaines Dédiées
Chaque Partie s'engage à déduire et affecter au Projet des ingénieurs qualifiés à temps plein (au moins 3 équivalents temps plein pour la Partie A et 3 pour la Partie B) pour toute la durée des travaux.

Article 14 - Obligations d'Information Mutuelle
Les Parties s'engagent à s'informer mutuellement et sans délai de toute découverte scientifique, difficulté technique, retard prévisible ou risque d'interférence avec les droits de tiers.

Article 15 - Clause de Non-Concurrence Technologique
Pendant toute la durée du Projet et pendant une période de 24 mois après sa fin, les Parties s'interdisent de collaborer avec des concurrents directs du partenaire sur des technologies similaires.

Article 16 - Clause d'Exclusivité Sectorielle
Les Parties s'interdisent d'utiliser les résultats du co-développement pour concurrencer le partenaire dans son secteur d'activité exclusif mentionné à l'Article 10.

Article 17 - Confidentialité des Informations Partagées
Toutes les informations techniques échangées pour les besoins du Projet sont considérées comme confidentielles. Cette obligation reste en vigueur pendant 5 ans après la fin du contrat.

Article 18 - Gestion des Données de Test et RGPD
Les données utilisées pour l'entraînement des algorithmes de vision artificielle ne contiendront aucune donnée personnelle identifiable, sauf accord écrit préalable conforme au RGPD.

Article 19 - Responsabilité Mutuelle du Co-développement
Chaque Partie est responsable de la qualité et de la conformité de ses propres livrables. Les Parties excluent mutuellement toute responsabilité pour les préjudices commerciaux indirects.

Article 20 - Assurance des Risques Technologiques
Chaque Partie s'engage à maintenir une police d'assurance couvrant les accidents corporels et les dommages matériels pouvant survenir lors des tests du prototype dans ses locaux.

Article 21 - Force Majeure Majeure
En cas d'événement de force majeure suspendant l'exécution du Projet pour une durée supérieure à 60 jours consécutifs, l'une ou l'autre Partie pourra mettre fin au contrat sans indemnité.

Article 22 - Modification et Avenants au Contrat
Toute modification des termes du présent contrat, de ses annexes techniques ou financiers, ne pourra être effectuée que par voie d'avenant signé par les représentants légaux des deux Parties.

Article 23 - Durée Générale du Partenariat
Le présent contrat est conclu pour une durée initiale de 18 mois à compter de sa signature. Il pourra être prolongé par accord écrit unanime des Parties pour achever les travaux.

Article 24 - Retrait d'une Partie du Projet
Une Partie peut demander son retrait du Projet avant le terme moyennant le respect d'un préavis de 3 mois et le transfert gratuit de ses droits d'usage sur ses travaux déjà réalisés.

Article 25 - Résiliation Anticipée pour Faute
En cas de violation caractérisée des obligations contractuelles ou d'abandon manifeste des travaux par l'une des Parties, le contrat pourra être résilié de plein droit après mise en demeure.

Article 26 - Effets de la Résiliation sur la Co-propriété
La résiliation du présent contrat pour quelque motif que ce soit n'affecte pas les droits de co-propriété acquis sur les Connaissances Nouvelles générées avant la date de résiliation.

Article 27 - Non-Sollicitation Réciproque de Collaborateurs
Les Parties s'interdisent réciproquement de débaucher ou d'employer les ingénieurs et chercheurs de l'autre Partie pendant la durée du partenariat et pendant 12 mois suivant son terme.

Article 28 - Règlement Amiable des Différends
En cas de différend majeur, les chefs de projet s'engagent à soumettre la difficulté au Comité de Pilotage. Si aucune solution n'est trouvée, une procédure de médiation sera engagée.

Article 29 - Cession et Transmission du Contrat
Aucune Partie ne peut céder ou transférer tout ou partie de ses droits et obligations au titre du présent contrat à un tiers sans l'accord écrit préalable et unanime de l'autre Partie.

Article 30 - Droit Applicable et Arbitrage
Le présent contrat est régi par la loi française. Tout différend persistant sera tranché par voie d'arbitrage sous l'égide de la Chambre de Commerce Internationale de Paris, statuant à trois arbitres.`
  },
  {
    id: "accord_cadre_ia",
    title: "Accord-Cadre Intégration IA (30 Articles)",
    type: "Accord de Services d'IA",
    parties: "Neural Consulting & Banking Global Services",
    text: `ACCORD-CADRE DE FOURNITURE DE SERVICES DE CONSEIL ET D'INTÉGRATION D'IA

ENTRE LES SOUSSIGNÉS :
La société NEURAL CONSULTING, SAS au capital de 100 000 €, immatriculée au RCS de Paris sous le numéro 333 444 555, dont le siège social est situé au 100 Rue des Algorithmes, 75008 Paris, représentée par M. Yann LeCun, Directeur Technique (ci-après le "Prestataire").

ET :
La société BANKING GLOBAL SERVICES, SA au capital de 10 000 000 €, immatriculée au RCS de Paris sous le numéro 666 777 888, dont le siège social est situé au 1 Place de la Défense, 92000 Nanterre, représentée par Mme Christine Lagarde, Présidente du Directoire (ci-après le "Client").

IL A ÉTÉ ARRÊTÉ ET CONVENU CE QUI SUIT :

Article 1 - Objet de l'Accord-Cadre
Le présent accord-cadre définit les conditions contractuelles générales applicables à toutes les prestations de conseil, d'audit, de conception, d'intégration et de formation en intelligence artificielle fournies par le Prestataire au profit du Client.

Article 2 - Commande de Prestations (Bons de Commande)
Chaque prestation spécifique fera l'objet d'un Bon de Commande ou d'un Contrat d'Application signé par les deux Parties, détaillant le cahier des charges, le calendrier, le prix et les livrables requis.

Article 3 - Devoir de Conseil du Prestataire
Le Prestataire s'engage à assurer un devoir d'alerte, de conseil et d'information vis-à-vis du Client, notamment sur la faisabilité technique des modèles d'IA, les limites des données fournies et les risques de biais algorithmiques.

Article 4 - Collaboration Obligatoire du Client
Le Client s'engage à fournir de manière active, de bonne foi et en temps utile au Prestataire l'ensemble des données, accès système, documentations et ressources humaines qualifiées nécessaires à l'accomplissement des services.

Article 5 - Délais et Calendrier
Les délais de réalisation sont convenus d'un commun accord dans chaque Bon de Commande. En cas de retard du Prestataire non imputable au Client ou à un tiers, des pénalités de retard pourront être appliquées conformément aux termes spécifiques.

Article 6 - Méthodologie Agile
Sauf stipulation contraire dans le Bon de Commande, les projets seront menés selon la méthodologie Scrum, prévoyant des réunions de planification et de démonstration de fin de sprint toutes les deux semaines.

Article 7 - Recette des Livrables
À l'issue de chaque phase du projet, le Prestataire soumettra le livrable au Client pour validation. Le Client dispose de 10 jours ouvrés pour formuler des réserves écrites. À défaut de réserves dans ce délai, le livrable est réputé accepté.

Article 8 - Garanties de Conformité Algorithmique
Le Prestataire garantit que ses algorithmes et modèles d'IA sont conçus conformément aux normes éthiques généralement admises et respectent les règles de l'art relatives à la transparence, à l'explicabilité et à l'absence de discrimination.

Article 9 - Sécurité des Systèmes d'Information (SSI)
Le Prestataire s'engage à respecter scrupuleusement la Politique de Sécurité des Systèmes d'Information (PSSI) du Client, en particulier concernant les accès à distance aux bases de données et aux serveurs de production.

Article 10 - Protection des Données Personnelles (RGPD)
Dans le cadre de l'entraînement des modèles d'apprentissage automatique, le Prestataire s'engage à respecter les principes de minimisation des données et d'anonymisation des informations personnelles confidentielles.

Article 11 - Propriété des Algorithmes Préexistants
Le Prestataire reste le propriétaire exclusif de ses biblitèques de codes, outils d'IA et modèles génériques développés indépendamment ou antérieurement à l'accord-cadre.

Article 12 - Propriété des Développements Spécifiques
Sauf clause contraire dans le Bon de Commande, la propriété intellectuelle des codes, modèles et documentations développés spécifiquement et sur mesure pour le compte du Client lui est transférée de plein droit après paiement intégral.

Article 13 - Licence d'Exploitation Commerciale
Pour les composants d'IA préexistants intégrés dans les livrables, le Prestataire concède au Client une licence perpétuelle, mondiale et non exclusive d'utilisation commerciale intégrée à l'application livrée.

Article 14 - Conditions Financières Générales
Les prestations d'IA sont facturées soit au forfait global défini au Bon de Commande, soit en régie au temps passé sur la base d'un taux journalier moyen (TJM) spécifié pour chaque profil d'ingénieur.

Article 15 - Frais de Déplacement et d'Hébergement
Les frais de transport, d'hébergement et de repas exposés par les collaborateurs du Prestataire pour l'exécution des missions au siège du Client seront remboursés sur présentation de justificatifs.

Article 16 - Retards de Paiement
Toute facture impayée à l'échéance porte intérêt au taux d'intérêt légal majoré de 10 points de pourcentage, ainsi qu'à l'indemnité légale de 40 € pour frais de recouvrement.

Article 17 - Audit d'Activités
Le Client pourra désigner un expert indépendant pour auditer périodiquement la conformité des processus de développement et de traitement des données mis en œuvre par le Prestataire au titre du présent contrat.

Article 18 - Secret Professionnel et Confidentialité
Les Parties s'engagent à respecter le secret professionnel le plus strict concernant l'ensemble des données bancaires, transactions, processus d'IA ou codes sources portés à leur connaissance.

Article 19 - Garantie d'Éviction Intellectuelle
Le Prestataire garantit qu'il dispose de tous les droits et autorisations requis pour utiliser et intégrer les technologies tierces ou open source dans le cadre des développements d'IA.

Article 20 - Limitation Réciproque de Responsabilité
Sauf faute lourde ou dolosive, la responsabilité totale cumulée du Prestataire est limitée à un montant maximum correspondant à 50% du montant HT total payé par le Client pour le Bon de Commande concerné.

Article 21 - Exclusion de Responsabilité sur les Décisions d'IA
Le Client reconnaît expressément que les résultats et prédictions générés par les modèles d'IA ne constituent que des aides à la décision. Le Prestataire exclut toute responsabilité quant aux conséquences financières des décisions prises par le Client sur la base de ces résultats.

Article 22 - Assurances Professionnelles
Le Prestataire s'engage à maintenir en vigueur une police d'assurance responsabilité civile professionnelle spécifiquement adaptée aux activités d'intégration d'intelligence artificielle et de traitement de données de masse.

Article 23 - Force Majeure
L'exécution des obligations des Parties sera suspendue de plein droit en cas d'événement de force majeure rendant impossible la fourniture normale des services d'IA ou l'accès aux serveurs.

Article 24 - Non-Sollicitation Mutuelle
Chaque Partie s'interdit d'embaucher, d'engager ou de faire travailler directement ou indirectement un collaborateur de l'autre Partie pendant la durée du contrat et l'année suivante, sous peine d'une indemnité forfaitaire de 100 000 €.

Article 25 - Clause d'Indépendance
Le Prestataire exécute les prestations de manière totalement autonome en fournissant ses propres outils et matériels de travail, de sorte qu'il n'existe aucun lien de subordination juridique entre ses collaborateurs et le Client.

Article 26 - Durée de l'Accord-Cadre
Le présent accord-cadre est conclu pour une durée initiale ferme de 24 mois à compter de sa signature. Il sera ensuite renouvelable d'année en année par avenant écrit d'un commun accord.

Article 27 - Résiliation Partielle d'un Bon de Commande
En cas d'annulation ou de résiliation d'un Bon de Commande spécifique du fait du Client sans manquement du Prestataire, le Client s'engage à payer l'intégralité des travaux déjà réalisés et des frais engagés.

Article 28 - Résiliation Générale pour Manquement
En cas de violation grave ou répétée des engagements de l'accord-cadre par l'une des Parties, l'autre Partie pourra mettre fin immédiatement à l'accord-cadre et à l'ensemble des Bons de Commande en cours après un préavis écrit de 30 jours.

Article 29 - Réversibilité et Transition de Données
À la fin de l'accord-cadre, le Prestataire assistera le Client dans les opérations de migration de ses données d'entraînement et de ses modèles de deep learning vers un autre prestataire ou en interne.

Article 30 - Loi Applicable et Litiges
Le présent accord-cadre est soumis à la loi française. En cas de contestation, et après échec d'une tentative de résolution amiable, compétence exclusive est attribuée aux tribunaux compétents de la ville de Paris.`
  }
];
