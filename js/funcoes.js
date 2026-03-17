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
        let carouselInner = $('#carousel-inner');
        
        projetos.forEach(function(projeto, index) {
            const activeClass = index === 0 ? ' active' : '';
            let itemCarrossel = `
                <div class="carousel-item${activeClass} bloco-projeto">
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
                    <div class="carousel-progress-track">
                        <div class="carousel-progress-fill"></div>
                    </div>
                </div>
            `;
          
          // Adicionando o conteúdo diretamente ao carouselInner
          carouselInner.append(itemCarrossel);
        });
        
        const INTERVAL = 7000;

        const carouselEl = document.getElementById('myCarousel');

        new bootstrap.Carousel(carouselEl, {
          interval: INTERVAL,
          pause: 'hover'
        });

        function startProgressBar() {
            const fill = carouselEl.querySelector('.carousel-item.active .carousel-progress-fill');
            if (!fill) return;
            fill.classList.remove('running');
            void fill.offsetWidth; // força reflow para reiniciar a animação
            fill.classList.add('running');
        }

        // slid dispara após a transição terminar e o active já estar no novo item
        carouselEl.addEventListener('slid.bs.carousel', startProgressBar);

        // inicia no primeiro slide
        startProgressBar();
      });
})