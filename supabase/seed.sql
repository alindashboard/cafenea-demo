-- ============================================================
-- Brew & Bean — Date fictive seed
-- Run AFTER schema.sql
-- ============================================================

-- Categories
insert into public.menu_categories (id, name, description, icon, sort_order) values
  ('11111111-0000-0000-0000-000000000001', 'Espresso', 'Băuturi pe bază de espresso', '☕', 1),
  ('11111111-0000-0000-0000-000000000002', 'Filter & Cold Brew', 'Cafea filtru și extracție la rece', '🫗', 2),
  ('11111111-0000-0000-0000-000000000003', 'Băuturi Reci & Limonade', 'Răcoritoare artizanale', '🍋', 3),
  ('11111111-0000-0000-0000-000000000004', 'Food', 'Sandwichuri, deserturi și altele', '🥐', 4)
on conflict (id) do nothing;

-- Espresso items
insert into public.items (name, description, price, category_id, is_popular, features, allergens, sizes, available) values
(
  'Espresso',
  'Shot dublu, crema aurie, origini sezoniere',
  8,
  '11111111-0000-0000-0000-000000000001',
  false,
  array['Decaf disponibil'],
  null,
  '[{"name":"Single","price":8},{"name":"Double","price":12}]'::jsonb,
  true
),
(
  'Cappuccino',
  'Espresso, lapte texturizat, spumă catifelată — echilibrul perfect',
  13,
  '11111111-0000-0000-0000-000000000001',
  true,
  array['Lapte de ovăz / migdale / cocos: +3 lei', 'Decaf disponibil'],
  array['lactoză'],
  '[{"name":"Small","ml":150,"price":13},{"name":"Medium","ml":200,"price":16},{"name":"Large","ml":300,"price":19}]'::jsonb,
  true
),
(
  'Flat White',
  'Dublu espresso, micro-foam, intensitate perfectă într-o ceașcă mică',
  14,
  '11111111-0000-0000-0000-000000000001',
  true,
  array['Lapte de ovăz / migdale / cocos: +3 lei', 'Decaf disponibil'],
  array['lactoză'],
  '[{"name":"Small","ml":150,"price":14},{"name":"Medium","ml":200,"price":17}]'::jsonb,
  true
),
(
  'Latte',
  'Espresso delicat, lapte cremos, perfect pentru latte art sezonier',
  13,
  '11111111-0000-0000-0000-000000000001',
  false,
  array['Lapte de ovăz / migdale / cocos: +3 lei', 'Decaf disponibil'],
  array['lactoză'],
  '[{"name":"Small","ml":200,"price":13},{"name":"Medium","ml":300,"price":16},{"name":"Large","ml":400,"price":19}]'::jsonb,
  true
),
(
  'Cortado',
  'Espresso echilibrat cu puțin lapte cald — pentru cei care știu ce vor',
  11,
  '11111111-0000-0000-0000-000000000001',
  false,
  array['Lapte de ovăz / migdale / cocos: +3 lei', 'Decaf disponibil'],
  array['lactoză'],
  null,
  true
),
(
  'Mocha',
  'Espresso, ciocolată belgiană, lapte texturizat — indulgență lichidă',
  16,
  '11111111-0000-0000-0000-000000000001',
  false,
  array['Lapte de ovăz / migdale / cocos: +3 lei', 'Decaf disponibil'],
  array['lactoză'],
  '[{"name":"Small","ml":200,"price":16},{"name":"Medium","ml":300,"price":19},{"name":"Large","ml":400,"price":22}]'::jsonb,
  true
);

-- Filter & Cold Brew items
insert into public.items (name, description, price, category_id, is_popular, features, allergens, sizes, available) values
(
  'V60 Pour Over',
  'Filtru manual, origine la alegere, preparare 3-4 minute — cafea în stare pură',
  16,
  '11111111-0000-0000-0000-000000000002',
  true,
  array['Origine schimbată săptămânal', 'Tasting notes la cerere'],
  null,
  null,
  true
),
(
  'Cold Brew',
  'Extracție la rece 18 ore, neted și ciocolatos, fără amăreală',
  14,
  '11111111-0000-0000-0000-000000000002',
  false,
  null,
  null,
  '[{"name":"Regular","ml":250,"price":14},{"name":"Large","ml":350,"price":17}]'::jsonb,
  true
),
(
  'Cold Brew Tonic',
  'Cold brew + apă tonică + felie de portocală — răcoritor și complex',
  18,
  '11111111-0000-0000-0000-000000000002',
  false,
  null,
  null,
  null,
  true
),
(
  'Batch Brew',
  'Cafea filtru proaspătă, gata în 15 minute, refill gratuit',
  10,
  '11111111-0000-0000-0000-000000000002',
  false,
  array['Refill gratuit', 'Origine schimbată zilnic'],
  null,
  null,
  true
);

-- Băuturi Reci & Limonade
insert into public.items (name, description, price, category_id, is_popular, features, allergens, sizes, available) values
(
  'Iced Latte',
  'Espresso proaspăt, lapte rece, gheață — clasicul verii',
  15,
  '11111111-0000-0000-0000-000000000003',
  true,
  array['Lapte de ovăz / migdale / cocos: +3 lei'],
  array['lactoză'],
  '[{"name":"Regular","ml":300,"price":15},{"name":"Large","ml":400,"price":18}]'::jsonb,
  true
),
(
  'Matcha Latte',
  'Matcha ceremonial grade, lapte de ovăz, ușor dulce și cremos',
  18,
  '11111111-0000-0000-0000-000000000003',
  false,
  array['Lapte de ovăz inclus', 'Variante: lapte de migdale'],
  null,
  '[{"name":"Regular","ml":300,"price":18},{"name":"Large","ml":400,"price":21}]'::jsonb,
  true
),
(
  'Limonadă clasică',
  'Lămâie proaspătă stoarsă, miere de albine, apă minerală',
  14,
  '11111111-0000-0000-0000-000000000003',
  false,
  null,
  null,
  null,
  true
),
(
  'Limonadă cu lavandă',
  'Lămâie, sirop de lavandă artizanal, apă minerală — florală și răcoritoare',
  16,
  '11111111-0000-0000-0000-000000000003',
  false,
  null,
  null,
  null,
  true
),
(
  'Fresh de portocale',
  'Portocale storse la comandă, fără zahăr adăugat',
  14,
  '11111111-0000-0000-0000-000000000003',
  false,
  null,
  null,
  null,
  true
);

-- Food
insert into public.items (name, description, price, category_id, is_popular, features, allergens, sizes, available) values
(
  'Croissant cu unt',
  'Copt dimineața, unt franțuzesc, foietaj auriu și crocant',
  12,
  '11111111-0000-0000-0000-000000000004',
  false,
  array['Disponibil dimineața până la 12:00'],
  array['gluten', 'lactoză'],
  null,
  true
),
(
  'Banana bread',
  'Rețetă proprie, nuci prăjite, ciocolată neagră — moale și aromat',
  14,
  '11111111-0000-0000-0000-000000000004',
  false,
  null,
  array['gluten', 'nuci', 'ouă'],
  null,
  true
),
(
  'Avocado toast',
  'Pâine artizanală prăjită, avocado, ou poșat, semințe, fulgi de chili',
  28,
  '11111111-0000-0000-0000-000000000004',
  false,
  array['Ou poșat opțional'],
  array['gluten', 'ouă'],
  null,
  true
),
(
  'Sandwich pui & pesto',
  'Ciabatta, pui la grătar, pesto de busuioc, rucola, mozzarella',
  32,
  '11111111-0000-0000-0000-000000000004',
  false,
  null,
  array['gluten', 'lactoză'],
  null,
  true
),
(
  'Cheesecake',
  'New York style, cremos, cu fructe de sezon din Bistrița-Năsăud',
  22,
  '11111111-0000-0000-0000-000000000004',
  false,
  array['Fructe de sezon — variază săptămânal'],
  array['gluten', 'lactoză', 'ouă'],
  null,
  true
),
(
  'Granola bowl',
  'Iaurt grecesc, granola homemade, fructe proaspete, miere de salcâm',
  24,
  '11111111-0000-0000-0000-000000000004',
  false,
  null,
  array['nuci', 'lactoză'],
  null,
  true
);

-- Gallery placeholders
insert into public.gallery (url, caption, sort_order) values
  ('/images/gallery-interior.jpg', 'Interiorul cald al cafenelei', 1),
  ('/images/gallery-bar.jpg', 'Barul — unde magia se întâmplă', 2),
  ('/images/gallery-terasa.jpg', 'Terasa din Piața Centrală', 3),
  ('/images/gallery-cafea.jpg', 'Latte art — fiecare ceașcă e unică', 4),
  ('/images/gallery-detail.jpg', 'Detalii — lemn, plante și lumini calde', 5),
  ('/images/gallery-echipa.jpg', 'Echipa Brew & Bean', 6)
on conflict do nothing;
