import test from 'node:test';
import assert from 'node:assert/strict';
import { MENU, makeLine, restoreCart, totalPrice, whatsappUrl } from '../src/menu.js';

test('invalid stored data never crashes startup', () => {
  for (const raw of [null, '{broken', '{}', 'null', '42', '[null, false, {}, {"quantity":-1}]']) {
    assert.deepEqual(restoreCart(raw), []);
  }
});

test('restored cart uses current catalog pricing, rejects invalid variants, caps duplicate quantities', () => {
  const cart = restoreCart(JSON.stringify([
    { id: 3, size: 'Large', quantity: 2, price: 1, name: 'Wrong name' },
    { id: 3, size: 'Large', quantity: 120 },
    { id: 1, size: 'Bottle', quantity: 1 },
    { id: 800, size: 'Medium', quantity: 1 },
    { id: 2, size: 'Medium', quantity: 1.5 },
  ]));
  assert.equal(cart.length, 1);
  assert.equal(cart[0].name, 'Avocado');
  assert.equal(cart[0].price, 500000);
  assert.equal(cart[0].quantity, 99);
});

test('menu retains all 21 items and the photographed size availability', () => {
  assert.equal(MENU.length, 21);
  assert.equal(new Set(MENU.map(item => item.id)).size, 21);
  for (const id of [1, 9, 10]) assert.equal(MENU.find(item => item.id === id).options.length, 2);
  assert.equal(MENU.find(item => item.id === 3).options[2].price, 800000);
  assert.equal(MENU.find(item => item.id === 16).options[0].price, 450000);
});

test('WhatsApp message correctly encodes quantities, totals, Arabic notes and delivery details', () => {
  const cart = [makeLine(MENU[0], MENU[0].options[1], 2), makeLine(MENU[2], MENU[2].options[2])];
  assert.equal(totalPrice(cart), 1600000);
  const url = new URL(whatsappUrl(cart, { name: ' Rana ', method: 'delivery', address: 'شارع ١ & Building #2', notes: 'No sugar & extra ice' }));
  assert.equal(url.origin + url.pathname, 'https://wa.me/96176804192');
  const message = url.searchParams.get('text');
  assert.ok(message.includes("1. *Fruit Pieces Cocktail*"));
  assert.ok(message.includes("Size: Large · Qty: 2"));
  assert.ok(message.includes("Line total: 800,000 L.L."));
  assert.match(message, /Items total: 1,600,000 L.L./);
  assert.match(message, /Name: Rana/);
  assert.ok(message.includes('شارع ١ & Building #2'));
  assert.ok(message.includes('No sugar & extra ice'));
  assert.equal(url.searchParams.size, 1);
});

test('pickup message excludes any previously entered delivery address', () => {
  const message = new URL(whatsappUrl([], { method: 'pickup', address: 'Old address' })).searchParams.get('text');
  assert.ok(message.includes('Order type: Pickup'));
  assert.ok(!message.includes('Old address'));
});

test('professional summary has numbered selections, item counts and separate delivery fees', () => {
  const cart = [makeLine(MENU[0], MENU[0].options[0], 2), makeLine(MENU[14], MENU[14].options[0])];
  const message = new URL(whatsappUrl(cart, { method: 'delivery', address: 'Main street', notes: 'No added sugar' })).searchParams.get('text');
  assert.ok(message.startsWith('*BEIRUT SWEETS*\nOrder request'));
  assert.ok(message.includes('2. *Nutella Crepe*'));
  assert.ok(message.includes('Total quantity: 3 items'));
  assert.ok(message.includes('*Items total: 1,000,000 L.L.*'));
  assert.ok(message.includes('Delivery fee: to be confirmed (not included above).'));
  assert.ok(message.includes('*SPECIAL REQUESTS*\nNotes: No added sugar'));
  const pickup = new URL(whatsappUrl([makeLine(MENU[0], MENU[0].options[0])])).searchParams.get('text');
  assert.ok(pickup.includes('Total quantity: 1 item'));
  assert.ok(!pickup.includes('Delivery fee:'));
  assert.ok(!pickup.includes('*SPECIAL REQUESTS*'));
});
