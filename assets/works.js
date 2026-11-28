/*
  Backyard Press Club: every work, in catalog order.
  This one file feeds the Shop, the Catalog and the quick look.

  To add a work, copy one block and change it:
    no        catalog number, in order (BPC–001, BPC–002 ...)
    title     name of the piece
    type      "Print", "Zine", "Poster" or "Book"
    inks      ink names from INKS below, in print order
    size      e.g. "A3 · 297 × 420 mm"
    pages     zines and books only, e.g. "24 pages"
    frame     the standard frame size it fits, e.g. "11 × 17 in" (shown on the print's page)
    edition   number of copies (leave "" for an open, unsigned run such as postcards)
    paper     paper stock
    year      year printed
    price     unframed price, shown as written, e.g. "$45"
    framed    framed price, or "" if not offered framed
    status    "available" or "sold-out"
    image     photo of the print, e.g. "images/bpc-001.jpg" (leave "" to show an ink sketch)
    detail    optional close-up (not shown on the site for now), e.g. "images/bpc-001-detail.jpg"
    photo     optional second view on the print's page, e.g. a framed photo: "images/photos/bpc-001.jpg"
    layers    optional, one image per ink in print order, ink on white, for "Ink by ink"
    buy       the Stripe Payment Link for the unframed print (leave "" until it exists)
    buyFramed the Stripe Payment Link for the framed version, if offered (pickup in Brooklyn, no shipping)
    about     one or two sentences for the quick look
*/

window.BPC_INKS = {
  'Federal Blue':     '#3255a4',
  'Sunflower':        '#ffb511',
  'Teal':             '#00838a',
  'Orange':           '#ff6c2f',
  'Green':            '#00a95c',
  'Aqua':             '#5ec8e5',
  'Brown':            '#925f52',
  'Black':            '#3d3b38',
  'Bright Red':       '#f15060',
  'Kelly Green':      '#67b346',
  'Purple':           '#765ba7',
  'Fluorescent Pink': '#ff48b0',
  'Scarlet':          '#f65058',
  'Cornflower':       '#62a8e5',
  'Blue':             '#0078bf',
  'Violet':           '#9d7ad2',
  'Light Lime':       '#e3ff00',
  'Yellow':           '#ffe800'
};

/* Inks shown in the picker on the Riso printing page. */
/* Email signup: the form ID of a free Kit form (kit.com, free up to 10,000 subscribers).
   Leave "" until it exists; the signup shows as "coming soon". */
window.BPC_SIGNUP_FORM = '10253741';

window.BPC_DRUMS = ['Teal', 'Sunflower', 'Bright Red', 'Scarlet', 'Kelly Green', 'Aqua', 'Blue', 'Purple', 'Black'];

/* Every work is a collaboration between Ezgi Eyigor and Jon Goldman, so there is no per-print artist. */
var TREE_ABOUT = 'A tree at Lake Tahoe, shot on 35mm film and mirrored, printed in two inks that sit a little off-register. The first run sold out at the Brooklyn Fine Art Print Fair in a day and a half.';

window.BPC_WORKS = [
  { no: 'BPC–001', title: 'Green Water', type: 'Print', inks: ['Sunflower', 'Light Lime', 'Kelly Green', 'Blue'], size: '10.5 × 16.25 in', frame: '11 × 17 in', pages: '', edition: '25', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '$120', status: 'available',
    image: 'images/green-water.jpg', photo: 'images/photos/green-water.jpg', detail: 'images/green-water-detail.jpg', buy: 'https://buy.stripe.com/8x228r7HQfoO0h3bi74Rq00', buyFramed: 'https://buy.stripe.com/5kQ4gzfaia4ud3P1Hx4Rq04',
    about: 'Water at Akyaka, on the Turkish coast, from a 35mm photo, with leaves reflected on the surface. Printed in four inks and signed and numbered in pencil by both of us.' },
  { no: 'BPC–002', title: 'Untitled (Tree Composition)', type: 'Print', inks: ['Sunflower', 'Bright Red'], size: '10 × 15 in', frame: '11 × 17 in', pages: '', edition: '50', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '$95', status: 'available',
    image: 'images/tree-sunflower-red.jpg', photo: 'images/photos/tree-sunflower-red.jpg', layers: ['images/layers/tree-sunflower-red-1.webp', 'images/layers/tree-sunflower-red-2.webp'], detail: 'images/tree-sunflower-red-detail.jpg', buy: 'https://buy.stripe.com/8x228r2nw2C24xjbi74Rq01', buyFramed: 'https://buy.stripe.com/eVq00jaU24Ka6Fr71R4Rq05', about: TREE_ABOUT },
  { no: 'BPC–003', title: 'Untitled (Tree Composition)', type: 'Print', inks: ['Purple', 'Fluorescent Pink'], size: '10 × 15 in', frame: '11 × 17 in', pages: '', edition: '50', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '$95', status: 'available',
    image: 'images/tree-purple-pink.jpg', photo: 'images/photos/tree-purple-pink.jpg', layers: ['images/layers/tree-purple-pink-1.webp', 'images/layers/tree-purple-pink-2.webp'], detail: 'images/tree-purple-pink-detail.jpg', buy: 'https://buy.stripe.com/7sY4gzbY62C2e7Tdqf4Rq02', buyFramed: 'https://buy.stripe.com/14AbJ15zI6SibZL85V4Rq06', about: TREE_ABOUT },
  { no: 'BPC–004', title: 'Untitled (Tree Composition)', type: 'Print', inks: ['Kelly Green', 'Teal'], size: '10 × 15 in', frame: '11 × 17 in', pages: '', edition: '50', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '$95', status: 'available',
    image: 'images/tree-green-teal.jpg', photo: 'images/photos/tree-green-teal.jpg', layers: ['images/layers/tree-green-teal-1.webp', 'images/layers/tree-green-teal-2.webp'], detail: 'images/tree-green-teal-detail.jpg', buy: 'https://buy.stripe.com/7sY6oHgem4Ka0h3fyn4Rq03', buyFramed: 'https://buy.stripe.com/5kQdR9d2aekKbZL3PF4Rq07', about: TREE_ABOUT },
  { no: 'BPC–005', title: 'Matador', type: 'Print', inks: ['Scarlet', 'Purple', 'Black'], size: '15 × 10.5 in', frame: '11 × 17 in', pages: '', edition: '25', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '', status: 'available',
    image: 'images/matador.jpg', photo: 'images/photos/matador.jpg', detail: 'images/matador-detail.jpg', buy: 'https://buy.stripe.com/cNi6oHaU26SifbXcmb4Rq08',
    about: 'A bullfight, from an old family photo that was last printed in 2003. We left in the seams from the old scan.' },
  { no: 'BPC–006', title: 'Water Stone Gradient', type: 'Postcard', inks: ['Fluorescent Pink', 'Black', 'Blue', 'Sunflower'], size: '4 × 6 in', frame: '4 × 6 in', pages: '', edition: '', paper: 'Speckletone, 80 lb', year: '2026', price: '$8', framed: '', status: 'available',
    image: 'images/water-stone-gradient.jpg', detail: '', buy: 'https://buy.stripe.com/3cI5kDaU2b8yd3P85V4Rq0i', about: 'A narrow cove between two cliffs. The water goes from dark blue to pale green over the rocks.' },
  { no: 'BPC–007', title: 'Sparkle', type: 'Postcard', inks: ['Aqua', 'Blue'], size: '4 × 6 in', frame: '4 × 6 in', pages: '', edition: '', paper: 'Speckletone, 80 lb', year: '2026', price: '$8', framed: '', status: 'available',
    image: 'images/sparkle.jpg', detail: '', buy: 'https://buy.stripe.com/00wcN5faiekKd3P99Z4Rq0j', about: 'Sun on dark water. The bright spots are bare paper.' },
  { no: 'BPC–008', title: 'Seeing Through Trees', type: 'Postcard', inks: ['Sunflower', 'Fluorescent Pink', 'Blue', 'Black'], size: '4 × 6 in', frame: '4 × 6 in', pages: '', edition: '', paper: 'Speckletone, 80 lb', year: '2026', price: '$8', framed: '', status: 'available',
    image: 'images/seeing-through-trees.jpg', detail: '', buy: 'https://buy.stripe.com/fZu14ne6e6Si5Bn5XN4Rq0k', about: 'A lake at dusk through a gap in the pines. The film camera’s date stamp is still in the corner.' },
  { no: 'BPC–009', title: 'Rainbowburn', type: 'Postcard', inks: ['Aqua', 'Scarlet', 'Sunflower', 'Violet'], size: '6 × 4 in', frame: '4 × 6 in', pages: '', edition: '', paper: 'Speckletone, 80 lb', year: '2026', price: '$8', framed: '', status: 'available',
    image: 'images/rainbowburn.jpg', detail: '', buy: 'https://buy.stripe.com/7sY8wP7HQa4ugg1fyn4Rq0l', about: 'The Golden Gate Bridge from across the bay, with an orange and pink light leak down one side.' },
  { no: 'BPC–010', title: 'Flowers Up', type: 'Postcard', inks: ['Fluorescent Pink', 'Black', 'Blue', 'Sunflower'], size: '6 × 4 in', frame: '4 × 6 in', pages: '', edition: '', paper: 'Speckletone, 80 lb', year: '2026', price: '$8', framed: '', status: 'available',
    image: 'images/flowers-up.jpg', detail: '', buy: 'https://buy.stripe.com/7sY5kD8LUfoOgg10Dt4Rq0m', about: 'Looking straight up into a tree in bloom.' },
  { no: 'BPC–011', title: 'Foliage', type: 'Print', inks: ['Scarlet', 'Purple'], size: '5.5 × 8.5 in', frame: '8 × 10 in, with a mat', pages: '', edition: '25', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '', status: 'available',
    image: 'images/foliage.jpg', layers: ['images/layers/foliage-1.webp', 'images/layers/foliage-2.webp'], detail: '', buy: 'https://buy.stripe.com/3cIaEX1js1xYaVH85V4Rq0e', about: 'Fallen petals, from a 2019 photo. Purple printed over Scarlet.' },
  { no: 'BPC–012', title: 'Flowers 4', type: 'Print', inks: ['Aqua', 'Scarlet', 'Sunflower', 'Violet'], size: '8.5 × 5.5 in', frame: '8 × 10 in, with a mat', pages: '', edition: '25', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '', status: 'available',
    image: 'images/flowers-4.jpg', detail: '', buy: 'https://buy.stripe.com/3cIfZh9PYa4u8Nzfyn4Rq0f', about: 'White flowers over red, violet and blue.' },
  { no: 'BPC–013', title: 'Dark Water', type: 'Postcard', inks: ['Sunflower', 'Fluorescent Pink', 'Blue', 'Black'], size: '4 × 6 in', frame: '4 × 6 in', pages: '', edition: '', paper: 'Speckletone, 80 lb', year: '2026', price: '$8', framed: '', status: 'available',
    image: 'images/dark-water.jpg', detail: '', buy: 'https://buy.stripe.com/28E5kDfaidgGbZLgCr4Rq0n', about: 'Water in the evening, almost black, with a little light on the ripples.' },
  { no: 'BPC–014', title: 'Blue Water', type: 'Print', inks: ['Aqua', 'Cornflower', 'Kelly Green'], size: '11 × 17 in', frame: '11 × 17 in', pages: '', edition: '25', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '', status: 'available',
    image: 'images/blue-water.jpg', detail: '', buy: 'https://buy.stripe.com/dRm6oHgem1xYgg11Hx4Rq0h', about: 'Light on the bottom of a swimming pool.' }
];

/* Sets: several works sold together on one Stripe Payment Link (Nov 28, Jon approved).
   items   catalog numbers in the set
   buy     the set's Payment Link (leave "" until it exists) */
window.BPC_SETS = [
  { id: 'postcard-set', title: 'Postcard set', price: '$36',
    items: ['BPC–006', 'BPC–007', 'BPC–008', 'BPC–009', 'BPC–010', 'BPC–013'],
    about: 'All six postcards, one of each. Free shipping in the US.',
    buy: 'https://buy.stripe.com/9B6fZh5zI3G6gg12LB4Rq0o' }
];
