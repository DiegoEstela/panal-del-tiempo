// Cantidad de miembros (sin contar a quien lo creó) que tienen que validar
// un recuerdo para que pase a la línea de tiempo. No hace falta que sean
// los 3: alcanza con que 2 lo aprueben, porque no siempre van a estar los
// 4 disponibles al mismo tiempo.
export const VALIDATION_QUORUM = 2;

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const CURRENT_YEAR = new Date().getFullYear();
export const EARLIEST_YEAR = CURRENT_YEAR - 30;

export const IDENTITY_STORAGE_KEY = 'panal-identity';
export const ACCESSIBILITY_STORAGE_KEY = 'panal-accessibility';
export const LOCAL_EVENTS_STORAGE_KEY = 'panal-events';
