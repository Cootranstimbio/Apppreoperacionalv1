import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'Administrador' | 'Programador' | 'Mantenimiento' | 'Operador Isla';

export interface User {
  id: string;
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  rol: Role;
  password: string;
}

export interface Conductor {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  licenciaVencimiento: string;
}

export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  tipo: string;
  soatVencimiento: string;
  rtmVencimiento: string;
  toVencimiento: string;
  polizaRccVencimiento: string;
  polizaRceVencimiento: string;
}

export interface CheckItem {
  id: string;
  nombre: string;
  modulo: string;
  criterio: string;
  islero: boolean;
}

export interface ReporteItem {
  itemId: string;
  estado: 'bien' | 'regular' | 'mal' | null;
  observacion: string;
  adjuntos: { name: string; url: string; type: string }[];
}

export interface Reporte {
  id: string;
  fecha: string;
  vehiculo: Vehiculo;
  conductor: Conductor;
  inspector: User;
  tipo: 'Mantenimiento' | 'Planillaje';
  items: ReporteItem[];
  documentosGenerales?: { name: string; url: string; type: string }[];
  firmaInspector?: string;
  firmaConductor?: string;
  documentacionVencida?: boolean;
  motivoBloqueo?: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  conductores: Conductor[];
  setConductores: (conductores: Conductor[]) => void;
  vehiculos: Vehiculo[];
  setVehiculos: (vehiculos: Vehiculo[]) => void;
  checkItems: CheckItem[];
  setCheckItems: (items: CheckItem[]) => void;
  reportes: Reporte[];
  setReportes: (reportes: Reporte[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Datos de ejemplo
const initialUsers: User[] = [
  {
    id: '1',
    nombre: 'Carlos Administrador',
    cedula: '1001001001',
    email: 'admin@transtimbio.com',
    telefono: '3001234567',
    rol: 'Administrador',
    password: 'admin123'
  },
  {
    id: '2',
    nombre: 'María Programadora',
    cedula: '1002002002',
    email: 'programador@transtimbio.com',
    telefono: '3002345678',
    rol: 'Programador',
    password: 'prog123'
  },
  {
    id: '3',
    nombre: 'Juan Mecánico',
    cedula: '1003003003',
    email: 'mecanico@transtimbio.com',
    telefono: '3003456789',
    rol: 'Mantenimiento',
    password: 'mec123'
  },
  {
    id: '4',
    nombre: 'Pedro Islero',
    cedula: '1004004004',
    email: 'islero@transtimbio.com',
    telefono: '3004567890',
    rol: 'Operador Isla',
    password: 'isla123'
  }
];

const initialConductores: Conductor[] = [
  {
    id: 'c1',
    nombre: 'Roberto Pérez',
    cedula: '80123456',
    telefono: '3101234567',
    email: 'roberto@example.com',
    licenciaVencimiento: '2028-06-15'
  },
  {
    id: 'c2',
    nombre: 'Ana García',
    cedula: '52987654',
    telefono: '3112345678',
    email: 'ana@example.com',
    licenciaVencimiento: '2028-09-20'
  },
  {
    id: 'c3',
    nombre: 'Luis Martínez',
    cedula: '79456123',
    telefono: '3123456789',
    email: 'luis@example.com',
    licenciaVencimiento: '2026-01-10'
  },
  {
    id: 'c4',
    nombre: 'Carmen Torres',
    cedula: '41789456',
    telefono: '3134567890',
    email: 'carmen@example.com',
    licenciaVencimiento: '2024-11-30'
  }
];

const initialVehiculos: Vehiculo[] = [
  {
    id: 'v1',
    placa: 'ABC123',
    marca: 'Chevrolet',
    modelo: 'NPR',
    tipo: 'Camión',
    soatVencimiento: '2028-03-15',
    rtmVencimiento: '2028-04-20',
    toVencimiento: '2028-05-10',
    polizaRccVencimiento: '2028-03-15',
    polizaRceVencimiento: '2028-03-15'
  },
  {
    id: 'v2',
    placa: 'XYZ789',
    marca: 'Mercedes Benz',
    modelo: 'Sprinter',
    tipo: 'Van',
    soatVencimiento: '2028-07-22',
    rtmVencimiento: '2028-08-15',
    toVencimiento: '2028-06-30',
    polizaRccVencimiento: '2028-07-22',
    polizaRceVencimiento: '2028-07-22'
  },
  {
    id: 'v3',
    placa: 'DEF456',
    marca: 'Hino',
    modelo: 'FC',
    tipo: 'Camión',
    soatVencimiento: '2026-01-05',
    rtmVencimiento: '2026-01-12',
    toVencimiento: '2025-12-28',
    polizaRccVencimiento: '2026-01-05',
    polizaRceVencimiento: '2026-01-05'
  },
  {
    id: 'v4',
    placa: 'GHI789',
    marca: 'Isuzu',
    modelo: 'NQR',
    tipo: 'Camión',
    soatVencimiento: '2024-10-15',
    rtmVencimiento: '2024-09-20',
    toVencimiento: '2024-11-05',
    polizaRccVencimiento: '2024-10-15',
    polizaRceVencimiento: '2024-10-15'
  }
];

const initialCheckItems: CheckItem[] = [
  // Módulo 5.1
  { id: 'i1', nombre: 'Limpieza General Externa (Carrocería)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Estado óptimo de limpieza del vehículo.', islero: true },
  { id: 'i2', nombre: 'Placas de Matrícula (Legibilidad)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Placas visibles y legibles, sin obstrucciones.', islero: true },
  { id: 'i3', nombre: 'Emblemas y Logotipos TRANSTIMBIO (Integridad)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Logotipos e identificación completos.', islero: true },
  { id: 'i4', nombre: 'Vidrio Retrovisor exterior IZQ (Limpieza)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Vidrio reflectante limpio.', islero: true },
  { id: 'i5', nombre: 'Vidrio Retrovisor exterior IZQ (Sin Fisuras)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Vidrio reflectante sin grietas ni fisuras.', islero: true },
  { id: 'i6', nombre: 'Carcasa Retrovisor IZQ (Estado Físico)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Carcasa íntegra, sin roturas graves.', islero: true },
  { id: 'i7', nombre: 'Soporte Retrovisor IZQ (Firmeza)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Soporte fijo y firme, sin juego.', islero: true },
  { id: 'i8', nombre: 'Mecanismo de Ajuste Retrovisor IZQ (Funcionalidad)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Funcionamiento correcto del ajuste.', islero: true },
  { id: 'i9', nombre: 'Vidrio Retrovisor exterior DER (Limpieza)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Vidrio reflectante limpio.', islero: true },
  { id: 'i10', nombre: 'Vidrio Retrovisor exterior DER (Sin Fisuras)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Vidrio reflectante sin grietas ni fisuras.', islero: true },
  { id: 'i11', nombre: 'Carcasa Retrovisor DER (Estado Físico)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Carcasa íntegra, sin roturas graves.', islero: true },
  { id: 'i12', nombre: 'Soporte Retrovisor DER (Firmeza)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Soporte fijo y firme, sin juego.', islero: true },
  { id: 'i13', nombre: 'Mecanismo de Ajuste Retrovisor DER (Funcionalidad)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Funcionamiento correcto del ajuste.', islero: false },
  { id: 'i14', nombre: 'Carrocería General (Ausencia de Golpes Graves)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Ausencia de golpes que comprometan estructura.', islero: true },
  { id: 'i15', nombre: 'Pintura y Latonería (Corrosión Estructural)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Ausencia de corrosión (óxido) grave.', islero: true },
  { id: 'i16', nombre: 'Puerta Delantera Conductor (Apertura y Cierre)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Apertura y cierre suave y completo.', islero: true },
  { id: 'i17', nombre: 'Puerta Delantera Conductor (Mecanismo de Seguro)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Mecanismo de seguro (pestillo) funcional.', islero: true },
  { id: 'i18', nombre: 'Puertas Traseras Pasajeros (Apertura y Cierre)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Apertura y cierre suave y completo.', islero: true },
  { id: 'i19', nombre: 'Puertas Traseras Pasajeros (Mecanismo de Seguro)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Mecanismo de seguro (pestillo) funcional.', islero: true },
  { id: 'i20', nombre: 'Panorámico Delantero (Limpieza)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Vidrio limpio, sin elementos que restrinjan la visión.', islero: true },
  { id: 'i21', nombre: 'Panorámico Delantero (Ausencia de Fisuras/Impactos)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Sin fisuras o impactos en la zona de barrido.', islero: true },
  { id: 'i22', nombre: 'Panorámico Trasero (Ausencia de Fisuras/Impactos)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Vidrio limpio, sin fisuras o impactos.', islero: true },
  { id: 'i23', nombre: 'Vidrios Laterales (Estado general)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Vidrios laterales en buen estado, sin daños.', islero: true },
  { id: 'i24', nombre: 'Mecanismos de Ventanas Laterales (Funcionalidad)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Mecanismos de accionamiento funcionales.', islero: true },
  { id: 'i25', nombre: 'Compartimentos de Bodegas (Cierre)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Correcto cierre de las compuertas de bodega.', islero: true },
  { id: 'i26', nombre: 'Compartimentos de Bodegas (Aseguramiento)', modulo: '5.1 - Parte Externa del Vehículo y Carrocería', criterio: 'Mecanismos de seguridad/pestillos de bodega funcionales.', islero: true },

  // Módulo 5.2
  { id: 'i27', nombre: 'Llantas Rodamiento (Nivel de Labrado)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Profundidad mínima de 1.6 mm en el dibujo.', islero: true },
  { id: 'i28', nombre: 'Llantas Rodamiento (Presencia de Cortes/Daños)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Ausencia de cortes profundos, grietas o protuberancias.', islero: true },
  { id: 'i29', nombre: 'Llantas Rodamiento (Presión de Inflado)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Presión correcta según especificación.', islero: false },
  { id: 'i30', nombre: 'Llanta de Repuesto (Presencia)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Llanta de repuesto presente.', islero: true },
  { id: 'i31', nombre: 'Llanta de Repuesto (Estado Utilizable)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Repuesto inflado y en estado utilizable.', islero: false },
  { id: 'i32', nombre: 'Luz Frontal - Cuartos (Funcionamiento)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Funcionamiento correcto de la luz de posición.', islero: true },
  { id: 'i33', nombre: 'Luz Frontal - Bajas (Funcionamiento)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Funcionamiento e intensidad adecuadas del haz bajo.', islero: true },
  { id: 'i34', nombre: 'Luz Frontal - Altas (Funcionamiento)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Funcionamiento e intensidad adecuadas del haz alto.', islero: true },
  { id: 'i35', nombre: 'Direccionales Delanteras (Funcionamiento)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Funcionamiento intermitente correcto.', islero: true },
  { id: 'i36', nombre: 'Direccionales Traseras (Funcionamiento)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Funcionamiento intermitente correcto.', islero: true },
  { id: 'i37', nombre: 'Stops (Principal)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Funcionamiento instantáneo de las luces de freno principales.', islero: true },
  { id: 'i38', nombre: 'Tercer Stop (Funcionamiento)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Funcionamiento de la luz de freno auxiliar.', islero: true },
  { id: 'i39', nombre: 'Luz de Retroceso (Funcionamiento)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Funcionamiento de la luz blanca al engranar la reversa.', islero: true },
  { id: 'i40', nombre: 'Exosto: Ausencia de Rupturas', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Sistema de escape sin rupturas o perforaciones.', islero: false },
  { id: 'i41', nombre: 'Exosto: Fijación y Soporte', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Sistema de escape firmemente sujeto al chasis.', islero: false },
  { id: 'i42', nombre: 'Mangueras y Tuberías de Frenos (Sin Fisuras)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Mangueras y tuberías sin fisuras o abultamientos.', islero: false },
  { id: 'i43', nombre: 'Tanques de Aire (Corrosión/Golpes)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Sin corrosión grave ni golpes (si aplica).', islero: false },
  { id: 'i44', nombre: 'Fuga de Líquido de Frenos', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: '¡CRÍTICO! Ausencia total de goteo.', islero: false },
  { id: 'i45', nombre: 'Fuga de Combustible', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: '¡CRÍTICO! Ausencia total de goteo o fuerte olor.', islero: false },
  { id: 'i46', nombre: 'Fuga de Aceite de Motor (Goteo Activo)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Ausencia de goteo activo.', islero: false },
  { id: 'i47', nombre: 'Fuga de Líquido Refrigerante (Goteo Activo)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Ausencia de goteo activo.', islero: false },
  { id: 'i48', nombre: 'Fuga de Líquido de Dirección (Goteo Activo)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Ausencia de goteo activo.', islero: false },
  { id: 'i49', nombre: 'Fuga de Aceite de Transmisión/Caja (Goteo Activo)', modulo: '5.2 - Llantas, Frenos, Luces y Fugas', criterio: 'Ausencia de goteo activo.', islero: false },

  // Módulo 5.3
  { id: 'i50', nombre: 'Nivel de Aceite del Motor (Rango Correcto)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Nivel entre la marca MIN y MAX.', islero: false },
  { id: 'i51', nombre: 'Nivel de Líquido Refrigerante (Rango Correcto)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Nivel entre la marca MIN y MAX.', islero: false },
  { id: 'i52', nombre: 'Nivel de Aceite Hidráulico (Rango Correcto)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Nivel entre la marca MIN y MAX.', islero: false },
  { id: 'i53', nombre: 'Nivel de Líquido de Frenos (Sobre el Mínimo)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Nivel SIEMPRE por encima de la marca MIN.', islero: false },
  { id: 'i54', nombre: 'Nivel de Agua del Limpiaparabrisas', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Nivel suficiente para su uso.', islero: false },
  { id: 'i55', nombre: 'Tapa de Llenado de Aceite (Asegurada)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Tapa del motor firmemente asegurada.', islero: true },
  { id: 'i56', nombre: 'Tapas de Depósitos (Aseguradas)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Tapas de todos los depósitos de fluidos aseguradas.', islero: true },
  { id: 'i57', nombre: 'Aislamiento de Alambrado Eléctrico (Integridad)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Aislamiento íntegro, sin cables pelados o quemados.', islero: false },
  { id: 'i58', nombre: 'Conexiones Eléctricas (Firmeza)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Conexiones limpias y firmes (sin juego).', islero: false },
  { id: 'i59', nombre: 'Tensión de Correas Auxiliares', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Tensión correcta.', islero: false },
  { id: 'i60', nombre: 'Estado Físico de Correas (Ausencia de Grietas)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Correas sin grietas profundas o deshilachados.', islero: false },
  { id: 'i61', nombre: 'Nivel de Electrolitos Batería (si aplica)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Nivel correcto de líquido en las celdas.', islero: false },
  { id: 'i62', nombre: 'Terminales de Batería (Limpieza/Ausencia de Sulfatación)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Bornes limpios, sin excesiva sulfatación.', islero: false },
  { id: 'i63', nombre: 'Terminales de Batería (Ajuste/Firmeza)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Terminales firmemente apretados a los bornes.', islero: false },
  { id: 'i64', nombre: 'Carcasa Filtro de Aire (Ajuste)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Carcasa del filtro bien ajustada y sellada.', islero: true },
  { id: 'i65', nombre: 'Filtro de Aceite (Ajuste y Fugas)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Firmemente apretado y sin fugas visibles en la base.', islero: false },
  { id: 'i66', nombre: 'Juego Libre del Volante (Holgura)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Movimiento muerto o juego libre mínimo.', islero: false },
  { id: 'i67', nombre: 'Componentes de Dirección (Daños Estructurales)', modulo: '5.3 - Compartimiento del Motor, Fluidos y Componentes', criterio: 'Inspección visual de caja de dirección/bomba sin daños.', islero: false },

  // Módulo 5.4
  { id: 'i68', nombre: 'Sistema de Encendido (Primer Intento)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'El motor debe encender al primer intento.', islero: true },
  { id: 'i69', nombre: 'Ruidos Anormales al Encender', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Motor arranca sin ruidos mecánicos fuertes.', islero: true },
  { id: 'i70', nombre: 'Velocímetro (Funcionalidad)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Aguja o lectura digital funcionando correctamente.', islero: true },
  { id: 'i71', nombre: 'Tacómetro (Funcionalidad)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Aguja o lectura digital funcionando correctamente.', islero: true },
  { id: 'i72', nombre: 'Indicador de Temperatura', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'El indicador debe moverse y no estar en zona roja.', islero: true },
  { id: 'i73', nombre: 'Indicadores de Luces Testigo (Apagado)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Las luces testigo deben apagarse una vez el motor está en marcha.', islero: true },
  { id: 'i74', nombre: 'Aseo Interior y Cabina (General)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Cabina, piso y asientos libres de basura.', islero: true },
  { id: 'i75', nombre: 'Luces Internas (Cabina/Salón)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Funcionamiento correcto de todas las luminarias internas.', islero: true },
  { id: 'i76', nombre: 'Estado Físico de Sillas', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Sillas íntegras, sin roturas graves.', islero: true },
  { id: 'i77', nombre: 'Estado Físico de Reposabrazos', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Reposabrazos presentes y en buen estado.', islero: true },
  { id: 'i78', nombre: 'Estado Físico de Piso y Techo', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Piso sin aberturas. Techo íntegro.', islero: true },
  { id: 'i79', nombre: 'Cinturón de Seguridad (Conductor - Estado Físico)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Cinturón sin desgarros.', islero: true },
  { id: 'i80', nombre: 'Cinturón de Seguridad (Conductor - Mecanismo)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Mecanismo retráctil y de cierre funcional.', islero: true },
  { id: 'i81', nombre: 'Cinturones de Seguridad (Pasajeros - Estado Físico)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Cinturones sin desgarros en todos los puestos.', islero: true },
  { id: 'i82', nombre: 'Cinturones de Seguridad (Pasajeros - Mecanismo)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Mecanismos de cierre funcionales en todos los puestos.', islero: true },
  { id: 'i83', nombre: 'Mecanismos de Salidas de Emergencia (Funcionalidad)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Mecanismos de apertura o quiebre funcionales.', islero: true },
  { id: 'i84', nombre: 'Obstrucciones de Salidas de Emergencia', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Salidas de emergencia libres de objetos.', islero: true },
  { id: 'i85', nombre: 'Martillo de Fragmentación (Presencia)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Martillo presente.', islero: true },
  { id: 'i86', nombre: 'Martillo de Fragmentación (Ubicación y Aseguramiento)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Visible, accesible y asegurado a su soporte.', islero: true },
  { id: 'i87', nombre: 'Gato y Llave de Expansión (Presencia)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Herramientas presentes.', islero: false },
  { id: 'i88', nombre: 'Gato y Llave de Expansión (Estado Funcional)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Herramientas en buen estado y funcionales.', islero: false },
  { id: 'i89', nombre: 'Cruceta (Presencia y Estado)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Presente y en buen estado.', islero: false },
  { id: 'i90', nombre: 'Señales de Carretera (Presencia de 2)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Dos triángulos o conos reflectivos presentes.', islero: true },
  { id: 'i91', nombre: 'Señales de Carretera (Estado Físico)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'En buen estado, reflectividad intacta.', islero: true },
  { id: 'i92', nombre: 'Linterna (Presencia y Funcionalidad)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Linterna presente y funcionando correctamente.', islero: true },
  { id: 'i93', nombre: 'Tacos de Seguridad (2 Tacos)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Dos tacos adecuados para el vehículo presentes.', islero: true },
  { id: 'i94', nombre: 'Extintor (Tipo/Capacidad)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Tipo y capacidad reglamentarios.', islero: true },
  { id: 'i95', nombre: 'Extintor (Ubicación/Aseguramiento)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Asegurado y accesible.', islero: true },
  { id: 'i96', nombre: 'Extintor (Vigencia/Sello)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Vigente y sello de seguridad intacto.', islero: true },
  { id: 'i97', nombre: 'Botiquín (Recipiente y Tapa)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Recipiente limpio, con tapa, y asegurado.', islero: true },
  { id: 'i98', nombre: 'Botiquín - Gasa Estéril (Presencia/Vigencia)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Gasa estéril presente y con vigencia.', islero: true },
  { id: 'i99', nombre: 'Botiquín - Esparadrapo (Presencia/Vigencia)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Esparadrapo presente y con vigencia.', islero: true },
  { id: 'i100', nombre: 'Botiquín - Vendas Elásticas (Presencia)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Vendas elásticas presentes.', islero: true },
  { id: 'i101', nombre: 'Botiquín - Antiséptico/Alcohol (Presencia/Vigencia)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Antiséptico o alcohol presente y vigente.', islero: true },
  { id: 'i102', nombre: 'Documentación Legal (SOAT PDF)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Confirmación de presencia del SOAT físico o pdf', islero: true },
  { id: 'i103', nombre: 'Documentación Legal (RTM PDF)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Confirmación de presencia de la RTM física o pdf', islero: true },
  { id: 'i104', nombre: 'Documentación Legal (Tarjeta de Operación PDF)', modulo: '5.4 - Interior del Vehículo y Seguridad Obligatoria', criterio: 'Confirmación de presencia de la Tarjeta de Operación o pdf', islero: true }
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [conductores, setConductores] = useState<Conductor[]>(initialConductores);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(initialVehiculos);
  const [checkItems, setCheckItems] = useState<CheckItem[]>(initialCheckItems);
  const [reportes, setReportes] = useState<Reporte[]>([]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        conductores,
        setConductores,
        vehiculos,
        setVehiculos,
        checkItems,
        setCheckItems,
        reportes,
        setReportes
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}