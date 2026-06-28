const STORAGE_KEY = "cafeshop-pos-state-v1";
const TAX_RATE = 0.1;
const SERVICE_RATE = 0.05;

const staticMenuImages = {
  "m-espresso": "images/espresso.svg",
  "m-americano": "images/americano.svg",
  "m-latte": "images/latte.svg",
  "m-cappuccino": "images/cappuccino.svg",
  "m-mocha": "images/mocha.svg",
  "m-matcha": "images/matcha.svg",
  "m-choco": "images/chocolate.svg",
  "m-lemongrass": "images/tea.svg",
  "m-croissant": "images/croissant.svg",
  "m-toast": "images/toast.svg",
  "m-rice": "images/ricebowl.svg",
  "m-brownies": "images/brownies.svg",
  "m-cheesecake": "images/cheesecake.svg",
  "m-pudding": "images/pudding.svg"
};

const state = {
  view: "cashier",
  selectedCategory: "Semua",
  search: "",
  orderType: "Dine-in",
  editingMenuId: null,
  pendingMenuImage: null,
  pendingMenuImageSource: "none",
  cart: [],
  data: loadState()
};

const el = {
  pageTitle: document.getElementById("pageTitle"),
  pageSubtitle: document.getElementById("pageSubtitle"),
  clock: document.getElementById("clock"),
  shiftStatusDot: document.getElementById("shiftStatusDot"),
  shiftStatusText: document.getElementById("shiftStatusText"),
  shiftStatusMeta: document.getElementById("shiftStatusMeta"),
  quickOpenShift: document.getElementById("quickOpenShift"),
  navLinks: document.querySelectorAll(".nav-link"),
  views: document.querySelectorAll(".view"),
  categoryTabs: document.getElementById("categoryTabs"),
  productGrid: document.getElementById("productGrid"),
  menuSearch: document.getElementById("menuSearch"),
  cartItems: document.getElementById("cartItems"),
  ticketNumber: document.getElementById("ticketNumber"),
  clearCart: document.getElementById("clearCart"),
  cashierName: document.getElementById("cashierName"),
  customerName: document.getElementById("customerName"),
  tableNumber: document.getElementById("tableNumber"),
  orderTypeTabs: document.getElementById("orderTypeTabs"),
  discountInput: document.getElementById("discountInput"),
  paymentMethod: document.getElementById("paymentMethod"),
  paidInput: document.getElementById("paidInput"),
  subtotalText: document.getElementById("subtotalText"),
  serviceText: document.getElementById("serviceText"),
  taxText: document.getElementById("taxText"),
  totalText: document.getElementById("totalText"),
  changeText: document.getElementById("changeText"),
  checkoutButton: document.getElementById("checkoutButton"),
  filterStart: document.getElementById("filterStart"),
  filterEnd: document.getElementById("filterEnd"),
  filterPayment: document.getElementById("filterPayment"),
  transactionSearch: document.getElementById("transactionSearch"),
  transactionMetrics: document.getElementById("transactionMetrics"),
  transactionTable: document.getElementById("transactionTable"),
  exportTransactions: document.getElementById("exportTransactions"),
  shiftCashier: document.getElementById("shiftCashier"),
  openingCash: document.getElementById("openingCash"),
  shiftExpenses: document.getElementById("shiftExpenses"),
  shiftNotes: document.getElementById("shiftNotes"),
  openShiftButton: document.getElementById("openShiftButton"),
  closeShiftButton: document.getElementById("closeShiftButton"),
  dailyReport: document.getElementById("dailyReport"),
  shiftTable: document.getElementById("shiftTable"),
  monthlyRevenue: document.getElementById("monthlyRevenue"),
  popularItems: document.getElementById("popularItems"),
  menuForm: document.getElementById("menuForm"),
  menuName: document.getElementById("menuName"),
  menuCategory: document.getElementById("menuCategory"),
  menuPrice: document.getElementById("menuPrice"),
  menuStock: document.getElementById("menuStock"),
  menuImage: document.getElementById("menuImage"),
  menuImagePreview: document.getElementById("menuImagePreview"),
  menuFormTitle: document.getElementById("menuFormTitle"),
  menuFormMode: document.getElementById("menuFormMode"),
  menuSubmitLabel: document.getElementById("menuSubmitLabel"),
  clearMenuImage: document.getElementById("clearMenuImage"),
  cancelMenuEdit: document.getElementById("cancelMenuEdit"),
  menuAdminList: document.getElementById("menuAdminList"),
  resetDemo: document.getElementById("resetDemo"),
  receiptDialog: document.getElementById("receiptDialog"),
  receiptContent: document.getElementById("receiptContent"),
  closeReceipt: document.getElementById("closeReceipt"),
  printReceipt: document.getElementById("printReceipt"),
  toast: document.getElementById("toast")
};

const pageMeta = {
  cashier: ["Menu Kasir", "Pilih produk, cek keranjang, dan selesaikan pembayaran."],
  transactions: ["Rekapan Transaksi", "Pantau transaksi berdasarkan tanggal, kasir, dan metode bayar."],
  shift: ["Laporan Shift", "Buka shift, tutup kasir, dan simpan totalan harian."],
  admin: ["Menu Admin", "Pendapatan bulanan, menu terlaris, dan pengelolaan menu."]
};

function defaultMenu() {
  return [
    { id: "m-espresso", name: "Espresso", category: "Kopi", price: 18000, stock: 68 },
    { id: "m-americano", name: "Americano", category: "Kopi", price: 22000, stock: 74 },
    { id: "m-latte", name: "Cafe Latte", category: "Kopi", price: 28000, stock: 62 },
    { id: "m-cappuccino", name: "Cappuccino", category: "Kopi", price: 29000, stock: 59 },
    { id: "m-mocha", name: "Mocha", category: "Kopi", price: 32000, stock: 41 },
    { id: "m-matcha", name: "Matcha Latte", category: "Non Kopi", price: 30000, stock: 46 },
    { id: "m-choco", name: "Chocolate", category: "Non Kopi", price: 26000, stock: 50 },
    { id: "m-lemongrass", name: "Lemongrass Tea", category: "Non Kopi", price: 24000, stock: 35 },
    { id: "m-croissant", name: "Butter Croissant", category: "Makanan", price: 26000, stock: 32 },
    { id: "m-toast", name: "Chicken Toast", category: "Makanan", price: 36000, stock: 25 },
    { id: "m-rice", name: "Beef Rice Bowl", category: "Makanan", price: 48000, stock: 18 },
    { id: "m-brownies", name: "Brownies", category: "Dessert", price: 22000, stock: 28 },
    { id: "m-cheesecake", name: "Cheesecake", category: "Dessert", price: 34000, stock: 14 },
    { id: "m-pudding", name: "Caramel Pudding", category: "Dessert", price: 21000, stock: 22 }
  ].map((item) => ({
    ...item,
    image: staticMenuImages[item.id] || "",
    imageSource: staticMenuImages[item.id] ? "static" : "none"
  }));
}

function seedData() {
  const menu = defaultMenu();
  const now = new Date();
  const shifts = [];
  const transactions = [];
  const sampleItems = [
    ["m-latte", 2],
    ["m-croissant", 1],
    ["m-americano", 3],
    ["m-rice", 1],
    ["m-matcha", 2],
    ["m-brownies", 2],
    ["m-cappuccino", 1],
    ["m-toast", 1],
    ["m-mocha", 2],
    ["m-cheesecake", 1]
  ];

  for (let dayOffset = 0; dayOffset < 22; dayOffset += 1) {
    const day = new Date(now);
    day.setDate(now.getDate() - dayOffset);
    const shiftId = `s-demo-${dateKey(day)}`;
    const openedAt = atHour(day, 8, 0).toISOString();
    const closedAt = atHour(day, 21, 30).toISOString();
    const dailyTransactions = 3 + (dayOffset % 4);
    let shiftSales = 0;
    let shiftCash = 0;

    for (let index = 0; index < dailyTransactions; index += 1) {
      const itemSeed = sampleItems[(dayOffset + index) % sampleItems.length];
      const secondSeed = sampleItems[(dayOffset + index + 3) % sampleItems.length];
      const items = [itemSeed, secondSeed].map(([id, qty]) => {
        const product = menu.find((item) => item.id === id);
        return {
          id: product.id,
          name: product.name,
          category: product.category,
          qty,
          price: product.price
        };
      });
      const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const discount = index === 0 && dayOffset % 3 === 0 ? 5000 : 0;
      const service = Math.round(subtotal * SERVICE_RATE);
      const tax = Math.round((subtotal - discount + service) * TAX_RATE);
      const total = Math.max(0, subtotal - discount + service + tax);
      const paymentMethod = ["Tunai", "QRIS", "Kartu Debit", "Transfer"][(dayOffset + index) % 4];
      const date = atHour(day, 9 + index * 2, 15 + index * 7).toISOString();
      const transaction = {
        id: `TRX-${dateKey(day).replaceAll("-", "")}-${String(index + 1).padStart(3, "0")}`,
        date,
        shiftId,
        cashier: index % 2 === 0 ? "Rani" : "Bima",
        customer: index % 2 === 0 ? "Walk-in" : "Member",
        table: index % 2 === 0 ? `A${index + 1}` : "",
        orderType: index % 2 === 0 ? "Dine-in" : "Takeaway",
        items,
        subtotal,
        discount,
        service,
        tax,
        total,
        paymentMethod,
        paid: paymentMethod === "Tunai" ? roundCash(total + 20000) : total,
        change: paymentMethod === "Tunai" ? roundCash(total + 20000) - total : 0
      };
      transactions.push(transaction);
      shiftSales += total;
      if (paymentMethod === "Tunai") shiftCash += total;
    }

    shifts.push({
      id: shiftId,
      cashier: dayOffset % 2 === 0 ? "Rani" : "Bima",
      openedAt,
      closedAt,
      openingCash: 500000,
      expenses: dayOffset % 5 === 0 ? 45000 : 0,
      notes: dayOffset % 5 === 0 ? "Pembelian bahan operasional" : "",
      status: "closed",
      closing: {
        transactionCount: dailyTransactions,
        totalSales: shiftSales,
        cashSales: shiftCash,
        nonCashSales: shiftSales - shiftCash,
        expectedCash: 500000 + shiftCash - (dayOffset % 5 === 0 ? 45000 : 0)
      }
    });
  }

  return {
    menu,
    transactions,
    shifts,
    activeShiftId: null,
    ticketCounter: 1
  };
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedData();
  try {
    const parsed = JSON.parse(raw);
    const menu = normalizeMenu(Array.isArray(parsed.menu) ? parsed.menu : defaultMenu());
    return {
      menu,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      shifts: Array.isArray(parsed.shifts) ? parsed.shifts : [],
      activeShiftId: parsed.activeShiftId || null,
      ticketCounter: Number(parsed.ticketCounter) || 1
    };
  } catch {
    return seedData();
  }
}

function normalizeMenu(menu) {
  return menu.map((item) => ({
    id:
      item.id ||
      `m-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
    name: item.name || "Menu Baru",
    category: item.category || "Kopi",
    price: Number(item.price) || 0,
    stock: Number(item.stock) || 0,
    image:
      item.imageSource === "custom"
        ? item.image
        : staticMenuImages[item.id] || item.image || "",
    imageSource:
      item.imageSource === "custom"
        ? "custom"
        : staticMenuImages[item.id]
          ? "static"
          : item.image
            ? "custom"
            : "none"
  }));
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    return true;
  } catch (error) {
    showToast("Penyimpanan penuh. Gunakan gambar yang lebih kecil.");
    return false;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium"
  }).format(new Date(value));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function dateKey(date = new Date()) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function atHour(date, hour, minute) {
  const next = new Date(date);
  next.setHours(hour, minute, 0, 0);
  return next;
}

function roundCash(value) {
  return Math.ceil(value / 10000) * 10000;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getActiveShift() {
  return state.data.shifts.find((shift) => shift.id === state.data.activeShiftId && shift.status === "open");
}

function getCartTotals() {
  const subtotal = state.cart.reduce((sum, line) => sum + line.price * line.qty, 0);
  const discount = Math.min(Number(el.discountInput.value) || 0, subtotal);
  const service = Math.round(subtotal * SERVICE_RATE);
  const taxable = Math.max(0, subtotal - discount + service);
  const tax = Math.round(taxable * TAX_RATE);
  const total = Math.max(0, taxable + tax);
  const paid = Number(el.paidInput.value) || 0;
  const change = Math.max(0, paid - total);
  return { subtotal, discount, service, tax, total, paid, change };
}

function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => el.toast.classList.remove("show"), 2600);
}

function setView(view) {
  state.view = view;
  el.navLinks.forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  el.views.forEach((viewNode) => viewNode.classList.toggle("active", viewNode.id === `${view}View`));
  el.pageTitle.textContent = pageMeta[view][0];
  el.pageSubtitle.textContent = pageMeta[view][1];
  render();
}

function render() {
  renderShiftStatus();
  if (state.view === "cashier") {
    renderCategories();
    renderProducts();
    renderCart();
  }
  if (state.view === "transactions") renderTransactions();
  if (state.view === "shift") renderShift();
  if (state.view === "admin") renderAdmin();
}

function renderShiftStatus() {
  const activeShift = getActiveShift();
  el.quickOpenShift.textContent = activeShift ? "Shift Aktif" : "Buka Shift";
  el.quickOpenShift.disabled = Boolean(activeShift);
  el.openShiftButton.disabled = Boolean(activeShift);
  el.closeShiftButton.disabled = !activeShift;
  el.checkoutButton.disabled = !activeShift || state.cart.length === 0;
  el.shiftStatusDot.classList.toggle("open", Boolean(activeShift));
  el.shiftStatusText.textContent = activeShift ? `Shift ${activeShift.cashier}` : "Shift belum dibuka";
  el.shiftStatusMeta.textContent = activeShift
    ? `Dibuka ${formatDateTime(activeShift.openedAt)}`
    : "Buka shift untuk mulai mencatat penjualan.";
}

function renderCategories() {
  const categories = ["Semua", ...new Set(state.data.menu.map((item) => item.category))];
  el.categoryTabs.innerHTML = categories
    .map(
      (category) => `
        <button class="${state.selectedCategory === category ? "active" : ""}" data-category="${escapeHtml(category)}">
          ${escapeHtml(category)}
        </button>
      `
    )
    .join("");
}

function renderProducts() {
  const query = state.search.trim().toLowerCase();
  const products = state.data.menu.filter((product) => {
    const categoryMatch = state.selectedCategory === "Semua" || product.category === state.selectedCategory;
    const searchMatch = product.name.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });

  if (!products.length) {
    el.productGrid.innerHTML = '<div class="empty-state">Menu tidak ditemukan.</div>';
    return;
  }

  el.productGrid.innerHTML = products
    .map((product) => {
      const initials = product.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();
      const visualClass = product.category.toLowerCase().replaceAll(" ", "-");
      const disabled = product.stock <= 0;
      const imageStyle = product.image ? ` style="background-image: url('${escapeHtml(product.image)}')"` : "";
      return `
        <article class="product-card" aria-disabled="${disabled}">
          <div class="product-visual ${visualClass}"${imageStyle}>${product.image ? "" : escapeHtml(initials)}</div>
          <div class="product-meta">
            <strong>${escapeHtml(product.name)}</strong>
            <span>${escapeHtml(product.category)} - Stok ${product.stock}</span>
          </div>
          <div class="product-bottom">
            <span class="price">${formatCurrency(product.price)}</span>
            <button class="add-button" data-add="${product.id}" ${disabled ? "disabled" : ""}>Tambah</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCart() {
  el.ticketNumber.textContent = `Tiket #${String(state.data.ticketCounter).padStart(4, "0")}`;

  if (!state.cart.length) {
    el.cartItems.innerHTML = '<div class="cart-empty">Keranjang masih kosong.</div>';
  } else {
    el.cartItems.innerHTML = state.cart
      .map(
        (line) => `
          <div class="cart-line">
            <div class="cart-line-title">
              <strong>${escapeHtml(line.name)}</strong>
              <span>${formatCurrency(line.price)} x ${line.qty}</span>
              <strong>${formatCurrency(line.price * line.qty)}</strong>
            </div>
            <div class="qty-control" aria-label="Jumlah ${escapeHtml(line.name)}">
              <button data-decrease="${line.id}" aria-label="Kurangi ${escapeHtml(line.name)}">-</button>
              <span>${line.qty}</span>
              <button data-increase="${line.id}" aria-label="Tambah ${escapeHtml(line.name)}">+</button>
            </div>
          </div>
        `
      )
      .join("");
  }

  const totals = getCartTotals();
  el.subtotalText.textContent = formatCurrency(totals.subtotal);
  el.serviceText.textContent = formatCurrency(totals.service);
  el.taxText.textContent = formatCurrency(totals.tax);
  el.totalText.textContent = formatCurrency(totals.total);
  el.changeText.textContent = formatCurrency(totals.change);
  el.checkoutButton.disabled = !getActiveShift() || state.cart.length === 0;
}

function addToCart(productId) {
  const product = state.data.menu.find((item) => item.id === productId);
  if (!product || product.stock <= 0) return;

  const existing = state.cart.find((line) => line.id === productId);
  const existingQty = existing ? existing.qty : 0;
  if (existingQty >= product.stock) {
    showToast("Stok menu tidak cukup.");
    return;
  }

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      qty: 1
    });
  }
  renderCart();
}

function updateCartQty(productId, delta) {
  const index = state.cart.findIndex((line) => line.id === productId);
  if (index < 0) return;
  const product = state.data.menu.find((item) => item.id === productId);
  const nextQty = state.cart[index].qty + delta;
  if (nextQty <= 0) {
    state.cart.splice(index, 1);
  } else if (product && nextQty <= product.stock) {
    state.cart[index].qty = nextQty;
  } else {
    showToast("Stok menu tidak cukup.");
  }
  renderCart();
}

function clearCart() {
  state.cart = [];
  el.discountInput.value = 0;
  el.paidInput.value = 0;
  el.customerName.value = "";
  el.tableNumber.value = "";
  renderCart();
}

function openShift() {
  if (getActiveShift()) return;
  const cashier = el.shiftCashier.value.trim() || el.cashierName.value.trim() || "Kasir";
  const openingCash = Number(el.openingCash.value) || 0;
  const shift = {
    id: `SHIFT-${Date.now()}`,
    cashier,
    openedAt: new Date().toISOString(),
    closedAt: null,
    openingCash,
    expenses: 0,
    notes: "",
    status: "open",
    closing: null
  };
  state.data.shifts.push(shift);
  state.data.activeShiftId = shift.id;
  el.cashierName.value = cashier;
  saveState();
  showToast("Shift dibuka.");
  render();
}

function closeShift() {
  const activeShift = getActiveShift();
  if (!activeShift) return;

  const expenses = Number(el.shiftExpenses.value) || 0;
  const relatedTransactions = state.data.transactions.filter((trx) => trx.shiftId === activeShift.id);
  const totalSales = relatedTransactions.reduce((sum, trx) => sum + trx.total, 0);
  const cashSales = relatedTransactions
    .filter((trx) => trx.paymentMethod === "Tunai")
    .reduce((sum, trx) => sum + trx.total, 0);

  activeShift.closedAt = new Date().toISOString();
  activeShift.expenses = expenses;
  activeShift.notes = el.shiftNotes.value.trim();
  activeShift.status = "closed";
  activeShift.closing = {
    transactionCount: relatedTransactions.length,
    totalSales,
    cashSales,
    nonCashSales: totalSales - cashSales,
    expectedCash: activeShift.openingCash + cashSales - expenses
  };
  state.data.activeShiftId = null;
  saveState();
  showToast("Kasir ditutup dan laporan shift tersimpan.");
  render();
}

function checkout() {
  const activeShift = getActiveShift();
  if (!activeShift) {
    showToast("Buka shift terlebih dahulu.");
    return;
  }
  if (!state.cart.length) return;

  const totals = getCartTotals();
  const paymentMethod = el.paymentMethod.value;
  if (paymentMethod === "Tunai" && totals.paid < totals.total) {
    showToast("Nominal diterima kurang dari total.");
    return;
  }

  const transaction = {
    id: `TRX-${dateKey().replaceAll("-", "")}-${String(state.data.ticketCounter).padStart(4, "0")}`,
    date: new Date().toISOString(),
    shiftId: activeShift.id,
    cashier: el.cashierName.value.trim() || activeShift.cashier,
    customer: el.customerName.value.trim() || "Walk-in",
    table: el.tableNumber.value.trim(),
    orderType: state.orderType,
    items: state.cart.map((line) => ({ ...line })),
    subtotal: totals.subtotal,
    discount: totals.discount,
    service: totals.service,
    tax: totals.tax,
    total: totals.total,
    paymentMethod,
    paid: paymentMethod === "Tunai" ? totals.paid : totals.total,
    change: paymentMethod === "Tunai" ? totals.change : 0
  };

  for (const line of state.cart) {
    const product = state.data.menu.find((item) => item.id === line.id);
    if (product) product.stock = Math.max(0, product.stock - line.qty);
  }

  state.data.transactions.unshift(transaction);
  state.data.ticketCounter += 1;
  saveState();
  showReceipt(transaction);
  clearCart();
  renderProducts();
  showToast("Transaksi tersimpan.");
}

function getFilteredTransactions() {
  const start = el.filterStart.value ? new Date(`${el.filterStart.value}T00:00:00`) : null;
  const end = el.filterEnd.value ? new Date(`${el.filterEnd.value}T23:59:59`) : null;
  const payment = el.filterPayment.value;
  const query = el.transactionSearch.value.trim().toLowerCase();

  return state.data.transactions.filter((trx) => {
    const trxDate = new Date(trx.date);
    const startMatch = !start || trxDate >= start;
    const endMatch = !end || trxDate <= end;
    const paymentMatch = payment === "Semua" || trx.paymentMethod === payment;
    const queryText = `${trx.id} ${trx.cashier} ${trx.customer} ${trx.items.map((item) => item.name).join(" ")}`.toLowerCase();
    return startMatch && endMatch && paymentMatch && queryText.includes(query);
  });
}

function renderTransactions() {
  const transactions = getFilteredTransactions();
  const revenue = transactions.reduce((sum, trx) => sum + trx.total, 0);
  const itemCount = transactions.reduce((sum, trx) => sum + trx.items.reduce((count, item) => count + item.qty, 0), 0);
  const cash = transactions.filter((trx) => trx.paymentMethod === "Tunai").reduce((sum, trx) => sum + trx.total, 0);
  const average = transactions.length ? Math.round(revenue / transactions.length) : 0;

  el.transactionMetrics.innerHTML = [
    ["Total Omzet", formatCurrency(revenue)],
    ["Transaksi", transactions.length],
    ["Item Terjual", itemCount],
    ["Rata-rata Nota", formatCurrency(average)]
  ]
    .map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  if (!transactions.length) {
    el.transactionTable.innerHTML = '<tr><td colspan="7">Belum ada transaksi pada filter ini.</td></tr>';
    return;
  }

  el.transactionTable.innerHTML = transactions
    .map(
      (trx) => `
        <tr>
          <td><strong>${escapeHtml(trx.id)}</strong></td>
          <td>${formatDateTime(trx.date)}</td>
          <td>${escapeHtml(trx.customer)}<br><span class="status-pill soft">${escapeHtml(trx.orderType)}</span></td>
          <td>${trx.items.map((item) => `${escapeHtml(item.name)} x${item.qty}`).join("<br>")}</td>
          <td><span class="status-pill">${escapeHtml(trx.paymentMethod)}</span></td>
          <td><strong>${formatCurrency(trx.total)}</strong></td>
          <td><button class="ghost-button" data-receipt="${trx.id}">Struk</button></td>
        </tr>
      `
    )
    .join("");
}

function renderShift() {
  const activeShift = getActiveShift();
  const todayTransactions = state.data.transactions.filter((trx) => dateKey(trx.date) === dateKey());
  const activeTransactions = activeShift
    ? state.data.transactions.filter((trx) => trx.shiftId === activeShift.id)
    : todayTransactions;
  const totalSales = activeTransactions.reduce((sum, trx) => sum + trx.total, 0);
  const cashSales = activeTransactions
    .filter((trx) => trx.paymentMethod === "Tunai")
    .reduce((sum, trx) => sum + trx.total, 0);
  const expenses = Number(el.shiftExpenses.value) || (activeShift ? activeShift.expenses : 0);
  const openingCash = activeShift ? activeShift.openingCash : Number(el.openingCash.value) || 0;

  el.dailyReport.innerHTML = [
    ["Status", activeShift ? "Shift aktif" : "Tidak ada shift aktif"],
    ["Transaksi shift", activeTransactions.length],
    ["Penjualan", formatCurrency(totalSales)],
    ["Tunai", formatCurrency(cashSales)],
    ["Non tunai", formatCurrency(totalSales - cashSales)],
    ["Modal kas", formatCurrency(openingCash)],
    ["Pengeluaran", formatCurrency(expenses)],
    ["Kas akhir sistem", formatCurrency(openingCash + cashSales - expenses)]
  ]
    .map(([label, value]) => `<div class="report-line"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  const closedShifts = [...state.data.shifts]
    .filter((shift) => shift.status === "closed")
    .sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt));

  if (!closedShifts.length) {
    el.shiftTable.innerHTML = '<tr><td colspan="6">Belum ada laporan shift yang ditutup.</td></tr>';
    return;
  }

  el.shiftTable.innerHTML = closedShifts
    .map((shift) => {
      const closing = shift.closing || {};
      return `
        <tr>
          <td>${formatDate(shift.closedAt || shift.openedAt)}<br><span>${formatDateTime(shift.openedAt)}</span></td>
          <td>${escapeHtml(shift.cashier)}</td>
          <td>${closing.transactionCount || 0}</td>
          <td><strong>${formatCurrency(closing.totalSales || 0)}</strong></td>
          <td>${formatCurrency(closing.cashSales || 0)}</td>
          <td>${formatCurrency(closing.expectedCash || 0)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderAdmin() {
  renderMonthlyRevenue();
  renderPopularItems();
  renderMenuAdmin();
}

function renderMonthlyRevenue() {
  const monthly = new Map();
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - offset);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthly.set(key, 0);
  }

  state.data.transactions.forEach((trx) => {
    const date = new Date(trx.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (monthly.has(key)) monthly.set(key, monthly.get(key) + trx.total);
  });

  const max = Math.max(...monthly.values(), 1);
  el.monthlyRevenue.innerHTML = [...monthly.entries()]
    .map(([key, total]) => {
      const monthLabel = new Intl.DateTimeFormat("id-ID", { month: "short", year: "2-digit" }).format(
        new Date(`${key}-01T00:00:00`)
      );
      return `
        <div class="bar-row">
          <span>${escapeHtml(monthLabel)}</span>
          <div class="bar-track"><div class="bar-fill" style="width: ${Math.max(3, (total / max) * 100)}%"></div></div>
          <strong>${formatCurrency(total)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderPopularItems() {
  const counts = new Map();
  state.data.transactions.forEach((trx) => {
    trx.items.forEach((item) => {
      counts.set(item.name, (counts.get(item.name) || 0) + item.qty);
    });
  });
  const topItems = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const max = Math.max(...topItems.map((item) => item[1]), 1);

  if (!topItems.length) {
    el.popularItems.innerHTML = '<div class="empty-state">Belum ada data pembelian.</div>';
    return;
  }

  el.popularItems.innerHTML = topItems
    .map(
      ([name, qty]) => `
        <div class="bar-row">
          <span>${escapeHtml(name)}</span>
          <div class="bar-track"><div class="bar-fill alt" style="width: ${Math.max(5, (qty / max) * 100)}%"></div></div>
          <strong>${qty}x</strong>
        </div>
      `
    )
    .join("");
}

function renderMenuAdmin() {
  el.menuAdminList.innerHTML = state.data.menu
    .map(
      (item) => `
        <div class="menu-admin-item">
          <div class="menu-admin-thumb" ${item.image ? `style="background-image: url('${escapeHtml(item.image)}')"` : ""}>
            ${item.image ? "" : "<span>No Image</span>"}
          </div>
          <div class="menu-admin-meta">
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.category)} - ${formatCurrency(item.price)} - Stok ${item.stock}</p>
          </div>
          <div class="menu-admin-actions">
            <button class="ghost-button" data-edit-menu="${item.id}">Edit</button>
            <button class="ghost-button text-button-danger" data-remove-menu="${item.id}">Hapus</button>
          </div>
        </div>
      `
    )
    .join("");
}

function updateMenuImagePreview() {
  const image = state.pendingMenuImage;
  el.menuImagePreview.style.backgroundImage = image ? `url("${image}")` : "";
  el.menuImagePreview.innerHTML = image ? "" : "<span>Preview</span>";
}

function resetMenuForm() {
  state.editingMenuId = null;
  state.pendingMenuImage = null;
  state.pendingMenuImageSource = "none";
  el.menuForm.reset();
  el.menuFormTitle.textContent = "Tambah Menu";
  el.menuFormMode.textContent = "Baru";
  el.menuSubmitLabel.textContent = "Simpan Menu";
  el.cancelMenuEdit.classList.add("is-hidden");
  updateMenuImagePreview();
}

function startMenuEdit(menuId) {
  const item = state.data.menu.find((menuItem) => menuItem.id === menuId);
  if (!item) return;

  state.editingMenuId = item.id;
  state.pendingMenuImage = item.image || null;
  state.pendingMenuImageSource = item.imageSource || (item.image ? "custom" : "none");
  el.menuName.value = item.name;
  el.menuCategory.value = item.category;
  el.menuPrice.value = item.price;
  el.menuStock.value = item.stock;
  el.menuImage.value = "";
  el.menuFormTitle.textContent = "Edit Menu";
  el.menuFormMode.textContent = "Edit";
  el.menuSubmitLabel.textContent = "Update Menu";
  el.cancelMenuEdit.classList.remove("is-hidden");
  updateMenuImagePreview();
  el.menuName.focus();
}

function getMenuImageForSave(name, category) {
  if (state.pendingMenuImageSource === "custom") {
    return { image: state.pendingMenuImage, imageSource: "custom" };
  }
  if (state.pendingMenuImageSource === "static") {
    return { image: state.pendingMenuImage, imageSource: "static" };
  }
  if (state.pendingMenuImageSource === "none") {
    return { image: null, imageSource: "none" };
  }
  return { image: null, imageSource: "none" };
}

function saveMenuItem(event) {
  event.preventDefault();
  const name = el.menuName.value.trim();
  const category = el.menuCategory.value;
  const price = Number(el.menuPrice.value);
  const stock = Number(el.menuStock.value);
  if (!name || price <= 0 || stock < 0) {
    showToast("Lengkapi nama, harga, dan stok menu.");
    return;
  }

  const imageData = getMenuImageForSave(name, category);
  const payload = {
    name,
    category,
    price,
    stock,
    image: imageData.image,
    imageSource: imageData.imageSource
  };

  if (state.editingMenuId) {
    const item = state.data.menu.find((menuItem) => menuItem.id === state.editingMenuId);
    if (!item) return;
    Object.assign(item, payload);
    state.cart = state.cart.map((line) =>
      line.id === item.id
        ? { ...line, name: item.name, category: item.category, price: item.price, qty: Math.min(line.qty, item.stock) }
        : line
    );
    showToast("Menu berhasil diupdate.");
  } else {
    state.data.menu.push({
      id: `m-${Date.now()}`,
      ...payload
    });
    showToast("Menu baru tersimpan.");
  }

  if (saveState()) resetMenuForm();
  render();
}

function removeMenuItem(menuId) {
  const item = state.data.menu.find((menuItem) => menuItem.id === menuId);
  if (!item) return;
  if (!window.confirm(`Hapus menu "${item.name}" dari daftar aktif?`)) return;
  state.data.menu = state.data.menu.filter((item) => item.id !== menuId);
  state.cart = state.cart.filter((line) => line.id !== menuId);
  if (state.editingMenuId === menuId) resetMenuForm();
  saveState();
  showToast("Menu dihapus.");
  render();
}

function clearMenuImage() {
  state.pendingMenuImage = null;
  state.pendingMenuImageSource = "none";
  el.menuImage.value = "";
  updateMenuImagePreview();
}

function handleMenuImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Pilih file gambar.");
    el.menuImage.value = "";
    return;
  }

  compressImage(file)
    .then((image) => {
      state.pendingMenuImage = image;
      state.pendingMenuImageSource = "custom";
      updateMenuImagePreview();
    })
    .catch(() => {
      showToast("Gambar gagal diproses.");
      el.menuImage.value = "";
    });
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSide = 900;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showReceipt(transaction) {
  el.receiptContent.innerHTML = `
    <strong>CafeShop POS</strong>
    <span>${escapeHtml(transaction.id)}</span>
    <span>${formatDateTime(transaction.date)}</span>
    <div class="rule"></div>
    <div>Kasir: ${escapeHtml(transaction.cashier)}</div>
    <div>Pelanggan: ${escapeHtml(transaction.customer)}</div>
    <div>Tipe: ${escapeHtml(transaction.orderType)}${transaction.table ? ` / Meja ${escapeHtml(transaction.table)}` : ""}</div>
    <div class="rule"></div>
    ${transaction.items
      .map(
        (item) => `
          <div>
            <div>${escapeHtml(item.name)} x${item.qty}</div>
            <div class="split"><span>${formatCurrency(item.price)}</span><strong>${formatCurrency(item.price * item.qty)}</strong></div>
          </div>
        `
      )
      .join("")}
    <div class="rule"></div>
    <div class="split"><span>Subtotal</span><strong>${formatCurrency(transaction.subtotal)}</strong></div>
    <div class="split"><span>Diskon</span><strong>${formatCurrency(transaction.discount)}</strong></div>
    <div class="split"><span>Service</span><strong>${formatCurrency(transaction.service)}</strong></div>
    <div class="split"><span>PPN</span><strong>${formatCurrency(transaction.tax)}</strong></div>
    <div class="split"><span>Total</span><strong>${formatCurrency(transaction.total)}</strong></div>
    <div class="split"><span>${escapeHtml(transaction.paymentMethod)}</span><strong>${formatCurrency(transaction.paid)}</strong></div>
    <div class="split"><span>Kembali</span><strong>${formatCurrency(transaction.change)}</strong></div>
  `;
  el.receiptDialog.showModal();
}

function exportCsv() {
  const transactions = getFilteredTransactions();
  const header = ["id", "tanggal", "kasir", "pelanggan", "item", "metode_bayar", "subtotal", "diskon", "service", "ppn", "total"];
  const rows = transactions.map((trx) => [
    trx.id,
    formatDateTime(trx.date),
    trx.cashier,
    trx.customer,
    trx.items.map((item) => `${item.name} x${item.qty}`).join("; "),
    trx.paymentMethod,
    trx.subtotal,
    trx.discount,
    trx.service,
    trx.tax,
    trx.total
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rekap-transaksi-${dateKey()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  el.navLinks.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  el.quickOpenShift.addEventListener("click", openShift);
  el.openShiftButton.addEventListener("click", openShift);
  el.closeShiftButton.addEventListener("click", closeShift);
  el.menuSearch.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderProducts();
  });
  el.categoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.selectedCategory = button.dataset.category;
    renderCategories();
    renderProducts();
  });
  el.productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(button.dataset.add);
  });
  el.cartItems.addEventListener("click", (event) => {
    const increase = event.target.closest("[data-increase]");
    const decrease = event.target.closest("[data-decrease]");
    if (increase) updateCartQty(increase.dataset.increase, 1);
    if (decrease) updateCartQty(decrease.dataset.decrease, -1);
  });
  el.clearCart.addEventListener("click", clearCart);
  el.discountInput.addEventListener("input", renderCart);
  el.paidInput.addEventListener("input", renderCart);
  el.paymentMethod.addEventListener("change", () => {
    if (el.paymentMethod.value !== "Tunai") el.paidInput.value = getCartTotals().total;
    renderCart();
  });
  el.orderTypeTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-order-type]");
    if (!button) return;
    state.orderType = button.dataset.orderType;
    el.orderTypeTabs.querySelectorAll("button").forEach((node) => node.classList.toggle("active", node === button));
  });
  el.checkoutButton.addEventListener("click", checkout);
  [el.filterStart, el.filterEnd, el.filterPayment, el.transactionSearch].forEach((input) =>
    input.addEventListener("input", renderTransactions)
  );
  el.transactionTable.addEventListener("click", (event) => {
    const button = event.target.closest("[data-receipt]");
    if (!button) return;
    const transaction = state.data.transactions.find((trx) => trx.id === button.dataset.receipt);
    if (transaction) showReceipt(transaction);
  });
  el.exportTransactions.addEventListener("click", exportCsv);
  el.shiftExpenses.addEventListener("input", renderShift);
  el.openingCash.addEventListener("input", renderShift);
  el.menuForm.addEventListener("submit", saveMenuItem);
  el.menuImage.addEventListener("change", handleMenuImageUpload);
  el.clearMenuImage.addEventListener("click", clearMenuImage);
  el.cancelMenuEdit.addEventListener("click", resetMenuForm);
  el.menuAdminList.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-menu]");
    const removeButton = event.target.closest("[data-remove-menu]");
    if (editButton) startMenuEdit(editButton.dataset.editMenu);
    if (removeButton) removeMenuItem(removeButton.dataset.removeMenu);
  });
  el.resetDemo.addEventListener("click", () => {
    if (!window.confirm("Reset semua data demo?")) return;
    state.data = seedData();
    state.cart = [];
    resetMenuForm();
    saveState();
    showToast("Data demo direset.");
    render();
  });
  el.closeReceipt.addEventListener("click", () => el.receiptDialog.close());
  el.printReceipt.addEventListener("click", () => window.print());
}

function initFilters() {
  const today = dateKey();
  el.filterStart.value = today;
  el.filterEnd.value = today;
}

function startClock() {
  const tick = () => {
    el.clock.textContent = new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());
  };
  tick();
  window.setInterval(tick, 30000);
}

bindEvents();
initFilters();
startClock();
render();
