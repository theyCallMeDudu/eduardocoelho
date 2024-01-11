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
                <div class="col-md-1 bloco-tecnologia" data-toggle="tooltip" title="${tecnologia.nome}">
                    <img src="${tecnologia.img}" alt="${tecnologia.nome}">
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
            let itemCarrossel = '';
            if (index === 0) {
                itemCarrossel = `
                    <div class="carousel-item active bloco-projeto" data-toggle="tooltip" title="${projeto.nome}">
                        <div class="row">
                            <div class="col-md-4 logo-projeto">
                                <a href="${projeto.url}" target="blank">
                                    <img src="${projeto.img}" alt="${projeto.nome}">
                                </a>
                            </div>
                            <div class="col-md-8 descricao-projeto">
                                <h3>${projeto.nome}</h3>
                                <p>${projeto.descricao}</p>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                itemCarrossel = `
                    <div class="carousel-item bloco-projeto" data-toggle="tooltip" title="${projeto.nome}">
                        <div class="row">
                            <div class="col-md-4 logo-projeto">
                            <a href="${projeto.url}" target="blank">
                            <img src="${projeto.img}" alt="${projeto.nome}">
                            </a>
                            </div>
                            <div class="col-md-8">
                                <h3>${projeto.nome}</h3>
                                <p descricao-projeto>${projeto.descricao}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
          
          // Adicionando o conteúdo diretamente ao carouselInner
          carouselInner.append(itemCarrossel);
        });
        
        // Inicializando o carrossel após adicionar os itens
        new bootstrap.Carousel(document.getElementById('myCarousel'), {
          interval: 3000,
          pause: "hover"
        });
      });
})