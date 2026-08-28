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
});
