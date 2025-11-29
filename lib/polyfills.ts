/**
 * Polyfills para compatibilidad con navegadores moviles
 * crypto.randomUUID requiere HTTPS, este polyfill lo soluciona
 */

export function initPolyfills() {
  if (typeof window !== 'undefined') {
    // Polyfill para crypto.randomUUID en contextos no seguros (HTTP)
    if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
      // @ts-expect-error - añadiendo polyfill
      crypto.randomUUID = function randomUUID() {
        return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: string) =>
          (
            Number(c) ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
          ).toString(16)
        );
      };
    }
  }
}
