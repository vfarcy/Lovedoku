# Lovedoku — Rendez-vous Secrets

Lovedoku est un jeu de déduction dans lequel il faut placer neuf silhouettes sur
une grille, respecter les indices de chaque chapitre et permettre à B. et V. de
se retrouver seuls dans un même lieu. Le jeu est entièrement exécuté dans le
navigateur.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Démarrer le jeu](#démarrer-le-jeu)
- [Règles](#règles)
- [Commandes](#commandes)
- [Chapitres](#chapitres)
- [Grilles aléatoires](#grilles-aléatoires)
- [Solveur et indices](#solveur-et-indices)
- [Technologies et architecture](#technologies-et-architecture)
- [Développement et vérification](#développement-et-vérification)

## Fonctionnalités

- Trois chapitres scénarisés sur une grille de 9 × 9.
- Génération à la demande de grilles de 6 × 6 à 9 × 9.
- Neuf silhouettes illustrées en SVG et plusieurs lieux colorés.
- Indices topologiques : voisinage orthogonal ou diagonal et distance de
  Manhattan.
- Croix d'exclusion manuelles et hachures automatiques.
- Annulation des actions, suivi visuel des indices et vérification de la
  solution.
- Solveur par contraintes avec recherche en profondeur, heuristique MRV et
  limite de calcul.
- Interface responsive en français, utilisable à la souris et sur écran tactile.

## Démarrer le jeu

Aucune installation ni compilation n'est nécessaire.

1. Récupérez le dépôt ou téléchargez ses fichiers.
2. Ouvrez `index.html` dans un navigateur moderne.

Pour servir le fichier en local avec Python, ouvrez un terminal à la racine du
projet et exécutez :

```sh
python -m http.server 8000
```

Puis ouvrez <http://localhost:8000>.

La page charge Tailwind CSS et les polices Cormorant Garamond et Inter depuis des
CDN. Une connexion Internet est donc nécessaire pour obtenir le style complet
et ces polices. Le jeu ne nécessite pas de serveur applicatif ni de compte.

## Règles

1. Chaque silhouette doit occuper une case libre, sans repère de lieu.
2. Chaque ligne et chaque colonne doit contenir exactement une silhouette.
3. B. et V. doivent se trouver dans le même lieu coloré.
4. Aucun témoin ne peut partager ce lieu avec B. et V.
5. Tous les indices du chapitre doivent être respectés pour sceller le
   rendez-vous.

Les repères dessinés sur la grille — fontaine, piano, horloge, etc. — sont des
obstacles : aucune silhouette ne peut être placée sur leur case. Les indices
utilisent notamment des voisinages orthogonaux, des diagonales et des distances
de marche sur la grille.

La partie est vérifiée automatiquement lorsque toutes les silhouettes sont
placées. Le bouton **Sceller le rendez-vous** permet également de lancer la
vérification à la demande.

## Commandes

| Action | Commande |
| --- | --- |
| Placer la silhouette sélectionnée | Clic gauche ou toucher une case libre |
| Retirer une silhouette | Cliquer sur sa case |
| Remplacer une silhouette sur une case | Sélectionner une autre silhouette, puis cliquer sur la case occupée |
| Sélectionner une silhouette | Cliquer sur sa vignette dans la palette |
| Marquer ou retirer une croix | Clic droit sur une case libre |
| Activer/désactiver le mode Croix | Bouton **Mode Croix**, puis clic gauche sur une case libre |
| Annuler la dernière action | Bouton **Annuler**, `Ctrl+Z` ou `Cmd+Z` |
| Afficher/masquer l'aide | Bouton **Ergonomie & Aide** ou touche `?` |
| Fermer la fenêtre de victoire | `Échap` |

Après la pose d'une silhouette, la palette sélectionne automatiquement la
prochaine silhouette non placée, lorsqu'il en reste une.

**Auto-croix** hachure les cases des lignes et colonnes déjà occupées. Lorsque
B. et V. sont placés dans le même lieu, le reste de ce lieu est également
signalé comme exclu. Cette aide visuelle ne remplace pas les indices.

Le bouton **Vider** retire les placements et les croix manuelles du chapitre
courant. Les indices du carnet peuvent être cochés indépendamment pour suivre
vos déductions ; leur coche est une annotation personnelle, pas une validation
automatique de l'indice.

## Chapitres

Les trois chapitres prédéfinis utilisent une grille de 9 × 9 et les neuf
silhouettes :

1. **Le Jardin d'Hiver** — salons botaniques et rendez-vous sous la verrière.
2. **L'Opéra sous la Pluie** — loges, foyer et galeries musicales.
3. **Minuit sur les Toits de Paris** — ateliers et coupoles nocturnes.

Chaque chapitre possède sa propre carte de lieux, ses repères, ses indices et
son récit de victoire. Les boutons de chapitre chargent une nouvelle partie ;
les placements de la partie précédente ne sont pas conservés.

## Grilles aléatoires

Les boutons **6×6**, **7×7**, **8×8** et **9×9** lancent la génération d'une
énigme dans le navigateur. La taille détermine le nombre de lignes, de colonnes
et de silhouettes utilisées. La grille associe des lieux, une permutation de
placements cible, des repères adjacents et des indices calculés à partir de
cette cible.

Le solveur vérifie les grilles générées et le générateur ne présente une grille
que lorsqu'il en a certifié une solution unique dans la limite de calcul prévue.
La génération peut prendre un moment. Une grille aléatoire remplace le chapitre
courant pour la session ; elle n'est pas enregistrée après le rechargement de la
page.

## Solveur et indices

Le solveur CSP (*Constraint Satisfaction Problem*) complète les placements
déjà posés en respectant les contraintes de lignes et colonnes, les règles de
lieu et les indices. Il choisit le prochain jeton à explorer avec l'heuristique
**MRV** (*Minimum Remaining Values*), qui privilégie le jeton ayant le moins de
cases candidates.

Le badge CSP indique si la piste a une solution, plusieurs solutions ou aucune.
La recherche est plafonnée afin de préserver la réactivité de la page : si ce
plafond est atteint, le résultat est affiché comme **indéterminé** et non comme
une preuve d'absence ou d'unicité.

Le bouton **Indice logique (CSP)** fournit une position compatible avec les
contraintes restantes. Si plusieurs solutions sont déjà trouvées, la position
est présentée comme un exemple, et non comme une obligation. Si la recherche
est interrompue par sa limite, l'indice signale que le résultat est incomplet.

## Technologies et architecture

- `index.html` contient la structure, les styles et le code JavaScript du jeu.
- HTML, CSS, JavaScript natif et SVG en ligne.
- Tailwind CSS chargé depuis `cdn.tailwindcss.com`.
- Polices chargées depuis Google Fonts, avec des polices de repli.
- Aucune dépendance à installer, aucun serveur métier et aucun stockage
  persistant des parties.

L'état de jeu — placements, croix, chapitre et indices cochés — reste en mémoire
dans la page. Un rechargement réinitialise la partie.

## Développement et vérification

Il n'y a pas de commande de build, de gestionnaire de paquets ni de suite de
tests automatisés dans le dépôt. Après une modification, vérifiez manuellement :

1. que chacun des trois chapitres se charge ;
2. que les placements et les croisements de lignes/colonnes mettent à jour le
   badge CSP ;
3. que l'annulation, les croix et le raccourci d'aide fonctionnent ;
4. que le bouton d'indice distingue une possibilité d'une position forcée ;
5. que les générateurs 6 × 6 et 9 × 9 produisent une grille utilisable ;
6. que la validation n'affiche la victoire qu'après respect de toutes les
   règles et de tous les indices.
