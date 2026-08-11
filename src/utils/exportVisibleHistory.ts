import { IHistory } from '../interfaces';
import { dateUtils } from './dateUtils';

const escapeXml = (value: string) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const formatCellDate = (iso: string) => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso || '';
    const { getFormatDay, getFormatMonth, getExtenseHour } = dateUtils();
    return `${getFormatDay(d)}/${getFormatMonth(d)}/${d.getFullYear()} ${getExtenseHour(d)}`;
  } catch {
    return iso || '';
  }
};

const statusLabel = (row: IHistory) => {
  if (Array.isArray(row.items) && row.items.length > 0) {
    const allDone = row.items.every(i => i.performed);
    const noneDone = row.items.every(i => !i.performed);
    if (allDone) return 'Concluído';
    if (noneDone) return 'Não realizado';
    return 'Parcial';
  }
  return row.status ? 'Concluído' : 'Pendente';
};

/**
 * Exporta exatamente as linhas visíveis na tela (Excel XML compatível).
 */
export const downloadVisibleHistoryExcel = (
  rows: IHistory[],
  filenamePrefix = 'history',
) => {
  const headers = [
    'Área',
    'Funcionário',
    'Início',
    'Conclusão',
    'Duração',
    'Status',
  ];

  const bodyRows = rows.map(row => {
    const durationRaw = String(row.duration || '');
    const duration =
      Number(durationRaw.replace(':', '').split('.')[0]) < 0
        ? '0'
        : durationRaw.split('.')[0].replace('-', '');

    return [
      row.department || '',
      `${row.employeeName || ''} ${row.employeeLastName || ''}`.trim(),
      formatCellDate(row.dateStart),
      formatCellDate(row.dateEnd),
      duration,
      statusLabel(row),
    ];
  });

  const sheetRows = [headers, ...bodyRows]
    .map(
      cells =>
        `<Row>${cells
          .map(
            c =>
              `<Cell><Data ss:Type="String">${escapeXml(c)}</Data></Cell>`,
          )
          .join('')}</Row>`,
    )
    .join('');

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Historico">
  <Table>${sheetRows}</Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute(
    'download',
    `${new Date().toISOString().split('T')[0]}_${filenamePrefix}.xls`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
