(function () {
    function getIdade(dataNascimento) {
        var hoje = new Date();
        var nascimento = new Date(dataNascimento + 'T00:00:00');
        var idade = hoje.getFullYear() - nascimento.getFullYear();
        var m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    }

    var elIdade = document.getElementById('idade');
    if (elIdade) {
        elIdade.textContent = getIdade('1996-10-02');
    }
})();
