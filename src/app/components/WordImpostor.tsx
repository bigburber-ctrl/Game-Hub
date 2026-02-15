import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/app/App";
import { GameConfig } from "@/app/components/GameSettings";
import { ChevronLeft, Eye, Check, Users, ShieldAlert, Award, RotateCcw, Lightbulb, Info } from "lucide-react";
import { toast } from "sonner";

interface WordImpostorProps {
  players: Player[];
  config: GameConfig;
  onBack: () => void;
}

const WORD_CATEGORIES: Record<string, { word: string; hint: string }[]> = {
  "Objets du quotidien": [
    { word: "Balai", hint: "Poussière" },
    { word: "Aspirateur", hint: "Bruit" },
    { word: "Calendrier", hint: "Date" },
    { word: "Horloge", hint: "Aiguille" },
    { word: "Théière", hint: "Vapeur" },
    { word: "Cafetière", hint: "Filtre" },
    { word: "Bicyclette", hint: "Pédale" },
    { word: "Lampe", hint: "Ombre" },
    { word: "Chaise", hint: "Dossier" },
    { word: "Table", hint: "Surface" },
    { word: "Tasse", hint: "Anse" },
    { word: "Verre", hint: "Transparent" },
    { word: "Livre", hint: "Page" },
    { word: "Cahier", hint: "Ligne" },
    { word: "Stylo", hint: "Encre" },
    { word: "Crayon", hint: "Mine" },
    { word: "Téléphone", hint: "Signal" },
    { word: "Chargeur", hint: "Câble" },
    { word: "Montre", hint: "Tic" },
    { word: "Clé", hint: "Serrure" },
    { word: "Lunettes", hint: "Vue" },
    { word: "Télécommande", hint: "Bouton" },
    { word: "Ordinateur", hint: "Clavier" },
    { word: "Souris", hint: "Clic" },
    { word: "Casque", hint: "Son" },
    { word: "Sac", hint: "Fermeture" },
    { word: "Parapluie", hint: "Pluie" },
    { word: "Miroir", hint: "Reflet" },
    { word: "Couteau", hint: "Lame" },
    { word: "Fourchette", hint: "Dents" },
    { word: "Brosse à dents", hint: "Dentifrice" },
    { word: "Peigne", hint: "Cheveux" },
    { word: "Savon", hint: "Mousse" },
    { word: "Shampoing", hint: "Cheveux" },
    { word: "Serviette", hint: "Séchage" },
    { word: "Oreiller", hint: "Tête" },
    { word: "Couverture", hint: "Chaleur" },
    { word: "Rideau", hint: "Fenêtre" },
    { word: "Tapis", hint: "Sol" },
    { word: "Étagère", hint: "Livres" },
    { word: "Vase", hint: "Fleurs" },
    { word: "Assiette", hint: "Repas" },
    { word: "Bol", hint: "Soupe" },
    { word: "Couverts", hint: "Manger" },
    { word: "Four", hint: "Chaleur" },
    { word: "Réfrigérateur", hint: "Froid" },
    { word: "Micro-ondes", hint: "Rapide" },
    { word: "Mixeur", hint: "Lisse" },
    { word: "Grille-pain", hint: "Toast" },
    { word: "Clé USB", hint: "Stockage" },
    { word: "Imprimante", hint: "Feuille" },
    { word: "Tableau", hint: "Marqueur" },
    { word: "Stylo-plume", hint: "Encre" },
    { word: "Agenda", hint: "Organisation" },
    { word: "Ciseaux", hint: "Découpe" },
    { word: "Colle", hint: "Fixer" },
    { word: "Ruban adhésif", hint: "Coller" }
  ],

  "Lieux": [
    { word: "Plage", hint: "Sable" },
    { word: "Forêt", hint: "Arbres" },
    { word: "Montagne", hint: "Altitude" },
    { word: "Désert", hint: "Chaleur" },
    { word: "Ville", hint: "Circulation" },
    { word: "Village", hint: "Place" },
    { word: "Château", hint: "Muraille" },
    { word: "École", hint: "Classe" },
    { word: "Université", hint: "Campus" },
    { word: "Bibliothèque", hint: "Silence" },
    { word: "Hôpital", hint: "Urgence" },
    { word: "Clinique", hint: "Consultation" },
    { word: "Gare", hint: "Quai" },
    { word: "Aéroport", hint: "Piste" },
    { word: "Parc", hint: "Pelouse" },
    { word: "Jardin", hint: "Fleurs" },
    { word: "Stade", hint: "Supporters" },
    { word: "Gymnase", hint: "Ballon" },
    { word: "Cinéma", hint: "Écran" },
    { word: "Théâtre", hint: "Scène" },
    { word: "Restaurant", hint: "Menu" },
    { word: "Café", hint: "Terrasse" },
    { word: "Supermarché", hint: "Rayon" },
    { word: "Bureau", hint: "Dossier" },
    { word: "Usine", hint: "Machine" },
    { word: "Entrepôt", hint: "Palette" },
    { word: "Musée", hint: "Exposition" },
    { word: "Église", hint: "Autel" },
    { word: "Cimetière", hint: "Tombe" },
    { word: "Piscine", hint: "Nage" },
    { word: "Plage privée", hint: "Parasol" },
    { word: "Bibliothèque municipale", hint: "Lecture" },
    { word: "Zoo", hint: "Animaux" },
    { word: "Aquarium", hint: "Poissons" },
    { word: "Mont", hint: "Sommet" },
    { word: "Vallée", hint: "Rivière" },
    { word: "Île", hint: "Plage" },
    { word: "Port", hint: "Bateau" },
    { word: "Marché", hint: "Étal" },
    { word: "Cinéma drive-in", hint: "Voiture" },
    { word: "Théâtre antique", hint: "Amphithéâtre" },
    { word: "Chambre", hint: "Lit" },
    { word: "Salon", hint: "Canapé" },
    { word: "Cuisine", hint: "Four" },
    { word: "Salle de bain", hint: "Douche" }
  ],

  "Animaux": [
    { word: "Lion", hint: "Crinière" },
    { word: "Tigre", hint: "Rayures" },
    { word: "Éléphant", hint: "Trompe" },
    { word: "Girafe", hint: "Cou" },
    { word: "Zèbre", hint: "Noir et blanc" },
    { word: "Panda", hint: "Bambou" },
    { word: "Koala", hint: "Sommeil" },
    { word: "Kangourou", hint: "Poche" },
    { word: "Loup", hint: "Hurlement" },
    { word: "Renard", hint: "Ruse" },
    { word: "Ours", hint: "Hibernation" },
    { word: "Chien", hint: "Laisse" },
    { word: "Chat", hint: "Griffe" },
    { word: "Lapin", hint: "Terrier" },
    { word: "Cheval", hint: "Sabot" },
    { word: "Vache", hint: "Lait" },
    { word: "Mouton", hint: "Laine" },
    { word: "Cochon", hint: "Boue" },
    { word: "Poulet", hint: "Plumes" },
    { word: "Canard", hint: "Étang" },
    { word: "Aigle", hint: "Rapace" },
    { word: "Hibou", hint: "Nuit" },
    { word: "Serpent", hint: "Écaille" },
    { word: "Grenouille", hint: "Saut" },
    { word: "Poisson", hint: "Nageoire" },
    { word: "Requin", hint: "Dents" },
    { word: "Dauphin", hint: "Sifflement" },
    { word: "Baleine", hint: "Géant" },
    { word: "Araignée", hint: "Toile" },
    { word: "Fourmi", hint: "Colonie" },
    { word: "Moustique", hint: "Piqûre" },
    { word: "Chauve-souris", hint: "Vol" },
    { word: "Coccinelle", hint: "Taches" },
    { word: "Hippocampe", hint: "Étrier" },
    { word: "Pingouin", hint: "Glace" },
    { word: "Écureuil", hint: "Noix" },
    { word: "Renne", hint: "Neige" },
    { word: "Castor", hint: "Barrages" },
    { word: "Otarie", hint: "Phoque" }
  ],

  "Nourriture": [
    { word: "Pomme", hint: "Verger" },
    { word: "Banane", hint: "Peau" },
    { word: "Orange", hint: "Zeste" },
    { word: "Citron", hint: "Acide" },
    { word: "Fraise", hint: "Rouge" },
    { word: "Raisin", hint: "Grappe" },
    { word: "Tomate", hint: "Sauce" },
    { word: "Carotte", hint: "Racine" },
    { word: "Salade", hint: "Feuille" },
    { word: "Riz", hint: "Grain" },
    { word: "Pâtes", hint: "Cuisson" },
    { word: "Pain", hint: "Croûte" },
    { word: "Fromage", hint: "Affinage" },
    { word: "Beurre", hint: "Tartine" },
    { word: "Œuf", hint: "Coquille" },
    { word: "Poulet", hint: "Rôti" },
    { word: "Steak", hint: "Grillade" },
    { word: "Poisson", hint: "Filet" },
    { word: "Pizza", hint: "Part" },
    { word: "Burger", hint: "Garniture" },
    { word: "Frites", hint: "Sachet" },
    { word: "Sandwich", hint: "Étages" },
    { word: "Soupe", hint: "Bol" },
    { word: "Gâteau", hint: "Bougie" },
    { word: "Biscuit", hint: "Croquant" },
    { word: "Glace", hint: "Cornet" },
    { word: "Yaourt", hint: "Pot" },
    { word: "Chocolat", hint: "Cacao" },
    { word: "Bonbon", hint: "Sucre" },
    { word: "Céréales", hint: "Bol" },
    { word: "Noix", hint: "Coque" },
    { word: "Amande", hint: "Croquer" },
    { word: "Miel", hint: "Abeille" },
    { word: "Beignet", hint: "Sucre" },
    { word: "Croissant", hint: "Petit déjeuner" },
    { word: "Confiture", hint: "Pot" },
    { word: "Chips", hint: "Sel" }
  ],
  
    "Films": [
    { word: "Titanic", hint: "Iceberg" },
    { word: "Avatar", hint: "Bleu" },
    { word: "Matrix", hint: "Pilule" },
    { word: "Jurassic Park", hint: "Dinosaure" },
    { word: "Star Wars", hint: "Sabre" },
    { word: "Harry Potter", hint: "Sorcier" },
    { word: "Le Seigneur des anneaux", hint: "Anneau" },
    { word: "Forrest Gump", hint: "Course" },
    { word: "Retour vers le futur", hint: "Temps" },
    { word: "Rocky", hint: "Boxe" },
    { word: "Les Dents de la mer", hint: "Requin" },
    { word: "E.T.", hint: "Téléphone" },
    { word: "Le Roi lion", hint: "Savane" },
    { word: "Histoire de jouets", hint: "Jouets" },
    { word: "Pirates des Caraïbes", hint: "Navire" },
    { word: "Batman", hint: "Chauve-souris" },
    { word: "Spider-Man", hint: "Toile" },
    { word: "Avengers", hint: "Équipe" },
    { word: "Interstellaire", hint: "Espace" },
    { word: "Parasite", hint: "Maison" },
    { word: "Fight Club", hint: "Règle" },
    { word: "Shrek", hint: "Ogre" },
    { word: "Kung Fu Panda", hint: "Arts martiaux" },
    { word: "Inception", hint: "Rêve" },
    { word: "Gladiateur", hint: "Colisée" },
    { word: "Panthère noire", hint: "Wakanda" },
    { word: "Deadpool", hint: "Humour" },
    { word: "Coco", hint: "Musique" },
    { word: "Moana", hint: "Océan" },
    { word: "La Reine des neiges", hint: "Glace" },
    { word: "Le Monde de Nemo", hint: "Poisson" },
    { word: "Là-haut", hint: "Ballons" },
    { word: "Les Incroyables", hint: "Super" },
    { word: "Ratatouille", hint: "Cuisine" },
    { word: "Les Gardiens de la Galaxie", hint: "Star-Lord" },
    { word: "Le Parrain", hint: "Mafia" },
    { word: "Pulp Fiction", hint: "Twist" },
    { word: "Intouchables", hint: "Handicap" },
    { word: "Iron Man", hint: "Armure" },
    { word: "Thor", hint: "Marteau" },
    { word: "Captain America", hint: "Bouclier" },
    { word: "Doctor Strange", hint: "Magie" },
    { word: "Veuve noire", hint: "Espionne" },
    { word: "Ant-Man", hint: "Petit" },
    { word: "WALL-E", hint: "Robot" },
    { word: "Sans Dessus Dessous", hint: "Émotions" },
    { word: "Cendrillon", hint: "Chaussure" },
    { word: "La Belle et la Bête", hint: "Rose" },
    { word: "Aladdin", hint: "Lampe" },
    { word: "Mulan", hint: "Épée" },
    { word: "Zootopie", hint: "Animaux" },
    { word: "Star Trek", hint: "Vaisseau" },
    { word: "Monstres et compagnie", hint: "Monstres" },
    { word: "Moi, moche et méchant", hint: "Méchanceté" },
    { word: "Minions", hint: "Jaune" },
    { word: "Lego Movie", hint: "Briques" },
    { word: "Sing", hint: "Chant" },
    { word: "Comme des bêtes", hint: "Animaux" },
    { word: "Le Livre de la jungle", hint: "Nature" },
    { word: "Alita : Battle Angel", hint: "Robot" },
    { word: "Hunger Games", hint: "Arène" },
    { word: "Le Labyrinthe", hint: "Labyrinthe" },
    { word: "Je suis une légende", hint: "Virus" },
    { word: "Nos étoiles contraires", hint: "Cancer" },
    { word: "Trueman show", hint: "Show" },
    { word: "Rocketman", hint: "Musique" },
    { word: "The Polar Express", hint: "Train" },
    { word: "Le Loup de Wall Street", hint: "Bourse" },
    { word: "Kill Bill", hint: "Épée" },
    { word: "Pocahontas", hint: "Indien" },
    { word: "Tarzan", hint: "Jungle" },
    { word: "Hercule", hint: "Force" },
    { word: "La Princesse et la grenouille", hint: "Grenouille" },
    { word: "Raiponce", hint: "Cheveux" },
    { word: "Rebelle", hint: "Arc" },
    { word: "Âme", hint: "Jazz" },
    { word: "Luca", hint: "Mer" },
    { word: "Raya et le dernier dragon", hint: "Dragon" },
    { word: "Encanto", hint: "Maison" },
    { word: "Buzz l'Éclair", hint: "Espace" },
    { word: "La Petite Sirène", hint: "Eau" },
    { word: "Peter Pan", hint: "Vol" },
    { word: "Les Mondes de Ralph", hint: "Jeux" },
    { word: "Les Nouveaux Héros", hint: "Robot" },
],
  
"Jeux vidéo": [
    { word: "Minecraft", hint: "Imagination" },
    { word: "Fortnite", hint: "JcJ" },
    { word: "GTA V", hint: "Ville" },
    { word: "Mario", hint: "Pièce" },
    { word: "The Legend of Zelda", hint: "Aventure" },
    { word: "Pokémon", hint: "Capture" },
    { word: "Call of Duty", hint: "Guerre" },
    { word: "Among Us", hint: "Trahison" },
    { word: "Roblox", hint: "Création" },
    { word: "FIFA", hint: "Sport" },
    { word: "Rocket League", hint: "Voiture" },
    { word: "League of Legends", hint: "Champions" },
    { word: "Valorant", hint: "Agents" },
    { word: "CS:GO", hint: "Bombe" },
    { word: "Overwatch", hint: "Équipe" },
    { word: "The Sims", hint: "Vie" },
    { word: "Animal Crossing", hint: "Village" },
    { word: "Assassin's Creed", hint: "Discrétion" },
    { word: "God of War", hint: "Mythologie" },
    { word: "Red Dead Redemption", hint: "Western" },
    { word: "Skyrim", hint: "Dragon" },
    { word: "Elden Ring", hint: "Difficulté" },
    { word: "Dark Souls", hint: "Mort" },
    { word: "Clash Royale", hint: "Cartes" },
    { word: "Brawl Stars", hint: "Arène" },
    { word: "Fall Guys", hint: "Obstacles" },
    { word: "Hollow Knight", hint: "Insecte" },
    { word: "Stardew Valley", hint: "Ferme" },
    { word: "Terraria", hint: "Minage" },
    { word: "Celeste", hint: "Montagne" },
    { word: "Final Fantasy", hint: "Cloud" },
    { word: "Persona", hint: "Fantôme" },
    { word: "Resident Evil", hint: "Horreur" },
    { word: "The Last of Us", hint: "Zombies" },
    { word: "Spider-Man", hint: "Toile" },
    { word: "Ghost of Tsushima", hint: "Samouraï" },
    { word: "Cyberpunk 2077", hint: "Ville nocturne" },
    { word: "Doom", hint: "Enfer" },
    { word: "Genshin Impact", hint: "Élément" },
    { word: "Super Smash Bros", hint: "Combattants" },
    { word: "Mario Kart", hint: "Course" },
    { word: "Splatoon", hint: "Encre" },
    { word: "Luigi's Mansion", hint: "Fantôme" },
    { word: "Donkey Kong", hint: "Tonneau" },
    { word: "Fire Emblem", hint: "Stratégie" },
    { word: "Kirby", hint: "Rose" },
    { word: "Pikmin", hint: "Petit" },
    { word: "Pac-Man", hint: "Labyrinthe" },
    { word: "Tetris", hint: "Blocs" },
    { word: "Sonic", hint: "Vitesse" },
    { word: "Street Fighter", hint: "Combat" },
    { word: "Tekken", hint: "Combat" },
    { word: "Mortal Kombat", hint: "Fatalité" },
    { word: "Halo", hint: "Spartan" },
    { word: "Mass Effect", hint: "Espace" },
    { word: "Portal", hint: "Puzzle" },
    { word: "Half-Life", hint: "Gordon" },
    { word: "Left 4 Dead", hint: "Zombies" },
    { word: "Team Fortress 2", hint: "Classes" },
    { word: "Overcooked", hint: "Cuisine" },
    { word: "Subnautica", hint: "Océan" },
    { word: "No Man's Sky", hint: "Univers" },
    { word: "Dead by Daylight", hint: "Horreur" },
    { word: "Cuphead", hint: "Boss" },
    { word: "Bloodborne", hint: "Horreur" },
    { word: "Arc Raiders", hint: "Extraction" },
    { word: "Fallout", hint: "Apocalypse" },
    { word: "Cult of the Lamb", hint: "Moutton" },
    { word: "Ark", hint: "Dinosaure" },

],

   "Cartes Clash Royale": [
  { word: "Petit Prince", hint: "Noble" },
  { word: "Chevalier d’or", hint: "Épreuve" },
  { word: "Roi squelette", hint: "Os" },
  { word: "Maître Mineur", hint: "Foreuse" },
  { word: "Reine des archers", hint: "Arc" },
  { word: "Goblinstein", hint: "Gobelin" },
  { word: "Monk", hint: "Moine" },
  { word: "Cheffe des voleuses", hint: "Furtive" },
  { word: "La bûche", hint: "Bois" },
  { word: "Mineur", hint: "Tunnel" },
  { word: "Princesse", hint: "Portée" },
  { word: "Sorcier de glace", hint: "Froid" },
  { word: "Fantôme royal", hint: "Invisible" },
  { word: "Voleuse", hint: "Course" },
  { word: "Pêcheur", hint: "Hameçon" },
  { word: "Électro-sorcier", hint: "Éclair" },
  { word: "Dragon de l'enfer", hint: "Rayon" },
  { word: "Phoenix", hint: "Œuf" },
  { word: "Archer Magique", hint: "Ligne" },
  { word: "Bûcheron", hint: "Hache" },
  { word: "Sorcière de la nuit", hint: "Chauvesouris" },
  { word: "Mamie sorcière", hint: "Malédiction" },
  { word: "Ram Rider", hint: "Lasso" },
  { word: "Cimetière", hint: "Squelettes" },
  { word: "Goblin Machine", hint: "Canon" },
  { word: "Zappy", hint: "Charge" },
  { word: "Impératrice spirituelle", hint: "Esprits" },
  { word: "Méga Knight", hint: "Saut" },
  { word: "Molosse de lave", hint: "Volant" },
  { word: "Miroir", hint: "Copie" },
  { word: "Fût à barbares", hint: "Surprise" },
  { word: "Sapeurs", hint: "Bombes" },
  { word: "Goblin Curse", hint: "Sort" },
  { word: "Rage", hint: "Vitesse" },
  { word: "Fût à gobelins", hint: "Lancer" },
  { word: "Gardes", hint: "Bouclier" },
  { word: "Armée de squelettes", hint: "Nombre" },
  { word: "Vines", hint: "Plantes" },
  { word: "Clonage", hint: "Double" },
  { word: "Tornade", hint: "Vent" },
  { word: "Void", hint: "Vide" },
  { word: "Bébé dragon", hint: "Souffle" },
  { word: "Prince ténébreux", hint: "Bouclier" },
  { word: "Freeze", hint: "Glace" },
  { word: "Poison", hint: "Nuage" },
  { word: "Rune Giant", hint: "Runes" },
  { word: "Chasseur", hint: "Fusil" },
  { word: "Foreuse gobeline", hint: "Sol" },
  { word: "Sorcière", hint: "Invocation" },
  { word: "Ballon", hint: "Bombes" },
  { word: "Prince", hint: "Charge" },
  { word: "Électro-Dragon", hint: "Chaîne" },
  { word: "Bouliste", hint: "Rocher" },
  { word: "Bourreau", hint: "Hache" },
  { word: "Charrette à canon", hint: "Roulante" },
  { word: "Squelette géant", hint: "Bombe" },
  { word: "Foudre", hint: "Éclair" },
  { word: "Gobelin géant", hint: "Sac" },
  { word: "Arc-X", hint: "Siège" },
  { word: "P.E.K.K.A", hint: "Armure" },
  { word: "Électro-géant", hint: "Électricité" },
  { word: "Golem", hint: "Pierre" },
  { word: "Esprit de guérison", hint: "Soin" },
  { word: "Golem de glace", hint: "Froid" },
  { word: "Buisson suspiscieux", hint: "Cachette" },
  { word: "Pierre tombale", hint: "Tombe" },
  { word: "Méga gargouille", hint: "Vol" },
  { word: "Gobelin à sarbacane", hint: "Poison" },
  { word: "Séisme", hint: "Sol" },
  { word: "Golem d'élixir", hint: "Élixir" },
  { word: "Boule de feu", hint: "Explosion" },
  { word: "Mini P.E.K.K.A", hint: "Épée" },
  { word: "Mousquetaire", hint: "Fusil" },
  { word: "Cage Gobeline", hint: "Prison" },
  { word: "Cabane de gobelin", hint: "Production" },
  { word: "Valkyrie", hint: "Rotation" },
  { word: "Bélier de combat", hint: "Charge" },
  { word: "Tour à bombes", hint: "Zone" },
  { word: "Machine Volante", hint: "Aérien" },
  { word: "Chevaucheur de cochon", hint: "Cochon" },
  { word: "Guérisseuse armée", hint: "Soin" },
  { word: "Fournaise", hint: "Feu" },
  { word: "Électrocuteurs", hint: "Éclair" },
  { word: "Gobelin explosif", hint: "Bombe" },
  { word: "Géant", hint: "Tank" },
  { word: "Tour de l'enfer", hint: "Rayon" },
  { word: "Sorcier", hint: "Feu" },
  { word: "Cochons Royaux", hint: "Groupe" },
  { word: "Roquette", hint: "Missile" },
  { word: "Cabane de barbare", hint: "Renfort" },
  { word: "Extracteur d'élixir", hint: "Pompe" },
  { word: "Trois mousquetaires", hint: "Trio" },
  { word: "Squelettes", hint: "Os" },
  { word: "Électro-esprit", hint: "Éclair" },
  { word: "Esprit de feu", hint: "Flamme" },
  { word: "Esprit de glace", hint: "Gel" },
  { word: "Gobelins", hint: "Vert" },
  { word: "Gobelins à lances", hint: "Portée" },
  { word: "Bombardier", hint: "Bombe" },
  { word: "Chauves-Souris", hint: "Vol" },
  { word: "Zap", hint: "Éclair" },
  { word: "Méga Boule de Neige", hint: "Repousse" },
  { word: "Berserker", hint: "Furie" },
  { word: "Archères", hint: "Arc" },
  { word: "Flèches", hint: "Pluie" },
  { word: "Chevalier", hint: "Bouclier" },
  { word: "Gargouilles", hint: "Pierre" },
  { word: "Canon", hint: "Défense" },
  { word: "Gang de gobelins", hint: "Surprise" },
  { word: "Fût à squelettes", hint: "Explosion" },
  { word: "Artificière", hint: "Canon" },
  { word: "Colis royal", hint: "Chute" },
  { word: "Dragons Squelettes", hint: "Bombes" },
  { word: "Mortier", hint: "Siège" },
  { word: "Tesla", hint: "Électricité" },
  { word: "Barbares", hint: "Nombre" },
  { word: "Horde de gargouilles", hint: "Essaim" },
  { word: "Fripons", hint: "Tromperie" },
  { word: "Géant Royal", hint: "Canon" },
  { word: "Barbares d'élite", hint: "Rapide" },
  { word: "Recrues Royales", hint: "Bouclier" }
],

  "Mobs Minecraft": [
  { word: "Allay", hint: "Objet" },
  { word: "Âne", hint: "Sac" },
  { word: "Strider", hint: "Lave" },
  { word: "Axolotl", hint: "Eau" },
  { word: "Champimeuh", hint: "Champignon" },
  { word: "Chat", hint: "Miaou" },
  { word: "Chauve-souris", hint: "Caverne" },
  { word: "Cheval", hint: "Selle" },
  { word: "Cheval-squelette", hint: "Os" },
  { word: "Cheval zombie", hint: "Mort" },
  { word: "Cochon", hint: "Rose" },
  { word: "Dromadaire", hint: "Désert" },
  { word: "Ghast desséché", hint: "Sec" },
  { word: "Ghastling", hint: "Petit" },
  { word: "Grenouille", hint: "Saut" },
  { word: "Golem de cuivre", hint: "Métal" },
  { word: "Golem de neige", hint: "Neige" },
  { word: "Happy Ghast", hint: "Sourire" },
  { word: "Lapin", hint: "Carotte" },
  { word: "Marchand ambulant", hint: "Lamas" },
  { word: "Morue", hint: "Poisson" },
  { word: "Mouton", hint: "Laine" },
  { word: "Mule", hint: "Transport" },
  { word: "Ocelot", hint: "Jungle" },
  { word: "Perroquet", hint: "Épaule" },
  { word: "Poisson-globe", hint: "Épines" },
  { word: "Poisson tropical", hint: "Couleurs" },
  { word: "Pieuvre", hint: "Tentacules" },
  { word: "Pieuvre luisant", hint: "Lumière" },
  { word: "Poule", hint: "Œuf" },
  { word: "Renard", hint: "Neige" },
  { word: "Saumon", hint: "Rose" },
  { word: "Sniffer", hint: "Graines" },
  { word: "Tatou", hint: "Coque" },
  { word: "Têtard", hint: "Bébé" },
  { word: "Tortue", hint: "Plage" },
  { word: "Vache", hint: "Lait" },
  { word: "Villageois", hint: "Commerce" },
  { word: "Abeille", hint: "Miel" },
  { word: "Chèvre", hint: "Corne" },
  { word: "Dauphin", hint: "Rapide" },
  { word: "Golem de fer", hint: "Protection" },
  { word: "Lama", hint: "Crachat" },
  { word: "Loup", hint: "Chien" },
  { word: "Nautilus", hint: "Coquille" },
  { word: "Nautilus zombie", hint: "Mort" },
  { word: "Ours polaire", hint: "Neige" },
  { word: "Panda", hint: "Bambou" },
  { word: "Piglin", hint: "Or" },
  { word: "Araignée", hint: "Mur" },
  { word: "Enderman", hint: "Téléportation" },
  { word: "Blaze", hint: "Feu" },
  { word: "Breeze", hint: "Vent" },
  { word: "Creaking", hint: "Forêt" },
  { word: "Creeper", hint: "Explosion" },
  { word: "Creeper chargé", hint: "Éclair" },
  { word: "Cube de magma", hint: "Lave" },
  { word: "Dromadaire momifié", hint: "Sable" },
  { word: "Bogged", hint: "Boue" },
  { word: "Endermite", hint: "Petit" },
  { word: "Evocateur", hint: "Totem" },
  { word: "Guardian", hint: "Laser" },
  { word: "Ghast", hint: "Feu" },
  { word: "Elder Guardian", hint: "Temple" },
  { word: "Hoglin", hint: "Nether" },
  { word: "Noyé", hint: "Trident" },
  { word: "Phantom", hint: "Nuit" },
  { word: "Piglin brute", hint: "Hache" },
  { word: "Pillard", hint: "Arbalète" },
  { word: "Silver fish", hint: "Pierre" },
  { word: "Ravageur", hint: "Charge" },
  { word: "Shulker", hint: "Boîte" },
  { word: "Slime", hint: "Gelée" },
  { word: "Sorcière", hint: "Potion" },
  { word: "Squelette", hint: "Arc" },
  { word: "Stray", hint: "Neige" },
  { word: "Vex", hint: "Vol" },
  { word: "Vindicateur", hint: "Hache" },
  { word: "Wither squelette", hint: "Noir" },
  { word: "Zoglin", hint: "Furie" },
  { word: "Zombie", hint: "Mort" },
  { word: "Zombie momifié", hint: "Faim" },
  { word: "Zombie villageois", hint: "Infection" },
  { word: "Ender dragon", hint: "Ailes" },
  { word: "Wither", hint: "Destruction" },
  { word: "Warden", hint: "Rayon" }
]
};

type Step = "reveal" | "describe" | "vote_instructions" | "reveal_result";

export function WordImpostor({ players, config, onBack }: WordImpostorProps) {
  const [step, setStep] = useState<Step>("reveal");
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [impostorsIds, setImpostorsIds] = useState<string[]>([]);
  const [words, setWords] = useState<Record<string, string>>({}); 
  const [playerHints, setPlayerHints] = useState<Record<string, string>>({});
  const [startingPlayerId, setStartingPlayerId] = useState("");
  const [showWord, setShowWord] = useState(false);

  useEffect(() => {
    if (!players || players.length === 0) return;

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const selectedImpostors = shuffledPlayers.slice(0, config.impostorCount).map(p => p.id);
    setImpostorsIds(selectedImpostors);

    const categoryData = WORD_CATEGORIES[config.category] || WORD_CATEGORIES["Objets du quotidien"];
    const shuffledWords = [...categoryData].sort(() => Math.random() - 0.5);
    
    const innocentItem = shuffledWords[0];
    const impostorItem = shuffledWords[1];

    const wordMap: Record<string, string> = {};
    const hintMap: Record<string, string> = {};
    
    players.forEach(p => {
      if (selectedImpostors.includes(p.id)) {
        wordMap[p.id] = config.impostorMode === "no-word" ? "???" : impostorItem.word;
        // The hint for the impostor is always the hint of the INNOCENT word to help them guess
        hintMap[p.id] = innocentItem.hint;
      } else {
        wordMap[p.id] = innocentItem.word;
        hintMap[p.id] = ""; // Innocents don't need hints
      }
    });

    setWords(wordMap);
    setPlayerHints(hintMap);
    setStartingPlayerId(players[Math.floor(Math.random() * players.length)].id);
  }, [players, config]);

  const handleNextReveal = () => {
    setShowWord(false);
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
    } else {
      setStep("describe");
    }
  };

  const resetGame = () => {
    setStep("reveal");
    setCurrentPlayerIdx(0);
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const selectedImpostors = shuffledPlayers.slice(0, config.impostorCount).map(p => p.id);
    setImpostorsIds(selectedImpostors);

    const categoryData = WORD_CATEGORIES[config.category] || WORD_CATEGORIES["Objets du quotidien"];
    const shuffledWords = [...categoryData].sort(() => Math.random() - 0.5);
    
    const innocentItem = shuffledWords[0];
    const impostorItem = shuffledWords[1];

    const wordMap: Record<string, string> = {};
    const hintMap: Record<string, string> = {};
    players.forEach(p => {
      if (selectedImpostors.includes(p.id)) {
        wordMap[p.id] = config.impostorMode === "no-word" ? "???" : impostorItem.word;
        hintMap[p.id] = innocentItem.hint;
      } else {
        wordMap[p.id] = innocentItem.word;
        hintMap[p.id] = "";
      }
    });
    setWords(wordMap);
    setPlayerHints(hintMap);
    setStartingPlayerId(players[Math.floor(Math.random() * players.length)].id);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 text-slate-400"><ChevronLeft /></button>
        <div className="text-center">
          <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-widest italic">🕵️ Qui est l'Imposteur ?</h2>
          <p className="text-sm font-black text-slate-300 uppercase italic tracking-tighter">
            {config.impostorCount} {config.impostorCount > 1 ? "Imposteurs" : "Imposteur"} parmi vous
          </p>
        </div>
        <div className="w-10"></div>
      </header>

      <AnimatePresence mode="wait">
        {step === "reveal" && (
          <motion.div key="reveal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex-1 flex flex-col justify-center gap-8 text-center">
            <div className="space-y-4">
              <p className="text-slate-400 italic">Passe l'appareil à</p>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{players[currentPlayerIdx]?.name}</h3>
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl relative shadow-xl overflow-hidden">
              {!showWord ? (
                <button onClick={() => setShowWord(true)} className="flex flex-col items-center gap-4 w-full py-4">
                  <div className="p-6 bg-emerald-600/20 rounded-full text-emerald-400">
                    <Eye size={48} />
                  </div>
                  <p className="font-bold text-emerald-400 uppercase tracking-widest text-[10px]">Voir mon mot</p>
                </button>
              ) : (
                <div className="space-y-8 animate-in zoom-in duration-300">
                  <div className="space-y-2">
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Ton Mot Secret</p>
                    <p className={`text-4xl font-black italic uppercase tracking-tight ${players[currentPlayerIdx] && words[players[currentPlayerIdx].id] === "???" ? "text-red-500" : "text-white"}`}>
                      {players[currentPlayerIdx] && words[players[currentPlayerIdx].id]}
                    </p>
                  </div>
                  
                  {players[currentPlayerIdx] && impostorsIds.includes(players[currentPlayerIdx].id) && config.impostorMode === "no-word" && (
                    <div className="p-4 rounded-2xl border bg-red-500/10 border-red-500/20">
                      <p className="text-red-500 font-black uppercase italic text-xs mb-1">Tu es l'imposteur</p>
                      {config.showHints && (
                        <p className="text-white text-sm font-bold">
                          Indice : <span className="text-amber-400 uppercase italic">{playerHints[players[currentPlayerIdx].id]}</span>
                        </p>
                      )}
                    </div>
                  )}

                  <button onClick={handleNextReveal} className="w-full py-4 bg-emerald-600 text-white font-black uppercase rounded-2xl active:scale-95 transition-all">
                    J'AI COMPRIS
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === "describe" && (
          <motion.div key="describe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center gap-6 text-center">
            <div className="p-6 rounded-3xl bg-slate-800/50 border-2 border-slate-700 relative overflow-hidden">
              <Users size={40} className="mx-auto text-emerald-500 mb-4" />
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2 leading-none">Tour de table</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Suivez l'ordre circulaire. Une seule description par personne.
              </p>

              <div className="space-y-3 text-left">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest mb-1">Le joueur qui commence :</p>
                  <p className="text-lg font-black text-white uppercase italic">
                    {players.find(p => p.id === startingPlayerId)?.name}
                  </p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Ordre de parole :</p>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const startIndex = players.findIndex(p => p.id === startingPlayerId);
                      const ordered = [...players.slice(startIndex), ...players.slice(0, startIndex)];
                      return ordered.map((p, i) => (
                        <div key={p.id} className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm uppercase italic">{p.name}</span>
                          {i < ordered.length - 1 && <span className="text-slate-700 text-xs">→</span>}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={() => setStep("vote_instructions")} className="py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">
              Passer au Vote
            </button>
          </motion.div>
        )}

        {step === "vote_instructions" && (
          <motion.div key="vote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center text-center gap-8">
            <div className="space-y-6">
              <ShieldAlert size={64} className="mx-auto text-emerald-500 mb-4 animate-pulse" />
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Votez !</h2>
              <p className="text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                Discutez et désignez les <span className="text-white font-bold">{impostorsIds.length}</span> suspects à haute voix.
              </p>
            </div>

            <button onClick={() => setStep("reveal_result")} className="mt-8 py-5 bg-emerald-600 text-white font-black uppercase italic rounded-2xl active:scale-95 transition-all shadow-xl shadow-emerald-900/40">
              Découvrir les imposteurs
            </button>
          </motion.div>
        )}

        {step === "reveal_result" && (
          <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col justify-center text-center gap-8">
            <div className="space-y-6">
              <Award size={80} className="mx-auto text-emerald-500 mb-4" />
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">La Vérité !</h2>
              
              <div className="bg-slate-800 rounded-3xl p-6 border-2 border-slate-700 space-y-6">
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mots du jeu</p>
                    <div className="flex justify-center items-center gap-4">
                       <div className="flex-1 text-right">
                         <p className="text-xs text-slate-400 mb-1 uppercase tracking-tighter">Innocents</p>
                         <p className="text-xl font-black text-emerald-400 italic uppercase">{words[players.find(p => !impostorsIds.includes(p.id))?.id || ""]}</p>
                       </div>
                       <div className="h-10 w-px bg-slate-700"></div>
                       <div className="flex-1 text-left">
                         <p className="text-xs text-slate-400 mb-1 uppercase tracking-tighter">Imposteurs</p>
                         <p className="text-xl font-black text-red-400 italic uppercase">{config.impostorMode === "no-word" ? "AUCUN" : words[impostorsIds[0]]}</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-700/50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Les coupables étaient</p>
                    <div className="flex flex-wrap justify-center gap-2">
                       {impostorsIds.map(id => (
                         <span key={id} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-xs font-black uppercase italic border border-red-500/20">
                           {players.find(p => p.id === id)?.name}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button onClick={resetGame} className="py-5 bg-emerald-600 text-white font-black uppercase italic rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                <RotateCcw size={20} /> Rejouer
              </button>
              <button onClick={onBack} className="py-4 bg-slate-800 text-slate-300 font-bold uppercase rounded-2xl">
                Menu Principal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}