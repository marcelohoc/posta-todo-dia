(function () {
  "use strict";
  var C = window.PTD_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var ultimo = null;

  try { $("token").value = localStorage.getItem("ptd_token") || ""; } catch (e) {}

  function erro(msg) { $("erro").textContent = msg; $("erro").hidden = !msg; }

  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var token = $("token").value.trim();
    if (!token) return erro("Cole o token de acesso.");
    if (!$("nome").value.trim()) return erro("Informe o nome do produto.");
    if (!$("descricao").value.trim() && !$("link").value.trim()) return erro("Informe a descrição ou o link.");
    erro("");
    try { localStorage.setItem("ptd_token", token); } catch (x) {}
    var corpo = {
      token: token,
      quantidade: parseInt($("quantidade").value, 10) || 10,
      plataforma: $("plataforma").value,
      tipo_conta: $("tipo_conta").value,
      voz_ia: $("voz_ia").value === "sim",
      produto: {
        nome: $("nome").value.trim(), link: $("link").value.trim(), descricao: $("descricao").value.trim(),
        preco: $("preco").value.trim(), publico: $("publico").value.trim(), diferenciais: $("diferenciais").value.trim()
      }
    };
    var btn = $("gerar"); btn.disabled = true; btn.textContent = "Gerando…";
    fetch(C.webhookRoteiros, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status + (r.status === 404 ? " — o workflow do n8n está ativo?" : "")); return r.json(); })
      .then(function (d) { if (!d.ok) throw new Error(d.erro || "Erro desconhecido"); ultimo = d; mostrar(d); })
      .catch(function (x) {
        erro(x instanceof TypeError
          ? "Não foi possível falar com o n8n. Confira se o workflow \"Posta Todo Dia — Roteirista\" foi importado e está ativo."
          : x.message);
      })
      .finally(function () { btn.disabled = false; btn.textContent = "Gerar roteiros"; });
  });

  function mostrar(d) {
    $("resumo").textContent = d.produto_resumo;
    $("tomadas").innerHTML = d.tomadas.map(function (t) {
      return '<li><span class="chk-print"></span><b>' + esc(t.id) + "</b><div>" + esc(t.o_que_filmar) + " <span class=\"pequeno\">(" + esc(t.duracao_s) + "s)</span>" +
        (t.dica ? '<br><span class="pequeno">Dica: ' + esc(t.dica) + "</span>" : "") + "</div></li>";
    }).join("");
    $("pendencias").innerHTML = (d.pendencias || []).length
      ? "<p><b>Confirmar antes de postar:</b></p><ul>" + d.pendencias.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "";
    $("roteiros").innerHTML = d.roteiros.map(function (r) {
      return '<div class="roteiro"><h4>' + esc(r.id) + " · " + esc(r.angulo) + "</h4>" +
        "<p><b>Gancho:</b> " + esc(r.gancho_falado) + "<br><b>Na tela:</b> " + esc(r.gancho_tela) + "</p>" +
        "<table>" + r.cenas.map(function (c) {
          return "<tr><td><b>" + esc(c.tomada) + "</b><br>" + esc(c.segundos) + "s</td><td>" + (c.fala ? "🗣 " + esc(c.fala) + "<br>" : "") + "🖊 " + esc(c.texto_tela) + "</td></tr>";
        }).join("") + "</table>" +
        '<p class="pequeno"><b>Legenda:</b> ' + esc(r.legenda) + "<br>" + esc(r.hashtags.join(" ")) + "<br><b>CTA:</b> " + esc(r.cta) +
        (r.usa_voz_ia ? "<br>⚠️ Ative o rótulo “Conteúdo gerado por IA” ao publicar." : "") + "</p></div>";
    }).join("");
    $("form-gerar").hidden = true;
    $("resultado").hidden = false;
    window.scrollTo(0, 0);
  }

  $("baixar").addEventListener("click", function () {
    if (!ultimo) return;
    var copia = { produto_resumo: ultimo.produto_resumo, pendencias: ultimo.pendencias, tomadas: ultimo.tomadas, roteiros: ultimo.roteiros };
    var url = URL.createObjectURL(new Blob([JSON.stringify(copia, null, 2)], { type: "application/json" }));
    var a = document.createElement("a"); a.href = url; a.download = "roteiros.json"; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });
  $("novo").addEventListener("click", function () { $("resultado").hidden = true; $("form-gerar").hidden = false; });
})();
