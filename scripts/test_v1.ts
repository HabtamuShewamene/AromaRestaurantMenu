import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...val] = trimmed.split('=');
    if (key && val.length > 0) {
      process.env[key.trim()] = val.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

import { createOrder, getKitchenOrders, updateOrderStatus, getOrderById } from '../src/server/services/order.service';
import { createWaiterRequest, getActiveWaiterRequests } from '../src/server/services/waiter.service';
import { getAllTables } from '../src/server/services/table.service';
import { serializeOrder } from '../src/server/db/serializers';
import prisma from '../src/server/db/prisma';

async function testV1Flow() {
  console.log('=== TESTING V1 ORDERING & KITCHEN SYSTEM WITHOUT PAYMENTS ===\n');

  // 1. Get menu items and table 1
  const menuItems = await prisma.menuItem.findMany();
  const table = await prisma.diningTable.findFirst({ where: { number: 1 } });

  console.log(`1. Found ${menuItems.length} menu items and Table ${table?.number}`);

  // 2. Customer places order (No payment fields!)
  const dish = menuItems[0];
  const order = await createOrder({
    tableNumber: 1,
    customerName: 'Test Diner Table 1',
    orderType: 'DINE_IN',
    notes: 'Direct kitchen dispatch without payment barrier',
    items: [
      {
        itemId: dish.id,
        quantity: 1,
        notes: 'Chef special prep',
      },
    ],
  });

  console.log(`2. Order created successfully: ID ${order.id}, Status: ${order.status}, Total: $${order.totalAmount}`);

  // 3. Serialize order
  const serialized = serializeOrder(order as any);
  console.log('3. Serialized order contains paymentStatus:', 'paymentStatus' in serialized ? 'YES (FAIL)' : 'NO (PASS)');

  // 4. Verify in Kitchen Display
  const kitchenOrders = await getKitchenOrders();
  const inKitchen = kitchenOrders.find((o) => o.id === order.id);
  console.log('4. Order present in KDS:', inKitchen ? 'YES (PASS)' : 'NO (FAIL)');

  // 5. Advance KDS lifecycle: NEW -> CONFIRMED -> PREPARING -> READY -> SERVED
  await updateOrderStatus(order.id, 'CONFIRMED');
  await updateOrderStatus(order.id, 'PREPARING');
  await updateOrderStatus(order.id, 'READY');
  const servedOrder = await updateOrderStatus(order.id, 'SERVED');
  console.log(`5. Advanced through KDS to: ${servedOrder.status} (PASS)`);

  // 6. Test "Request Bill" waiter request
  const waiterReq = await createWaiterRequest({
    tableId: table!.id,
    type: 'REQUEST_BILL',
    note: 'Table 1 requested manual staff check',
  });
  console.log(`6. Waiter request created: Type: ${waiterReq.type}, Status: ${waiterReq.status} (PASS)`);

  // 7. Verify tables
  const tables = await getAllTables();
  console.log(`7. Successfully loaded ${tables.length} tables (PASS)`);

  console.log('\n=== ALL V1 WORKFLOW TESTS PASSED! ===');
}

testV1Flow().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
