# El Panal del Tiempo 🐝

La línea de tiempo de la historia de Diego, Julian, Lucas y Lautaro. React + Vite +
TypeScript, sin backend propio: los datos se guardan en modo local (demo) o,
si activás Firebase, se sincronizan entre los dispositivos de los 4.

## Desarrollo local

```bash
npm install
npm run dev
```

La app arranca directamente en **modo demo**: guarda todo en `localStorage`
de tu navegador. Sirve para probar toda la funcionalidad (crear recuerdos,
validar, marcar para revisar, etc.) sin necesitar nada más. Si abrís dos
pestañas del mismo navegador, se sincronizan entre sí (simulando a 2
"amigos" distintos).

## Activar sincronización real con Firebase (recomendado para usar entre los 4)

1. Andá a [Firebase Console](https://console.firebase.google.com/) y creá un
   proyecto nuevo (gratis).
2. Dentro del proyecto, agregá una app web (ícono `</>`) y copiá el objeto
   de configuración que te da (`apiKey`, `projectId`, etc.).
3. En el menú lateral, andá a **Compilación > Firestore Database** y creá
   la base de datos (modo producción está bien).
4. En la pestaña **Reglas** de Firestore, pegá el contenido de
   [`firestore.rules`](./firestore.rules) de este repo y publicá.
5. En la raíz del proyecto, copiá `.env.example` como `.env.local` y
   completá las 6 variables con los datos del paso 2:

```bash
cp .env.example .env.local
```

6. Reiniciá `npm run dev`. La app detecta automáticamente que hay
   configuración de Firebase y empieza a usarla en vez del modo local.

> Nota: no hay login con usuario/contraseña. Al no ser datos sensibles y
> ser un grupo cerrado de 4 amigos, la identidad se elige una sola vez
> desde el cartel de bienvenida y queda guardada en el dispositivo.

## Instalarla como app (PWA)

Es instalable: en el navegador (Chrome/Edge en desktop o Android, Safari en
iOS con "Agregar a inicio") aparece la opción de instalar "El Panal del
Tiempo" como si fuera una app nativa, con su propio ícono. Esto solo
funciona en HTTPS, así que probalo sobre la URL de Vercel, no en local.

## Build y deploy

```bash
npm run build
```

Genera la carpeta `dist/` lista para deployar como sitio estático. Para
Vercel: importá el repo desde [vercel.com/new](https://vercel.com/new),
detecta Vite automáticamente — solo asegurate de cargar las mismas 6
variables `VITE_FIREBASE_*` en **Project Settings > Environment Variables**
si querés que el deploy use Firebase en vez del modo local.

## Estructura del proyecto

```
src/
  components/
    atoms/        Button, TextField, Avatar, HexTile...
    molecules/     FormField, EventCard, PendingEventCard, Modal, DateFinder, ConfirmDialog...
    organisms/     WelcomeModal, EventForm, TimelineList, OnThisDay, AssistedTimeline, AssistedModeButton...
    templates/     MainLayout
  pages/          HomeView, TimelineView, PendingView
  context/        IdentityContext, AccessibilityContext, EventsContext
  hooks/          useIdentity, useAccessibility, useEvents, useSpeech
  services/
    repository/    EventsRepository (interfaz) + implementación local y Firestore
    firebase/       cliente de Firebase
  constants/      members.ts, copy.ts, config.ts
  types/          member.ts, event.ts
  utils/          date.ts, validation.ts, id.ts, image.ts, speechText.ts
  styles/         tokens.css (colores/tipografía/espaciado/gradientes/sombras), reset.css, global.css
```

Organización por **atomic design** (atoms → molecules → organisms →
templates) y por **módulos** (cada capa técnica en su carpeta: contexto,
hooks, servicios). Los colores, textos y valores repetidos viven en
`constants/` y `styles/tokens.css`, nunca hardcodeados en los componentes.

## Versión 2 (pendiente, no implementada todavía)

- Subir foto de perfil y cambiar el nombre de cada miembro.

El modelo de datos (`types/member.ts`) ya tiene los campos opcionales
(`photoURL`, etc.) previstos para que sumar esto sea chico.
