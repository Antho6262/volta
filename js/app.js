/* ============================================================
   VOLTA — app.js
   Sidebar / topbar communs + items de navigation.
   ============================================================ */

const NAV_ITEMS = [
  { page: "dashboard",    icon: "🏠", label: "Dashboard",    file: "dashboard.html" },
  { page: "tracker",      icon: "📋", label: "Tracker",      file: "tracker.html" },
  { page: "armurerie",    icon: "🔫", label: "Armurerie",    file: "armurerie.html" },
  { page: "stats",        icon: "📊", label: "Stats",        file: "stats.html" },
  { page: "stock",        icon: "📦", label: "Stock",        file: "stock.html" },
  { page: "quotas",       icon: "🎯", label: "Quotas",       file: "quotas.html" },
  { page: "blanchiment",  icon: "💵", label: "Blanchiment",  file: "blanchiment.html" },
  { page: "paye",         icon: "💰", label: "Paye",         file: "paye.html" },
  { page: "transactions", icon: "🔁", label: "Transactions", file: "transactions.html" },
  { page: "taxes",        icon: "🧾", label: "Taxes",        file: "taxes.html" },
  { page: "admin",        icon: "⚙️", label: "Admin",        file: "admin.html" },
  { page: "profil",       icon: "👤", label: "Profil",       file: "profil.html" }
];

/* Construit le shell (sidebar + topbar) dans #shell, protège la page,
   et renvoie la session du membre connecté (ou redirige vers /index.html). */
async function initShell(activePage, pageTitle) {
  const session = requireSession();
  if (!session) return null;

  let allowed;
  try {
    allowed = await canAccess(session, activePage);
  } catch (e) {
    allowed = false;
  }
  if (!allowed) {
    document.body.innerHTML =
      '<div class="login-wrap"><div class="login-card"><div class="login-brand">ACCÈS REFUSÉ</div>' +
      '<p class="muted" style="text-align:center;margin-top:10px;">Ton compte est désactivé ou n\'a pas accès à cette page.</p>' +
      '<a href="' + pathToRoot() + 'index.html" class="btn btn-primary" style="margin-top:16px;display:block;text-align:center;" onclick="clearSession()">Retour à la connexion</a></div></div>';
    return null;
  }

  const root = pathToRoot();
  let navHtml = "";
  for (const item of NAV_ITEMS) {
    const ok = await canAccess(session, item.page);
    if (!ok) continue;
    const active = item.page === activePage ? " active" : "";
    navHtml += `<a class="nav-item${active}" href="${root}pages/${item.file}">
        <span class="ic">${item.icon}</span><span class="lbl">${item.label}</span>
      </a>`;
  }

  const shellHtml = `
    <div class="shell">
      <aside class="sidebar">
        <div class="sidebar-head">
          <img src="${root}img/logo.png" alt="Volta" class="sidebar-coin">
          <div class="sidebar-logo"><span class="full">VOLTA</span></div>
        </div>
        <nav class="nav">${navHtml}</nav>
        <div class="sidebar-foot">
          <div class="who"><b>${session.prenom} ${session.nom || ""}</b><span class="grade">${session.grade || ""}</span></div>
          <span class="logout-link" onclick="logout()">Se déconnecter</span>
        </div>
      </aside>
      <div class="main">
        <div class="topbar">
          <div class="topbar-title">${pageTitle || ""}</div>
          <div class="topbar-brand"><span class="coin">🪙</span> VOLTA</div>
        </div>
        <main class="content fade-in" id="content"></main>
      </div>
    </div>
  `;
  document.getElementById("shell").outerHTML = shellHtml;
  return session;
}
