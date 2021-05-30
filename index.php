<?php include('config.php'); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://kit.fontawesome.com/c0209b2941.js" crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap" rel="stylesheet">
    <link href="estilo/style.css" rel="stylesheet">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Descrição do meu website">
    <meta name="keywords" content="palavras-chave,do,meu,site">
    <title>Eduardo Coelho</title>
</head>
<body>
    <target target="sobre"/>
    <!-- <header> -->
        <!-- <div class="center"> -->
            <!-- Logo -->
            <!-- <div class="logo left"><a href="/">Logomarca</a></div> -->
            
            <!-- nav desktop -->
            <!--<nav class="desktop right">
                <ul>
                    <li><a href="">Home</a></li>
                    <li><a href="">Sobre</a></li>
                    <li><a href="">Serviços</a></li>
                    <li><a href="">Contato</a></li>
                </ul>
            </nav> -->
            
            <!-- nav mobile -->
            <!-- <nav class="mobile right">
                <div class="botao-menu-mobile">
                    <i class="fas fa-bars"></i>
                </div>
                <ul>
                    <li><a href="">Home</a></li>
                    <li><a href="">Sobre</a></li>
                    <li><a href="">Serviços</a></li>
                    <li><a href="">Contato</a></li>
                </ul>
            </nav> -->
            <!-- <div class="clear"></div>clear -->
        <!-- </div>center -->
    <!-- </header> -->
    
    <!-- banner principal -->
    <section class="banner-principal">
        <div></div><!-- overlay -->
        <div class="center">
            <!-- <form action="">
                <h2>Qual o seu melhor e-mail?</h2>
                <input type="email" name="email" required>
                <input type="submit" name="acao" value="Cadastrar">
            </form> -->
            <h2>Olá, eu sou <span class="nome">Eduardo Coelho</span>.</h2>
            <div class="social">
                <ul>
                    <li>
                        <a href="https://github.com/theyCallMeDudu" target="blank">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/eduardo-coelho-/" target="blank">
                            <i class="fab fa-linkedin"></i> LinkedIn
                        </a>
                    </li>
                    <li>
                        <a href="mailto:eduardo.coelho@edu.unirio.br" target="blank">
                            <i class="fas fa-envelope"></i> eduardo.coelho@edu.unirio.br
                        </a>
                    </li>
                </ul>
            </div>
        </div> 
        <div class="setaDescer">
            <i class="fas fa-chevron-down"></i>
        </div>
    </section>

    <!-- descricao-autor -->
    <section class="descricao-autor">
        <div class="center">
            <div class="w50 left" id="sobre"><!-- w50 = 50% da largura da tela  -->
                <h2>Sobre mim</h2>
                <p>
                    Tenho 24 anos e estudo <span style="color: #00C59E"><strong>Sistemas de Informação</strong></span> na Universidade Federal
                     do Estado do Rio de Janeiro (<span style="color: #00C59E"><strong>UNIRIO</strong></span>).
                    Atualmente, faço estágio em desenvolvimento na FAPES.
                </p>
                <p>
                    Gosto de poder ajudar as pessoas, e, em meus projetos pessoais, 
                    busco sempre desenvolver algo que facilite o dia a dia delas.
                </p>
                <p>
                    A área que mais gostei de trabalhar até hoje foi desenvolvimento web.
                    Me sinto mais confortável tabalhando com as tecnologias
                    HTML5, CSS3, JavaScript e PHP (framework Laravel, principalmente).
                </p>
            </div>
            <div class="w50 left">
                <img class="right" src="images/foto-autor.jpg" alt="Foto do autor">
            </div><!-- w50 -->
            <div class="clear"></div>
        </div><!-- center -->
    </section><!-- descricao-autor -->

    <!-- projetos -->
    <section class="descricao-autor">
        <div class="center">
            <div class="w50 left"><!-- w50 = 50% da largura da tela  -->
            <h2>Projetos</h2>
                    <p>
                        Alguns projetos pessoais e trabalhos da faculdade.
                    </p>
                    <p>
                        Meu <a href="https://github.com/theyCallMeDudu" target="blank"><i class="fab fa-github"></i> <span style="color: #00C59E"><strong>GitHub</span></strong></a>
                    </p>
                    <p>Entre em contato: <strong><a href="mailto:eduardo.coelho@edu.unirio.br" style="color: #00C59E">eduardo.coelho@edu.unirio.br</a></strong></p>
            </div>
            <div class="w50 left">
            <div class="projetos">
                <ul class="projetos">
                    <li>
                        <span style="color: #00C59E"><strong>MyShelf</span></strong>:
                        um sistema web para controle e gerenciamento de seus livros.
                        O MyShelf é a sua estante/ biblioteca digital.
                    </li>
                    <li>
                        <a href="https://hora-do-up.web.app/" target="blank">
                            <span style="color: #00C59E"><strong>Hora do Up</span></strong>
                        </a>:
                            um trabalho de faculdade feito em conjunto com Allan Borges, Eduardo Barboza e Rayanne Souza. 
                        O Hora do Up é um site de monitoramento de preços de hardware focado em PC's gamer.
                    </li>
                </ul>
                </div>   

            </div><!-- w50 -->
            <div class="clear"></div>
        </div><!-- center -->
    </section><!-- descricao-autor -->
    <script src="js/jquery.js"></script>
    <script src="js/scripts.js"></script>
</body>
</html>

<?php

?>