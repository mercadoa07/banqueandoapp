# Roadmap — Reactivar Banqueando

Creado: 2026-10-13 · Estado: borrador para decidir

## Punto de partida (diagnóstico del 2026-10-13)

- **Qué es:** quiz que recomienda tarjetas de crédito (12) y créditos personales/negocio (51) en Colombia, y captura el lead (WhatsApp, email, edad, género, ciudad) en Supabase.
- **Lo que vale:** la idea, el embudo de captación de leads con perfil financiero y la base de 63 productos.
- **Lo que está roto o flojo:**
  - `banqueandoapp` **no compila**: usa `@supabase/supabase-js`, que no está en `package.json`.
  - Hay dos repos casi iguales (`banqueandoapp` y `banqueandoapp-beta`) que se fueron separando.
  - Los datos de productos son de **dic-2024 / feb-2025** (~20 meses de antigüedad). Ningún producto tiene fecha de verificación ni fuente.
  - `matchingConfig.json` no se usa: los pesos están fijos en `matchingEngine.js`.
  - `businessLoans.json` no se usa. En créditos el campo es `provider`, no `bank`, así que `top_match_bank` se guarda vacío.
  - El "ahorro" asume siempre una cuota de $25.000/mes que el usuario quizá no paga.
  - Se pregunta `monthly_debt_payment` y no se usa para calcular la capacidad de pago.
  - No se registra cuando el usuario da clic en "Aplicar": no hay forma de medir conversión.
  - `Quiz.jsx` (45 KB) y `Landing.jsx` (36 KB) concentran todo. No hay tests, lint ni CI.
  - Las funciones `getLeadsBy*` leen la tabla de leads desde el navegador. **Revisar RLS**: puede exponer datos personales.

---

## Fase 0 — Rescate (semana 1)

Objetivo: que la app compile, se publique y no exponga datos.

En código (rama `fase-0-rescate`):

- [x] Agregar `@supabase/supabase-js` a `package.json` y confirmar que el build pasa.
- [x] Sacar las funciones de analytics del frontend. El insert ya no lee de vuelta la fila: con RLS correcto, el `.select()` anterior hacía fallar el guardado.
- [x] Registro: formulario (no Google). WhatsApp (celular colombiano válido) + email + consentimiento obligatorios; edad, género, ciudad y nombre opcionales.
- [x] Guardar el clic en "Aplicar" (producto, entidad, posición, score, sesión) en `apply_clicks`.
- [x] Mostrar la entidad en los resultados de crédito (`provider`) y guardarla en `top_match_bank`.
- [x] `.env.example`, `.gitignore` y claves solo por variables de entorno.
- [x] Quitar los `console.log` de depuración.
- [x] Actualizar el README.
- [x] Migración SQL: `supabase/migrations/20261013_fase0_rls_y_clics.sql`.

Fuera del código (requiere acceso a Supabase / Vercel / GitHub):

- [x] Reactivar el proyecto de Supabase: estaba pausado por inactividad y no se guardaba nada (reactivado el 2026-10-13).
- [x] Auditar RLS: existía la política "Allow anonymous reads" (cualquiera podía leer los leads con la clave pública).
- [x] Revisar columnas: el código de feb-2026 escribía en `alternatives`, `terms_accepted` y `top_match_bank`, que no existían. Ahora el código usa las columnas reales.
- [x] Correr la migración en Supabase: quita la lectura pública, agrega `top_match_bank` y crea `apply_clicks` (aplicada el 2026-10-13).
- [x] Eliminar la notificación a Telegram (trigger + función creados fuera del repo): bloqueaba el guardado si Telegram fallaba y tenía el token del bot dentro de la función.
- [ ] Revocar el token del bot de Telegram en @BotFather (`/revoke`): quedó expuesto en la función.
- [x] Revocar `SELECT` de `anon`/`authenticated` en `quiz_sessions` y `apply_clicks`. Probado: guardar funciona y leer está bloqueado. El revisor de seguridad de Supabase quedó limpio.
- [x] Configurar en Vercel `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en todos los entornos.
- [x] Revisar Vercel: producción (www.banqueando.co) corre `32310a9` del 4-feb-2026; los deploys posteriores fallaban por la dependencia faltante.
- [x] Prueba de punta a punta en la preview (2026-10-13): lead y clic llegan a Supabase con todos los campos.
- [ ] Hacer merge del PR #1 a `main` (publica en www.banqueando.co).
- [ ] **Archivar `banqueandoapp-beta`** en GitHub: fue un sandbox y todo lo útil ya está en `main` (ver "Decisiones tomadas"). Su clave pública queda visible en el historial; rotarla si RLS no estaba bien.
- [ ] Borrar la rama remota `v2-multi-vertical`: ya está toda incluida en `main`.

**Listo cuando:** el build pasa, producción corre el último commit y RLS está verificado.

## Fase 1 — Calidad de la base de productos (semanas 2–4)

Objetivo: que cada dato mostrado sea correcto, tenga fuente y fecha.

- [x] **Esquema único** por tipo de producto (zod, `scripts/lib/productSchema.mjs`), con `entity`, `active`, `source`, `lastVerified`, `usuryModality` y `usuryModalityVerified`. Migración en `scripts/migrate-products-v3.mjs`.
- [x] Normalizar `bank`/`provider` a un solo campo `entity` (se conservan `bank`/`provider` por compatibilidad).
- [ ] Unificar o borrar `businessLoans.json`.
- [ ] **Re-verificar los 63 productos** contra la página oficial de cada entidad: tasas EA, cuota de manejo, requisitos, montos, links vivos.
- [x] **Validaciones automáticas** en CI (`npm run validate:data`, `.github/workflows/ci.yml`):
  - el esquema se cumple;
  - ninguna tasa supera la **tasa de usura** vigente **de su modalidad** (`config/usuryRates.json`, mensual). Error si la modalidad está verificada; advertencia si no;
  - mínimos menores que máximos;
  - links responden (semanal, lunes 7 a. m.; 401/403/429 se toman como bloqueo anti-bots, no como link roto);
  - `lastVerified` tiene menos de 90 días (si no, alerta).
- [x] Marcar como `active: false` en vez de borrar. El motor los ignora. Desactivados el 2026-10-14 (10): Guama (sin link); R5, A2censo y CrediOrbe (tasa máx < mín); Ledn, Sosty, Unergy y Mattilda (monto mín > máx); Terrenta y Agroune (son inversión, no crédito).
- [x] Bug: el filtro de ingreso mínimo de tarjetas nunca se aplicaba (`minIncome` vs `minIncomeMillions`).
- [ ] **Corregir links rotos (404)** de RappiCard, Davivienda (2) y Scotiabank. Confirmar los que no responden (Amex, LATAM Pass, Tuya y 11 fintechs) con la corrida semanal.
- [ ] Verificar las tasas máximas de 30% exacto (27 créditos, probable relleno) y ADDI (68,75%).
- [ ] Verificar la modalidad de usura de cada crédito (`usuryModalityVerified`). Hoy está inferida por tipo/categoría.
- [ ] Revisar si factoring, confirming y arriendo (13 sin tope de usura) se recomiendan solo a negocios.
- [x] **Actualizador automático (lector con Claude + revisión humana)** — `scripts/refresh-products.mjs` + `.github/workflows/lector-productos.yml` (lunes 6 a. m.). Usa `claude-opus-5-5` con búsqueda web limitada al dominio oficial de cada entidad; solo aplica datos con frase de evidencia y URL oficial; abre un PR para aprobar. Falta: clave de API como secreto `ANTHROPIC_API_KEY` en GitHub, permitir que Actions abra PRs y medir el costo real con 3 productos.
  - Cuando no puede verificar (página caída, dato detrás de un simulador, sitio que no deja leer), lo deja en "revisión manual" en vez de inventar.
  - Respeta el dominio oficial de cada entidad y corre una vez por semana. Donde haya API o acuerdo con la entidad, preferirlo.
- [ ] Automatizar la tasa de usura mensual: un job que la busque y abra un PR sobre `config/usuryRates.json`. No hay API oficial ni dataset en datos.gov.co; se publica en comunicado de la SFC y en prensa.
- [ ] Para lo que el scraper no cubra: revisión manual trimestral con checklist.
- [ ] Ampliar la cobertura donde haya huecos: tarjetas de Davivienda, Banco de Bogotá, Itaú, Lulo, Falabella y nuevas fintechs.

**Listo cuando:** 100% de productos con `source` y `lastVerified` de menos de 90 días, y CI en verde.

## Fase 2 — Estructura y calidad de código (semanas 3–6, en paralelo con la Fase 1)

Objetivo: poder cambiar cosas sin miedo a romperlas.

- [x] Partir `Quiz.jsx` (609 → 67 líneas) en `src/components/quiz/` (pasos, tarjeta de resultado, tipos de pregunta, modales) y `Landing.jsx` (686 → 26) en 7 secciones en `src/components/landing/`.
- [x] Estado y acciones del quiz en `src/hooks/useQuiz.js`; lógica pura en `src/lib/validation.js`, `src/lib/questions.js` y `src/engine/savings.js`.
- [x] Herramientas: ESLint, Vitest + Testing Library y GitHub Actions (lint + pruebas + build + validación de datos en cada PR). 45 pruebas: 12 perfiles dorados del motor, reglas, quiz completo de punta a punta, página de inicio idéntica, utilidades.
- [x] El quiz se carga aparte (`React.lazy`): la página de inicio baja de 569 KB a 203 KB de JavaScript.
- [ ] Motor de recomendación como funciones puras que lean los pesos de `matchingConfig.json` (cambia resultados: va con la Fase 3).
- [ ] Opcional: migrar a TypeScript empezando por el engine y los tipos de producto.
- [ ] Dejar de editar desde la web de GitHub: ramas y PR con preview de Vercel.

**Listo cuando:** CI bloquea PRs rotos, el engine tiene cobertura de más del 80% y ningún archivo pasa de unas 300 líneas.

## Fase 3 — Calidad de resultados y algoritmo v5 (semanas 6–10)

Objetivo: que la recomendación sea defendible y útil, no solo un orden por puntos.

**Tests de resultados ("perfiles dorados")**
- [ ] Definir 20–30 perfiles típicos (estudiante sin historial, independiente reportado, PyME formal de 3 años, viajero frecuente que paga total…) con el resultado esperado o los resultados prohibidos.
- [ ] Correrlos en CI: si un cambio de datos o de pesos cambia el top 3, se ve en el PR.

**Mejoras del algoritmo**
- [ ] **Separar elegibilidad dura y preferencias.** Requisitos que descalifican (ingreso mínimo, reportado, relación con Bold) contra puntos por gusto. Mostrar "por qué no te recomendamos X".
- [x] **Costo real en pesos** (`src/engine/finance.js`):
  - créditos: cuota mensual estimada (rango con tasa mínima y máxima), monto, plazo e intereses totales;
  - tarjetas: beneficio neto anual = cashback + millas − cuota de manejo del año (puede ser negativo).
- [x] Tarjetas: intereses según cómo paga (saldo financiado promedio × tasa EA) y, si financia, la tasa baja pesa más en el ranking.
- [x] **Capacidad de pago:** 40% del ingreso (o 15% de las ventas en negocios) menos `monthly_debt_payment`. Si la cuota no cabe, baja el puntaje y lo advierte.
- [x] **Probabilidad de aprobación** (alta / media / baja) según historial, formalidad y lo que acepta cada producto.
- [x] **Ahorro honesto:** se quitó la "cuota promedio" de $25.000 que inflaba el ahorro; se muestra el beneficio neto con su desglose.
- [x] Pregunta nueva "¿Cuánto pagas hoy de cuota de manejo?" (solo al cambiar de tarjeta): muestra el ahorro real del cambio.
- [x] **Top 3 variado en créditos:** mejor match, menor costo (entre los que prestan lo pedido) y el más rápido o más fácil de aprobar.
- [x] Bugs: "Sin cuota de manejo" premiaba tarjetas con cuota mensual; "$0 con condiciones" en tarjetas que cobran.
- [ ] Pesos 100% configurables y versionados. Guardar la `engineVersion` en cada sesión.
- [ ] Más adelante: calibrar pesos con datos reales de clics en "Aplicar" y aprobaciones reportadas.

**Listo cuando:** los perfiles dorados pasan, cada resultado muestra costo estimado y probabilidad de aprobación, y no hay recomendaciones fuera de la capacidad de pago.

## Fase 4 — Explotar la utilidad (semana 8 en adelante)

Objetivo: convertir el tráfico en valor medible.

**Medición**
- [ ] Registrar el embudo: visita → inicio del quiz → pregunta en que abandona → registro → resultado → clic en "Aplicar" (por producto).
- [ ] Dashboard interno de leads y conversión, en el servidor y no en el navegador.

**Monetización y operación**
- [ ] Acuerdos de afiliación / CPA con fintechs y bancos (links con tracking por producto).
- [ ] Seguimiento del lead por WhatsApp (consentido): recordatorio, "¿te aprobaron?" (eso además alimenta la calibración del algoritmo).
- [ ] Venta de leads calificados B2B a entidades, solo con consentimiento explícito.

**Producto y adquisición**
- [ ] Páginas SEO por producto y por necesidad ("crédito para reportados", "tarjeta sin cuota de manejo") generadas desde la base de datos.
- [ ] Comparador lado a lado de 2–3 productos.
- [ ] Alertas: "bajó la tasa del producto que te recomendamos".
- [ ] Nuevas verticales con el mismo motor: cuentas de ahorro / CDT, seguros, crédito de vehículo.

**Legal y confianza**
- [ ] Cumplimiento de habeas data (Ley 1581): autorización explícita, finalidad clara, derecho a borrar, política actualizada.
- [ ] Aviso visible: "no es asesoría financiera" y transparencia sobre cómo se ordena y si hay comisiones.
- [ ] Revisar con un abogado el modelo de recomendación + afiliación.

---

## Decisiones tomadas (2026-10-13)

1. **Repo:** seguimos con `banqueandoapp`. `-beta` fue un sandbox creado el 30-dic-2025 como copia de `main`. En enero se trabajó ahí (vertical de crédito, landing, preguntas) y el 2-feb-2026 se pasó todo a `main`. Lo único que tiene `-beta` y `main` no es el login con Google y el registro de tipo de dispositivo. Se archiva.
2. **Registro:** formulario, sin login con Google. Google solo da nombre y email, y el dato valioso es el WhatsApp, que igual hay que pedir. Además el login de Google falla dentro de los navegadores de Instagram, TikTok y WhatsApp (de donde viene buena parte del tráfico en Colombia) y obliga a salir de la página y volver. El 4-feb-2026 ya se había quitado de `main`. Más adelante: verificar el WhatsApp con un código (OTP) si hace falta calidad de lead.
3. **Modelo de negocio:** probablemente comisión por referido, pero es temprano para cerrarlo. Por ahora solo se mide (clics en "Aplicar"), sin acuerdos.
4. **Datos:** actualizador automático con revisión humana (Fase 1).
5. **Meta:** primero reactivar (Fases 0–3) y después crecer (Fase 4).

## Orden sugerido

```
Sem 1      Fase 0  Rescate
Sem 2–4    Fase 1  Datos            ┐ en paralelo
Sem 3–6    Fase 2  Código           ┘
Sem 6–10   Fase 3  Algoritmo v5
Sem 8+     Fase 4  Crecimiento
```
