export const defaultCss = `
:root {
  --black: rgb(36, 41, 51);
  --white: #eceff4;
  --primary: #81a1c1;
}

html,
body {
  margin: 0;
  padding: 0;
  color: var(--black);
  background-color: var(--white);
  font-size: 22px;
  font-family: Superclarendon, 'Bookman Old Style', 'URW Bookman', 'URW Bookman L', 'Georgia Pro', Georgia, serif;
}

main {
  max-width: 1200px;
  margin: auto;
  margin-top: 2em;
  padding: 1em;
}

a {
  color: var(--primary);
}

p {
  line-height: 1.8;
  text-align: justify;
  text-justify: auto;
}

.serea {
  text-align: center;
}

.serea svg {
  max-height: 100vh;
}

@media (prefers-color-scheme: dark) {
  html, body {
    color: var(--white);
    background-color: var(--black);
  }
}

@media(max-width: 500px) {
  html, body {
    font-size: 18px;
  }
}
`;
