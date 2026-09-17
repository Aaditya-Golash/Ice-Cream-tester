export type FlavourKey = 'chocolate' | 'fruit' | 'vanillaCream' | 'caramel' | 'peanutButter' | 'baked';
export type PieceKey = 'chewy' | 'crunchy' | 'flakes' | 'fruitPieces' | 'marshmallowPieces' | 'none';
export type RibbonKey = 'none' | 'fudge' | 'caramel' | 'fruitJam' | 'marshmallow';
export type ExclusionKey = 'peanuts' | 'coconut' | 'fruitPieces' | 'chocolate' | 'cinnamon';

export type Product = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  sourceUrl: string;
  flavourTags: FlavourKey[];
  pieceTags: PieceKey[];
  ribbonTags: RibbonKey[];
  documentedIngredients: ExclusionKey[];
  palette: [string, string, string];
};

export const FLAVOUR_LABELS: Record<FlavourKey, string> = {
  chocolate: 'Heavy Chocolate',
  fruit: 'Bright Fruit & Citrus',
  vanillaCream: 'Classic Sweet Cream',
  caramel: 'Deep Caramel',
  peanutButter: 'Roasted Peanut Butter',
  baked: 'Warm Bakery Spices',
};

export const PIECE_LABELS: Record<PieceKey, string> = {
  chewy: 'Chewy dough or brownies',
  crunchy: 'Heavy cookie crunch',
  flakes: 'Chocolate flakes',
  fruitPieces: 'Real fruit chunks',
  marshmallowPieces: 'Soft marshmallows',
  none: 'Smooth sailing (No pieces)',
};

export const RIBBON_LABELS: Record<RibbonKey, string> = {
  none: 'Skip the ribbon',
  fudge: 'Thick fudge',
  caramel: 'Salty sweet caramel',
  fruitJam: 'Tart fruit jam',
  marshmallow: 'Sticky marshmallow',
};

export const EXCLUSION_LABELS: Record<ExclusionKey, string> = {
  peanuts: 'Peanuts',
  coconut: 'Coconut',
  fruitPieces: 'Fruit chunks',
  chocolate: 'Chocolate',
  cinnamon: 'Cinnamon',
};

export const PRODUCTS: Product[] = [
  {
    id: 'baked-blueberry-muffin',
    name: 'Baked Blueberry Muffin',
    shortName: 'Blueberry Muffin',
    description: 'Cinnamon sugar ice cream packed with crunchy streusel and thick blueberry jam swirls. Pure couch-lock comfort.',
    sourceUrl: 'https://drbombayfoods.com/product/baked-blueberry-muffin/',
    flavourTags: ['fruit', 'baked'],
    pieceTags: ['crunchy'],
    ribbonTags: ['fruitJam'],
    documentedIngredients: ['cinnamon'],
    palette: ['#7352a5', '#efc867', '#8c2146'],
  },
  {
    id: 'peanut-butter-jelly-time',
    name: 'Peanut Butter Jelly Time',
    shortName: 'PB Jelly Time',
    description: 'Heavy peanut butter ice cream cut with grape sherbet and jelly ribbons. The ultimate late-night munchie destroyer.',
    sourceUrl: 'https://drbombayfoods.com/product/peanut-butter-jelly-time/',
    flavourTags: ['peanutButter', 'fruit'],
    pieceTags: [],
    ribbonTags: ['fruitJam'],
    documentedIngredients: ['peanuts'],
    palette: ['#7f4e9d', '#e4a42c', '#4d235f'],
  },
  {
    id: 'long-beach-fruit-cart',
    name: 'Long Beach Fruit Cart',
    shortName: 'Fruit Cart',
    description: 'Mango-lime sherbet hitting coconut ice cream, loaded with pineapple chunks and a spiced mango swirl. Top down weather.',
    sourceUrl: 'https://drbombayfoods.com/product/long-beach-fruit-cart/',
    flavourTags: ['fruit'],
    pieceTags: ['fruitPieces'],
    ribbonTags: ['fruitJam'],
    documentedIngredients: ['coconut', 'fruitPieces'],
    palette: ['#f2ad31', '#b8cf68', '#e85a2c'],
  },
  {
    id: 'sticky-caramel-apple',
    name: 'Sticky Caramel Apple',
    shortName: 'Caramel Apple',
    description: 'Tart green apple sherbet clashing with caramel ice cream and salty peanuts. Loud contrast.',
    sourceUrl: 'https://drbombayfoods.com/product/sticky-caramel-apple/',
    flavourTags: ['fruit', 'caramel'],
    pieceTags: [],
    ribbonTags: ['caramel'],
    documentedIngredients: ['peanuts'],
    palette: ['#a8c45e', '#d88035', '#73501e'],
  },
  {
    id: 'strawberry-cream-dream',
    name: 'Strawberry Cream Dream',
    shortName: 'Cream Dream',
    description: 'Strawberry sherbet mixed into vanilla ice cream, smashed with golden sandwich cookies. A corner-store classic.',
    sourceUrl: 'https://drbombayfoods.com/product/strawberry-cream-dream/',
    flavourTags: ['fruit', 'vanillaCream'],
    pieceTags: ['crunchy'],
    ribbonTags: ['fruitJam'],
    documentedIngredients: [],
    palette: ['#f3a8ad', '#fff0cd', '#a51e45'],
  },
  {
    id: 'tropical-sherbet-swizzle',
    name: 'Tropical Sherbet Swizzle',
    shortName: 'Sherbet Swizzle',
    description: 'Bright orange sherbet running with a pineapple swirl. The ultimate palate reset when you need something cold.',
    sourceUrl: 'https://drbombayfoods.com/product/tropical-sherbet-swizzle/',
    flavourTags: ['fruit'],
    pieceTags: ['none'],
    ribbonTags: ['fruitJam'],
    documentedIngredients: [],
    palette: ['#f69234', '#f1d156', '#c94a2a'],
  },
  {
    id: 'iced-out-orange-cream',
    name: 'Iced Out Orange Cream',
    shortName: 'Orange Cream',
    description: 'Vanilla ice cream and orange sherbet swirled together. Straight nostalgia on a spoon.',
    sourceUrl: 'https://drbombayfoods.com/product/iced-out-orange-cream/',
    flavourTags: ['fruit', 'vanillaCream'],
    pieceTags: ['none'],
    ribbonTags: ['fruitJam'],
    documentedIngredients: [],
    palette: ['#f47d35', '#fff3cf', '#df4b23'],
  },
];
