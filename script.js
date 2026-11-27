/* =====================================================================
   script.js — todo o comportamento do site em um único arquivo

   PARTE 1 · CONFIGURAÇÃO (é só aqui que você edita dados do site)
   PARTE 2 · Preenchimento do conteúdo a partir da configuração
   PARTE 3 · Menu
   PARTE 4 · Rotas (site x Central de Orientação)
   PARTE 5 · Hero, scroll e animações
   PARTE 6 · Formulário de contato
   ===================================================================== */

/* ---------------------------------------------------------------------
   PARTE 1 · CONFIGURAÇÃO
   --------------------------------------------------------------------- */
window.SITE = {
  name: "Matheus Vicente",
  role: "Desenvolvedor independente",

  contact: {
    // Só dígitos, com país e DDD. Exemplo: "5511999999999"
    // Enquanto estiver vazio, os botões levam à seção de contato e o
    // formulário oferece e-mail (se houver) ou o botão "Copiar mensagem".
    whatsapp: "5511976961912",
    email: "vicentematheus628@gmail.com",
  },

  // URL completa do perfil. Vazio = o link não aparece no site.
  socials: {
    instagram: "",
    linkedin: "",
    github: "",
  },

  // Mensagens iniciais do WhatsApp (o formulário monta a dele automaticamente)
  messages: {
    hero: "Olá, Matheus! Vi seu portfólio e gostaria de conversar sobre um projeto.",
  },

  // Valores de referência. Para esconder um valor, apague a linha.
  prices: {
    landingPage: 500,
    siteInstitucional: 1000,
    lojaBasica: 2500,
    lojaIntermediaria: [2800, 3500],
    solucoesPersonalizadas: 4000,
  },

  // Mensalidades de manutenção por tipo de projeto.
  maintenancePrices: {
    landingPage: 300,
    siteInstitucional: 350,
    lojaVirtual: 400,
    sistemaPersonalizado: 450,
  },

  // Caminhos das imagens (coloque os arquivos em assets/img/).
  // Exemplo: foto: "assets/img/matheus.jpg"
  // Vazio = aparece o espaço reservado tracejado.
  images: {
    foto: "assets/img/matheus.jpg", // sua foto (retrato vertical)
    festas1: "assets/img/festas1.jpg", // Festas e Alegorias, captura grande
    festas2: "assets/img/festas2.jpg", // Festas e Alegorias, captura menor (vertical)
    gmud: "assets/img/gmud.jpg", // GMUD Control, SOMENTE captura higienizada
  },

  // Projetos. Preencha só com informações confirmadas.
  projects: {
    festas: {
      url: "", // link do site, ex: "https://www.festaseallegorias.com.br"
      features: [
        "Catálogo de produtos",
        "Busca de produtos",
        "Página de ofertas",
        "Área do cliente e pedidos",
        "Autenticação de clientes e administradores",
        "Criação e validação de cupons",
        "Atalho flutuante para WhatsApp",
      ], // ex: ["Catálogo", "Carrinho", "Painel administrativo"]

      tech: ["HTML", "CSS", "JavaScript", "Next.js", "Tailwind CSS"], // ex: ["HTML", "CSS", "JavaScript"]
    },

    gmud: {
      features: [
        "Dashboard gerencial",
        "Importação de planilhas Excel",
        "Consulta detalhada de chamados",
        "Filtros por período e status",
        "Acompanhamento de aprovações",
        "Indicadores e gráficos",
        "Análise de mudanças",
        "Exportação de relatórios",
      ],
      tech: ["HTML", "CSS", "JavaScript", "SheetJS", "Chart.js"],
    },
  },

  // Recursos que podem ser ligados quando estiverem prontos
  features: {
    whatsappAutomation: false, // true = mostra a seção de automação de WhatsApp
  },
};

(function () {
  "use strict";

  var SITE = window.SITE;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  /* -------------------------------------------------------------------
     PARTE 2 · PREENCHIMENTO A PARTIR DA CONFIGURAÇÃO
     ------------------------------------------------------------------- */
  $$("[data-site]").forEach(function (el) {
    var v = SITE[el.getAttribute("data-site")];
    if (v) el.textContent = v;
  });
  $$("#year, .year-copy").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  function brl(n) {
    return "R$ " + Number(n).toLocaleString("pt-BR");
  }
  $$("[data-price]").forEach(function (el) {
    var p = SITE.prices && SITE.prices[el.getAttribute("data-price")];
    if (p == null) return;
    el.textContent = Array.isArray(p) ? brl(p[0]) + " a " + brl(p[1]) : brl(p);
  });
  $$('[data-maintenance-price]').forEach(function (el) {
    var p = SITE.maintenancePrices && SITE.maintenancePrices[el.getAttribute("data-maintenance-price")];
    if (p == null) return;
    el.textContent = brl(p);
  });

  function whatsappUrl(text) {
    var n = String((SITE.contact && SITE.contact.whatsapp) || "").replace(
      /\D/g,
      "",
    );
    if (!n) return null;
    return (
      "https://wa.me/" + n + (text ? "?text=" + encodeURIComponent(text) : "")
    );
  }

  $$("[data-whatsapp]").forEach(function (el) {
    var url = whatsappUrl(
      SITE.messages && SITE.messages[el.getAttribute("data-whatsapp")],
    );
    if (!url) return; // sem número: o link segue para #contato
    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Canais da seção de contato (só aparecem se estiverem preenchidos)
  var email = (SITE.contact && SITE.contact.email) || "";
  if (whatsappUrl("")) $('[data-channel="whatsapp"]').hidden = false;
  if (email) {
    var li = $('[data-channel="email"]');
    li.hidden = false;
    var a = $("[data-mail]", li);
    a.href = "mailto:" + email;
    a.textContent = email;
  }
  // Contatos dentro do menu (mesmas regras: só aparecem se configurados)
  var mwa = whatsappUrl(SITE.messages && SITE.messages.hero),
    mchan = $(".menu__channels");
  if (mwa) {
    var lw = $("[data-menu-wa]");
    lw.href = mwa;
    lw.hidden = false;
    mchan.hidden = false;
  }
  if (email) {
    var lm = $("[data-menu-mail]");
    lm.href = "mailto:" + email;
    lm.textContent = email;
    lm.hidden = false;
    mchan.hidden = false;
  }

  ["instagram", "linkedin", "github"].forEach(function (k) {
    var url = SITE.socials && SITE.socials[k];
    if (!url) return;
    var li = $('[data-channel="' + k + '"]');
    li.hidden = false;
    $("a", li).href = url;
  });

  // Imagens (troca o espaço reservado pela imagem real)
  $$(".ph[data-img]").forEach(function (ph) {
    var src = SITE.images && SITE.images[ph.getAttribute("data-img")];
    if (!src) return;
    var img = new Image();
    img.alt = ph.getAttribute("data-alt") || "";
    img.decoding = "async";
    img.onload = function () {
      ph.textContent = "";
      ph.appendChild(img);
      void img.offsetWidth; // força o estilo inicial (opacidade 0) para o fade valer
      ph.classList.add("has-img");
    };
    img.onerror = function () {
      /* arquivo não encontrado: mantém o espaço reservado */
    };
    img.src = src;
  });

  // Projeto Festas e Alegorias
  var fest = (SITE.projects && SITE.projects.festas) || {};
  function fillList(sel, items) {
    var ul = $(sel);
    if (!ul || !items || !items.length) return;
    ul.textContent = "";
    items.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    });
  }
  fillList('[data-list="festasFeatures"]', fest.features);
  fillList('[data-list="festasTech"]', fest.tech);
  // Projeto GMUD CONTROL
  var gmud = (SITE.projects && SITE.projects.gmud) || {};

  fillList('[data-list="gmudFeatures"]', gmud.features);
  fillList('[data-list="gmudTech"]', gmud.tech);
  if (fest.url) {
    var pl = $("[data-project-link=festas]");
    pl.href = fest.url;
    pl.hidden = false;
  }

  // Automação de WhatsApp: só aparece quando ativada
  if (SITE.features && SITE.features.whatsappAutomation)
    $("#automacao").hidden = false;

  /* -------------------------------------------------------------------
     PARTE 3 · MENU
     ------------------------------------------------------------------- */
  var menu = $("#menu"),
    openBtn = $(".menu-btn"),
    closeBtn = $(".menu__close"),
    app = $("#app");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    openBtn.setAttribute("aria-expanded", String(open));
    app.toggleAttribute("inert", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeBtn.focus();
    else openBtn.focus({ preventScroll: true });
  }
  openBtn.addEventListener("click", function () {
    setMenu(true);
  });
  closeBtn.addEventListener("click", function () {
    setMenu(false);
  });
  $$("a", menu).forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("is-open");
      openBtn.setAttribute("aria-expanded", "false");
      app.removeAttribute("inert");
      document.body.style.overflow = "";
    });
  });
  document.addEventListener("keydown", function (e) {
    if (!menu.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      setMenu(false);
      return;
    }
    if (e.key === "Tab") {
      var items = $$("button, a", menu).filter(function (el) {
          return !el.closest("[hidden]") && el.getClientRects().length;
        }),
        first = items[0],
        last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* -------------------------------------------------------------------
     PARTE 4 · ROTAS: site (#/…) x Central de Orientação (#/orientacao/…)
     ------------------------------------------------------------------- */
  var site = $("#conteudo"),
    central = $("#central");
  var baseTitle = document.title,
    inCentral = false;

  function route() {
    var h = location.hash || "";
    if (h.indexOf("#/orientacao") === 0) {
      var slug = h.split("/")[2] || "";
      var found = false;
      $$("[data-tut]", central).forEach(function (v) {
        var show = v.getAttribute("data-tut") === slug;
        v.hidden = !show;
        if (show) found = true;
      });
      if (!found) {
        $('[data-tut=""]', central).hidden = false;
        slug = "";
      }
      site.hidden = true;
      central.hidden = false;
      inCentral = true;
      var view = $$("[data-tut]", central).filter(function (v) {
        return !v.hidden;
      })[0];
      var h1 = $("h1", view);
      document.title =
        (slug ? h1.textContent.replace(/\s+/g, " ") + " · " : "") +
        "Central de Orientação · " +
        SITE.name;
      window.scrollTo(0, 0);
      if (h1) h1.focus({ preventScroll: true });
      return;
    }
    var wasCentral = inCentral;
    site.hidden = false;
    central.hidden = true;
    inCentral = false;
    document.title = baseTitle;
    var target = null;
    if (h.length > 1 && h.charAt(1) !== "/") {
      try {
        target = $(h);
      } catch (e) {
        target = null;
      }
    }
    if (target) {
      requestAnimationFrame(function () {
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
        update();
      });
    } else if (wasCentral) {
      window.scrollTo(0, 0);
    }
    update();
  }
  window.addEventListener("hashchange", route);

  // Links de "solicitar" pré-selecionam o serviço do formulário
  $$("[data-service]").forEach(function (a) {
    a.addEventListener("click", function () {
      var sel = $("#f-servico");
      sel.value = a.getAttribute("data-service");
      updatePreview();
    });
  });

  /* -------------------------------------------------------------------
     PARTE 5 · HERO, SCROLL E ANIMAÇÕES
     ------------------------------------------------------------------- */
  var hero = $(".hero");

  // divide "Sistemas / que sustentam." em letras (entrada em passos)
  var count = 0;
  $$("[data-split]").forEach(function (line) {
    var text = line.textContent;
    line.textContent = "";
    Array.from(text).forEach(function (c) {
      var s = document.createElement("span");
      s.className = "ch";
      s.style.setProperty("--i", count++);
      s.textContent = c === " " ? " " : c;
      line.appendChild(s);
    });
  });

  function enter() {
    hero.classList.add("is-in");
  }
  if (reduce) {
    enter();
  } else {
    var fr =
      document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();
    Promise.race([
      fr,
      new Promise(function (r) {
        setTimeout(r, 1200);
      }),
    ]).then(function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(enter);
      });
    });
  }

  // Revelações: cada tipo tem uma intenção (assentar, máscara, arco, porta)
  $$("[data-stagger]").forEach(function (g) {
    $$("[data-reveal]", g).forEach(function (el, i) {
      el.style.setProperty("--i", i);
    });
  });
  // Revelação por posição na tela (não usa IntersectionObserver, que ignora
  // elementos totalmente recortados por clip-path, como os títulos em máscara)
  var pending = $$("[data-reveal]");
  function checkReveals() {
    if (!pending.length || inCentral) return;
    var vh = window.innerHeight;
    pending = pending.filter(function (el) {
      if (reduce) {
        el.classList.add("is-in");
        return false;
      }
      var r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return true;
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add("is-in");
        return false;
      }
      return true;
    });
  }

  var progress = $(".progress i"),
    steps = $(".steps");
  var parallax = $$("[data-parallax]");
  var ticking = false;
  if (reduce && steps) steps.style.setProperty("--draw", 1);

  function update() {
    ticking = false;
    checkReveals();
    var vh = window.innerHeight,
      y = window.scrollY;
    if (!inCentral) {
      if (!reduce)
        hero.style.setProperty(
          "--p",
          Math.min(Math.max(y / (vh * 0.9), 0), 1).toFixed(4),
        );
      if (steps && !reduce) {
        var r = steps.getBoundingClientRect();
        var d = Math.min(Math.max((vh * 0.65 - r.top) / r.height, 0), 1);
        steps.style.setProperty("--draw", d.toFixed(4));
      }
      if (!reduce)
        parallax.forEach(function (el) {
          var rr = el.getBoundingClientRect();
          if (rr.bottom < -100 || rr.top > vh + 100) return;
          var off =
            (rr.top + rr.height / 2 - vh / 2) *
            -parseFloat(el.getAttribute("data-parallax"));
          el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
        });
    }
    var max = document.documentElement.scrollHeight - vh;
    progress.style.setProperty("--page", max > 0 ? (y / max).toFixed(4) : 0);
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Profundidade com o ponteiro (só mouse e sem movimento reduzido)
  if (!reduce && finePointer) {
    var tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = null;
    var tick = function () {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      hero.style.setProperty("--px", cx.toFixed(3));
      hero.style.setProperty("--py", cy.toFixed(3));
      raf =
        Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001
          ? requestAnimationFrame(tick)
          : null;
    };
    window.addEventListener("pointermove", function (e) {
      if (inCentral || window.scrollY > window.innerHeight) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    var magnet = $(".hero .btn--solid");
    if (magnet) {
      magnet.addEventListener("pointermove", function (e) {
        var r = magnet.getBoundingClientRect();
        magnet.style.transform =
          "translate(" +
          ((e.clientX - (r.left + r.width / 2)) * 0.18).toFixed(1) +
          "px," +
          ((e.clientY - (r.top + r.height / 2)) * 0.28).toFixed(1) +
          "px)";
      });
      magnet.addEventListener("pointerleave", function () {
        magnet.style.transform = "";
      });
    }
  }

  /* -------------------------------------------------------------------
     PARTE 6 · FORMULÁRIO DE CONTATO
     Sem backend: o envio abre o WhatsApp com a mensagem pronta.
     Nada é "simulado": se não houver canal configurado, o site avisa.
     ------------------------------------------------------------------- */
  var form = $("#form-contato"),
    status = $("#form-status"),
    copyBtn = $("#copy-msg"),
    prev = $("#preview");
  var F = {
    nome: $("#f-nome"),
    empresa: $("#f-empresa"),
    servico: $("#f-servico"),
    descricao: $("#f-descricao"),
    contato: $("#f-contato"),
  };

  function buildMessage() {
    var nome = F.nome.value.trim(),
      emp = F.empresa.value.trim();
    var linhas = [
      "Olá, Matheus! Meu nome é " +
        (nome || "…") +
        (emp ? ", da empresa " + emp : "") +
        ".",
    ];
    linhas.push("Tenho interesse em: " + (F.servico.value || "…") + ".");
    linhas.push(
      "",
      "Sobre o projeto:",
      F.descricao.value.trim() || "…",
      "",
      "Meu contato: " + (F.contato.value.trim() || "…"),
    );
    return linhas.join("\n");
  }
  function updatePreview() {
    prev.textContent = buildMessage();
  }
  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);
  updatePreview();

  function setErr(key, msg) {
    var field = F[key],
      out = $("#e-" + key);
    out.textContent = msg || "";
    if (msg) {
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", "e-" + key);
    } else {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    }
    return !msg;
  }
  function validate() {
    var ok = [];
    ok.push(
      setErr(
        "nome",
        F.nome.value.trim().length < 2 ? "Conte o seu nome, por favor." : "",
      ),
    );
    ok.push(
      setErr(
        "servico",
        F.servico.value ? "" : "Escolha o serviço que mais se aproxima.",
      ),
    );
    ok.push(
      setErr(
        "descricao",
        F.descricao.value.trim().length < 10
          ? "Descreva a sua ideia em algumas palavras (mínimo 10 letras)."
          : "",
      ),
    );
    var c = F.contato.value.trim(),
      digits = c.replace(/\D/g, "");
    var okC = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) || digits.length >= 10;
    ok.push(
      setErr("contato", okC ? "" : "Informe um e-mail ou telefone com DDD."),
    );
    return ok.every(Boolean);
  }
  ["nome", "servico", "descricao", "contato"].forEach(function (k) {
    F[k].addEventListener("blur", function () {
      if (F[k].value || F[k].hasAttribute("aria-invalid")) validate();
    });
  });

  function say(msg, isError) {
    status.textContent = msg;
    status.classList.toggle("is-error", !!isError);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    copyBtn.hidden = true;
    if (!validate()) {
      var bad = $("[aria-invalid=true]", form);
      if (bad) bad.focus();
      say("Confira os campos destacados.", true);
      return;
    }
    var msg = buildMessage(),
      wa = whatsappUrl(msg);
    if (wa) {
      window.open(wa, "_blank", "noopener");
      say("Abrindo o WhatsApp com a sua mensagem pronta. É só enviar por lá.");
      return;
    }
    if (email) {
      window.location.href =
        "mailto:" +
        email +
        "?subject=" +
        encodeURIComponent("Orçamento: " + F.servico.value) +
        "&body=" +
        encodeURIComponent(msg);
      say("Abrindo o seu programa de e-mail com a mensagem pronta.");
      return;
    }
    say(
      "O WhatsApp e o e-mail ainda não foram configurados neste site, então nada foi enviado. Você pode copiar a mensagem e mandá-la por onde preferir.",
      true,
    );
    copyBtn.hidden = false;
  });

  copyBtn.addEventListener("click", function () {
    var msg = buildMessage();
    var done = function () {
      say("Mensagem copiada.");
    };
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(msg).then(done, function () {
        prev.focus();
      });
    else {
      var t = document.createElement("textarea");
      t.value = msg;
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand("copy");
        done();
      } catch (er) {}
      t.remove();
    }
  });

  /* ---------- início ---------- */
  route();
  update();
})();

// GMUD CONTROL — inclinação 3D e luz que acompanha o ponteiro.
// Só ativa em dispositivos com ponteiro preciso e quando o usuário
// não solicitou redução de movimento.
(function () {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const card = document.querySelector(".shot--gmud");

  if (!card || !finePointer || reduceMotion) return;

  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    card.style.setProperty("--tilt-x", `${(0.5 - y) * 10}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 10}deg`);
    card.style.setProperty("--mouse-x", `${x * 100}%`);
    card.style.setProperty("--mouse-y", `${y * 100}%`);
    card.style.setProperty("--shadow-opacity", "1");
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
    card.style.setProperty("--shadow-opacity", "0");
  });
})();

/* =====================================================================
   V2 · Filtros de projetos (Inspora), inclinação em perspectiva nas
   capturas do Festas e Alegorias (Spell · Perspective Book) e atalho "/"
   para abrir o menu (Spell).
   ===================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Filtros por categoria
  var bar = document.querySelector(".work__filters");
  if (bar) {
    var chips = Array.prototype.slice.call(bar.querySelectorAll(".chip"));
    var cases = Array.prototype.slice.call(
      document.querySelectorAll(".work .case[data-cat]"),
    );
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-pressed", String(on));
        });
        cases.forEach(function (el) {
          var show = f === "all" || el.getAttribute("data-cat") === f;
          var was = !el.hidden;
          el.hidden = !show;
          if (show && !was && !reduce) {
            el.classList.remove("is-filter-in");
            void el.offsetWidth;
            el.classList.add("is-filter-in");
          }
        });
        // reaproveita o recálculo de revelações e progresso do script principal
        window.dispatchEvent(new Event("resize"));
      });
    });
    cases.forEach(function (el) {
      el.addEventListener("animationend", function () {
        el.classList.remove("is-filter-in");
      });
    });
  }

  // Inclinação em perspectiva com profundidade entre as duas capturas
  var media = document.querySelector(".case--festas .case__media");
  if (media && fine && !reduce) {
    media.addEventListener("pointermove", function (e) {
      var r = media.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      media.style.setProperty("--tilt-x", ((0.5 - y) * 8).toFixed(2) + "deg");
      media.style.setProperty("--tilt-y", ((x - 0.5) * 8).toFixed(2) + "deg");
      media.style.setProperty("--mx", ((x - 0.5) * 2).toFixed(3));
      media.style.setProperty("--my", ((y - 0.5) * 2).toFixed(3));
    });
    media.addEventListener("pointerleave", function () {
      ["--tilt-x", "--tilt-y"].forEach(function (k) {
        media.style.setProperty(k, "0deg");
      });
      ["--mx", "--my"].forEach(function (k) {
        media.style.setProperty(k, "0");
      });
    });
  }

  // Atalho "/" abre o menu (fora de campos de texto)
  document.addEventListener("keydown", function (e) {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target,
      tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (t && t.isContentEditable) return;
    var menu = document.getElementById("menu"),
      btn = document.querySelector(".menu-btn");
    if (menu && btn && !menu.classList.contains("is-open")) {
      e.preventDefault();
      btn.click();
    }
  });
})();


/* V3 · Spotlight ambiental: acompanha o ponteiro sem dependências externas. */
(() => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduceMotion) return;

  const surfaces = document.querySelectorAll(
    ".hero__stage, .services__back, .case--festas, .case--gmud"
  );
  surfaces.forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const rect = surface.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      surface.style.setProperty("--spot-x", `${x}%`);
      surface.style.setProperty("--spot-y", `${y}%`);
    }, { passive: true });
    surface.addEventListener("pointerleave", () => {
      surface.style.setProperty("--spot-x", "50%");
      surface.style.setProperty("--spot-y", "50%");
    }, { passive: true });
  });
})();
