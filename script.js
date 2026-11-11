document.addEventListener("DOMContentLoaded", () => {
  // --- MENU MOBILE ---
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open);
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }
});

// --- MODAL DE PDF ---
const modal = document.querySelector("#paper-modal");
const modalTitle = document.querySelector("#modal-title");
const pdfIframe = document.querySelector("#pdf-iframe");

function openModal(title, pdfUrl) {
  if (!modal || !modalTitle || !pdfIframe) return;
  modalTitle.textContent = title;
  pdfIframe.src = pdfUrl;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal || !pdfIframe) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  pdfIframe.src = "";
}

// Delegação de evento global para os botões de PDF (funciona com elementos dinâmicos)
document.addEventListener("click", (e) => {
  const button = e.target.closest(".open-paper");
  if (button) {
    const titulo = button.dataset.paper || "Jornal do Negro";
    const arquivoPdf = button.dataset.pdf || "documentos/Edicao01.pdf";
    closeAllModal();
    openModal(titulo, arquivoPdf);
  }
});

document.querySelectorAll(".close-modal, .modal-backdrop").forEach(element => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal();
    closeAllModal();
  }
});

// --- MODAL DE TODAS AS EDIÇÕES ---
const allPapersModal = document.querySelector("#all-papers-modal");
const btnTodasEdicoes = document.querySelector("#btn-todas-edicoes");
const closeAllModalElements = document.querySelectorAll("#close-all-modal-btn, #close-all-modal-bg, #close-all-modal-footer");

btnTodasEdicoes?.addEventListener("click", () => {
  if (!allPapersModal) return;
  allPapersModal.classList.add("open");
  allPapersModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
});

function closeAllModal() {
  if (!allPapersModal) return;
  allPapersModal.classList.remove("open");
  allPapersModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

closeAllModalElements.forEach(el => {
  el.addEventListener("click", closeAllModal);
});

// --- RENDERIZAÇÃO DINÂMICA DOS JORNAIS ---
function carregarJornais(jornais) {
  if (!jornais || jornais.length === 0) return;

  // 1. Edição Mais Recente (Card Principal)
  const maisRecente = jornais[0];
  const latestContainer = document.getElementById('latest-paper-container');
  if (latestContainer) {
    latestContainer.innerHTML = `
      <article class="latest-paper">
        <div class="paper-cover cover-04">
          <span>INSTITUTO<br><strong>Hospital do Negro</strong></span>
          <b>${maisRecente.numero}</b>
          <small>${maisRecente.edicaoFormatada} • ${maisRecente.mesAno}</small>
        </div>
        <div class="paper-info">
          <p class="eyebrow">Última edição</p>
          <h3>${maisRecente.titulo}</h3>
          <p>${maisRecente.descricao}</p>
          <button class="button button-primary open-paper" data-paper="Jornal do Negro — ${maisRecente.edicaoFormatada}" data-pdf="${maisRecente.pdf}">Visualizar jornal</button>
          <span class="paper-meta">PDF • ${maisRecente.paginas} • ${maisRecente.mesAno}</span>
        </div>
      </article>
    `;
  }

  // 2. Edições Anteriores Menores (Se houver)
  const anteriores = jornais.slice(1, 4);
  const archiveGrid = document.getElementById('archive-paper-grid');
  if (archiveGrid) {
    archiveGrid.innerHTML = "";
    anteriores.forEach(jornal => {
      archiveGrid.innerHTML += `
        <article class="paper-card">
          <div class="mini-cover cover-03"><span>JORNAL<br><strong>${jornal.numero}</strong></span></div>
          <div>
            <h4>${jornal.edicaoFormatada}</h4>
            <p>${jornal.mesAno}</p>
            <button class="mini-link open-paper" data-paper="Jornal do Negro — ${jornal.edicaoFormatada}" data-pdf="${jornal.pdf}">Ler edição →</button>
          </div>
        </article>
      `;
    });
  }

  // 3. Modal de Todas as Edições
  const modalAllGrid = document.getElementById('modal-all-grid');
  if (modalAllGrid) {
    modalAllGrid.innerHTML = "";
    jornais.forEach(jornal => {
      modalAllGrid.innerHTML += `
        <div class="paper-card" style="background: var(--paper); border: 1px solid var(--line); display: grid; grid-template-columns: 90px 1fr; gap: 15px; align-items: center; padding: 12px; border-radius: 4px;">
          <div class="mini-cover" style="height: 120px; padding: 10px; background: var(--gold); color: #fff; display: flex; flex-direction: column; justify-content: flex-end;">
            <span style="font-size:9px;">JORNAL</span>
            <strong style="font-size:26px;">${jornal.numero}</strong>
          </div>
          <div>
            <span style="font-size:10px; color:var(--gold); text-transform:uppercase; font-weight:700;">${jornal.mesAno}</span>
            <h4 style="font-family:'Playfair Display'; font-size:18px; color:#fff; margin: 4px 0;">${jornal.edicaoFormatada}</h4>
            <button class="button button-primary open-paper" style="font-size:11px; padding:6px 12px; margin-top:6px;" data-paper="Jornal do Negro — ${jornal.edicaoFormatada}" data-pdf="${jornal.pdf}">Abrir PDF</button>
          </div>
        </div>
      `;
    });
  }
}

// --- CARREGAMENTO GERAL (DADOS E JORNAIS) ---
function loadElements() {
  // 1. Carrega dados gerais de contato/redes sociais
  fetch('data/dados.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar dados.json. Status: ' + response.status);
      }
      return response.json();
    })
    .then(dados => {
      if (dados.instagram && document.getElementById('instagram')) document.getElementById('instagram').href = dados.instagram;
      if (dados.youtube && document.getElementById('youtube')) document.getElementById('youtube').href = dados.youtube;
      if (dados.facebook && document.getElementById('facebook')) document.getElementById('facebook').href = dados.facebook;
      if (dados.whatsapp && document.getElementById('whatsapp')) document.getElementById('whatsapp').href = dados.whatsapp;

      const linktel = document.getElementById('telefone');
      if (dados.telefone && linktel) {
        const apenasNumeros = dados.telefone.replace(/\D/g, "");
        linktel.href = `tel:+55${apenasNumeros}`;
        let telefoneFormatado = dados.telefone;
        if (apenasNumeros.length === 11) {
          telefoneFormatado = `(${apenasNumeros.substring(0, 2)}) ${apenasNumeros.substring(2, 7)} - ${apenasNumeros.substring(7, 11)}`;
        } else if (apenasNumeros.length === 10) {
          telefoneFormatado = `(${apenasNumeros.substring(0, 2)}) ${apenasNumeros.substring(2, 6)} - ${apenasNumeros.substring(6, 10)}`;
        }
        linktel.textContent = telefoneFormatado;
      }

      const linkmail = document.getElementById('email');
      if (dados.email && linkmail) {
        linkmail.href = `mailto:${dados.email}`;
        linkmail.textContent = dados.email;
      }

      if (dados.localizacao && document.getElementById('localizacao')) {
        document.getElementById('localizacao').textContent = dados.localizacao;
      }
    })
    .catch(error => {
      console.error('Erro no carregamento dos dados gerais:', error);
    });

  // 2. Carrega os jornais do arquivo separado jornais.json
  fetch('data/jornais.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar jornais.json.');
      }
      return response.json();
    })
    .then(jornais => {
      carregarJornais(jornais);
    })
    .catch(error => {
      console.error('Erro no carregamento dos jornais:', error);
    });
}

// --- RENDERIZAÇÃO DO PORTAL DE TRANSPARÊNCIA ---
function carregarTransparencia() {
  const transparenciaGrid = document.getElementById('transparencia-grid');
  if (!transparenciaGrid) return; // Só executa se estiver na página de transparência

  fetch('data/transparencia.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar dados de transparência.');
      }
      return response.json();
    })
    .then(documentos => {
      transparenciaGrid.innerHTML = "";
      
      if (!documentos || documentos.length === 0) {
        transparenciaGrid.innerHTML = "<p>Nenhum documento disponível no momento.</p>";
        return;
      }

      documentos.forEach(doc => {
        transparenciaGrid.innerHTML += `
          <div class="paper-card">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 10px; background: var(--gold); color: #fff; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-weight: 700;">${doc.ano}</span>
                <span style="font-size: 12px; color: var(--muted);">${doc.tamanho}</span>
              </div>
              <span style="font-size: 11px; color: var(--gold); text-transform: uppercase; font-weight: 600; display: block; margin-bottom: 4px;">${doc.categoria}</span>
              <h4 style="font-family: 'Playfair Display', serif; font-size: 18px; color: #fff; margin-bottom: 6px;">${doc.titulo}</h4>
              <p style="font-size: 12px; color: var(--muted);">Publicado em: ${doc.dataPublicacao}</p>
            </div>
            <button class="button button-primary open-paper" style="width: 100%; text-align: center; justify-content: center; font-size: 12px; padding: 8px;" data-paper="${doc.titulo} (${doc.ano})" data-pdf="${doc.pdf}">
              Visualizar Documento
            </button>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error('Erro:', error);
      transparenciaGrid.innerHTML = "<p style='color: #ff6b6b;'>Erro ao carregar os documentos de transparência.</p>";
    });
}
