/*
  Backyard Press Club: every work, in catalogue order.
  This one file feeds the Shop, the Catalogue and the quick look.

  To add a work, copy one block and change it:
    no        catalogue number, in order (BPC–001, BPC–002 ...)
    title     name of the piece
    artist    who made it
    type      "Print", "Zine", "Poster" or "Book"
    colorway  optional, tells apart versions of one image, e.g. "Kelly Green and Teal"
    inks      ink names from INKS below, in print order
    size      e.g. "A3 · 297 × 420 mm"
    pages     zines and books only, e.g. "24 pages"
    edition   number of copies
    paper     paper stock
    year      year printed
    price     unframed price, shown as written, e.g. "$45"
    framed    framed price, or "" if not offered framed
    left      how many of the edition are still for sale, e.g. "12" (shows "12 of 50 left"; "0" marks it sold out; leave "" to say nothing)
    status    "available", "few-left" or "sold-out" (with "left" filled in, this is worked out for you)
    image     photo of the print, e.g. "images/bpc-001.jpg" (leave "" to show an ink sketch)
    detail    optional close-up (not shown on the site for now), e.g. "images/bpc-001-detail.jpg"
    photo     optional second view on the print's page, e.g. a framed photo: "images/photos/bpc-001.jpg"
    layers    optional, one image per ink in print order, ink on white, for "Ink by ink"
    buy       the Stripe Payment Link for this work (leave "" until it exists)
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
  'Fluorescent Pink': '#ff48b0'
};

/* Inks shown in the picker on the Riso printing page. */
/* Email signup: the form ID of a free Kit form (kit.com, free up to 10,000 subscribers).
   Leave "" until it exists; the signup shows as "coming soon". */
window.BPC_SIGNUP_FORM = '';

window.BPC_DRUMS = ['Federal Blue', 'Sunflower', 'Teal', 'Orange', 'Green', 'Aqua', 'Brown', 'Black'];

var EZGI_JON = 'Ezgi Eyigor & Jon Goldman';
var TREE_ABOUT = 'A tree at Lake Tahoe, photographed on 35mm film, mirrored, and run through the risograph. Up close it reads as a tree; at a distance the separations drift slightly off-register and it resolves into overlapping fields of colour. The first run sold out at the Brooklyn Fine Art Print Fair in a day and a half.';

window.BPC_WORKS = [
  { no: 'BPC–001', title: 'Green Water', artist: EZGI_JON, type: 'Print', inks: [], size: '[Size]', pages: '', edition: '25', paper: '[Paper stock]', year: '2026', price: '$45', framed: '$120', left: '', status: 'available',
    image: 'images/green-water.jpg', photo: 'images/photos/green-water.jpg', detail: 'images/green-water-detail.jpg', buy: '',
    about: '[Two lines about Green Water.] Signed and numbered in pencil by both artists.' },
  { no: 'BPC–002', title: 'Untitled (Tree Composition)', artist: EZGI_JON, type: 'Print', colorway: 'Sunflower and Bright Red', inks: ['Sunflower', 'Bright Red'], size: '11 × 17 in', pages: '', edition: '50', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '$95', left: '', status: 'available',
    image: 'images/tree-sunflower-red.jpg', photo: 'images/photos/tree-sunflower-red.jpg', layers: ['images/layers/tree-sunflower-red-1.webp', 'images/layers/tree-sunflower-red-2.webp'], detail: 'images/tree-sunflower-red-detail.jpg', buy: '', about: TREE_ABOUT },
  { no: 'BPC–003', title: 'Untitled (Tree Composition)', artist: EZGI_JON, type: 'Print', colorway: 'Purple and Fluorescent Pink', inks: ['Purple', 'Fluorescent Pink'], size: '11 × 17 in', pages: '', edition: '50', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '$95', left: '', status: 'available',
    image: 'images/tree-purple-pink.jpg', photo: 'images/photos/tree-purple-pink.jpg', layers: ['images/layers/tree-purple-pink-1.webp', 'images/layers/tree-purple-pink-2.webp'], detail: 'images/tree-purple-pink-detail.jpg', buy: '', about: TREE_ABOUT },
  { no: 'BPC–004', title: 'Untitled (Tree Composition)', artist: EZGI_JON, type: 'Print', colorway: 'Kelly Green and Teal', inks: ['Kelly Green', 'Teal'], size: '11 × 17 in', pages: '', edition: '50', paper: 'Speckletone, 80 lb', year: '2026', price: '$45', framed: '$95', left: '', status: 'available',
    image: 'images/tree-green-teal.jpg', photo: 'images/photos/tree-green-teal.jpg', layers: ['images/layers/tree-green-teal-1.webp', 'images/layers/tree-green-teal-2.webp'], detail: 'images/tree-green-teal-detail.jpg', buy: '', about: TREE_ABOUT },
  { no: 'BPC–005', title: 'Matador', artist: 'Jon Goldman', type: 'Print', inks: [], size: '[Size]', pages: '', edition: '25', paper: '[Paper stock]', year: '2026', price: '[PRICE]', framed: '', left: '', status: 'available',
    image: 'images/matador.jpg', photo: 'images/photos/matador.jpg', detail: 'images/matador-detail.jpg', buy: '',
    about: '[Two lines about Matador.]' },
  { no: 'BPC–006', title: 'Water Stone Gradient', artist: '[Artist]', type: 'Print', inks: [], size: '[Size]', pages: '', edition: '[N]', paper: 'Speckletone', year: '[Year]', price: '[PRICE]', framed: '', left: '', status: 'available',
    image: 'images/water-stone-gradient.jpg', detail: '', buy: '', about: '[Two lines about Water Stone Gradient.]' },
  { no: 'BPC–007', title: 'Sparkle', artist: '[Artist]', type: 'Print', inks: [], size: '[Size]', pages: '', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', framed: '', left: '', status: 'available',
    image: 'images/sparkle.jpg', detail: '', buy: '', about: '[Two lines about Sparkle.]' },
  { no: 'BPC–008', title: 'Seeing Through Trees', artist: '[Artist]', type: 'Print', inks: [], size: '[Size]', pages: '', edition: '[N]', paper: 'Speckletone', year: '[Year]', price: '[PRICE]', framed: '', left: '', status: 'available',
    image: 'images/seeing-through-trees.jpg', detail: '', buy: '', about: '[Two lines about Seeing Through Trees.]' },
  { no: 'BPC–009', title: 'Rainbowburn', artist: '[Artist]', type: 'Print', inks: [], size: '[Size]', pages: '', edition: '[N]', paper: 'Speckletone', year: '[Year]', price: '[PRICE]', framed: '', left: '', status: 'available',
    image: 'images/rainbowburn.jpg', detail: '', buy: '', about: '[Two lines about Rainbowburn.]' },
  { no: 'BPC–010', title: 'Flowers Up', artist: '[Artist]', type: 'Print', inks: [], size: '[Size]', pages: '', edition: '[N]', paper: 'Speckletone', year: '[Year]', price: '[PRICE]', framed: '', left: '', status: 'available',
    image: 'images/flowers-up.jpg', detail: '', buy: '', about: '[Two lines about Flowers Up.]' },
  { no: 'BPC–011', title: 'Foliage', artist: '[Artist]', type: 'Print', inks: [], size: '[Size]', pages: '', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', framed: '', left: '', status: 'available',
    image: 'images/foliage.jpg', detail: '', buy: '', about: '[Two lines about Foliage.]' },
  { no: 'BPC–012', title: 'Flowers 4', artist: '[Artist]', type: 'Print', inks: [], size: '[Size]', pages: '', edition: '[N]', paper: 'Speckletone', year: '[Year]', price: '[PRICE]', framed: '', left: '', status: 'available',
    image: 'images/flowers-4.jpg', detail: '', buy: '', about: '[Two lines about Flowers 4.]' },
  { no: 'BPC–013', title: 'Dark Water', artist: '[Artist]', type: 'Print', inks: [], size: '[Size]', pages: '', edition: '[N]', paper: 'Speckletone', year: '[Year]', price: '[PRICE]', framed: '', left: '', status: 'available',
    image: 'images/dark-water.jpg', detail: '', buy: '', about: '[Two lines about Dark Water.]' },
  { no: 'BPC–014', title: 'Blue Water', artist: '[Artist]', type: 'Print', inks: [], size: '[Size]', pages: '', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', framed: '', left: '', status: 'available',
    image: 'images/blue-water.jpg', detail: '', buy: '', about: '[Two lines about Blue Water.]' }
];
