# App Flutter — Arquitectura monolítica por capas (Datos / Dominio / Presentación)

Esta aplicación Flutter sigue una arquitectura **monolítica en tres capas**:
- **Datos (Data):** acceso a red/almacenamiento, DTOs, mapeos.
- **Dominio (Domain):** entidades de negocio y casos de uso.
- **Presentación (Presentation):** UI, estado y navegación.

La app consume el backend en producción alojado en Railway:
> **BASE_URL (prod):** `https://appquesalebackend-production.up.railway.app`


# **Comandos principales — App Flutter**

## **1. Instalación de dependencias**

Instala las dependencias declaradas en `pubspec.yaml`:

```bash
flutter pub get
```

Si deseas limpiar y reinstalar dependencias (en caso de errores):

```bash
flutter clean
flutter pub get
```

Ejecuta la app en modo debug (por defecto):
```bash
flutter run
```
