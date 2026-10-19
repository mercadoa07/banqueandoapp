# 🏦 Banqueando

Recomendador de productos financieros para Colombia: **tarjetas de crédito** y **créditos personales / para negocio**.

## 🚀 Cómo funciona

1. El usuario elige qué busca (nueva tarjeta, cambiar tarjeta o crédito) y responde un quiz sobre su perfil.
2. El motor de matching califica cada producto (0–100) y muestra el mejor y dos alternativas, con razones.
3. Antes del resultado deja WhatsApp + email (obligatorios) y, opcionalmente, edad, género, ciudad y nombre.
4. La sesión se guarda en Supabase (`quiz_sessions`) y cada clic en "Solicitar" / "Ver más" en `apply_clicks`.

## 📁 Estructura

```
banqueandoapp/
├── config/                     # ⚙️ Datos editables
│   ├── cards.json              # Tarjetas de crédito
│   ├── creditProducts.json     # Créditos (personales y negocio)
│   ├── businessLoans.json      # (sin uso — pendiente unificar, ver ROADMAP)
│   ├── questions.json          # Preguntas del quiz por vertical
│   └── matchingConfig.json     # (aún no lo lee el motor — ver ROADMAP)
├── src/
│   ├── engine/matchingEngine.js  # Motores de tarjetas y crédito
│   ├── lib/supabase.js           # Guardado de sesiones y clics
│   ├── pages/                    # Landing y Quiz
│   ├── components/               # Navbar, Footer
│   └── constants/legal.js        # Textos legales y supuestos de ahorro
├── supabase/migrations/        # SQL para correr en Supabase
├── public/                     # Logo, favicon, términos y privacidad
└── ROADMAP.md                  # Plan de trabajo
```

## 🛠️ Desarrollo local

```bash
cp .env.example .env.local   # y completar con la URL y la clave pública de Supabase
npm install
npm run dev
```

Sin `.env.local` la app funciona, pero no guarda leads ni clics.

```bash
npm test                              # pruebas (motor, quiz completo, página de inicio)
npm run lint                          # revisión de código
npm run validate:data                 # valida productos (errores frenan, advertencias informan)
npm run validate:data -- --check-links  # además revisa que los links respondan
```

## 🗄️ Supabase

- Correr los archivos de `supabase/migrations/` en el SQL Editor, en orden.
- La clave pública (`anon`) solo debe poder **insertar** en `quiz_sessions` y `apply_clicks`, nunca leer.
- Los reportes se hacen desde el panel de Supabase, no desde la app.

## 📦 Deploy

Vercel despliega automáticamente cada push a `main`. Variables requeridas en Vercel:
`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

## ⚙️ Editar productos

- Tarjetas: `config/cards.json`
- Créditos: `config/creditProducts.json`
- Preguntas: `config/questions.json`
- Tasa de usura del mes: `config/usuryRates.json` (actualizar el primer día hábil de cada mes)

### Lector automático

`scripts/refresh-products.mjs` verifica los productos en el sitio oficial de cada entidad con Claude (`claude-opus-5-5`, búsqueda web limitada al dominio oficial). Solo aplica un dato si trae la frase de evidencia y una URL del dominio oficial; lo que no encuentra queda para revisión manual. Corre los lunes en GitHub Actions y abre un PR con los cambios para aprobar.

```bash
ANTHROPIC_API_KEY=... node scripts/refresh-products.mjs --limit 3 --dry-run   # simulación con 3 productos
```

Requiere la clave de API como secreto en GitHub (`BANQUEANDO` o `ANTHROPIC_API_KEY`) (Settings → Secrets and variables → Actions).

Cada producto lleva `entity`, `active`, `source` (de dónde sale el dato), `lastVerified` (fecha en que se comprobó) y `usuryModality`. Un producto con datos dudosos se marca `active: false` con el motivo en `source.notes`: no se borra.

---

Hecho con 💜 para Colombia
