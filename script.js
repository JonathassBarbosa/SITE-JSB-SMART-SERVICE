document.addEventListener('DOMContentLoaded', () => {
  const content = window.jsbContent || {};
  const projects = window.jsbProjects || [];
  const contactConfig = content.contactConfig || {};

  const heroStats = document.getElementById('hero-stats');
  const servicesList = document.getElementById('services-list');
  const competenciesList = document.getElementById('competencies-list');
  const technologiesList = document.getElementById('technology-list');
  const filterGroup = document.getElementById('project-filters');
  const projectGrid = document.getElementById('project-grid');
  const socialLinks = document.getElementById('social-links');
  const year = document.getElementById('year');
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const backToTop = document.querySelector('.back-to-top');
  const whatsappFloat = document.querySelector('.whatsapp-float');
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.getElementById('site-nav');
  const modal = document.getElementById('project-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalProblem = document.getElementById('modal-problem');
  const modalSolution = document.getElementById('modal-solution');
  const modalFeatures = document.getElementById('modal-features');
  const modalStatus = document.getElementById('modal-status');
  const modalLinks = document.getElementById('modal-links');
  const modalClose = document.querySelector('.modal__close');
  const submitWhatsApp = document.getElementById('submit-whatsapp');
  const submitEmail = document.getElementById('submit-email');
  const formInputs = form ? Array.from(form.querySelectorAll('input, textarea')) : [];
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let modalTrigger = null;
  let scrollFrame = null;

  const icons = {
    process: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h10M4 12h16M4 18h10"/><circle cx="17" cy="6" r="3"/><circle cx="17" cy="18" r="3"/></svg>',
    automation: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8M7 12h10M9 17h6"/><path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/></svg>',
    training: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M7 9v6c3 2 7 2 10 0V9M21 8v7"/></svg>',
    consulting: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H8l-4 4V4Z"/><path d="M8 8h8M8 12h5"/></svg>'
  };

  const escapeHtml = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const setStatus = (message, isError = false) => {
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.style.color = isError ? '#b42318' : 'var(--navy)';
    }
  };

  const renderStats = () => {
    if (!heroStats || !content.indicators?.length) return;
    heroStats.innerHTML = content.indicators
      .map(
        (item) => `
          <article class="stat-card">
            <strong data-value="${item.value}" data-suffix="${item.suffix || ''}">${item.value}${item.suffix || ''}</strong>
            <span>${item.label}</span>
          </article>
        `
      )
      .join('');

    if (prefersReducedMotion) return;

    requestAnimationFrame(() => {
      heroStats.querySelectorAll('[data-value]').forEach((element) => {
        const value = Number(element.dataset.value || 0);
        const suffix = element.dataset.suffix || '';
        const duration = 900;
        const startTime = performance.now();
        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(value * eased);
          element.textContent = `${current}${suffix}`;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
  };

  const renderServices = () => {
    if (!servicesList || !content.services?.length) return;
    servicesList.innerHTML = content.services
      .map(
        (service) => `
          <article class="service-card">
            <div class="service-card__icon" aria-hidden="true">${icons[service.icon] || ''}</div>
            <h3>${escapeHtml(service.title)}</h3>
            <p>${escapeHtml(service.description)}</p>
          </article>
        `
      )
      .join('');
  };

  const renderCompetencies = () => {
    if (!competenciesList || !content.competencies?.length) return;
    competenciesList.innerHTML = content.competencies.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('');
  };

  const renderTechnologies = () => {
    if (!technologiesList || !content.technologies?.length) return;
    technologiesList.innerHTML = content.technologies.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('');
  };

  const renderSocialLinks = () => {
    if (!socialLinks || !content.socialLinks?.length) return;
    socialLinks.innerHTML = content.socialLinks
      .map((item) => {
        if (!item.url) {
          return '';
        }
        return `<li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a></li>`;
      })
      .join('');
  };

  const formatValue = (value, suffix = '') => {
    const parts = String(value).split('.');
    const integer = Number(parts[0]).toLocaleString('pt-BR');
    const decimals = parts[1] ? `.${parts[1]}` : '';
    return `${integer}${decimals}${suffix}`;
  };

  const renderProjects = (selectedCategory = 'Todos') => {
    if (!projectGrid) return;
    const filtered = selectedCategory === 'Todos' ? projects : projects.filter((project) => project.category === selectedCategory);

    projectGrid.innerHTML = filtered
      .map(
        (project) => `
          <article class="project-card">
            <div class="project-card__top">
              <span class="project-card__meta">${escapeHtml(project.category)}</span>
              <span class="project-card__meta">${escapeHtml(project.status)}</span>
            </div>
            <h3>${escapeHtml(project.title)}</h3>
            <p class="project-card__highlight">${escapeHtml(project.highlight || project.solution)}</p>
            <p><strong>Problema:</strong> ${escapeHtml(project.problem)}</p>
            <p><strong>Solução:</strong> ${escapeHtml(project.solution)}</p>
            <div class="chip-list">
              ${project.technologies.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('')}
            </div>
            <div class="project-card__actions">
              ${buildLinkButton(project.demoUrl, 'Ver demonstração')}
              <button class="button button--ghost-dark" type="button" data-project-id="${project.id}">Ver detalhes</button>
            </div>
          </article>
        `
      )
      .join('');

    projectGrid.querySelectorAll('[data-project-id]').forEach((button) => {
      button.addEventListener('click', () => openModal(Number(button.dataset.projectId)));
    });
  };

  const buildLinkButton = (url, label) => {
    if (!url) {
      return `<button class="button button--ghost-dark" type="button" disabled>Disponível em breve</button>`;
    }
    return `<a class="button button--primary" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
  };

  const renderFilters = () => {
    if (!filterGroup) return;
    const categories = ['Todos', ...new Set(projects.map((project) => project.category))];
    filterGroup.innerHTML = categories
      .map(
        (category) => `<button class="filter-button ${category === 'Todos' ? 'is-active' : ''}" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === 'Todos'}">${escapeHtml(category)}</button>`
      )
      .join('');

    filterGroup.querySelectorAll('.filter-button').forEach((button) => {
      button.addEventListener('click', () => {
        filterGroup.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('is-active'));
        filterGroup.querySelectorAll('.filter-button').forEach((item) => item.setAttribute('aria-pressed', 'false'));
        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');
        renderProjects(button.dataset.category);
      });
    });
  };

  const openModal = (projectId) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;

    modalTrigger = document.activeElement;
    modalTitle.textContent = project.title;
    modalCategory.textContent = project.category;
    modalProblem.textContent = project.problem;
    modalSolution.textContent = project.solution;
    modalFeatures.innerHTML = project.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('');
    modalStatus.textContent = project.status;
    modalLinks.innerHTML = `
      ${buildLinkButton(project.demoUrl, 'Ver demonstração')}
      ${buildLinkButton(project.repoUrl, 'Ver repositório')}
    `;

    modal.hidden = false;
    modalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    modalBackdrop.hidden = true;
    document.body.style.overflow = '';
    if (modalTrigger instanceof HTMLElement) modalTrigger.focus();
  };

  const updateActiveLink = () => {
    const offset = window.scrollY + 140;
    let currentSection = sections[0]?.id || '';
    sections.forEach((section) => {
      if (offset >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentSection}`;
      link.classList.toggle('active', isActive);
    });
  };

  const toggleFloatingButtons = () => {
    const shouldShow = window.scrollY > 600;
    backToTop?.classList.toggle('is-visible', shouldShow);
    whatsappFloat?.classList.toggle('is-visible', shouldShow);
  };

  const validateField = (field) => {
    const errorEl = document.getElementById(`${field.name}-error`);
    let message = '';

    if (field.type === 'checkbox') {
      if (!field.checked) {
        message = 'É necessário aceitar o retorno de contato.';
      }
    } else {
      const value = field.value.trim();
      if (field.required && !value) {
        message = 'Este campo é obrigatório.';
      } else if (field.name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = 'Informe um e-mail válido.';
      } else if (field.name === 'message' && value.length < 20) {
        message = 'Escreva uma mensagem com ao menos 20 caracteres.';
      }
    }

    if (errorEl) errorEl.textContent = message;
    return !message;
  };

  const submitContact = (channel) => {
    const valid = formInputs.every(validateField);
    if (!valid) {
      setStatus('Revise os campos destacados e tente novamente.', true);
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const company = document.getElementById('company').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const body = [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      phone ? `Telefone: ${phone}` : '',
      company ? `Empresa: ${company}` : '',
      '',
      `Assunto: ${subject}`,
      `Mensagem: ${message}`
    ]
      .filter(Boolean)
      .join('\n');

    if (channel === 'whatsapp') {
      if (!contactConfig.whatsappNumber) {
        setStatus('O número de WhatsApp ainda não foi configurado. Ajuste o arquivo de configuração.', true);
        return;
      }
      const encoded = encodeURIComponent(`Olá, gostaria de falar sobre ${subject}.\n\n${body}`);
      window.open(`https://wa.me/${contactConfig.whatsappNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
      setStatus('Mensagem preparada para o WhatsApp.');
    }

    if (channel === 'email') {
      if (!contactConfig.professionalEmail) {
        setStatus('O e-mail profissional ainda não foi configurado. Ajuste o arquivo de configuração.', true);
        return;
      }
      const mailto = `mailto:${contactConfig.professionalEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setStatus('Cliente de e-mail aberto com os dados preenchidos.');
    }
  };

  if (year) year.textContent = new Date().getFullYear();
  renderStats();
  renderServices();
  renderCompetencies();
  renderTechnologies();
  renderSocialLinks();
  renderFilters();
  renderProjects();
  updateActiveLink();
  toggleFloatingButtons();
  if (submitEmail && contactConfig.professionalEmail) submitEmail.hidden = false;

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      updateActiveLink();
      toggleFloatingButtons();
      scrollFrame = null;
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      document.body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('menu-open')) return;
    if (siteNav?.contains(event.target) || menuToggle?.contains(event.target)) return;
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });

  formInputs.forEach((field) => {
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('blur', () => validateField(field));
  });

  if (submitWhatsApp) {
    submitWhatsApp.addEventListener('click', () => submitContact('whatsapp'));
  }

  if (submitEmail) {
    submitEmail.addEventListener('click', () => submitContact('email'));
  }

  modalBackdrop?.addEventListener('click', closeModal);
  modalClose?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (modal?.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
});
