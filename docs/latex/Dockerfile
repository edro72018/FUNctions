FROM fedora:latest

RUN dnf install -y \
    texlive-scheme-medium \
    texlive-babel-spanish \
    latexmk \
    && dnf clean all

WORKDIR /documentos

# Punto de entrada: compila el .tex que se le pase (por defecto main.tex)
CMD ["latexmk", "-pdf", "main.tex"]
