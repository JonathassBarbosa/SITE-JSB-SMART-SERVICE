# JSB Smart Services

Site institucional e portfólio profissional da JSB Smart Services.

## Endereço oficial

`https://jsbsmartservices.com.br`

## Estrutura

- `index.html`: página institucional
- `styles.css` e `branding.css`: interface, identidade visual e responsividade
- `script.js`: navegação, projetos, acessibilidade e contato
- `data/content.js`: conteúdo e canais públicos
- `data/projects.js`: portfólio
- `privacidade.html`: política de privacidade
- `_headers`: cabeçalhos de segurança e cache
- `tests/`: verificações automatizadas

## Desenvolvimento local

Sirva a pasta com um servidor estático:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Verificação

Requer Node.js 20 ou superior:

```bash
npm test
```

O GitHub Actions executa as verificações em cada alteração e monitora periodicamente a disponibilidade do domínio.

## Contatos

Os canais públicos ficam em `data/content.js`. O botão de e-mail permanece oculto até que um endereço profissional seja cadastrado.

## Publicação

A publicação definitiva só deve ocorrer após:

1. revisão visual da versão de homologação;
2. escolha da foto do fundador;
3. aprovação dos textos e projetos;
4. execução bem-sucedida dos testes;
5. definição do e-mail profissional.
