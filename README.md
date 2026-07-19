# JSB Smart Services

Site institucional e portfólio profissional one-page para a JSB Smart Services, desenvolvido com HTML5, CSS3 e JavaScript puro.

## Estrutura do projeto

- index.html: estrutura principal do site
- styles.css: identidade visual, responsividade e estilos
- script.js: interações, navegação, filtro de projetos e formulário
- data/content.js: indicadores, serviços, competências, tecnologias e links sociais
- data/projects.js: dados dos projetos apresentados no portfólio
- assets/: arquivos de marca e ícones

## Como visualizar localmente

Abra o arquivo index.html diretamente em um navegador ou sirva a pasta com um pequeno servidor estático.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois acesse http://localhost:8000.

## Publicação no GitHub Pages

1. Faça o push do projeto para um repositório GitHub.
2. Ative o GitHub Pages nas configurações do repositório.
3. Selecione a branch principal e a pasta raiz.
4. Atualize o link canônico em index.html para o domínio final.
5. Ajuste os valores de contato no arquivo data/content.js.

## Ajustes recomendados

- Substitua os arquivos de marca em assets/ pelos arquivos oficiais fornecidos pela empresa.
- Preencha o número do WhatsApp e o e-mail no arquivo data/content.js.
- Inclua links reais de LinkedIn e GitHub quando disponíveis.
