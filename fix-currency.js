const fs = require("fs");
const path = require("path");

const filesToFix = [
  "src/features/cart/components/Cart.tsx",
  "src/features/menu/components/MenuCard.tsx",
  "src/features/menu/components/MenuExplorer.tsx",
  "src/features/menu/components/MenuItemDetail.tsx",
  "src/features/orders/components/OrderStatusView.tsx"
];

filesToFix.forEach(file => {
  const p = path.join(__dirname, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, "utf-8");
    content = content.replace(/\$([{\d])/g, "Birr $1"); // Replace ${var} or $123 with Birr ${var} or Birr 123
    content = content.replace(/Price Range \(\$\)/g, "Price Range (Birr)");
    content = content.replace(/\+\$([{\d])/g, "+Birr $1"); // +${opt.price} -> +Birr ${opt.price}
    fs.writeFileSync(p, content, "utf-8");
    console.log("Fixed $ in", file);
  }
});
