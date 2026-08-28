import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL ?? "https://www.pegasotalent.com";

test.describe("Empresa - Registro", () => {
  test(
    "EMP-001 | Acceder al formulario de registro de Empresa desde la landing",
    {
      annotation: [
        {
          type: "precondiciones",
          description:
            "La landing publica de Pegaso Talent debe estar disponible.",
        },
        {
          type: "resultadoEsperado",
          description:
            "El usuario puede acceder al registro de Empresa y visualizar los campos requeridos del formulario.",
        },
        {
          type: "observaciones",
          description:
            "Caso ejecutado automaticamente en los navegadores configurados en Playwright.",
        },
      ],
    },
    async ({ page }) => {
      await page.goto(BASE_URL);

      await page.getByRole("link", { name: "Iniciar sesión" }).click();

      await page.getByRole("link", { name: "Regístrame" }).click();

      await page
        .getByRole("link", {
          name: /Empresa Gestiona procesos de/,
        })
        .click();

      await expect(
        page.getByRole("textbox", {
          name: "Nombre de la empresa *",
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("textbox", {
          name: "ID / Cedula juridica *",
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("textbox", {
          name: "Correo empresarial *",
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("textbox", {
          name: "Contrasena *",
          exact: true,
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("textbox", {
          name: "Confirmar contrasena *",
        }),
      ).toBeVisible();
    },
  );

  test(
    "EMP-002 | Validar campos obligatorios vacíos en el registro de Empresa",
    {
      annotation: [
        {
          type: "precondiciones",
          description:
            "El usuario debe encontrarse en el formulario de registro de Empresa.",
        },
        {
          type: "resultadoEsperado",
          description:
            "El sistema debe impedir el registro cuando los campos obligatorios estén vacíos y mostrar un mensaje indicando que deben completarse.",
        },
        {
          type: "observaciones",
          description:
            "Se valida el comportamiento del formulario sin ingresar información.",
        },
      ],
    },
    async ({ page }) => {
      await page.goto(BASE_URL);

      await page.getByRole("link", { name: "Iniciar sesión" }).click();

      await page.getByRole("link", { name: "Regístrame" }).click();

      await page
        .getByRole("link", {
          name: /Empresa Gestiona procesos de/,
        })
        .click();

      const nombreEmpresa = page.getByRole("textbox", {
        name: "Nombre de la empresa *",
      });

      const cedulaJuridica = page.getByRole("textbox", {
        name: "ID / Cedula juridica *",
      });

      const correoEmpresa = page.getByRole("textbox", {
        name: "Correo empresarial *",
      });

      const contrasena = page.getByRole("textbox", {
        name: "Contrasena *",
        exact: true,
      });

      const confirmarContrasena = page.getByRole("textbox", {
        name: "Confirmar contrasena *",
      });

      await expect(nombreEmpresa).toHaveValue("");
      await expect(cedulaJuridica).toHaveValue("");
      await expect(correoEmpresa).toHaveValue("");
      await expect(contrasena).toHaveValue("");
      await expect(confirmarContrasena).toHaveValue("");

      const solicitarCuenta = page.getByRole("button", {
        name: "Solicitar cuenta empresarial",
      });

      await expect(solicitarCuenta).toBeVisible();

      await solicitarCuenta.click();

      const alerta = page.getByRole("alert", {
        name: /Por favor, complete todos los/i,
      });

      await expect(alerta).toBeVisible();
    },
  );

  test(
    "EMP-003 | Validar formato inválido de correo empresarial",
    {
      annotation: [
        {
          type: "precondiciones",
          description:
            "El usuario debe encontrarse en el formulario de registro de Empresa.",
        },
        {
          type: "resultadoEsperado",
          description:
            "El sistema debe impedir la solicitud de una cuenta empresarial cuando el correo ingresado tiene un formato inválido y mostrar el mensaje correspondiente.",
        },
        {
          type: "observaciones",
          description:
            "Se valida el formato del correo empresarial utilizando una dirección sin formato de correo válido.",
        },
      ],
    },
    async ({ page }) => {
      await page.goto(BASE_URL);

      await page.getByRole("link", { name: "Iniciar sesión" }).click();

      await page.getByRole("link", { name: "Regístrame" }).click();

      await page
        .getByRole("link", {
          name: /Empresa Gestiona procesos de/,
        })
        .click();

      await page
        .getByRole("textbox", {
          name: "Nombre de la empresa *",
        })
        .fill("Kinora Test");

      await page
        .getByRole("textbox", {
          name: "ID / Cedula juridica *",
        })
        .fill("TEST-001");

      const correoEmpresa = page.getByRole("textbox", {
        name: "Correo empresarial *",
      });

      await correoEmpresa.fill("test.com");

      await page
        .getByRole("textbox", {
          name: "Contrasena *",
          exact: true,
        })
        .fill("test787843*");

      await page
        .getByRole("textbox", {
          name: "Confirmar contrasena *",
        })
        .fill("test787843*");

      await page
        .getByRole("button", {
          name: "Solicitar cuenta empresarial",
        })
        .click();

      const mensajeCorreo = page.getByText("Ingresa un email válido.");

      await expect(mensajeCorreo).toBeVisible();
    },
  );

  test(
    "EMP-004 | Validar contraseñas que no coinciden",
    {
      annotation: [
        {
          type: "precondiciones",
          description:
            "El usuario debe encontrarse en el formulario de registro de Empresa.",
        },
        {
          type: "resultadoEsperado",
          description:
            "El sistema debe impedir la solicitud de una cuenta empresarial cuando las contraseñas no coinciden y mostrar el mensaje de validación correspondiente.",
        },
        {
          type: "observaciones",
          description:
            "El mensaje de validación fue confirmado directamente en la aplicación.",
        },
      ],
    },
    async ({ page }) => {
      await page.goto(BASE_URL);

      await page.getByRole("link", { name: "Iniciar sesión" }).click();

      await page.getByRole("link", { name: "Regístrame" }).click();

      await page
        .getByRole("link", {
          name: /Empresa Gestiona procesos de/,
        })
        .click();

      await page
        .getByRole("textbox", {
          name: "Nombre de la empresa *",
        })
        .fill("Empresa QA");

      await page
        .getByRole("textbox", {
          name: "ID / Cedula juridica *",
        })
        .fill("3-101-123456");

      await page
        .getByRole("textbox", {
          name: "Correo empresarial *",
        })
        .fill("empresa.qa@example.com");

      await page
        .getByRole("textbox", {
          name: "Contrasena *",
          exact: true,
        })
        .fill("EmpresaQa123*");

      await page
        .getByRole("textbox", {
          name: "Confirmar contrasena *",
        })
        .fill("EmpresaQa456*");

      await page
        .getByRole("button", {
          name: "Solicitar cuenta empresarial",
        })
        .click();

      await expect(
        page.getByText("Las contraseñas no coinciden.", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "EMP-005 | Validar ID / Cédula jurídica inválida",
    {
      annotation: [
        {
          type: "precondiciones",
          description:
            "El usuario debe encontrarse en el formulario de registro de Empresa.",
        },
        {
          type: "resultadoEsperado",
          description:
            "El sistema debe impedir la solicitud de una cuenta empresarial cuando el ID / Cédula jurídica es inválido.",
        },
        {
          type: "observaciones",
          description:
            "Bloqueado: la aplicación no muestra una validación visible para el valor ! y se debe confirmar la regla o respuesta real antes de agregar una assertion.",
        },
      ],
    },
    async ({ page }) => {
      await page.goto(BASE_URL);

      await page.getByRole("link", { name: "Iniciar sesión" }).click();

      await page.getByRole("link", { name: "Regístrame" }).click();

      await page
        .getByRole("link", {
          name: /Empresa Gestiona procesos de/,
        })
        .click();

      const cedulaJuridica = page.getByRole("textbox", {
        name: "ID / Cedula juridica *",
      });

      await cedulaJuridica.fill("!");
      await expect(cedulaJuridica).toHaveValue("!");

      // TODO(EMP-005): confirmar con Codegen la regla y el mensaje real para un ID inválido.
      test.fixme(
        true,
        "La aplicación no expone una validación visible conocida para el ID inválido.",
      );
    },
  );

  test(
    "EMP-006 | Registrar Empresa con datos válidos",
    {
      annotation: [
        {
          type: "precondiciones",
          description:
            "EMPRESA_EMAIL y EMPRESA_PASSWORD deben corresponder a datos de prueba nuevos; también se requieren nombre, ID y país válidos confirmados para el ambiente.",
        },
        {
          type: "resultadoEsperado",
          description:
            "El sistema registra la Empresa y muestra el resultado real confirmado de la solicitud de cuenta.",
        },
        {
          type: "observaciones",
          description:
            "Bloqueado para evitar consumir EMPRESA_EMAIL repetidamente hasta confirmar los datos obligatorios, el resultado real y una estrategia de ejecución única.",
        },
      ],
    },
    async ({ page }) => {
      // TODO(EMP-006): confirmar con Codegen el selector/mensaje posterior al registro
      // y habilitar este flujo únicamente con un correo desechable de una sola ejecución.
      test.fixme(
        true,
        "El registro consume el correo y todavía no se confirmó el resultado real de la UI.",
      );

      const empresaEmail = process.env.EMPRESA_EMAIL;
      const empresaPassword = process.env.EMPRESA_PASSWORD;

      test.skip(
        !empresaEmail || !empresaPassword,
        "Se requieren EMPRESA_EMAIL y EMPRESA_PASSWORD.",
      );

      await page.goto(BASE_URL);
      await page.getByRole("link", { name: "Iniciar sesión" }).click();
      await page.getByRole("link", { name: "Regístrame" }).click();
      await page
        .getByRole("link", { name: /Empresa Gestiona procesos de/ })
        .click();

      // TODO(EMP-006): completar nombre, ID y país con datos válidos del ambiente.
      await page
        .getByRole("textbox", { name: "Correo empresarial *" })
        .fill(empresaEmail!);
      await page
        .getByRole("textbox", { name: "Contrasena *", exact: true })
        .fill(empresaPassword!);
      await page
        .getByRole("textbox", { name: "Confirmar contrasena *" })
        .fill(empresaPassword!);
      await page
        .getByRole("checkbox", { name: "Acepto los Terminos y Condiciones" })
        .check();
      await page
        .getByRole("checkbox", { name: "Acepto la Politica de Privacidad" })
        .check();
      await page
        .getByRole("button", { name: "Solicitar cuenta empresarial" })
        .click();

      // TODO(EMP-006): agregar aquí la assertion del resultado real confirmado.
    },
  );

  test(
    "EMP-007 | Validar confirmación de correo",
    {
      annotation: [
        {
          type: "precondiciones",
          description:
            "Debe existir una solicitud de cuenta empresarial pendiente de confirmación.",
        },
        {
          type: "resultadoEsperado",
          description:
            "La Empresa confirma su correo y la aplicación refleja el estado real de la cuenta.",
        },
        {
          type: "observaciones",
          description:
            "Bloqueado: la confirmación requiere acceso externo al inbox y no existe un mecanismo verificable únicamente desde la aplicación.",
        },
      ],
    },
    async ({ page }) => {
      await page.goto(BASE_URL);
      await page.getByRole("link", { name: "Iniciar sesión" }).click();
      await page.getByRole("link", { name: "Regístrame" }).click();
      await page
        .getByRole("link", { name: /Empresa Gestiona procesos de/ })
        .click();

      // TODO(EMP-007): verificar manualmente el enlace recibido en el inbox de prueba.
      test.fixme(
        true,
        "La confirmación no puede comprobarse sin acceso externo al correo.",
      );
    },
  );

  test(
    "EMP-008 | Intentar iniciar sesión antes de confirmar correo",
    {
      annotation: [
        {
          type: "precondiciones",
          description:
            "Debe existir una cuenta empresarial registrada cuyo correo todavía no haya sido confirmado.",
        },
        {
          type: "resultadoEsperado",
          description:
            "El sistema impide el acceso y muestra el mensaje o estado real asociado a una cuenta sin confirmar.",
        },
        {
          type: "observaciones",
          description:
            "Bloqueado hasta disponer de una cuenta sin confirmar y conocer el comportamiento real; el login también requiere resolver reCAPTCHA.",
        },
      ],
    },
    async ({ page }) => {
      await page.goto(BASE_URL);
      await page.getByRole("link", { name: "Iniciar sesión" }).click();
      await page.getByRole("link", { name: "Regístrame" }).click();
      await page
        .getByRole("link", { name: /Empresa Gestiona procesos de/ })
        .click();
      await page.getByRole("link", { name: "Iniciar sesion" }).click();

      // TODO(EMP-008): confirmar con Codegen el estado/mensaje real de cuenta no confirmada.
      test.fixme(
        true,
        "Se desconoce el comportamiento real y reCAPTCHA bloquea el ingreso automatizado.",
      );
    },
  );

  test(
    "EMP-009 | Primer inicio de sesión de Empresa confirmada",
    {
      annotation: [
        {
          type: "precondiciones",
          description:
            "EMPRESA_EMAIL y EMPRESA_PASSWORD deben pertenecer a una Empresa confirmada y habilitada.",
        },
        {
          type: "resultadoEsperado",
          description:
            "La Empresa inicia sesión correctamente y accede al panel correspondiente.",
        },
        {
          type: "observaciones",
          description:
            "Bloqueado: reCAPTCHA mantiene deshabilitado el botón Ingresar y todavía debe confirmarse el selector accesible del panel empresarial.",
        },
      ],
    },
    async ({ page }) => {
      const empresaEmail = process.env.EMPRESA_EMAIL;
      const empresaPassword = process.env.EMPRESA_PASSWORD;

      test.skip(
        !empresaEmail || !empresaPassword,
        "Se requieren EMPRESA_EMAIL y EMPRESA_PASSWORD.",
      );

      await page.goto(BASE_URL);
      await page.getByRole("link", { name: "Iniciar sesión" }).click();
      await page.getByRole("link", { name: "Regístrame" }).click();
      await page
        .getByRole("link", { name: /Empresa Gestiona procesos de/ })
        .click();
      await page.getByRole("link", { name: "Iniciar sesion" }).click();

      await page
        .getByRole("textbox", { name: "Correo electrónico" })
        .fill(empresaEmail!);
      await page
        .getByRole("textbox", { name: "Contraseña" })
        .fill(empresaPassword!);

      // TODO(EMP-009): disponer de bypass/test key para reCAPTCHA y confirmar
      // con Codegen el selector accesible que identifica el panel de Empresa.
      test.fixme(
        true,
        "reCAPTCHA impide habilitar Ingresar en la automatización E2E.",
      );
    },
  );
});
