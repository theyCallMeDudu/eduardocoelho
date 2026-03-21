$(function() {
    function getIdade(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    let idade = getIdade('1996-10-02');
    $("#idade").html(idade);
    
    let anoAtual = new Date();
    console.log(anoAtual.getFullYear());
    $("#copyrights").html(anoAtual.getFullYear());

    // Ler e exibir os itens do JSON
    $.getJSON('database/tecnologias.json', function(data) {
        // Obtendo a lista de tecnologias do JSON
        let tecnologias = data.tecnologias;

        // Iterando sobre as tecnologias e adicionando ao HTML
        let itemHTML = '';
        tecnologias.forEach(function(tecnologia) {
            itemHTML += `
                <div class="col-md-1 bloco-tecnologia">
                    <img src="${tecnologia.img}" alt="${tecnologia.nome}">
                    <span class="tech-nome">${tecnologia.nome}</span>
                </div>
            `;
        });

        // Adicionando a lista de tecnologias ao elemento UL
        $('#lista-tecnologias').html(itemHTML);
    });

    $.getJSON('database/projetos.json', function(data) {
        let projetos = data.projetos;
        let sliderEl = document.getElementById('projects-slider');
        let dotsEl   = document.getElementById('projects-dots');

        projetos.forEach(function(projeto, index) {
            let slide = document.createElement('div');
            slide.className = 'project-slide bloco-projeto' + (index === 0 ? ' active' : '');
            slide.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-4 logo-projeto">
                        <a href="${projeto.url}" target="_blank" rel="noopener noreferrer">
                            <img src="${projeto.img}" alt="${projeto.nome}">
                        </a>
                    </div>
                    <div class="col-md-8 descricao-projeto">
                        <h3>${projeto.nome}</h3>
                        <p>${projeto.descricao}</p>
                    </div>
                </div>
                <div class="project-progress-track">
                    <div class="project-progress-fill"></div>
                </div>
            `;
            sliderEl.appendChild(slide);

            let dot = document.createElement('button');
            dot.className = 'project-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Ir para ' + projeto.nome);
            dot.addEventListener('click', function() { navigateTo(index); });
            dotsEl.appendChild(dot);
        });

        const slides = Array.from(sliderEl.querySelectorAll('.project-slide'));
        const dots   = Array.from(dotsEl.querySelectorAll('.project-dot'));
        const INTERVAL = 7000;
        let current      = 0;
        let rafId        = null;
        let startTime    = null;
        let pausedAt     = 0;
        let isPaused     = false;

        function setActive(next) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            slides[next].classList.add('active');
            dots[next].classList.add('active');
            current = next;
        }

        function navigateTo(next) {
            if (next === current) return;
            cancelAnimationFrame(rafId);
            pausedAt = 0;
            setActive(next);
            if (!isPaused) startProgress();
        }

        function startProgress(fromElapsed) {
            fromElapsed = fromElapsed || 0;
            cancelAnimationFrame(rafId);
            const fill = slides[current].querySelector('.project-progress-fill');
            if (!fill) return;
            fill.style.width = (fromElapsed / INTERVAL * 100).toFixed(2) + '%';
            startTime = performance.now() - fromElapsed;

            function tick(now) {
                const elapsed = now - startTime;
                const pct = Math.min(elapsed / INTERVAL * 100, 100);
                fill.style.width = pct.toFixed(2) + '%';
                if (pct < 100) {
                    rafId = requestAnimationFrame(tick);
                } else {
                    setActive((current + 1) % slides.length);
                    pausedAt = 0;
                    startProgress();
                }
            }
            rafId = requestAnimationFrame(tick);
        }

        sliderEl.addEventListener('mouseenter', function() {
            if (!isPaused) {
                isPaused = true;
                cancelAnimationFrame(rafId);
                rafId = null;
                const fill = slides[current].querySelector('.project-progress-fill');
                pausedAt = (parseFloat(fill.style.width) / 100) * INTERVAL;
            }
        });

        sliderEl.addEventListener('mouseleave', function() {
            if (isPaused) {
                isPaused = false;
                startProgress(pausedAt);
            }
        });

        startProgress();
    });
})