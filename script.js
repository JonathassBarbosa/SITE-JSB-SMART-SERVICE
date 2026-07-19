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
            <div class="service-card__icon" aria-hidden="true">${service.icon}</div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
          </article>
        `
      )
      .join('');
  };

  const renderCompetencies = () => {
    if (!competenciesList || !content.competencies?.length) return;
    competenciesList.innerHTML = content.competencies.map((item) => `<span class="chip">${item}</span>`).join('');
  };

  const renderTechnologies = () => {
    if (!technologiesList || !content.technologies?.length) return;
    technologiesList.innerHTML = content.technologies.map((item) => `<span class="chip">${item}</span>`).join('');
  };

  const renderSocialLinks = () => {
    if (!socialLinks || !content.socialLinks?.length) return;
    socialLinks.innerHTML = content.socialLinks
      .map((item) => {
        if (!item.url) {
          return `<li><span>${item.label}</span></li>`;
        }
        return `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.label}</a></li>`;
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
              <span class="project-card__meta">${project.category}</span>
              <span class="project-card__meta">${project.status}</span>
            </div>
            <h3>${project.title}</h3>
            <p><strong>Problema:</strong> ${project.problem}</p>
            <p><strong>Solução:</strong> ${project.solution}</p>
            <p><strong>Recursos:</strong> ${project.features.join(' • ')}</p>
            <div class="chip-list">
              ${project.technologies.map((item) => `<span class="chip">${item}</span>`).join('')}
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
    return `<a class="button button--primary" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  };

  const renderFilters = () => {
    if (!filterGroup) return;
    const categories = ['Todos', ...new Set(projects.map((project) => project.category))];
    filterGroup.innerHTML = categories
      .map(
        (category) => `<button class="filter-button ${category === 'Todos' ? 'is-active' : ''}" type="button" data-category="${category}">${category}</button>`
      )
      .join('');

    filterGroup.querySelectorAll('.filter-button').forEach((button) => {
      button.addEventListener('click', () => {
        filterGroup.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        renderProjects(button.dataset.category);
      });
    });
  };

  const openModal = (projectId) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;

    modalTitle.textContent = project.title;
    modalCategory.textContent = project.category;
    modalProblem.textContent = project.problem;
    modalSolution.textContent = project.solution;
    modalFeatures.innerHTML = project.features.map((feature) => `<li>${feature}</li>`).join('');
    modalStatus.textContent = project.status;
    modalLinks.innerHTML = `
      ${buildLinkButton(project.demoUrl, 'Ver demonstração')}
      ${buildLinkButton(project.repoUrl, 'Ver repositório')}
    `;

    modal.hidden = false;
    modalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.hidden = true;
    modalBackdrop.hidden = true;
    document.body.style.overflow = '';
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

    const confirmMessage = channel === 'whatsapp'
      ? 'Deseja abrir o WhatsApp com os dados do formulário?'
      : 'Deseja abrir o cliente de e-mail com os dados do formulário?';

    if (!window.confirm(confirmMessage)) {
      setStatus('Envio cancelado.');
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
    updateActiveLink();
    toggleFloatingButtons();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      document.body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
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
    if (event.key === 'Escape') closeModal();
  });

  whatsappFloat?.addEventListener('click', (event) => {
    event.preventDefault();
    submitContact('whatsapp');
  });
});
