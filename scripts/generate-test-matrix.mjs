import fs from "fs";
import path from "path";

const resultsPath = path.resolve("test-results/results.json");
const outputPath = path.resolve("docs/matriz-pruebas.csv");

if (!fs.existsSync(resultsPath)) {
  console.error("No existe test-results/results.json");
  console.error("Ejecuta primero los tests.");
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
const rows = [];

function escapeCsv(value = "") {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
}

function walkSuite(suite, parents = []) {
  const currentParents = suite.title
    ? [...parents, suite.title]
    : parents;

  for (const spec of suite.specs ?? []) {
    const match = spec.title.match(/^([A-Z]+-\d+)\s*\|\s*(.+)$/);

    const id = match?.[1] ?? "";
    const testCase = match?.[2] ?? spec.title;

    for (const test of spec.tests ?? []) {
      const result = test.results?.at(-1);
      const status = result?.status ?? "unknown";

      const annotations = Object.fromEntries(
        (test.annotations ?? []).map((annotation) => [
          annotation.type,
          annotation.description ?? "",
        ]),
      );

      rows.push({
        ID: id,
        Rol: id.startsWith("EMP-")
          ? "Empresa"
          : id.startsWith("CAN-")
            ? "Candidato"
            : "",
        Modulo: currentParents.at(-1) ?? "",
        Caso: testCase,
        Precondiciones: annotations.precondiciones ?? "",
        ResultadoEsperado: annotations.resultadoEsperado ?? "",
        ResultadoObtenido:
          status === "passed"
            ? "El comportamiento observado coincide con el resultado esperado."
            : result?.error?.message ??
              "La ejecucion no finalizo correctamente.",
        Navegador: test.projectName ?? "",
        Estado:
          status === "passed"
            ? "PASS"
            : status === "failed"
              ? "FAIL"
              : status.toUpperCase(),
        Duracion: result?.duration ?? "",
        Error: result?.error?.message ?? "",
        Observaciones: annotations.observaciones ?? "",
      });
    }
  }

  for (const child of suite.suites ?? []) {
    walkSuite(child, currentParents);
  }
}

for (const suite of report.suites ?? []) {
  walkSuite(suite);
}

const headers = [
  "ID",
  "Rol",
  "Modulo",
  "Caso de prueba",
  "Precondiciones",
  "Resultado esperado",
  "Resultado obtenido",
  "Navegador",
  "Estado",
  "Duracion (ms)",
  "Error",
  "Observaciones",
];

const csv = [
  headers.map(escapeCsv).join(","),
  ...rows.map((row) =>
    [
      row.ID,
      row.Rol,
      row.Modulo,
      row.Caso,
      row.Precondiciones,
      row.ResultadoEsperado,
      row.ResultadoObtenido,
      row.Navegador,
      row.Estado,
      row.Duracion,
      row.Error,
      row.Observaciones,
    ]
      .map(escapeCsv)
      .join(","),
  ),
].join("\n");

fs.writeFileSync(outputPath, csv, "utf8");

console.log(`Matriz generada: ${outputPath}`);
console.log(`Ejecuciones registradas: ${rows.length}`);
