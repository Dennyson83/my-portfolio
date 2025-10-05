'use strict';

/* =========================
 * Util: toggle de classe
 * ========================= */
const elementToggleFunc = (elem) => elem.classList.toggle('active');

/* =========================
 * Sidebar (mobile)
 * ========================= */
(() => {
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));
  }
})();

/* =========================
 * Testimonials: modal (abrir/fechar detalhe)
 * ========================= */
(() => {
  const items = document.querySelectorAll('[data-testimonials-item]');
  const modalContainer = document.querySelector('[data-modal-container]');
  const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
  const overlay = document.querySelector('[data-overlay]');

  const modalImg   = document.querySelector('[data-modal-img]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalText  = document.querySelector('[data-modal-text]');

  if (!items.length || !modalContainer || !overlay || !modalImg || !modalTitle || !modalText) return;

  const toggleModal = () => {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
  };

  items.forEach((it) => {
    it.addEventListener('click', () => {
      const avatar = it.querySelector('[data-testimonials-avatar]');
      const title  = it.querySelector('[data-testimonials-title]');
      const text   = it.querySelector('[data-testimonials-text]');

      if (avatar) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt ?? '';
      }
      if (title) modalTitle.innerHTML = title.innerHTML;
      if (text)  modalText.innerHTML  = text.innerHTML;

      toggleModal();
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', toggleModal);
  overlay.addEventListener('click', toggleModal);
})();

/* =========================
 * Custom Select + Filtro (portfolio)
 * ========================= */
(() => {
  const select      = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-selecct-value]'); // (sic) segue o atributo do HTML
  const filterBtn   = document.querySelectorAll('[data-filter-btn]');
  const filterItems = document.querySelectorAll('[data-filter-item]');

  const filterFunc = (selectedValue) => {
    filterItems.forEach((el) => {
      const matchAll = selectedValue === 'all';
      const matchCat = selectedValue === el.dataset.category;
      el.classList.toggle('active', matchAll || matchCat);
    });
  };

  if (select) {
    select.addEventListener('click', () => elementToggleFunc(select));
  }

  selectItems.forEach((it) => {
    it.addEventListener('click', () => {
      const val = it.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = it.innerText;
      if (select) elementToggleFunc(select);
      filterFunc(val);
    });
  });

  let lastClickedBtn = filterBtn.length ? filterBtn[0] : null;

  filterBtn.forEach((btn) => {
    btn.addEventListener('click', function () {
      const val = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(val);

      if (lastClickedBtn) lastClickedBtn.classList.remove('active');
      this.classList.add('active');
      lastClickedBtn = this;
    });
  });
})();

/* =========================
 * Form: habilita botão quando válido
 * ========================= */
(() => {
  const form = document.querySelector('[data-form]');
  if (!form) return;

  const inputs = form.querySelectorAll('[data-form-input]');
  const btn    = document.querySelector('[data-form-btn]');

  const updateBtn = () => {
    if (!btn) return;
    btn.disabled = !form.checkValidity();
  };

  // estado inicial
  updateBtn();

  inputs.forEach((inp) => inp.addEventListener('input', updateBtn));
})();

/* =========================
 * Navegação entre páginas (data-page)
 * ========================= */
(() => {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages    = document.querySelectorAll('[data-page]');
  if (!navLinks.length || !pages.length) return;

  const getTarget = (el) =>
    (el.dataset.target || el.textContent).trim().toLowerCase();

  const showPage = (name) => {
    pages.forEach((pg) => pg.classList.toggle('active', pg.dataset.page === name));
    navLinks.forEach((lnk) => lnk.classList.toggle('active', getTarget(lnk) === name));
    window.scrollTo(0, 0);
  };

  navLinks.forEach((lnk) => {
    lnk.addEventListener('click', () => showPage(getTarget(lnk)));
  });
})();

/* =========================
 * Testimonials: 2 cards rotativos (sempre uma linha com 2)
 * =========================
 * Exige estrutura:
 * <section class="testimonials">
 *   <ul class="testimonials-list">
 *     <li class="testimonials-item">...</li>
 *     ...
 *   </ul>
 * </section>
 *
 * CSS necessário (exemplo):
 * .testimonials-list { display:flex; gap:24px; }
 * .testimonials-item { display:none; flex:1 1 0; }
 * .testimonials-item.visible { display:block; }
 */
(() => {
  const list = document.querySelector('.testimonials .testimonials-list');
  if (!list) return;

  const items = Array.from(list.querySelectorAll('.testimonials-item'));
  if (!items.length) return;

  // Se tem 1 ou 2, mostra tudo e sai
  if (items.length <= 2) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  // limpa estado
  items.forEach((el) => el.classList.remove('visible'));

  // mostra os dois primeiros
  let current = [0, 1];

  const render = () => {
    items.forEach((el, i) => el.classList.toggle('visible', i === current[0] || i === current[1]));
  };
  render();

  const nextIndex = (exclude) => {
    if (items.length <= exclude.length) return exclude[0];
    let idx, guard = 0;
    do {
      idx = Math.floor(Math.random() * items.length);
      guard++;
    } while (exclude.includes(idx) && guard < 50);
    return idx;
  };

  let flip = 0;  // alterna qual dos dois slots troca (0, depois 1, depois 0, ...)
  let timer = null;

  const start = () => {
    stop();
    timer = setInterval(() => {
      const slot = flip % 2;
      current[slot] = nextIndex(current);
      render();
      flip++;
    }, 3000);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  start();

  // pausa no hover da seção inteira
  const container = document.querySelector('.testimonials');
  if (container) {
    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);
  }
})();

if (new URLSearchParams(location.search).get('sent') === '1') {
  "message sent successfully"
}