import bottleVetiverNoir from "@/assets/bottle-vetiver-noir.jpg";
import bottleCedarSmoke from "@/assets/bottle-cedar-smoke.jpg";
import bottleSageReverie from "@/assets/bottle-sage-reverie.jpg";
import bottleJasmineFern from "@/assets/bottle-jasmine-fern.jpg";
import ingredientVetiver from "@/assets/ingredient-vetiver.jpg";
import ingredientCedar from "@/assets/ingredient-cedar.jpg";
import ingredientSage from "@/assets/ingredient-sage.jpg";
import cutoutVetiverNoir from "@/assets/dummy/vetiver-noir.webp";
import cutoutCedarSmoke from "@/assets/dummy/cedar-smoke.webp";
import cutoutSageReverie from "@/assets/dummy/sage-reverie.webp";
import cutoutJasmineFern from "@/assets/dummy/jasmine-fern.webp";

export interface FragranceSize {
  ml: number;
  price: string;
}

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Fragrance {
  slug: string;
  name: string;
  collection: string;
  tagline: string;
  description: string;
  story: string;
  concentration: string;
  notes: FragranceNotes;
  ingredients: string[];
  sizes: FragranceSize[];
  image: string;
  cutout: string;
}

export const fragrances: Fragrance[] = [
  {
    slug: "vetiver-noir",
    name: "Vetiver Noir",
    collection: "The Forest Floor",
    tagline: "Earth, root and shadow",
    description:
      "Our signature composition. Haitian vetiver, rested eighteen months in the ground before harvest, folded into smoked papyrus and cool iris root. A perfume of quiet authority — the smell of soil after rain, worn like a dark coat.",
    story:
      "Vetiver Noir began as a single vial of root oil carried back from Les Cayes in 1991. Élise Moreau spent four winters refining it, refusing every shortcut, until the smoke settled and the earth remained.",
    concentration: "Eau de Parfum",
    notes: {
      top: ["Bergamot", "Black Pepper", "Cardamom"],
      heart: ["Haitian Vetiver", "Iris Root", "Cypress"],
      base: ["Smoked Papyrus", "Oakmoss", "White Musk"],
    },
    ingredients: ["Wild Vetiver", "Iris Root", "Cypress Leaf"],
    sizes: [
      { ml: 50, price: "€185" },
      { ml: 100, price: "€265" },
    ],
    image: bottleVetiverNoir,
    cutout: cutoutVetiverNoir,
  },
  {
    slug: "cedar-smoke",
    name: "Cedar & Smoke",
    collection: "The Forest Floor",
    tagline: "Ember-lit woods",
    description:
      "Atlas cedarwood, cut in moon-dark winters, meets a whisper of birch smoke and warm labdanum. Cedar & Smoke is the fire at the edge of the clearing — resinous, wrapped in wool, faintly sweet at the last.",
    story:
      "The cedar in this composition comes from a single high valley in the Atlas Mountains, where our partner grove fells no more than forty trees a year. Each harvest is weighed, logged and macerated separately.",
    concentration: "Eau de Parfum",
    notes: {
      top: ["Saffron", "Elemi Resin"],
      heart: ["Atlas Cedarwood", "Incense"],
      base: ["Birch Tar", "Labdanum", "Vanilla Pod"],
    },
    ingredients: ["Atlas Cedarwood", "Labdanum", "Saffron"],
    sizes: [
      { ml: 50, price: "€180" },
      { ml: 100, price: "€255" },
    ],
    image: bottleCedarSmoke,
    cutout: cutoutCedarSmoke,
  },
  {
    slug: "sage-reverie",
    name: "Sage Reverie",
    collection: "The Sunlit Glade",
    tagline: "Silver leaves at dawn",
    description:
      "Clary sage gathered at first light over the Provence hills, brightened with green mandarin and shaded by fig leaf. Sage Reverie is the glade where morning hesitates — silver, herbal, softly sweet at its close.",
    story:
      "Our sage grows on a terraced Provence farm that has worked without irrigation since 1932. The harvest window lasts eleven days; after that, the oil loses its silver edge and we wait another year.",
    concentration: "Eau de Parfum",
    notes: {
      top: ["Clary Sage", "Green Mandarin"],
      heart: ["White Sage", "Fig Leaf"],
      base: ["Tonka Bean", "Vetiver"],
    },
    ingredients: ["Clary Sage", "Fig Leaf", "Tonka Bean"],
    sizes: [
      { ml: 50, price: "€170" },
      { ml: 100, price: "€245" },
    ],
    image: bottleSageReverie,
    cutout: cutoutSageReverie,
  },
  {
    slug: "jasmine-fern",
    name: "Jasmine & Fern",
    collection: "The Sunlit Glade",
    tagline: "Night-blooming glade",
    description:
      "Night-blooming jasmine threaded through cool fern and dew accord, resting on pale sandalwood. Jasmine & Fern is the hour when the glade turns blue — luminous, green, a little wild.",
    story:
      "The jasmine is picked between four and seven in the morning, before the sun can touch the flower. It travels to Grasse in lined baskets the same day, and is enfleuraged within twenty-four hours.",
    concentration: "Eau de Parfum",
    notes: {
      top: ["Dew Accord", "Neroli"],
      heart: ["Night Jasmine", "Wild Fern"],
      base: ["White Amber", "Sandalwood"],
    },
    ingredients: ["Night Jasmine", "Wild Fern", "Sandalwood"],
    sizes: [
      { ml: 50, price: "€175" },
      { ml: 100, price: "€250" },
    ],
    image: bottleJasmineFern,
    cutout: cutoutJasmineFern,
  },
];

export interface Collection {
  name: string;
  numeral: string;
  description: string;
  lead: string;
  slugs: string[];
}

export const collections: Collection[] = [
  {
    name: "The Forest Floor",
    numeral: "I",
    description:
      "Deep, rooted and resinous — fragrances drawn from the shadowed ground of the wood, where roots and embers keep their secrets.",
    lead: "vetiver-noir",
    slugs: ["vetiver-noir", "cedar-smoke"],
  },
  {
    name: "The Sunlit Glade",
    numeral: "II",
    description:
      "Silver herbs and night bloom — two compositions for the light that slips through the canopy and the hour it fades.",
    lead: "sage-reverie",
    slugs: ["sage-reverie", "jasmine-fern"],
  },
];

export interface Ingredient {
  name: string;
  origin: string;
  harvest: string;
  description: string;
  image: string;
  usedIn: string[];
}

export const ingredients: Ingredient[] = [
  {
    name: "Wild Vetiver",
    origin: "Les Cayes, Haiti",
    harvest: "Dug by hand, rested 18 months in the ground",
    description:
      "The root is left in the earth long after the leaf dies back, deepening from grassy to almost animalic. We buy the entire harvest of one family distillery each year.",
    image: ingredientVetiver,
    usedIn: ["Vetiver Noir", "Sage Reverie"],
  },
  {
    name: "Atlas Cedarwood",
    origin: "The Atlas Mountains, Morocco",
    harvest: "Felled only in moon-dark winters",
    description:
      "Slow-grown at altitude, the wood yields an oil that is dry, pencil-sharp and quietly sweet. Our grove fells no more than forty trees a year.",
    image: ingredientCedar,
    usedIn: ["Cedar & Smoke"],
  },
  {
    name: "Clary Sage",
    origin: "Provence, France",
    harvest: "An eleven-day window at first light",
    description:
      "Harvested before the sun can burn off its silver edge. The terrace farm that grows it has worked without irrigation since 1932.",
    image: ingredientSage,
    usedIn: ["Sage Reverie", "Jasmine & Fern"],
  },
];

export const getFragrance = (slug: string): Fragrance | undefined =>
  fragrances.find((f) => f.slug === slug);

export const getFragrancesByCollection = (name: string): Fragrance[] =>
  fragrances.filter((f) => f.collection === name);
