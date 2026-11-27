/*
  Backyard Press Club: every work, in catalogue order.
  This one file feeds the Shop, the Catalogue and the quick look.

  To add a work, copy one block and change it:
    no        catalogue number, in order (BPC–001, BPC–002 ...)
    title     name of the piece
    artist    who made it
    type      "Print", "Zine", "Poster" or "Book"
    inks      ink names from INKS below, in print order
    size      e.g. "A3 · 297 × 420 mm"
    pages     zines and books only, e.g. "24 pages"
    edition   number of copies
    paper     paper stock
    year      year printed
    price     shown as written, e.g. "£25"
    status    "available", "few-left" or "sold-out"
    image     photo of the print, e.g. "images/bpc-001.jpg" (leave "" to show an ink sketch)
    detail    optional close-up shown on hover, e.g. "images/bpc-001-detail.jpg"
    buy       the Stripe Payment Link for this work (leave "" until it exists)
    about     one or two sentences for the quick look
*/

window.BPC_INKS = {
  'Federal Blue': '#3255a4',
  'Sunflower':    '#ffb511',
  'Teal':         '#00838a',
  'Orange':       '#ff6c2f',
  'Green':        '#00a95c',
  'Aqua':         '#5ec8e5',
  'Brown':        '#925f52',
  'Black':        '#3d3b38'
};

window.BPC_WORKS = [
  { no: 'BPC–001', title: '[Title]', artist: '[Artist]', type: 'Print',  inks: ['Federal Blue', 'Sunflower'], size: 'A3', pages: '', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', status: 'available', image: '', detail: '', buy: '', about: '[Two lines about the piece: what it is, how it was made, anything a buyer should know.]' },
  { no: 'BPC–002', title: '[Title]', artist: '[Artist]', type: 'Zine',   inks: ['Teal', 'Orange'],            size: 'A5', pages: '[N] pages', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', status: 'available', image: '', detail: '', buy: '', about: '[Two lines about the piece.]' },
  { no: 'BPC–003', title: '[Title]', artist: '[Artist]', type: 'Print',  inks: ['Black', 'Sunflower'],        size: 'A3', pages: '', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', status: 'sold-out',  image: '', detail: '', buy: '', about: '[Two lines about the piece.]' },
  { no: 'BPC–004', title: '[Title]', artist: '[Artist]', type: 'Poster', inks: ['Green', 'Federal Blue'],     size: 'A2', pages: '', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', status: 'few-left',  image: '', detail: '', buy: '', about: '[Two lines about the piece.]' },
  { no: 'BPC–005', title: '[Title]', artist: '[Artist]', type: 'Print',  inks: ['Brown', 'Aqua'],             size: 'A4', pages: '', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', status: 'available', image: '', detail: '', buy: '', about: '[Two lines about the piece.]' },
  { no: 'BPC–006', title: '[Title]', artist: '[Artist]', type: 'Zine',   inks: ['Orange', 'Federal Blue'],    size: 'A5', pages: '[N] pages', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', status: 'available', image: '', detail: '', buy: '', about: '[Two lines about the piece.]' },
  { no: 'BPC–007', title: '[Title]', artist: '[Artist]', type: 'Book',   inks: ['Green', 'Sunflower'],        size: 'A5', pages: '[N] pages', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', status: 'available', image: '', detail: '', buy: '', about: '[Two lines about the piece.]' },
  { no: 'BPC–008', title: '[Title]', artist: '[Artist]', type: 'Poster', inks: ['Teal', 'Sunflower'],         size: 'A2', pages: '', edition: '[N]', paper: '[Paper stock]', year: '[Year]', price: '[PRICE]', status: 'sold-out',  image: '', detail: '', buy: '', about: '[Two lines about the piece.]' }
];
