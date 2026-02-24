(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const fmtBn = (v) => (v == null ? "N/A" : `LKR ${v.toLocaleString()} bn`);
  const fmtMn = (v) => `LKR ${v.toLocaleString()} mn`;
  const fmtPct = (v) => (v == null ? "N/A" : `${v}%`);

  const state = { data: null, selectedMinistry: null, sortMode: "total", trendMode: "exports" };

  const metric = (label) => state.data.headline_metrics.find((m) => m.label === label);
  const val = (m) => m?.value_lkr_bn ?? m?.value_pct ?? m?.value_usd_bn ?? null;

  /* ── Hero KPIs ── */
  function renderHeroKPIs() {
    const kpis = [
      { label: "Total Revenue", value: fmtBn(val(metric("Total Revenue and Grants"))), sub: "Revenue & Grants", cls: "green" },
      { label: "Total Expenditure", value: fmtBn(val(metric("Total Expenditure"))), sub: "Recurrent + Capital", cls: "blue" },
      { label: "Budget Deficit", value: fmtBn(val(metric("Overall Deficit"))), sub: `${val(metric("Deficit to GDP"))}% of GDP`, cls: "red" },
      { label: "GDP Growth", value: fmtPct(val(metric("GDP Growth Assumption"))), sub: "Projected for 2026", cls: "teal" },
    ];

    $("heroKpis").innerHTML = kpis
      .map(
        (k) => `
      <div class="hero-kpi hero-kpi--${k.cls}">
        <div class="hero-kpi__label">${k.label}</div>
        <div class="hero-kpi__value">${k.value}</div>
        <div class="hero-kpi__sub">${k.sub}</div>
      </div>`
      )
      .join("");
  }

  /* ── Fiscal Overview ── */
  function renderFiscalOverview() {
    const groups = [
      {
        title: "Revenue",
        cards: [
          { label: "Total Revenue & Grants", val: fmtBn(val(metric("Total Revenue and Grants"))), cls: "green" },
          { label: "Tax Revenue", val: fmtBn(val(metric("Tax Revenue"))), cls: "green" },
          { label: "Non-Tax Revenue", val: fmtBn(val(metric("Non-tax Revenue"))), cls: "green" },
        ],
      },
      {
        title: "Expenditure",
        cards: [
          { label: "Total Expenditure", val: fmtBn(val(metric("Total Expenditure"))), cls: "blue" },
          { label: "Recurrent Expenditure", val: fmtBn(val(metric("Recurrent Expenditure"))), cls: "blue" },
          { label: "Capital Expenditure", val: fmtBn(val(metric("Capital Expenditure"))), cls: "blue" },
        ],
      },
      {
        title: "Fiscal Balance",
        cards: [
          { label: "Overall Deficit", val: fmtBn(val(metric("Overall Deficit"))), cls: "red" },
          { label: "Deficit to GDP", val: fmtPct(val(metric("Deficit to GDP"))), cls: "red" },
          { label: "Primary Surplus to GDP", val: fmtPct(val(metric("Primary Surplus to GDP"))), cls: "teal" },
        ],
      },
      {
        title: "Financing & Assumptions",
        cards: [
          { label: "Gross Financing Needs", val: fmtBn(val(metric("Gross Financing Needs"))), cls: "purple" },
          { label: "Debt Repayments", val: fmtBn(val(metric("Debt Repayments"))), cls: "purple" },
          { label: "Inflation Assumption", val: fmtPct(val(metric("Inflation Assumption"))), cls: "amber" },
          { label: "GDP Growth", val: fmtPct(val(metric("GDP Growth Assumption"))), cls: "teal" },
        ],
      },
    ];

    $("fiscalGrid").innerHTML = groups
      .map(
        (g) => `
      <div class="fiscal-group">
        <div class="fiscal-group__title">${g.title}</div>
        <div class="fiscal-group__cards">
          ${g.cards.map((c) => `<div class="fiscal-card fiscal-card--${c.cls}"><div class="fiscal-card__label">${c.label}</div><div class="fiscal-card__value">${c.val}</div></div>`).join("")}
        </div>
      </div>`
      )
      .join("");
  }

  /* ── SVG Donut helper ── */
  function donutSVG(segments, size = 180, strokeWidth = 28) {
    const r = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circ = 2 * Math.PI * r;
    let offset = 0;

    const paths = segments.map((seg) => {
      const dash = (seg.pct / 100) * circ;
      const o = offset;
      offset += dash;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${strokeWidth}"
        stroke-dasharray="${dash} ${circ - dash}" stroke-dashoffset="${-o}"
        transform="rotate(-90 ${cx} ${cy})" />`;
    });

    const total = segments.reduce((a, s) => a + (s.amount || 0), 0);
    const centerText = total
      ? `<text x="${cx}" y="${cy - 6}" text-anchor="middle" fill="#0f172a" font-size="14" font-weight="800">${total.toLocaleString()}</text>
         <text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="500">LKR bn</text>`
      : "";

    return `<svg viewBox="0 0 ${size} ${size}" width="100%">${paths.join("")}${centerText}</svg>`;
  }

  /* ── Composition Section ── */
  function renderComposition() {
    const totalExp = val(metric("Total Expenditure"));
    const rec = val(metric("Recurrent Expenditure"));
    const cap = val(metric("Capital Expenditure"));
    const totalRev = val(metric("Total Revenue and Grants"));
    const taxRev = val(metric("Tax Revenue"));
    const nonTax = val(metric("Non-tax Revenue"));

    const recPct = ((rec / totalExp) * 100).toFixed(1);
    const capPct = ((cap / totalExp) * 100).toFixed(1);

    $("expDonut").innerHTML =
      donutSVG(
        [
          { pct: +recPct, color: "#3b82f6", amount: rec },
          { pct: +capPct, color: "#14b8a6", amount: cap },
        ],
        180,
        28
      ) +
      `<div class="donut-legend">
        <div class="donut-legend__item"><span class="donut-legend__label"><span class="donut-legend__dot" style="background:#3b82f6"></span>Recurrent</span><span class="donut-legend__val">${recPct}%</span></div>
        <div class="donut-legend__item"><span class="donut-legend__label"><span class="donut-legend__dot" style="background:#14b8a6"></span>Capital</span><span class="donut-legend__val">${capPct}%</span></div>
      </div>`;

    const taxPct = ((taxRev / totalRev) * 100).toFixed(1);
    const nonTaxPct = ((nonTax / totalRev) * 100).toFixed(1);

    $("revDonut").innerHTML =
      donutSVG(
        [
          { pct: +taxPct, color: "#10b981", amount: taxRev },
          { pct: +nonTaxPct, color: "#a7f3d0", amount: nonTax },
        ],
        180,
        28
      ) +
      `<div class="donut-legend">
        <div class="donut-legend__item"><span class="donut-legend__label"><span class="donut-legend__dot" style="background:#10b981"></span>Tax Revenue</span><span class="donut-legend__val">${taxPct}%</span></div>
        <div class="donut-legend__item"><span class="donut-legend__label"><span class="donut-legend__dot" style="background:#a7f3d0"></span>Non-Tax</span><span class="donut-legend__val">${nonTaxPct}%</span></div>
      </div>`;

    const maxBar = totalExp;
    const revCoverage = ((totalRev / totalExp) * 100).toFixed(1);
    const deficit = val(metric("Overall Deficit"));
    const financing = val(metric("Gross Financing Needs"));
    const debt = val(metric("Debt Repayments"));

    const bars = [
      { label: "Revenue", val: totalRev, color: "#10b981", max: maxBar },
      { label: "Expenditure", val: totalExp, color: "#3b82f6", max: maxBar },
      { label: "Deficit", val: deficit, color: "#ef4444", max: maxBar },
      { label: "Debt Service", val: debt, color: "#8b5cf6", max: maxBar },
    ];

    $("balanceViz").innerHTML =
      bars
        .map((b) => {
          const w = ((b.val / b.max) * 100).toFixed(1);
          return `<div class="balance-row">
          <div class="balance-row__label">${b.label}</div>
          <div class="balance-row__bar balance-row__bar--bg">
            <div class="balance-row__fill" style="width:${w}%;background:${b.color}">${fmtBn(b.val)}</div>
          </div>
        </div>`;
        })
        .join("") +
      `<div style="font-size:0.78rem;color:#64748b;margin-top:0.3rem">Revenue covers ${revCoverage}% of expenditure. The remaining ${(100 - revCoverage).toFixed(1)}% requires deficit financing.</div>`;
  }

  /* ── Ministry Allocations ── */
  function getMinistries() {
    const q = $("searchInput").value.trim().toLowerCase();
    let list = [...state.data.ministry_allocations];

    if (q) list = list.filter((m) => m.ministry.toLowerCase().includes(q));

    const key =
      state.sortMode === "capital"
        ? "capital_lkr_mn"
        : state.sortMode === "recurrent"
          ? "recurrent_lkr_mn"
          : state.sortMode === "alpha"
            ? "ministry"
            : "total_lkr_mn";

    if (key === "ministry") list.sort((a, b) => a.ministry.localeCompare(b.ministry));
    else list.sort((a, b) => b[key] - a[key]);

    return list;
  }

  function renderMinistries() {
    const items = getMinistries();
    const maxVal = Math.max(...state.data.ministry_allocations.map((m) => m.total_lkr_mn), 1);

    if (!items.length) {
      $("ministryBars").innerHTML = '<div class="no-results">No ministries match your search.</div>';
      return;
    }

    $("ministryBars").innerHTML = items
      .map((m, i) => {
        const recPct = ((m.recurrent_lkr_mn / m.total_lkr_mn) * 100).toFixed(1);
        const capPct = (100 - recPct).toFixed(1);
        const barW = Math.max((m.total_lkr_mn / maxVal) * 100, 12).toFixed(1);
        const isActive = state.selectedMinistry?.ministry === m.ministry;
        return `<div class="ministry-bar${isActive ? " active" : ""}" data-idx="${i}" role="button" tabindex="0">
        <div class="ministry-bar__top">
          <span class="ministry-bar__name">${m.ministry}</span>
          <span class="ministry-bar__total">${fmtMn(m.total_lkr_mn)}</span>
        </div>
        <div class="ministry-bar__track" style="width:${barW}%">
          <div class="ministry-bar__rec" style="width:${recPct}%"></div>
          <div class="ministry-bar__cap" style="width:${capPct}%"></div>
        </div>
        <div class="ministry-bar__legend">
          <span class="rec-label">Recurrent ${recPct}%</span>
          <span class="cap-label">Capital ${capPct}%</span>
        </div>
      </div>`;
      })
      .join("");

    $("ministryBars").querySelectorAll(".ministry-bar").forEach((el) => {
      const handler = () => {
        const idx = +el.dataset.idx;
        state.selectedMinistry = items[idx];
        renderMinistries();
        renderDetail();
      };
      el.addEventListener("click", handler);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handler();
        }
      });
    });
  }

  function renderDetail() {
    const m = state.selectedMinistry;
    if (!m) {
      $("ministryDetail").innerHTML = `<div class="detail-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6M9 13h4"/></svg>
        <p>Select a ministry to see its breakdown</p>
      </div>`;
      return;
    }

    const capPct = ((m.capital_lkr_mn / m.total_lkr_mn) * 100).toFixed(1);
    const recPct = (100 - capPct).toFixed(1);
    const allTotal = state.data.ministry_allocations.reduce((s, x) => s + x.total_lkr_mn, 0);
    const shareOfListed = ((m.total_lkr_mn / allTotal) * 100).toFixed(1);

    $("ministryDetail").innerHTML = `<div class="detail-filled">
      <h3>${m.ministry}</h3>
      <div class="detail-donut">
        ${donutSVG(
          [
            { pct: +recPct, color: "#3b82f6", amount: 0 },
            { pct: +capPct, color: "#14b8a6", amount: 0 },
          ],
          140,
          22
        )}
      </div>
      <div class="detail-stat"><span class="detail-stat__label">Total Allocation</span><span class="detail-stat__val">${fmtMn(m.total_lkr_mn)}</span></div>
      <div class="detail-stat"><span class="detail-stat__label">Recurrent</span><span class="detail-stat__val">${fmtMn(m.recurrent_lkr_mn)}</span></div>
      <div class="detail-stat"><span class="detail-stat__label">Capital</span><span class="detail-stat__val">${fmtMn(m.capital_lkr_mn)}</span></div>
      <div class="detail-stat"><span class="detail-stat__label">Capital Share</span><span class="detail-stat__val">${capPct}%</span></div>
      <div class="detail-stat"><span class="detail-stat__label">Share of Listed</span><span class="detail-stat__val">${shareOfListed}%</span></div>
    </div>`;
  }

  function renderCoverage() {
    const allTotal = state.data.ministry_allocations.reduce((s, x) => s + x.total_lkr_mn, 0);
    const totalExpBn = val(metric("Total Expenditure"));
    const totalExpMn = totalExpBn * 1000;
    const coveragePct = ((allTotal / totalExpMn) * 100).toFixed(1);
    $("coverageBar").innerHTML = `<strong>Data Coverage:</strong> These 16 ministries account for LKR ${(allTotal / 1000).toFixed(0).toLocaleString()} bn (${coveragePct}% of total expenditure of LKR ${totalExpBn.toLocaleString()} bn). Remaining expenditure is allocated to other government entities not listed in this extract.`;
  }

  /* ── Trend Chart ── */
  function renderTrend() {
    const mode = state.trendMode;
    const series =
      mode === "exports"
        ? state.data.trend_indicators.merchandise_exports_usd_bn
        : state.data.trend_indicators.poverty_rate_pct;

    const yLabel = mode === "exports" ? "USD bn" : "%";
    const title = mode === "exports" ? "Merchandise Exports" : "Poverty Rate";
    const color = mode === "exports" ? "#10b981" : "#ef4444";
    const colorLight = mode === "exports" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)";

    if (!series || !series.length) {
      $("trendChart").innerHTML = '<div class="no-results">No official time series available.</div>';
      return;
    }

    const W = 700;
    const H = 260;
    const padL = 50;
    const padR = 30;
    const padT = 40;
    const padB = 50;

    const minY = Math.min(...series.map((d) => d.value)) * 0.9;
    const maxY = Math.max(...series.map((d) => d.value)) * 1.1;
    const ySpan = maxY - minY || 1;

    const pts = series.map((d, i) => ({
      ...d,
      x: padL + (i * (W - padL - padR)) / Math.max(series.length - 1, 1),
      y: padT + (1 - (d.value - minY) / ySpan) * (H - padT - padB),
    }));

    const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
    const areaPath = `M${pts[0].x},${H - padB} L${pts.map((p) => `${p.x},${p.y}`).join(" L")} L${pts[pts.length - 1].x},${H - padB} Z`;

    const gridLines = [0, 0.25, 0.5, 0.75, 1]
      .map((f) => {
        const y = padT + f * (H - padT - padB);
        const v = (maxY - f * ySpan).toFixed(1);
        return `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#e2e8f0" stroke-width="1" />
        <text x="${padL - 8}" y="${y + 4}" text-anchor="end" fill="#94a3b8" font-size="11">${v}</text>`;
      })
      .join("");

    const dots = pts
      .map(
        (p) => `
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="${color}" stroke="#fff" stroke-width="2.5" />
      <text x="${p.x}" y="${p.y - 14}" text-anchor="middle" fill="${color}" font-size="12" font-weight="700">${p.value}</text>
      <text x="${p.x}" y="${H - padB + 20}" text-anchor="middle" fill="#64748b" font-size="12" font-weight="500">${p.year}</text>`
      )
      .join("");

    const changeText =
      series.length >= 2
        ? (() => {
            const first = series[0].value;
            const last = series[series.length - 1].value;
            const change = (((last - first) / first) * 100).toFixed(1);
            const dir = last > first ? "+" : "";
            return `<text x="${W - padR}" y="22" text-anchor="end" fill="${color}" font-size="12" font-weight="700">${dir}${change}% (${series[0].year}-${series[series.length - 1].year})</text>`;
          })()
        : "";

    $("trendChart").innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" style="display:block">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <text x="${padL}" y="22" fill="#0f172a" font-size="14" font-weight="700">${title}</text>
        <text x="${padL}" y="36" fill="#94a3b8" font-size="11">${yLabel}</text>
        ${changeText}
        ${gridLines}
        <path d="${areaPath}" fill="url(#areaGrad)" />
        <polyline fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${polyline}" />
        ${dots}
      </svg>`;
  }

  /* ── Tax Cards ── */
  function renderTax() {
    $("taxCards").innerHTML = state.data.tax_policy_changes
      .map(
        (t) => `
      <div class="tax-card">
        <h3>${t.name}</h3>
        <div class="tax-card__rates">
          <div class="tax-rate">
            <span class="tax-rate__label">Previous</span>
            <span class="tax-rate__val tax-rate__val--old">${t.previous_rate_pct}%</span>
          </div>
          <span class="tax-arrow">&rarr;</span>
          <div class="tax-rate">
            <span class="tax-rate__label">New Rate</span>
            <span class="tax-rate__val tax-rate__val--new">${t.new_rate_pct}%</span>
          </div>
          <div style="margin-left:auto;text-align:right">
            <span style="display:block;font-size:1.3rem;font-weight:800;color:#ef4444">+${t.new_rate_pct - t.previous_rate_pct}pp</span>
            <span style="font-size:0.72rem;color:#94a3b8">increase</span>
          </div>
        </div>
        <div class="tax-card__date">Effective: ${t.effective_date}</div>
      </div>`
      )
      .join("");
  }

  /* ── Insights ── */
  function renderInsights() {
    const totalExp = val(metric("Total Expenditure"));
    const totalRev = val(metric("Total Revenue and Grants"));
    const rec = val(metric("Recurrent Expenditure"));
    const cap = val(metric("Capital Expenditure"));
    const deficit = val(metric("Overall Deficit"));
    const debt = val(metric("Debt Repayments"));
    const financing = val(metric("Gross Financing Needs"));

    const allMinTotal = state.data.ministry_allocations.reduce((s, x) => s + x.total_lkr_mn, 0);
    const sorted = [...state.data.ministry_allocations].sort((a, b) => b.total_lkr_mn - a.total_lkr_mn);
    const topCapital = [...state.data.ministry_allocations].sort((a, b) => b.capital_lkr_mn - a.capital_lkr_mn)[0];

    const povertyData = state.data.trend_indicators.poverty_rate_pct;
    const exportData = state.data.trend_indicators.merchandise_exports_usd_bn;

    const revCoverage = ((totalRev / totalExp) * 100).toFixed(1);
    const recShare = ((rec / totalExp) * 100).toFixed(1);

    const insights = [
      {
        icon: "red",
        title: "Revenue Gap",
        value: `${(100 - revCoverage).toFixed(1)}% Unfunded`,
        desc: `Revenue covers only ${revCoverage}% of expenditure. For every LKR 100 spent, only LKR ${(+revCoverage).toFixed(0)} comes from revenue; the rest requires borrowing.`,
        svg: '<path d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" stroke-width="1.5" stroke-linecap="round" fill="none" stroke="currentColor"/>',
      },
      {
        icon: "blue",
        title: "Recurrent Burden",
        value: `${recShare}% Recurrent`,
        desc: `Nearly 3 out of every 4 rupees goes to running costs (salaries, pensions, maintenance). Only ${(100 - recShare).toFixed(1)}% funds development/capital projects.`,
        svg: '<rect x="3" y="12" width="4" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="6" width="4" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="17" y="3" width="4" height="17" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      },
      {
        icon: "purple",
        title: "Debt Servicing",
        value: fmtBn(debt),
        desc: `Debt repayments (LKR ${debt.toLocaleString()} bn) exceed the annual deficit (LKR ${deficit.toLocaleString()} bn). Total financing needs stand at LKR ${financing.toLocaleString()} bn.`,
        svg: '<path d="M12 2v10l4.5 4.5M12 2a10 10 0 100 20 10 10 0 000-20z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      },
      {
        icon: "amber",
        title: "Spending Concentration",
        value: `${state.data.derived_insights.top_5_ministry_share_pct_of_listed_allocations}%`,
        desc: `Top 5 listed ministries command ${state.data.derived_insights.top_5_ministry_share_pct_of_listed_allocations}% of listed ministry allocations. ${sorted[0].ministry} leads with LKR ${sorted[0].total_lkr_mn.toLocaleString()} mn.`,
        svg: '<path d="M3 3h18v18H3zM3 9h18M9 3v18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      },
      {
        icon: "teal",
        title: "Infrastructure Investment",
        value: fmtMn(topCapital.capital_lkr_mn),
        desc: `${topCapital.ministry} receives the highest capital allocation, reflecting infrastructure development priority. Capital ratio: ${((topCapital.capital_lkr_mn / topCapital.total_lkr_mn) * 100).toFixed(1)}%.`,
        svg: '<path d="M2 20h20M5 20V10l7-7 7 7v10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      },
      {
        icon: "green",
        title: "Poverty Reduction",
        value: `${povertyData[0].value}% → ${povertyData[povertyData.length - 1].value}%`,
        desc: `Poverty declined from ${povertyData[0].value}% (${povertyData[0].year}) to ${povertyData[povertyData.length - 1].value}% (${povertyData[povertyData.length - 1].year}) — a ${(povertyData[0].value - povertyData[povertyData.length - 1].value).toFixed(1)} percentage point drop.`,
        svg: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      },
      {
        icon: "green",
        title: "Export Growth",
        value: `USD ${exportData[exportData.length - 1].value} bn`,
        desc: `Merchandise exports grew ${(((exportData[exportData.length - 1].value - exportData[0].value) / exportData[0].value) * 100).toFixed(1)}% from USD ${exportData[0].value} bn (${exportData[0].year}) to USD ${exportData[exportData.length - 1].value} bn (${exportData[exportData.length - 1].year}).`,
        svg: '<path d="M7 17l5-5 4 4 5-7M22 7h-5v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      },
      {
        icon: "red",
        title: "Tax Tightening",
        value: `${state.data.tax_policy_changes.length} Rate Hikes`,
        desc: `Both withholding tax (5%→10%) and capital gains tax (10%→15%) are being increased from April 2026, aimed at broadening the revenue base to close the fiscal gap.`,
        svg: '<path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      },
    ];

    $("insightCards").innerHTML = insights
      .map(
        (ins) => `
      <div class="insight-card">
        <div class="insight-card__header">
          <div class="insight-card__icon insight-card__icon--${ins.icon}">
            <svg width="18" height="18" viewBox="0 0 24 24">${ins.svg}</svg>
          </div>
          <span class="insight-card__title">${ins.title}</span>
        </div>
        <div class="insight-card__value">${ins.value}</div>
        <div class="insight-card__desc">${ins.desc}</div>
      </div>`
      )
      .join("");
  }

  /* ── Navigation ── */
  function setupNav() {
    $("menuBtn").addEventListener("click", () => {
      $("navLinks").classList.toggle("open");
    });

    document.querySelectorAll(".topnav__links a").forEach((a) => {
      a.addEventListener("click", () => $("navLinks").classList.remove("open"));
    });

    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const nav = $("topnav");
      if (window.scrollY > 100) nav.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
      else nav.style.boxShadow = "none";
      lastScroll = window.scrollY;
    });
  }

  /* ── Trend Toggle ── */
  function setupTrendToggle() {
    $("trendToggle").querySelectorAll(".pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        $("trendToggle").querySelectorAll(".pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.trendMode = btn.dataset.val;
        renderTrend();
      });
    });
  }

  /* ── Init ── */
  async function init() {
    setupNav();

    try {
      const res = await fetch("/data/processed/budget_2026.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.data = await res.json();

      $("status").textContent = "Data loaded successfully from official-source extraction pipeline.";
      $("heroSub").textContent = `Fiscal Year ${state.data.metadata.fiscal_year} · Generated ${new Date(state.data.metadata.generated_at_utc).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
      $("footerGen").textContent = `Dataset generated: ${state.data.metadata.generated_at_utc}`;

      renderHeroKPIs();
      renderFiscalOverview();
      renderComposition();
      renderMinistries();
      renderDetail();
      renderCoverage();
      renderTrend();
      renderTax();
      renderInsights();

      setupTrendToggle();

      $("searchInput").addEventListener("input", renderMinistries);
      $("sortSelect").addEventListener("change", (e) => {
        state.sortMode = e.target.value;
        renderMinistries();
      });
    } catch (err) {
      $("status").innerHTML = `<span style="color:#ef4444;font-weight:600">Failed to load data: ${err.message}</span>`;
    }
  }

  init();
})();
