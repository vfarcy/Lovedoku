# Lovedoku — Rendez-vous Secrets

Lovedoku est un jeu de déduction dans lequel il faut placer les silhouettes sur
une grille, respecter les indices de chaque chapitre et permettre à B. et V. de
se retrouver seuls dans un même lieu. Les chapitres scénarisés utilisent neuf
silhouettes ; les grilles aléatoires en utilisent de six à neuf. Le jeu est
entièrement exécuté dans le navigateur.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Démarrer le jeu](#démarrer-le-jeu)
- [Règles](#règles)
- [Commandes](#commandes)
- [Chapitres](#chapitres)
- [Grilles aléatoires](#grilles-aléatoires)
- [Solveur et indices](#solveur-et-indices)
- [Technologies et architecture](#technologies-et-architecture)
- [Publication GitHub Pages](#publication-github-pages)
- [Développement et vérification](#développement-et-vérification)

## Fonctionnalités

- Trois chapitres scénarisés sur une grille de 9 × 9.
- Génération à la demande de grilles de 6 × 6 à 9 × 9.
- Neuf silhouettes illustrées en SVG et plusieurs lieux colorés.
- Indices topologiques : voisinage orthogonal ou diagonal et distance de
  Manhattan.
- Indices déclaratifs combinables avec ET, OU et NON.
- Relations de direction, de bordure, de coin et entre lieux.
- Croix d'exclusion manuelles et hachures automatiques.
- Annulation des actions, suivi visuel des indices et vérification de la
  solution.
- Hypothèses réversibles, avec repérage visuel des placements testés.
- Damier encadré façon papier ancien, avec frontières de lieux contrastées et
  repères visuels au survol et au focus clavier.
- Solveur par contraintes avec recherche en profondeur, heuristique MRV et
  limite de calcul, accompagné d'une estimation indicative de complexité.
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
| Retirer une silhouette | Sélectionner cette silhouette dans la palette, puis cliquer sur sa case |
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

Le panneau **Ergonomie & Aide** (`?`) donne aussi des exemples pour distinguer
les voisinages orthogonal, diagonal et du roi, comprendre les distances à pas de
marche, les directions, les frontières de lieux et les combinaisons ET/OU/NON.
Il explique également le calcul et les seuils de la difficulté de la grille.

## Chapitres

Les trois chapitres prédéfinis utilisent une grille de 9 × 9 et les neuf
silhouettes :

1. **Le Jardin d'Hiver** — salons botaniques et rendez-vous sous la verrière.
2. **L'Opéra sous la Pluie** — loges, foyer et galeries musicales.
3. **Minuit sur les Toits de Paris** — ateliers et coupoles nocturnes.

Chaque chapitre possède sa propre carte de lieux, ses repères, ses indices et
son récit de victoire. Les boutons de chapitre chargent une nouvelle partie ;
les placements de la partie précédente ne sont pas conservés.

Les trois scénarios prédéfinis sont conçus pour admettre chacun exactement une
solution. À chaque chargement, le solveur vérifie cette unicité avant
d'afficher le chapitre. Si elle ne peut pas être certifiée (aucune solution,
plusieurs solutions ou limite de calcul atteinte), le jeu génère en mémoire une
grille unique de même taille pour la session courante et conserve l'identité
narrative du chapitre.

## Grilles aléatoires

Les boutons **6×6**, **7×7**, **8×8** et **9×9** lancent la génération d'une
énigme dans le navigateur. La taille détermine le nombre de lignes, de colonnes
et de silhouettes utilisées. Le générateur construit une carte de lieux
connexes, choisit une permutation de placements cible, puis place des repères
adjacents et compose des indices à partir de cette cible.

Les indices générés varient les relations utilisées : proximité de repères,
bordure ou coin, direction, distance et relations entre les lieux. Des règles
ET/OU/NON peuvent aussi être utilisées pour exprimer des combinaisons sans
remplacer la vérification d'unicité.

Le solveur vérifie chaque grille candidate ; elle n'est présentée qu'après la
certification d'une solution unique dans la limite de recherche. Le générateur
choisit aléatoirement entre des grilles résolubles par placements forcés (avec
des indices d'ancrage ajoutés si nécessaire) et des grilles qui nécessitent une
hypothèse selon les déductions reconnues. Le badge **Progression** indique la
catégorie de la grille et son état courant. Le générateur relance les séries de
tentatives en cédant la main au navigateur entre elles ; la génération peut
donc prendre un moment. Une grille aléatoire remplace le chapitre courant pour
la session ; elle n'est pas enregistrée après le rechargement de la page.

Pour explorer une piste sur une autre grille, cliquez sur **Hypothèse** avant
de placer un pion. Le bouton devient **Sous-hypothèse** pendant une piste et
ouvre un nouveau niveau imbriqué. Les placements qui diffèrent de l'état
précédant la première hypothèse sont marqués d'un **?**. **Revenir au niveau N**
abandonne seulement le niveau actif et restaure son état de départ ; les niveaux
parents restent ouverts. **Valider le niveau N** conserve la piste et ferme ce
niveau, sans fermer son parent. **Tout abandonner** (disponible à partir du
niveau 2) restaure l'état précédant la première hypothèse et ferme toute la
chaîne ; au niveau 1, **Revenir au niveau 1** produit le même effet.
**Annuler** reste disponible pour défaire un placement ou une croix sans fermer
les points de retour.

## Solveur et indices

Les indices sont décrits par un arbre de règles déclaratif. Les opérateurs
**ET**, **OU** et **NON** peuvent combiner des prédicats tels que voisinage
orthogonal/diagonal, distance de Manhattan, direction relative, bordure ou coin
de grille, frontière entre lieux et relations entre lieux. La même évaluation
sert au solveur et à la validation finale ; les règles composées peuvent donc
être vérifiées aussi pendant les placements partiels.

Les indices se définissent dans `index.html` avec les constructeurs `Rule`.
Les coordonnées utilisées dans le code sont indexées à partir de zéro : `(0, 0)`
est la case en haut à gauche. Par exemple, une proximité et une distance peuvent
être réunies ainsi :

```js
Rule.and(
  Rule.adjacent('J', Rule.landmark(6, 7)),
  Rule.distance('J', 'Gh', 4)
)
```

Les expressions peuvent aussi être imbriquées ; par exemple,
`Rule.not(Rule.or(regleA, regleB))` signifie que ni `regleA` ni `regleB` ne
doit être vraie. Il s'agit d'une API d'édition dans le code, pas d'un éditeur
visuel accessible dans l'interface.

Le solveur CSP (*Constraint Satisfaction Problem*) complète les placements
déjà posés en respectant les contraintes de lignes et colonnes, les règles de
lieu et les indices. Il choisit le prochain jeton à explorer avec l'heuristique
**MRV** (*Minimum Remaining Values*), qui privilégie le jeton ayant le moins de
cases candidates.

Le badge CSP indique si la piste a une solution, plusieurs solutions ou aucune.
La recherche est plafonnée afin de préserver la réactivité de la page : si ce
plafond est atteint, le résultat est affiché comme **indéterminé** et non comme
une preuve d'absence ou d'unicité.

Le badge **Progression** indique, à partir des placements actuels, si le solveur
voit une suite de coups forcés ou s'il est bloqué et recommande une hypothèse.
Les déductions reconnues sont une case unique pour un jeton, ou une seule
possibilité dans une ligne ou une colonne, en tenant compte des contradictions
détectées dans les indices. **Hypothèse requise** signifie donc qu'aucun coup
forcé de ces types n'a été trouvé ; une déduction humaine plus avancée peut
toutefois éviter de supposer.

Le bouton **Indice logique (CSP)** fournit une position compatible avec les
contraintes restantes. Si plusieurs solutions sont déjà trouvées, la position
est présentée comme un exemple, et non comme une obligation. Si la recherche
est interrompue par sa limite, l'indice signale que le résultat est incomplet.

Le badge **Difficulté de la grille** est une estimation calculée au chargement,
sur la grille vide ; contrairement au badge **Progression**, elle reste fixe
pendant la partie. Elle combine le test de placements forcés et un score
technique d'**effort du solveur** : nœuds CSP explorés, plus 30 points par
opérateur OU et 10 par opérateur NON.

La catégorie de base est **Accessible** jusqu'à 300 points, **Intermédiaire**
de 301 à 1 200 et **Soutenue** au-delà. Si les déductions reconnues ne suffisent
pas à terminer sans hypothèse, la difficulté est au minimum **Intermédiaire**,
même avec un score inférieur ou égal à 300. L'infobulle du badge donne le score
technique et le résultat du test initial. Cette estimation ne certifie pas la
difficulté humaine : une déduction plus avancée peut éviter une hypothèse.
Si la recherche atteint sa limite ou ne certifie pas une solution unique, aucune
estimation n'est affichée.

## Technologies et architecture

- `index.html` contient la structure, les styles et le code JavaScript du jeu.
- HTML, CSS, JavaScript natif et SVG en ligne.
- Tailwind CSS chargé depuis `cdn.tailwindcss.com`.
- Polices chargées depuis Google Fonts, avec des polices de repli.
- Aucune dépendance à installer, aucun serveur métier et aucun stockage
  persistant des parties.

L'état de jeu — placements, croix, chapitre et indices cochés — reste en mémoire
dans la page. Un rechargement réinitialise la partie.

## Publication GitHub Pages

Le workflow [deploy-pages.yml](.github/workflows/deploy-pages.yml) publie
automatiquement `index.html` sur GitHub Pages à chaque push vers `main`. Il peut
aussi être lancé manuellement depuis l'onglet **Actions** avec
**Deploy GitHub Pages**. Le workflow prépare l'artifact en copiant la page et
en y inscrivant le numéro du run ainsi que la date et l'heure de génération en
UTC. Cette information apparaît en bas de la page publiée.

Après la première exécution réussie, le site est accessible à l'adresse :
<https://vfarcy.github.io/Lovedoku/>.

## Développement et vérification

Il n'y a pas de commande de build, de gestionnaire de paquets ni de suite de
tests automatisés dans le dépôt. Après une modification, vérifiez manuellement :

1. que chacun des trois chapitres se charge et que le solveur y certifie une
   solution unique ;
2. que les placements mettent à jour les badges CSP et **Progression** ; les
   croix manuelles sont des annotations et ne modifient pas les contraintes du
   solveur ;
3. que l'annulation, les croix et le raccourci d'aide fonctionnent ;
4. que les indices ET/OU/NON et les règles de direction, bordure, coin et lieu
   sont évalués de la même façon par le solveur et la validation finale ;
5. que le bouton d'indice distingue une possibilité d'une position forcée ;
6. que les générateurs de 6 × 6 à 9 × 9 produisent des grilles à solution
   unique dans les deux modes de progression ;
7. que la validation n'affiche la victoire qu'après respect de toutes les
   règles et de tous les indices.
