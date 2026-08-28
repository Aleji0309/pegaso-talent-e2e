# Pegaso Talent E2E Tests

Suite de pruebas End-to-End para **Pegaso Talent**, desarrollada con **Playwright**.

El proyecto permite ejecutar pruebas funcionales automatizadas, generar reportes HTML y construir una matriz QA a partir de los resultados obtenidos.

---

## Requisitos

Antes de ejecutar el proyecto necesitas:

- Node.js
- npm

Verificar instalación:

```bash
node --version
npm --version
```

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Aleji0309/pegaso-talent-e2e.git
cd pegaso-talent-e2e
```

Instalar dependencias:

```bash
npm install
```

Instalar los navegadores de Playwright:

```bash
npx playwright install
```

---

## Variables de entorno

El proyecto utiliza un archivo `.env` para configuraciones y credenciales locales.

Crear el archivo a partir del ejemplo:

```bash
cp .env.example .env
```

Ejemplo:

```env
BASE_URL=https://www.pegasotalent.com
APP_URL=https://app.pegasotalent.com

EMPRESA_EMAIL=
EMPRESA_PASSWORD=

CANDIDATO_EMAIL=
CANDIDATO_PASSWORD=
```

> El archivo `.env` contiene información local y credenciales, por lo que **no debe subirse al repositorio**.

---

## Ejecución de pruebas

### Ejecutar toda la suite

```bash
npm test
```

Por defecto, la suite se ejecuta en:

- Chromium
- Firefox
- WebKit

---

### Ejecutar únicamente las pruebas de Empresa

```bash
npm run test:empresa
```

---

### Ejecutar una prueba individual

Cada caso de prueba tiene un identificador único.

Ejemplo:

```bash
npx playwright test -g "EMP-003"
```

Esto ejecutará `EMP-003` en todos los navegadores configurados.

Para ejecutarlo únicamente en Chromium:

```bash
npx playwright test -g "EMP-003" --project=chromium
```

---

### Ejecutar una prueba mostrando el navegador

```bash
npx playwright test -g "EMP-003" --project=chromium --headed
```

También se puede utilizar:

```bash
npm run test:headed
```

---

### Modo Debug

Para ejecutar una prueba paso a paso utilizando Playwright Inspector:

```bash
npx playwright test -g "EMP-003" --project=chromium --debug
```

Este modo permite detener la ejecución, revisar selectores, inspeccionar elementos y avanzar paso a paso por la prueba.

---

## Reporte HTML

Después de ejecutar las pruebas, Playwright genera un reporte HTML.

Para abrirlo:

```bash
npx playwright show-report
```

El reporte puede incluir:

- Casos ejecutados
- Navegador
- Estado PASS / FAIL
- Duración
- Assertions
- Errores
- Screenshots
- Videos
- Traces cuando corresponda

---

## Matriz automática de pruebas

Los resultados generados por Playwright se utilizan para construir automáticamente una matriz QA.

Para ejecutar las pruebas y generar la matriz:

```bash
npm run test:matrix
```

El flujo es el siguiente:

```text
Playwright Tests
      ↓
test-results/results.json
      ↓
scripts/generate-test-matrix.mjs
      ↓
docs/matriz-pruebas.csv
```

---

## Generar únicamente la matriz

Si las pruebas ya fueron ejecutadas y existe el archivo:

```text
test-results/results.json
```

se puede regenerar la matriz sin volver a ejecutar la suite:

```bash
npm run matrix
```

---

## Ver la matriz

La matriz generada se encuentra en:

```text
docs/matriz-pruebas.csv
```

### Desde terminal

```bash
cat docs/matriz-pruebas.csv
```

### Abrir con la aplicación predeterminada en macOS

```bash
open docs/matriz-pruebas.csv
```

### Abrir con Microsoft Excel

```bash
open -a "Microsoft Excel" docs/matriz-pruebas.csv
```

También puede abrirse utilizando:

- Numbers
- Microsoft Excel
- Google Sheets
- VS Code

Para visualizar archivos CSV de forma más clara en VS Code se puede utilizar una extensión como **Rainbow CSV**.

---

## Información incluida en la matriz

Cada ejecución registra la siguiente información:

| Campo | Descripción |
|---|---|
| ID | Identificador del caso |
| Rol | Empresa, Candidato, etc. |
| Módulo | Área funcional probada |
| Caso de prueba | Nombre del escenario |
| Precondiciones | Condiciones necesarias para ejecutar la prueba |
| Resultado esperado | Comportamiento esperado del sistema |
| Resultado obtenido | Resultado observado durante la ejecución |
| Navegador | Chromium, Firefox o WebKit |
| Estado | PASS / FAIL |
| Duración | Tiempo de ejecución |
| Error | Error capturado cuando la prueba falla |
| Observaciones | Información adicional del caso |

---

## Convención de casos de prueba

Los tests utilizan identificadores dependiendo del rol que se está probando.

### Empresa

```text
EMP-001
EMP-002
EMP-003
...
```

### Candidato

```text
CAN-001
CAN-002
CAN-003
...
```

Ejemplo:

```ts
test(
  "EMP-003 | Validar formato inválido de correo empresarial",
  async ({ page }) => {
    // Test
  },
);
```

Gracias a esta convención es posible ejecutar fácilmente un caso específico:

```bash
npx playwright test -g "EMP-003"
```

---

## Estructura del proyecto

```text
pegaso-talent-e2e/
├── tests/
│   ├── empresa/
│   │   └── registro.spec.ts
│   ├── candidato/
│   └── shared/
│
├── scripts/
│   └── generate-test-matrix.mjs
│
├── docs/
│   └── matriz-pruebas.csv
│
├── test-results/
├── playwright-report/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts
└── README.md
```

---

## Evidencias de fallos

Cuando una prueba falla, Playwright puede almacenar evidencias que ayudan a investigar el problema.

Estas evidencias pueden incluir:

- Screenshot
- Video
- Trace
- Contexto del error

Los artefactos se generan dentro de:

```text
test-results/artifacts/
```

Para abrir un trace:

```bash
npx playwright show-trace <ruta-del-trace.zip>
```

---

## Casos de prueba actuales

Actualmente se están automatizando los flujos correspondientes al rol **Empresa**.

Los primeros casos implementados son:

| ID | Caso |
|---|---|
| EMP-001 | Acceder al formulario de registro de Empresa desde la landing |
| EMP-002 | Validar campos obligatorios vacíos en el registro de Empresa |
| EMP-003 | Validar formato inválido de correo empresarial |

La suite continuará creciendo conforme se agreguen nuevos escenarios funcionales.
