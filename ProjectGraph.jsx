// ProjectGraph.jsx — centralized object graph (full entity model)

window.GRAPH = {

  /* ── Projects ───────────────────────────────────────────────────────────── */
  projects: {
    'elou-6':   { id: 'elou-6',   name: 'ЭЛОУ-АВТ-6',       status: 'warn',     progress: 67 },
    'gpz-2':    { id: 'gpz-2',    name: 'ГПЗ-2',             status: 'ok',       progress: 42 },
    'ust-luga': { id: 'ust-luga', name: 'Усть-Луга',          status: 'ok',       progress: 88 },
    'vankor':   { id: 'vankor',   name: 'Ванкор',             status: 'warn',     progress: 55 },
    'kstovo':   { id: 'kstovo',   name: 'Кстово',             status: 'crit',     progress: 23 },
    'astra':    { id: 'astra',    name: 'Астра',              status: 'inactive', progress: 95 },
  },

  /* ── Systems ────────────────────────────────────────────────────────────── */
  systems: {
    'SYS-ATM':  { id: 'SYS-ATM',  name: 'Атм. перегонка',  projectId: 'elou-6' },
    'SYS-PUMP': { id: 'SYS-PUMP', name: 'Насосная группа', projectId: 'elou-6' },
  },

  /* ── Assets ─────────────────────────────────────────────────────────────── */
  assets: {
    'V-1208':   { id: 'V-1208',   type: 'Колонна разделения', discipline: 'Технология', systemId: 'SYS-ATM',  projectId: 'elou-6', location: 'LOC-SEC4', status: 'warn', sensors: ['TI-1208-01', 'PI-1208-02'] },
    'E-4401':   { id: 'E-4401',   type: 'Теплообменник',      discipline: 'Технология', systemId: 'SYS-ATM',  projectId: 'elou-6', location: 'LOC-SEC4', status: 'crit', sensors: ['PI-4401-01'] },
    'P-2340-A': { id: 'P-2340-A', type: 'Насос центробежный', discipline: 'Технология', systemId: 'SYS-PUMP', projectId: 'elou-6', location: 'LOC-SEC2', status: 'ok',   sensors: ['PI-2340-A', 'TI-2340-A'] },
    'P-2340-B': { id: 'P-2340-B', type: 'Насос центробежный', discipline: 'Технология', systemId: 'SYS-PUMP', projectId: 'elou-6', location: 'LOC-SEC2', status: 'ok',   sensors: ['PI-2340-B', 'TI-2340-B'] },
  },

  /* ── Sensors ────────────────────────────────────────────────────────────── */
  sensors: {
    'TI-1208-01': { id: 'TI-1208-01', asset: 'V-1208',   type: 'TI', value: 342.0, unit: '°C',  threshold: 335,  status: 'warn' },
    'PI-1208-02': { id: 'PI-1208-02', asset: 'V-1208',   type: 'PI', value: 0.842, unit: 'МПа', threshold: 0.90, status: 'ok'   },
    'PI-4401-01': { id: 'PI-4401-01', asset: 'E-4401',   type: 'PI', value: 2.4,   unit: 'МПа', threshold: 2.1,  status: 'crit' },
    'PI-2340-A':  { id: 'PI-2340-A',  asset: 'P-2340-A', type: 'PI', value: 3.247, unit: 'МПа', threshold: 4.0,  status: 'ok'   },
    'TI-2340-A':  { id: 'TI-2340-A',  asset: 'P-2340-A', type: 'TI', value: 187.4, unit: '°C',  threshold: 200,  status: 'ok'   },
    'PI-2340-B':  { id: 'PI-2340-B',  asset: 'P-2340-B', type: 'PI', value: 3.251, unit: 'МПа', threshold: 4.0,  status: 'ok'   },
    'TI-2340-B':  { id: 'TI-2340-B',  asset: 'P-2340-B', type: 'TI', value: 188.1, unit: '°C',  threshold: 200,  status: 'ok'   },
  },

  /* ── Contractors ────────────────────────────────────────────────────────── */
  contractors: {
    'su17':  { id: 'su17',  name: 'СУ-17',          status: 'active',   projects: ['elou-6', 'kstovo', 'vankor'] },
    'pkb3':  { id: 'pkb3',  name: 'ПКБ-3',          status: 'active',   projects: ['elou-6', 'gpz-2'] },
    'bim':   { id: 'bim',   name: 'БИМ Инжиниринг', status: 'active',   projects: ['elou-6', 'ust-luga', 'vankor', 'astra'] },
    'otk':   { id: 'otk',   name: 'ОТК Надзор',     status: 'active',   projects: ['elou-6', 'kstovo', 'ust-luga', 'gpz-2', 'vankor'] },
    'sup12': { id: 'sup12', name: 'СУП-12',          status: 'inactive', projects: ['astra'] },
  },

  /* ── Brigades ───────────────────────────────────────────────────────────── */
  brigades: {
    'br-1': { id: 'br-1', name: 'Монтаж №1',         foremanId: 'f1', contractorId: 'su17',  projectId: 'elou-6' },
    'br-2': { id: 'br-2', name: 'Электромонтаж №3',   foremanId: 'f2', contractorId: null,    projectId: 'elou-6' },
    'br-3': { id: 'br-3', name: 'КИПиА №2',           foremanId: 'f3', contractorId: null,    projectId: 'elou-6' },
    'br-4': { id: 'br-4', name: 'Изоляция №1',        foremanId: 'f4', contractorId: null,    projectId: 'elou-6' },
    'br-5': { id: 'br-5', name: 'Сварка №2',          foremanId: 'f5', contractorId: 'su17',  projectId: 'elou-6' },
    'br-6': { id: 'br-6', name: 'Монтаж конструкций', foremanId: 'f6', contractorId: 'sup12', projectId: 'elou-6' },
    'br-7': { id: 'br-7', name: 'Технадзор ОТК',      foremanId: 'f7', contractorId: 'otk',   projectId: 'elou-6' },
    'br-8': { id: 'br-8', name: 'Испытания труб.',    foremanId: 'f8', contractorId: 'su17',  projectId: 'elou-6' },
    'br-9': { id: 'br-9', name: 'Фундамент №1',       foremanId: 'f9', contractorId: 'sup12', projectId: 'elou-6' },
  },

  /* ── Persons ────────────────────────────────────────────────────────────── */
  persons: {
    'f1': { id: 'f1', name: 'Захаров Н.А.',  role: 'Прораб',           brigadeId: 'br-1', contractorId: 'su17'  },
    'f2': { id: 'f2', name: 'Орлов В.С.',    role: 'Прораб',           brigadeId: 'br-2', contractorId: null    },
    'f3': { id: 'f3', name: 'Новиков Д.К.',  role: 'Прораб',           brigadeId: 'br-3', contractorId: null    },
    'f4': { id: 'f4', name: 'Волков А.Т.',   role: 'Прораб',           brigadeId: 'br-4', contractorId: null    },
    'f5': { id: 'f5', name: 'Рыбаков И.Н.', role: 'Прораб',           brigadeId: 'br-5', contractorId: 'su17'  },
    'f6': { id: 'f6', name: 'Лебедев В.О.',  role: 'Прораб',           brigadeId: 'br-6', contractorId: 'sup12' },
    'f7': { id: 'f7', name: 'Миронова С.К.', role: 'Инспектор ОТК',   brigadeId: 'br-7', contractorId: 'otk'   },
    'f8': { id: 'f8', name: 'Прохоров В.Л.', role: 'Прораб',           brigadeId: 'br-8', contractorId: 'su17'  },
    'f9': { id: 'f9', name: 'Громов А.И.',   role: 'Прораб',           brigadeId: 'br-9', contractorId: 'sup12' },
    'u1': { id: 'u1', name: 'Соколова М.А.', role: 'ГИП',              brigadeId: null,   projectId: 'elou-6'   },
    'u2': { id: 'u2', name: 'Кузнецов В.Е.', role: 'Куратор договоров', brigadeId: null,  projectId: 'elou-6'   },
    'u3': { id: 'u3', name: 'Фёдоров А.К.',  role: 'ПТО',              brigadeId: null,   projectId: 'elou-6'   },
  },

  /* ── Phases ─────────────────────────────────────────────────────────────── */
  phases: {
    'PH-PIR': { id: 'PH-PIR', name: 'ПИР',                status: 'done',    progress: 100, projectId: 'elou-6', order: 1 },
    'PH-OIM': { id: 'PH-OIM', name: 'Оборудование и МТР', status: 'done',    progress: 100, projectId: 'elou-6', order: 2 },
    'PH-SMR': { id: 'PH-SMR', name: 'СМР',                status: 'active',  progress: 67,  projectId: 'elou-6', order: 3 },
    'PH-PNR': { id: 'PH-PNR', name: 'ПНР',                status: 'pending', progress: 0,   projectId: 'elou-6', order: 4 },
    'PH-SDA': { id: 'PH-SDA', name: 'Сдача объекта',      status: 'pending', progress: 0,   projectId: 'elou-6', order: 5 },
  },

  /* ── Budget lines ───────────────────────────────────────────────────────── */
  budgetLines: {
    'BL-SMR': { id: 'BL-SMR', name: 'СМР',              planned: 11200, actual: 7504, phaseId: 'PH-SMR', projectId: 'elou-6' },
    'BL-OIM': { id: 'BL-OIM', name: 'Оборудование/МТР', planned: 7400,  actual: 5920, phaseId: 'PH-OIM', projectId: 'elou-6' },
    'BL-PIR': { id: 'BL-PIR', name: 'ПИР',              planned: 2800,  actual: 2660, phaseId: 'PH-PIR', projectId: 'elou-6' },
    'BL-PNR': { id: 'BL-PNR', name: 'ПНР',              planned: 1600,  actual: 480,  phaseId: 'PH-PNR', projectId: 'elou-6' },
    'BL-UP':  { id: 'BL-UP',  name: 'УП',               planned: 992,   actual: 664,  phaseId: null,      projectId: 'elou-6' },
    'BL-RES': { id: 'BL-RES', name: 'Резерв',           planned: 808,   actual: 0,    phaseId: null,      projectId: 'elou-6' },
  },

  /* ── Documents ──────────────────────────────────────────────────────────── */
  documents: {
    'DOC-001': { id: 'DOC-001', name: 'Паспорт E-4401',     type: 'Паспорт',    projectId: 'elou-6', assetId: 'E-4401', phaseId: null,     status: 'approved' },
    'DOC-002': { id: 'DOC-002', name: 'Исп. схема V-1208',  type: 'Исп. схема', projectId: 'elou-6', assetId: 'V-1208', phaseId: null,     status: 'draft'    },
    'DOC-003': { id: 'DOC-003', name: 'ПИР. Технол. часть', type: 'Проект',     projectId: 'elou-6', assetId: null,     phaseId: 'PH-PIR', status: 'approved' },
    'DOC-004': { id: 'DOC-004', name: 'Акт скрытых работ',  type: 'Акт',        projectId: 'elou-6', assetId: null,     phaseId: 'PH-SMR', status: 'approved' },
    'DOC-005': { id: 'DOC-005', name: 'Разрешение огневые', type: 'Разрешение', projectId: 'kstovo', assetId: null,     phaseId: null,     status: 'expired'  },
  },

  /* ── Event cross-links ──────────────────────────────────────────────────── */
  eventLinks: {
    1: { assetId: 'V-1208',   sensorId: 'TI-1208-01', linkedTaskId: 'TSK-009', projectId: 'elou-6' },
    5: { assetId: 'P-2340-A', sensorId: null,          linkedTaskId: null,       projectId: 'elou-6' },
    7: { assetId: 'V-1208',   sensorId: 'PI-1208-02',  linkedTaskId: null,       projectId: 'elou-6' },
  },

  /* ── Task cross-links ───────────────────────────────────────────────────── */
  taskLinks: {
    'TSK-001': { projectId: 'elou-6', assetId: null,       brigadeId: 'br-3', assigneeId: 'f3', contractorId: null,    sourceEventId: null },
    'TSK-002': { projectId: 'elou-6', assetId: 'E-4401',   brigadeId: 'br-1', assigneeId: 'f1', contractorId: 'su17',  sourceEventId: null },
    'TSK-003': { projectId: 'elou-6', assetId: 'P-2340-B', brigadeId: 'br-3', assigneeId: 'f3', contractorId: null,    sourceEventId: null },
    'TSK-004': { projectId: 'elou-6', assetId: null,       brigadeId: 'br-4', assigneeId: 'f4', contractorId: null,    sourceEventId: null },
    'TSK-005': { projectId: 'elou-6', assetId: null,       brigadeId: 'br-6', assigneeId: 'f6', contractorId: 'sup12', sourceEventId: null },
    'TSK-006': { projectId: 'elou-6', assetId: null,       brigadeId: 'br-5', assigneeId: 'f5', contractorId: 'su17',  sourceEventId: null },
    'TSK-007': { projectId: 'elou-6', assetId: null,       brigadeId: 'br-2', assigneeId: 'f2', contractorId: null,    sourceEventId: null },
    'TSK-008': { projectId: 'elou-6', assetId: null,       brigadeId: 'br-7', assigneeId: 'f7', contractorId: 'otk',   sourceEventId: null },
    'TSK-009': { projectId: 'elou-6', assetId: 'V-1208',   brigadeId: 'br-1', assigneeId: 'f1', contractorId: 'su17',  sourceEventId: 1    },
  },

  /* ── Helpers ────────────────────────────────────────────────────────────── */
  getAssetSensor(assetId, type) {
    return Object.values(this.sensors).find(s => s.asset === assetId && s.type === type) || null;
  },
  getAssetTasks(assetId) {
    return Object.keys(this.taskLinks).filter(id => this.taskLinks[id].assetId === assetId);
  },
  getAssetEvents(assetId) {
    return Object.keys(this.eventLinks).filter(id => this.eventLinks[id].assetId === assetId).map(Number);
  },
  getAssetWorstSensorStatus(assetId) {
    const ord = { crit: 2, warn: 1, ok: 0 };
    return Object.values(this.sensors)
      .filter(s => s.asset === assetId)
      .reduce((worst, s) => (ord[s.status] || 0) > (ord[worst] || 0) ? s.status : worst, 'ok');
  },
};
