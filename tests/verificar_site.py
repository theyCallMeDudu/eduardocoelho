#!/usr/bin/env python3
"""Verificações estáticas do site.

Uso: python3 tests/verificar_site.py [nome_do_check ...]
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
INDEX = RAIZ / "index.html"
BASE_URL = "https://theycallmedudu.github.io/eduardocoelho/"
ARQUIVOS_MORTOS = (
    "index_antigo.html", "js/scripts.js", "js/jquery.js", "estilo/style.css",
    "estilo/pages.php", "estilo/css", "estilo/webfonts", "bootstrap-5.3.2-dist",
    "database", "src/img/x.jpg", "src/img/fav-icon-antigo.png",
)


class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.links = []
        self.ids = set()
        self._a = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.tags.append((tag, a))
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "a":
            self._a = {**a, "_texto": ""}

    def handle_endtag(self, tag):
        if tag == "a" and self._a is not None:
            self.links.append(self._a)
            self._a = None

    def handle_data(self, data):
        if self._a is not None:
            self._a["_texto"] += data


CHECKS = {}


def check(fn):
    CHECKS[fn.__name__] = fn
    return fn


def atributos(p, tag):
    return [a for t, a in p.tags if t == tag]


def refs_locais(p):
    for _, a in p.tags:
        for k in ("href", "src"):
            v = a.get(k)
            if v and not re.match(r"(https?:|mailto:|tel:|#|data:)", v):
                yield v


def js_locais():
    return "".join(f.read_text(encoding="utf-8") for f in (RAIZ / "js").glob("*.js"))


@check
def idioma(p, html):
    tag = atributos(p, "html")
    return [] if tag and tag[0].get("lang") == "pt-BR" else ['<html> deve ter lang="pt-BR"']


@check
def links_externos(p, html):
    erros = []
    for a in p.links:
        href, target = a.get("href", ""), a.get("target")
        if href.startswith("mailto:") and target:
            erros.append(f"mailto não deve ter target: {href}")
        if target and target != "_blank":
            erros.append(f'target="{target}" inválido em {href}')
        if target == "_blank" and "noopener" not in (a.get("rel") or ""):
            erros.append(f"falta rel=noopener em {href}")
        if href.endswith(".git"):
            erros.append(f"link aponta para .git: {href}")
    return erros


@check
def nomes_acessiveis(p, html):
    return [f"link sem nome acessível: {a.get('href')}"
            for a in p.links if not a["_texto"].strip() and not a.get("aria-label")]


@check
def open_graph(p, html):
    metas = {(a.get("property") or a.get("name")): a.get("content", "") for a in atributos(p, "meta")}
    erros = [f"falta {k}" for k in ("og:title", "og:description", "og:image", "og:url", "og:type", "twitter:card")
             if not metas.get(k)]
    img = metas.get("og:image", "")
    if img:
        if not img.startswith(BASE_URL):
            erros.append("og:image deve ser URL absoluta do site")
        else:
            local = RAIZ / img[len(BASE_URL):]
            if not local.exists():
                erros.append(f"og:image não existe localmente: {local}")
            elif local.stat().st_size > 300_000:
                erros.append("og:image acima de 300 KB")
    return erros


@check
def sem_dependencias_pesadas(p, html):
    erros = []
    for a in atributos(p, "script"):
        src = a.get("src", "")
        if src.startswith("http"):
            erros.append(f"script externo: {src}")
        if re.search(r"jquery|bootstrap", src, re.I):
            erros.append(f"dependência removível: {src}")
    for a in atributos(p, "link"):
        if "bootstrap" in a.get("href", ""):
            erros.append("bootstrap ainda referenciado")
    return erros


@check
def imagens(p, html):
    erros = []
    for a in atributos(p, "img"):
        src = a.get("src", "")
        for k in ("alt", "width", "height"):
            if k not in a:
                erros.append(f"<img src={src}> sem {k}")
        local = RAIZ / src
        if not src.startswith("http") and local.exists() and local.stat().st_size > 100_000:
            erros.append(f"imagem acima de 100 KB: {src}")
    return erros


@check
def arquivos_existem(p, html):
    return [f"arquivo não encontrado: {r}" for r in refs_locais(p)
            if not (RAIZ / r.split("#")[0].split("?")[0]).exists()]


@check
def ancoras_existem(p, html):
    return [f"âncora sem alvo: {a['href']}" for _, a in p.tags
            if a.get("href", "").startswith("#") and len(a["href"]) > 1 and a["href"][1:] not in p.ids]


@check
def conteudo_topo(p, html):
    topo = html.split('id="experiencia"')[0]
    erros = []
    if "Desenvolvedor Fullstack Sênior" not in topo:
        erros.append("cargo ausente no topo")
    if not re.search(r"Laravel.{0,20}Angular", topo):
        erros.append("foco Laravel + Angular ausente no topo")
    if not any("botao--primario" in (a.get("class") or "") and a.get("href") == "#contato" for a in p.links):
        erros.append("falta chamada de contato no topo")
    return erros


@check
def conteudo_estatico(p, html):
    erros = []
    n_tec = len(re.findall(r'<li class="tech"', html))
    if n_tec < 10:
        erros.append(f"esperadas >= 10 tecnologias no HTML, há {n_tec}")
    n_proj = len(re.findall(r'<article class="projeto\b', html))
    if n_proj != 6:
        erros.append(f"esperados 6 projetos no HTML, há {n_proj}")
    if "getJSON" in js_locais():
        erros.append("ainda usa getJSON")
    for erro in ("estante/ ", "ele/ "):
        if erro in html:
            erros.append(f"espaço sobrando: '{erro}'")
    if not re.search(r'<span id="idade">\d+</span>', html):
        erros.append("idade sem valor de fallback no HTML")
    n_empresas = len(re.findall(r'<li class="timeline-item"', html))
    if n_empresas < 3:
        erros.append(f"esperadas >= 3 empresas na linha do tempo, há {n_empresas}")
    for termo in ("WebSockets", "PHPUnit", "CI/CD"):
        if termo not in html:
            erros.append(f"falta citar {termo}")
    return erros


@check
def residuos(p, html):
    erros = []
    if "console.log" in js_locais():
        erros.append("console.log em js/")
    if "copyrights" in html + js_locais():
        erros.append("referência a #copyrights")
    if "<!--" in html:
        erros.append("comentário HTML residual")
    erros += [f"arquivo morto: {f}" for f in ARQUIVOS_MORTOS if (RAIZ / f).exists()]
    return erros


@check
def css(p, html):
    texto = (RAIZ / "estilo/estilo.css").read_text(encoding="utf-8")
    erros = []
    if "color: transparent" in texto:
        erros.append("texto escondido com color: transparent")
    if re.search(r"font-size:\s*[\d.]+pt", texto):
        erros.append("font-size em pt")
    for m in re.finditer(r"font-size:\s*([\d.]+)(px|rem)", texto):
        px = float(m.group(1)) * (16 if m.group(2) == "rem" else 1)
        if px < 14:
            erros.append(f"fonte menor que 14px: {m.group(0)}")
    for trecho in ("prefers-reduced-motion", "min-height: 44px", ":focus-visible",
                   "(hover: none)", ":focus-within", "backface-visibility"):
        if trecho not in texto:
            erros.append(f"CSS sem {trecho}")
    return erros


@check
def orcamento(p, html):
    total = len(html.encode("utf-8"))
    total += sum((RAIZ / r).stat().st_size for r in refs_locais(p)
                 if r.endswith((".css", ".js")) and (RAIZ / r).exists())
    return [] if total <= 40_000 else [f"HTML+CSS+JS = {total} bytes (> 40 KB)"]


def main():
    html = INDEX.read_text(encoding="utf-8")
    p = Parser()
    p.feed(html)
    falhas = 0
    for nome in sys.argv[1:] or list(CHECKS):
        erros = CHECKS[nome](p, html)
        print(f"{'PASS' if not erros else 'FAIL'} {nome}")
        for e in erros:
            print(f"     - {e}")
        falhas += bool(erros)
    sys.exit(1 if falhas else 0)


if __name__ == "__main__":
    main()
