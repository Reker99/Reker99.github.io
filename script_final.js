/* ═══════════════════════════════════════════════════════════════════
   FBC ARCHIVE — script_final.js
   E. Jurado Cano · Portafolio Profesional
═══════════════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────────────────
// 0. TEMA OSCURO / CLARO (Lógica Brutalista)
// ──────────────────────────────────────────────────────────────────
(function initTheme() {
    const btn  = document.getElementById('theme-toggle');
    const body = document.body;

    if (!btn) return;

    // Lee la preferencia guardada; el predeterminado es oscuro
    const savedTheme = localStorage.getItem('theme') || 'dark';

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            btn.textContent = '[DRK]'; // Ofrece cambiar a oscuro
        } else {
            body.classList.remove('light-mode');
            btn.textContent = '[LHT]'; // Ofrece cambiar a claro
        }
        localStorage.setItem('theme', theme);
    }

    // Aplica el tema al cargar la página
    applyTheme(savedTheme);

    // Evento de clic
    btn.addEventListener('click', () => {
        const isCurrentlyLight = body.classList.contains('light-mode');
        applyTheme(isCurrentlyLight ? 'dark' : 'light');
    });
})();

// ──────────────────────────────────────────────────────────────────
// 1. HEADER — sombra/borde al hacer scroll
// ──────────────────────────────────────────────────────────────────
(function initHeaderScroll() {
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
})();


// ──────────────────────────────────────────────────────────────────
// 2. MENÚ HAMBURGUESA (móvil)
// ──────────────────────────────────────────────────────────────────
(function initMobileMenu() {
    const toggle   = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!toggle || !navLinks) return;

    // Abre / cierra el menú
    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cierra al hacer click en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Cierra al redimensionar a escritorio
    window.addEventListener('resize', () => {
        if (window.innerWidth > 640) {
            navLinks.classList.remove('active');
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
})();


// ──────────────────────────────────────────────────────────────────
// 3. ENLACE ACTIVO EN NAV según sección visible
// ──────────────────────────────────────────────────────────────────
(function initActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const matches = link.getAttribute('href') === `#${id}`;
                        link.classList.toggle('active', matches);
                    });
                }
            });
        },
        { threshold: 0.35 }
    );

    sections.forEach(sec => observer.observe(sec));
})();


// ──────────────────────────────────────────────────────────────────
// 4. VALIDACIÓN DE FORMULARIO DE CONTACTO
// ──────────────────────────────────────────────────────────────────
(function initContactForm() {
    const form      = document.getElementById('contact-form');
    const feedback  = document.getElementById('form-feedback');
    const emailRgx  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form) return;

    // Muestra error en un campo
    function setError(fieldId, errId, msg) {
        document.getElementById(fieldId).classList.add('input-error');
        document.getElementById(errId).textContent = '⚠ ' + msg;
    }

    // Limpia error de un campo
    function clearError(fieldId, errId) {
        document.getElementById(fieldId).classList.remove('input-error');
        document.getElementById(errId).textContent = '';
    }

    // Limpia en tiempo real mientras el usuario escribe
    [['nombre', 'error-nombre'], ['email', 'error-email'], ['mensaje', 'error-mensaje']].forEach(([id, errId]) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => clearError(id, errId));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre  = document.getElementById('nombre').value.trim();
        const email   = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        // Limpiar estado previo
        [['nombre', 'error-nombre'], ['email', 'error-email'], ['mensaje', 'error-mensaje']].forEach(
            ([id, errId]) => clearError(id, errId)
        );
        feedback.className   = 'form-feedback';
        feedback.textContent = '';

        let hasError = false;

        if (!nombre) {
            setError('nombre', 'error-nombre', 'IDENTIFICADOR REQUERIDO');
            hasError = true;
        }

        if (!email) {
            setError('email', 'error-email', 'ENLACE DE RETORNO REQUERIDO');
            hasError = true;
        } else if (!emailRgx.test(email)) {
            setError('email', 'error-email', 'FORMATO DE ENLACE INVÁLIDO');
            hasError = true;
        }

        if (!mensaje) {
            setError('mensaje', 'error-mensaje', 'NO HAY DATOS PARA TRANSMITIR');
            hasError = true;
        } else if (mensaje.length < 10) {
            setError('mensaje', 'error-mensaje', 'DATOS INSUFICIENTES — MÍN. 10 CARACTERES');
            hasError = true;
        }

        if (hasError) return;

        // Simulación de envío
        const submitBtn = form.querySelector('.btn-primary');
        const btnText   = submitBtn.querySelector('.btn-text');
        submitBtn.classList.add('loading');
        btnText.textContent = 'TRANSMITIENDO...';

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            btnText.textContent = 'TRANSMITIR DATOS';

            feedback.textContent = '// TRANSMISIÓN EXITOSA — RESPUESTA PENDIENTE //';
            feedback.className   = 'form-feedback success';

            form.reset();

            // Oculta el mensaje después de 5 segundos
            setTimeout(() => {
                feedback.className   = 'form-feedback';
                feedback.textContent = '';
            }, 5000);
        }, 1200);
    });
})();


// ──────────────────────────────────────────────────────────────────
// 5. MODAL DINÁMICO DE PROYECTOS
// Para agregar un proyecto nuevo: añade un objeto al array proyectosData
// ──────────────────────────────────────────────────────────────────
(function initModal() {

    // ── Datos de cada proyecto ──────────────────────────────────
    const proyectosData = [
        {
            num:          "// ARCHIVO 01",
            estado:       "CLASIFICADO · COMPLETADO",
            titulo:       "Simulador Lógico DAQ",
            descripcion:  "Sistema de adquisición de datos en LabVIEW que emula el ciclo completo de una lavadora industrial. Opera una tarjeta NI USB-6009 configurando puertos digitales de 8 bits para controlar actuadores en tiempo real mediante máquinas de estados finitos.",
            tecnologias:  ["LABVIEW", "NI USB-6009", "DAQ", "LÓGICA DIGITAL"],
            detalles: [
                "Máquina de estados con 5 etapas: lavado, enjuague, centrifugado, pausa y fin de ciclo.",
                "Control de 8 bits digital vía puertos D/A de la USB-6009.",
                "Panel frontal LabVIEW con indicadores de estado en tiempo real.",
                "Gráficas de temporización y log de eventos exportado a archivo TXT.",
                "Manejo de condiciones de error y reinicio de ciclo automatizado."
            ]
        },
        {
            num:          "// ARCHIVO 02",
            estado:       "CLASIFICADO · COMPLETADO",
            titulo:       "Regresor Neural de Distancia",
            descripcion:  "Red neuronal de regresión para inferencia de distancia con alta precisión. Integra una etapa de acondicionamiento analógico de señal con amplificadores operacionales y combina hardware de precisión con modelado de inteligencia artificial.",
            tecnologias:  ["PYTHON", "SCIKIT-LEARN", "OP-AMPS", "NUMPY", "MATPLOTLIB"],
            detalles: [
                "Etapa de acondicionamiento analógico con Op-Amps para limpieza y amplificación de señal.",
                "Acoplamiento de impedancias para máxima transferencia de potencia.",
                "Modelado de regresión con red neuronal multicapa (MLP Regressor).",
                "Pipeline: adquisición → normalización → inferencia → visualización.",
                "Exportación de resultados a CSV con gráficas generadas con Matplotlib."
            ]
        },
        {
            num:          "// ARCHIVO 03",
            estado:       "CLASIFICADO · COMPLETADO",
            titulo:       "Controlador PID Analógico",
            descripcion:  "Control Proporcional-Integral-Derivativo implementado íntegramente en hardware con amplificadores operacionales — sin microcontrolador. Diseñado para estabilizar sistemas dinámicos de segundo orden con ajuste fino de parámetros.",
            tecnologias:  ["OP-AMPS", "PID", "CONTROL DE SISTEMAS", "ELECTRÓNICA ANALÓGICA"],
            detalles: [
                "Ajuste independiente de Kp, Ki y Kd mediante potenciómetros de precisión.",
                "Respuesta transitoria optimizada: sobrepaso < 5% en planta de segundo orden.",
                "Circuito anti-windup para evitar saturación del integrador.",
                "Diseño en PCB con análisis de tolerancias y temperatura.",
                "Documentación: esquemáticos completos, simulaciones SPICE y resultados medidos."
            ]
        },
        {
            num:          "// ARCHIVO 04",
            estado:       "CLASIFICADO · COMPLETADO",
            titulo:       "Nodo Inteligente MQTT",
            descripcion:  "Arquitectura IoT completa con un ESP32-S3 como nodo publicador/suscriptor MQTT. Permite el control descentralizado de LEDs NeoPixel mediante mensajes JSON enviados vía Wi-Fi con reconexión automática y manejo de errores robusto.",
            tecnologias:  ["ESP32-S3", "MQTT", "C++", "JSON", "NEOPIXEL", "IOT"],
            detalles: [
                "Protocolo Pub/Sub con broker MQTT externo (Mosquitto).",
                "Parser de JSON para comandos de color, brillo y patrones de animación.",
                "Conectividad Wi-Fi robusta con reconexión automática y heartbeat.",
                "Control de LEDs NeoPixel con efectos: arcoíris, pulso, color sólido.",
                "Consumo optimizado con Deep Sleep entre ciclos de publicación."
            ]
        }
    ];

    // ── Elementos del modal ──────────────────────────────────────
    const overlay    = document.getElementById('modal-overlay');
    const closeBtn   = document.getElementById('modal-close');
    const modalNum   = overlay.querySelector('.modal-num');
    const modalEst   = overlay.querySelector('.modal-status');
    const modalTit   = document.getElementById('modal-titulo');
    const modalDesc  = document.getElementById('modal-descripcion');
    const modalTags  = document.getElementById('modal-tags');
    const modalDets  = document.getElementById('modal-detalles');

    if (!overlay) return;

    function openModal(id) {
        const p = proyectosData[parseInt(id, 10)];
        if (!p) return;

        modalNum.textContent   = p.num;
        modalEst.textContent   = '● ' + p.estado;
        modalTit.textContent   = p.titulo;
        modalDesc.textContent  = p.descripcion;
        modalTags.innerHTML    = p.tecnologias.map(t => `<span class="tag">${t}</span>`).join('');
        modalDets.innerHTML    = p.detalles.map(d => `<li>${d}</li>`).join('');

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeModal() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Asigna el evento a cada botón "VER ARCHIVO"
    document.querySelectorAll('.btn-proyecto').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.id));
    });

    closeBtn.addEventListener('click', closeModal);

    // Click fuera del modal (en el overlay oscuro)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
})();


// ──────────────────────────────────────────────────────────────────
// 6. ANIMACIONES AL HACER SCROLL (IntersectionObserver)
// Las secciones con clase .reveal aparecen al entrar en pantalla
// ──────────────────────────────────────────────────────────────────
(function initReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Solo anima una vez
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
