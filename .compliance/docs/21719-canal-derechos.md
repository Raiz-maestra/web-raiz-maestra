# Canal de ejercicio de derechos — Raíz Maestra

> Art. 14 ter: el responsable debe ofrecer un medio para que el titular ejerza sus derechos. Este
> documento tiene (1) el texto público (ya usado en `/privacidad` y `/terminos`) y (2) el
> procedimiento interno con los plazos correctos.

## 1. Texto público ("Tus derechos", en la web)
> Como titular de tus datos puedes ejercer estos derechos: **acceso, rectificación, supresión,
> oposición, portabilidad y bloqueo**. Escríbenos a **appraizmaestra@gmail.com**. Responderemos
> dentro de los plazos legales y sin costo en los casos que la ley establece.

## 2. Procedimiento interno (plazos verificados contra la ley)
1. **Recepción:** quien reciba el correo en `appraizmaestra@gmail.com` registra la solicitud (titular,
   derecho pedido, fecha) en una bitácora simple (hoja de cálculo o issue tracker interno) y verifica
   la identidad del solicitante (ej. confirmar desde el correo asociado a la cuenta).
2. **Plazo de respuesta: 30 días corridos**, prorrogable **una sola vez hasta por 30 días corridos**
   más, avisando al titular (Art. 11).
3. **Gratuidad:** rectificación, supresión y oposición son **siempre gratuitas**. El **acceso** es
   gratuito **al menos una vez por trimestre**; se puede cobrar un costo razonable solo si el titular
   pide acceso o portabilidad más de una vez en el mismo trimestre.
4. **Ejecución por derecho (según el modelo de datos de `supabase/schema.sql`):**
   - Acceso → exportar la fila de `profiles` del usuario y un resumen de sus tablas relacionadas
     (`materials`, `channel_messages`, `mentorship_messages`, `support_requests`, `mood_entries`).
   - Portabilidad → entregar lo anterior en JSON.
   - Rectificación → editar `profiles` directamente (o guiar al usuario a hacerlo desde su perfil).
   - Supresión → eliminar o anonimizar `profiles` y datos asociados (no basta un soft-delete si el
     titular pide borrado real; revisar qué tablas usan `hidden_at`/soft-delete en vez de DELETE).
   - Oposición → dejar de tratar ese dato para el fin objetado (ej. desactivar módulo de Autocuidado).
   - Bloqueo → suspender temporalmente la cuenta mientras se resuelve la solicitud.
5. **Cierre:** responde por escrito a `appraizmaestra@gmail.com` y guarda evidencia de la respuesta.

## 3. Si no puedes cumplir
Informa el motivo legal (ej. obligación de conservar cierto dato). El titular puede reclamar ante la
**Agencia de Protección de Datos**.

## Hallazgo de la auditoría — control `data-derechos`
`app-rurales` no tiene todavía un endpoint/flujo dedicado de exportación o borrado de cuenta en la app
(no se encontró en el repositorio de perfil ni pantallas de "Eliminar mi cuenta"). Mientras no exista,
este canal por correo **es** el mecanismo válido — pero conviene automatizarlo antes de escalar
usuarios, y es **obligatorio para Play Store/App Store** contar con una vía de eliminación de cuenta
visible (ver `store-data-safety.md`).

---
*Borrador generado con compliance-cl (pack ley-21719). No constituye asesoría legal; revisar con un abogado.*
