(function () {
  "use strict";
  var C = window.PTD_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function digitos(s) { return String(s || "").replace(/\D/g, ""); }

  if (C.metaPixelId) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", C.metaPixelId); window.fbq("track", "PageView");
  }

  var lp = $("lista-planos");
  if (lp) {
    lp.innerHTML = (C.planos || []).map(function (p) {
      return '<article class="plano' + (p.destaque ? " destaque" : "") + '">' + (p.destaque ? '<span class="tag">Mais escolhido</span>' : "") +
        "<h3>" + esc(p.nome) + '</h3><div class="preco">' + (p.preco ? "R$ " + esc(p.preco) + "<small>" + esc(p.periodo) + "</small>" : "Grátis") + "</div>" +
        "<ul>" + p.itens.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>" +
        '<a class="btn ' + (p.destaque ? "" : "btn-escuro") + ' btn-bloco" href="#teste">' + (p.preco ? "Começar com o teste grátis" : "Pedir meus 3 vídeos") + "</a></article>";
    }).join("");
  }

  var ct = $("contato");
  if (ct && C.email) ct.innerHTML = 'Contato: <a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>";

  var w = $("l-whats");
  if (w) w.addEventListener("input", function (e) {
    var d = digitos(e.target.value).slice(0, 11), o = d;
    if (d.length > 2) o = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) o = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
    e.target.value = o;
  });

  var form = $("form-lead");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = $("l-nome").value.trim(), whats = $("l-whats").value.trim();
    var erro = $("l-erro");
    if (!nome || digitos(whats).length < 10) { erro.textContent = "Preencha seu nome e WhatsApp com DDD."; erro.hidden = false; return; }
    erro.hidden = true;
    var perfil = $("l-perfil").options[$("l-perfil").selectedIndex].text;
    var msg = "Olá! Quero meus 3 vídeos grátis do Posta Todo Dia.\nNome: " + nome + "\nWhatsApp: " + whats + "\nPerfil: " + perfil +
      "\n@: " + ($("l-perfil-at").value.trim() || "-") + "\nProduto: " + ($("l-produto").value.trim() || "-");
    try { if (window.fbq) window.fbq("track", "Lead"); } catch (x) {}
    var link = C.whatsapp
      ? "https://wa.me/" + digitos(C.whatsapp) + "?text=" + encodeURIComponent(msg)
      : "mailto:" + C.email + "?subject=" + encodeURIComponent("Teste grátis — " + nome) + "&body=" + encodeURIComponent(msg);
    $("painel-lead").innerHTML = '<div class="ok-box"><div class="icone">🎬</div><h2>Quase lá, ' + esc(nome.split(" ")[0]) + "!</h2>" +
      "<p>Toque no botão para enviar seu pedido. A gente responde com o roteiro de gravação.</p>" +
      '<a class="btn btn-lg btn-bloco" href="' + esc(link) + '" target="_blank" rel="noopener">' + (C.whatsapp ? "Enviar no WhatsApp" : "Enviar por e-mail") + "</a></div>";
    location.href = link;
  });
})();
