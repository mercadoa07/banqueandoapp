# 🏦 Banqueando

Comparador inteligente de tarjetas de crédito para Colombia.

## 🚀 Cómo funciona

1. El usuario responde un quiz sobre su perfil financiero
2. El algoritmo de matching calcula compatibilidad con cada tarjeta
3. Se muestran las mejores opciones personalizadas

## 📁 Estructura del proyecto

```
banqueandoapp/
├── config/                    # ⚙️ ARCHIVOS EDITABLES
│   ├── cards.json            # Base de datos de tarjetas
│   ├── matchingConfig.json   # Pesos y reglas del algoritmo
│   └── questions.json        # Preguntas del quiz
├── src/
│   ├── engine/
│   │   └── matchingEngine.js # Lógica del algoritmo
│   ├── App.jsx               # Componente principal
│   ├── main.jsx              # Entry point
│   └── index.css             # Estilos
├── public/
│   └── favicon.svg
└── package.json
```

## ⚙️ Cómo editar

### Agregar una tarjeta nueva
Edita `config/cards.json` y agrega un objeto con la estructura:

```json
{
  "id": "nueva_tarjeta",
  "name": "Nombre Tarjeta",
  "bank": "Banco X",
  ...
}
```

### Cambiar pesos del algoritmo
Edita `config/matchingConfig.json`:

```json
{
  "weights": {
    "paymentBehavior": 20,  // Importancia del comportamiento de pago
    "feeSensitivity": 15,   // Importancia de la sensibilidad a cuotas
    ...
  }
}
```

### Agregar/modificar preguntas
Edita `config/questions.json`

## 🛠️ Desarrollo local

```bash
npm install
npm run dev
```

## 📦 Deploy

El proyecto está configurado para deploy automático en Vercel.

Cada push a `main` despliega automáticamente.

## 📊 Base de datos actual

- Nu (Classic y Control)
- RappiCard
- BBVA (Aqua y Coral)
- Falabella CMR
- Bancolombia
- Davivienda
- Scotiabank LifeMiles

---

Hecho con 💜 para Colombia
