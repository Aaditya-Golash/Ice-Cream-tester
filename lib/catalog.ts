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
  chocolate: 'Chocolate',
  fruit: 'Fruit',
  vanillaCream: 'Vanilla and cream',
  caramel: 'Caramel',
  peanutButter: 'Peanut butter',
  baked: 'Cinnamon and baked desserts',
};

export const PIECE_LABELS: Record<PieceKey, string> = {
  chewy: 'Chewy brownie or dough',
  crunchy: 'Crunchy cookie or crumble',
  flakes: 'Chocolate flakes',
  fruitPieces: 'Fruit pieces',
  marshmallowPieces: 'Soft marshmallow pieces',
  none: 'Just the ice cream',
};

export const RIBBON_LABELS: Record<RibbonKey, string> = {
  none: 'No ribbon',
  fudge: 'Fudge ribbon',
  caramel: 'Caramel ribbon',
  fruitJam: 'Fruit jam ribbon',
  marshmallow: 'Marshmallow ribbon',
};

export const EXCLUSION_LABELS: Record<ExclusionKey, string> = {
  peanuts: 'Peanuts',
  coconut: 'Coconut',
  fruitPieces: 'Fruit pieces',
  chocolate: 'Chocolate',
  cinnamon: 'Cinnamon',
};

export const PRODUCTS: Product[] = [
  {
    id: 'baked-blueberry-muffin',
    name: 'Baked Blueberry Muffin',
    shortName: 'Blueberry Muffin',
    description: 'Cinnamon sugar ice cream, crunchy streusel, blueberry jam swirls.',
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
    description: 'Peanut butter ice cream, grape sherbet, peanut butter chips, grape jelly swirl.',
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
    description: 'Mango-lime sherbet, coconut ice cream, pineapple pieces, spiced mango swirl.',
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
    description: 'Tart green apple sherbet, caramel ice cream, crunchy peanuts, salted caramel swirls.',
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
    description: 'Strawberry sherbet, vanilla ice cream, crunchy golden sandwich cookies, strawberry jam swirl.',
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
    description: 'Orange sherbet with a pineapple swirl and citrus flavours.',
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
    description: 'Vanilla ice cream, orange sherbet, icy orange swirls.',
    sourceUrl: 'https://drbombayfoods.com/product/iced-out-orange-cream/',
    flavourTags: ['fruit', 'vanillaCream'],
    pieceTags: ['none'],
    ribbonTags: ['fruitJam'],
    documentedIngredients: [],
    palette: ['#f47d35', '#fff3cf', '#df4b23'],
  },
];
