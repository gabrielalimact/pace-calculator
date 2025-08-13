# PaceCalc

Calculadora de pace de corrida + conversor de pace (min/km ou min/milha) para velocidade de esteira (km/h) e vice‑versa.

## Funcionalidades
- Calcular pace e velocidade média a partir de distância e tempo
- Aceita distância em km, metros ou milhas
- Entrada de tempo em campos separados ou texto (mm:ss ou hh:mm:ss)
- Conversão pace ↔ velocidade com suporte a pace por km ou por milha
- Previsão de tempo estimado para 5K, 10K, 21K e 42K com base no pace calculado
- Interface responsiva e acessível

## Desenvolvimento
Instale dependências e rode o watcher do TypeScript:

```bash
npm install
npm run dev
```

Abra `index.html` diretamente no navegador (ou sirva a pasta via extensão Live Server).

## Build

```bash
npm run build
```

Arquivos finais em `dist/`.

## Estrutura
- `index.html` – Landing page
- `styles.css` – Estilos principais
- `script.ts` – Lógica TypeScript (compila para `script.js`)

## Licença
MIT
