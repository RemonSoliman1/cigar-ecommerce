
import productsData from '@/data/products.json';

// Re-export constants for compatibility
export const PRODUCTS = productsData;

export const BRANDS = [
    {
        id: 'cohiba',
        name: 'Cohiba',
        type: 'cigar',
        origin: 'Cuba',
        description: 'The flagship brand of Habanos, created in 1966 for President Fidel Castro.',
        logo: '/images/brands/cohiba.png' // Placeholder
    },
    {
        id: 'montecristo',
        name: 'Montecristo',
        type: 'cigar',
        origin: 'Cuba',
        description: 'The most famous and popular of all Havana brands.',
        logo: '/images/brands/montecristo.png'
    },
    {
        id: 'arturo-fuente',
        name: 'Arturo Fuente',
        type: 'cigar',
        origin: 'Dominican Republic',
        description: 'A family tradition since 1912, known for the Opus X.',
        logo: '/images/brands/fuente.png'
    },
    {
        id: 'padron',
        name: 'Padrón',
        type: 'cigar',
        origin: 'Nicaragua',
        description: 'Delivering only the finest, handmade, complex cigars.',
        logo: '/images/brands/padron.png'
    },
    {
        id: 'oliva',
        name: 'Oliva',
        type: 'cigar',
        origin: 'Nicaragua',
        description: 'A family of cigar makers that have been producing fine cigars since 1886.',
        logo: '/images/brands/oliva.png'
    },
    {
        id: 'romeo-y-julieta',
        name: 'Romeo y Julieta',
        type: 'cigar',
        origin: 'Cuba',
        description: 'Famous for the romance of its name and choice of Winston Churchill.',
        logo: '/images/brands/ryj.png'
    },
    {
        id: 'davidoff',
        name: 'Davidoff',
        type: 'cigar',
        origin: 'Dominican Republic',
        description: 'Time beautifully filled.',
        logo: '/images/brands/davidoff.png'
    },
    {
        id: 'std',
        name: 'S.T. Dupont',
        type: 'accessory',
        origin: 'France',
        description: 'Luxury lighters and cutters.',
        logo: '/images/brands/std.png'
    },
    {
        id: 'xikar',
        name: 'Xikar',
        type: 'accessory',
        origin: 'USA',
        description: 'The best thing to happen to cigars since fire.',
        logo: '/images/brands/xikar.png'
    },
    {
        id: 'elie-bleu',
        name: 'Elie Bleu',
        type: 'accessory',
        origin: 'France',
        description: 'The finest humidors in the world.',
        logo: '/images/brands/eliebleu.png'
    },
    {
        id: 'newair',
        name: 'NewAir',
        type: 'accessory',
        origin: 'USA',
        description: 'Modern cooling solutions.',
        logo: '/images/brands/newair.png'
    },
    {
        id: 'audew',
        name: 'Audew',
        type: 'accessory',
        origin: 'China',
        description: 'Affordable precision cooling.',
        logo: '/images/brands/audew.png'
    },
    {
        id: 'habanos',
        name: 'Habanos S.A.',
        type: 'cigar',
        origin: 'Cuba',
        description: 'The world leader in the commercialization of Premium cigars.',
        logo: '/images/brands/cohiba.png' // Placeholder
    },
    {
        id: 'factory',
        name: 'Factory Bundles',
        type: 'cigar',
        origin: 'Nicaragua',
        description: 'Premium value bundles.',
        logo: '/images/brands/padron.png' // Placeholder
    }
];

export const MOCK_USER_HISTORY = [
    'cohiba', 'full-strength', 'cuba'
];
