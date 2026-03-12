const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

// ═══════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════
const C = {
  dark:        '2D2D2D',
  green:       '96C15C',
  greenLight:  'F2FAE8',
  greenBdr:    'C2DD9A',
  greenDark:   '5A8A28',
  blue:        '0078D4',
  blueLight:   'EDF4FF',
  blueBdr:     'A8C4EC',
  blueText:    '2D6EC0',
  gray:        'F4F6FA',
  grayBdr:     'C5CFE0',
  grayText:    '6B7A8D',
  red:         'E05252',
  redLight:    'FFF0F0',
  purple:      '6040B0',
  purpleLight: 'F5F0FF',
  white:       'FFFFFF',
  arcBlue:     '0060B0',
  arcLight:    'E4F0FF',
};

const LOGO_PATH = path.resolve('logo-white-small.png');
const logoB64   = fs.readFileSync(LOGO_PATH).toString('base64');

// ═══════════════════════════════════════════
// PPTX
// ═══════════════════════════════════════════
function generatePPTX() {
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5"
  pres.author = 'au2mator';
  pres.title  = 'au2mator - Ideal Automation Architecture';

  const slide = pres.addSlide();

  // ── helpers ──
  function rr(x, y, w, h, fill, lineColor, lineW, accentColor) {
    slide.addShape(pres.ShapeType.roundRect, {
      x, y, w, h,
      fill: { color: fill || C.white },
      line: { color: lineColor || 'DDDDDD', width: lineW || 1 },
      rectRadius: 0.06,
    });
    if (accentColor) {
      slide.addShape(pres.ShapeType.rect, {
        x, y, w: 0.05, h,
        fill: { color: accentColor },
        line: { color: accentColor, width: 0 },
      });
    }
  }
  function rect(x, y, w, h, fill, lineColor, lineW) {
    slide.addShape(pres.ShapeType.rect, {
      x, y, w, h,
      fill: { color: fill || C.white },
      line: { color: lineColor || 'DDDDDD', width: lineW || 0 },
    });
  }
  function t(text, x, y, w, h, size, bold, color, align) {
    slide.addText(text, {
      x, y, w, h,
      fontSize: size || 9, bold: bold || false,
      color: color || C.dark, align: align || 'left',
      fontFace: 'Calibri', valign: 'middle',
    });
  }
  function ln(x1, y1, x2, y2, color, w, dash, noArrow) {
    slide.addShape(pres.ShapeType.line, {
      x: x1, y: y1, w: x2-x1, h: y2-y1,
      line: {
        color: color || C.green, width: w || 1.5,
        dashType: dash ? 'dash' : 'solid',
        endArrowType: noArrow ? 'none' : 'arrow',
      },
    });
  }

  // ──────────────────────────────────────────
  // HEADER  (y=0, h=0.52)
  // ──────────────────────────────────────────
  rect(0, 0, 13.33, 0.52, C.dark, C.dark);
  // Logo
  slide.addImage({ path: LOGO_PATH, x: 0.2, y: 0.09, w: 1.5, h: 0.33 });
  // Green tag right
  rr(10.4, 0.1, 2.73, 0.32, C.green, C.green);
  t('AUTOMATION ARCHITECTURE', 10.4, 0.1, 2.73, 0.32, 8.5, true, C.dark, 'center');

  // ──────────────────────────────────────────
  // FOOTER  (y=6.98, h=0.52)
  // ──────────────────────────────────────────
  rect(0, 6.98, 13.33, 0.52, C.dark, C.dark);
  t('Automatisierung einfacher machen - au2mator GmbH', 0.25, 6.98, 6.0, 0.52, 9, false, '999999', 'left');
  t('au2mator.com  |  info@au2mator.com', 0.25, 6.98, 6.0, 0.52, 9, false, '777777', 'left');
  // Contact right (green pill)
  rr(10.5, 7.07, 2.6, 0.34, C.green, C.green);
  t('au2mator.com  |  info@au2mator.com', 10.5, 7.07, 2.6, 0.34, 8, true, C.dark, 'center');

  // ──────────────────────────────────────────
  // CONTENT  (y=0.6 to y=6.9)
  // ──────────────────────────────────────────

  // DEV FLOW zone
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.12, y: 0.6, w: 13.09, h: 1.02,
    fill: { color: C.greenLight },
    line: { color: C.greenBdr, width: 1, dashType: 'dash' },
    rectRadius: 0.08,
  });
  t('DEV FLOW', 0.22, 0.63, 1.2, 0.18, 7, true, '6A9A30');

  // VS Code
  rr(0.22, 0.7, 1.72, 0.8, C.white, C.grayBdr, 1);
  rr(0.31, 0.76, 0.36, 0.34, '0066B8', '0066B8');
  t('</>', 0.31, 0.76, 0.36, 0.34, 9, true, C.white, 'center');
  t('VS Code', 0.75, 0.76, 1.1, 0.2, 9.5, true);
  t('Developer IDE', 0.75, 0.95, 1.1, 0.17, 7.5, false, C.grayText);
  t('personal identity', 0.75, 1.1, 1.1, 0.17, 7.5, true, C.green);

  // GitHub
  rr(5.0, 0.7, 1.88, 0.8, C.white, C.grayBdr, 1);
  slide.addShape(pres.ShapeType.ellipse, { x:5.1, y:0.76, w:0.36, h:0.36, fill:{color:C.dark}, line:{color:C.dark,width:0} });
  t('GH', 5.1, 0.76, 0.36, 0.36, 8, true, C.white, 'center');
  t('GitHub Repo', 5.54, 0.76, 1.25, 0.2, 9.5, true);
  t('Source Control', 5.54, 0.95, 1.25, 0.17, 7.5, false, C.grayText);
  t('PAT Token', 5.54, 1.1, 1.25, 0.17, 7.5, true, C.blueText);

  ln(1.95, 1.1, 5.0, 1.1, C.green, 1.5);
  rr(2.65, 1.01, 1.55, 0.2, C.greenLight, C.greenBdr, 1);
  t('personal identity', 2.65, 1.01, 1.55, 0.2, 7.5, false, C.greenDark, 'center');

  ln(6.88, 1.1, 9.3, 1.1, '4A8EDD', 1.5, true);
  rr(7.3, 1.01, 1.2, 0.2, C.blueLight, C.blueBdr, 1);
  t('PAT Token', 7.3, 1.01, 1.2, 0.2, 7.5, true, C.blueText, 'center');

  // ON-PREMISES zone
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.12, y: 1.7, w: 3.12, h: 5.0,
    fill: { color: C.gray },
    line: { color: C.grayBdr, width: 1.5 },
    rectRadius: 0.08,
  });
  t('ON-PREMISES', 0.65, 1.78, 2.1, 0.2, 7, true, C.grayText, 'center');

  // Automator Server
  rr(0.25, 1.96, 2.78, 1.02, C.white, C.green, 2, C.green);
  rr(0.37, 2.06, 0.36, 0.28, C.greenLight, C.greenBdr, 1);
  t('SRV', 0.37, 2.06, 0.36, 0.28, 7.5, true, C.greenDark, 'center');
  t('Automator Server', 0.81, 2.06, 2.0, 0.22, 10, true);
  t('On-Premises Windows Server', 0.81, 2.26, 2.0, 0.18, 7.5, false, C.grayText);
  rr(0.32, 2.52, 2.6, 0.38, C.arcLight, C.blue, 1.5);
  t('Azure Arc-enabled Server', 0.4, 2.53, 2.48, 0.2, 8, true, C.arcBlue, 'center');
  t('Arc Agent  |  Hybrid Worker Extension', 0.4, 2.71, 2.48, 0.17, 7, false, '4A90D0', 'center');

  // AD/Entra
  rr(0.25, 4.32, 2.78, 0.8, C.white, C.grayBdr, 1);
  rr(0.33, 4.42, 0.36, 0.36, 'F0F4FF', 'B8C8F0', 1);
  t('AD', 0.33, 4.42, 0.36, 0.36, 9, true, C.blueText, 'center');
  t('AD / Entra ID', 0.78, 4.44, 2.0, 0.2, 10, true);
  t('Active Directory oder Entra', 0.78, 4.62, 2.0, 0.18, 7.5, false, C.grayText);
  t('Benutzer & Identitaeten', 0.78, 4.78, 2.0, 0.18, 7.5, true, C.blueText);

  slide.addShape(pres.ShapeType.line, { x:1.65, y:2.98, w:0, h:1.34, line:{color:'8A9AB0',width:1.5,beginArrowType:'arrow',endArrowType:'arrow'} });
  rr(1.04, 3.56, 1.22, 0.2, C.white, C.grayBdr, 1);
  t('Auth / Directory', 1.04, 3.56, 1.22, 0.2, 7.5, false, C.grayText, 'center');

  // FIREWALL
  slide.addShape(pres.ShapeType.line, { x:3.25, y:1.7, w:0, h:5.0, line:{color:C.red,width:2,dashType:'dash'} });
  rr(2.84, 3.16, 0.76, 0.36, C.redLight, C.red, 1.5);
  t('FW', 2.84, 3.16, 0.76, 0.36, 9, true, C.red, 'center');
  rr(2.64, 3.62, 1.36, 0.2, C.redLight, 'F0B0B0', 1);
  t('Port 443 outbound', 2.64, 3.62, 1.36, 0.2, 7, false, C.red, 'center');
  rr(2.64, 3.82, 1.36, 0.2, C.redLight, 'F0B0B0', 1);
  t('kein Inbound!', 2.64, 3.82, 1.36, 0.2, 7, true, C.red, 'center');

  // AZURE zone
  slide.addShape(pres.ShapeType.roundRect, {
    x: 3.45, y: 1.6, w: 9.73, h: 5.1,
    fill: { color: C.blueLight },
    line: { color: C.blueBdr, width: 1.5 },
    rectRadius: 0.08,
  });
  t('MICROSOFT AZURE', 6.5, 1.68, 3.7, 0.2, 7, true, C.blueText, 'center');

  // Azure Arc service
  rr(3.58, 3.06, 2.72, 0.8, C.arcLight, C.blue, 1.5, C.blue);
  rr(3.7, 3.14, 0.36, 0.36, 'C8E0FF', '80B8F8', 1);
  t('ARC', 3.7, 3.14, 0.36, 0.36, 7, true, C.arcBlue, 'center');
  t('Azure Arc', 4.14, 3.16, 2.0, 0.2, 10, true, '004A9E');
  t('Hybrid Cloud Management', 4.14, 3.34, 2.0, 0.18, 7.5, false, '3070B0');
  t('Registrierung  |  Identitaet  |  Extensions', 3.62, 3.51, 2.6, 0.2, 7, false, '2060A0', 'center');

  ln(3.03, 2.6, 3.6, 3.2, C.blue, 2);
  rr(2.87, 2.26, 1.55, 0.22, C.arcLight, C.blue, 1);
  t('OUTBOUND HTTPS 443', 2.87, 2.26, 1.55, 0.22, 7, true, '004A9E', 'center');

  // Azure Automation Account
  rr(7.0, 1.96, 3.3, 0.88, C.white, C.blueBdr, 1.5, C.blue);
  rr(7.1, 2.06, 0.36, 0.36, 'E8F2FF', C.blueBdr, 1);
  t('AA', 7.1, 2.06, 0.36, 0.36, 9, true, C.blue, 'center');
  t('Automation Account', 7.54, 2.08, 2.65, 0.22, 10.5, true);
  t('Azure Automation', 7.54, 2.27, 2.65, 0.18, 8, false, C.grayText);
  t('Runbook Store  |  Job Queue  |  Scheduling', 7.06, 2.5, 3.14, 0.2, 7.5, true, C.blueText, 'center');

  ln(3.03, 2.26, 7.0, 2.4, C.green, 2);
  rr(3.88, 2.13, 2.04, 0.24, C.greenLight, C.greenBdr, 1);
  t('App Registration (Entra)', 3.88, 2.13, 2.04, 0.24, 7.5, true, C.greenDark, 'center');

  // Cloud Runbooks
  rr(3.8, 3.92, 2.35, 0.8, C.white, C.grayBdr, 1);
  rr(3.9, 4.0, 0.36, 0.36, 'E8F2FF', 'B0D0F0', 1);
  t('CR', 3.9, 4.0, 0.36, 0.36, 8, true, C.blue, 'center');
  t('Cloud Runbooks', 4.34, 4.02, 1.72, 0.22, 9.5, true);
  t('Azure Automation Cloud', 4.34, 4.2, 1.72, 0.18, 7.5, false, C.grayText);
  t('Shared Sandbox', 4.34, 4.38, 1.72, 0.18, 7.5, true, C.blue);

  ln(7.3, 2.84, 5.12, 3.92, '8A9AB0', 1.5);
  rr(5.37, 3.17, 0.74, 0.2, C.white, C.grayBdr, 1);
  t('PUSH', 5.37, 3.17, 0.74, 0.2, 7, false, '8A9AB0', 'center');

  // Hybrid Worker
  rr(7.0, 3.92, 3.5, 1.22, C.white, C.green, 2, C.green);
  rr(7.1, 4.0, 0.36, 0.36, C.greenLight, C.greenBdr, 1);
  t('HW', 7.1, 4.0, 0.36, 0.36, 8, true, C.greenDark, 'center');
  t('Hybrid Runbook Worker', 7.54, 4.02, 2.82, 0.22, 9.5, true);
  t('On-Premises Execution  =  Automator Server', 7.54, 4.21, 2.82, 0.18, 7.5, false, C.grayText);
  rr(7.07, 4.55, 3.33, 0.5, C.greenLight, C.green, 1);
  t('PULL: Hybrid Worker holt Jobs aktiv ab', 7.09, 4.56, 3.29, 0.22, 8, true, C.greenDark, 'center');
  t('outbound HTTPS 443  |  kein Inbound  |  Firewall-freundlich', 7.09, 4.77, 3.29, 0.18, 7, false, '6A9A40', 'center');

  ln(8.75, 3.92, 8.75, 2.84, C.green, 2.5);
  rr(8.81, 3.22, 1.5, 0.36, C.greenLight, C.greenBdr, 1);
  t('PULL', 8.81, 3.22, 1.5, 0.2, 9, true, C.greenDark, 'center');
  t('Job Queue abfragen', 8.81, 3.4, 1.5, 0.18, 7, false, '6A9A40', 'center');

  ln(6.3, 3.45, 7.0, 3.98, C.blue, 1.5, true);
  rr(5.88, 3.57, 1.35, 0.2, C.arcLight, '9ACAFF', 1);
  t('Extension Deploy', 5.88, 3.57, 1.35, 0.2, 7, false, C.arcBlue, 'center');
  ln(9.6, 2.84, 9.6, 3.92, C.green, 1.5);

  // Managed Identity
  slide.addShape(pres.ShapeType.roundRect, {
    x: 3.7, y: 5.3, w: 6.75, h: 0.34,
    fill: { color: C.purpleLight },
    line: { color: 'C8B8F0', width: 1.5 },
    rectRadius: 0.17,
  });
  t('Managed Identity - berechtigungsbasierter Zugriff auf Azure Ressourcen', 3.7, 5.3, 6.75, 0.34, 8.5, true, C.purple, 'center');

  ln(4.95, 4.72, 5.1, 5.3, '8A9AB0', 1.5);
  ln(8.75, 5.14, 8.75, 5.3, C.green, 1.5);

  // Key Vault
  rr(6.3, 5.82, 2.55, 0.74, C.white, 'C8B8F0', 1.5, C.purple);
  rr(6.42, 5.92, 0.36, 0.36, C.purpleLight, 'C8B8F0', 1);
  t('KV', 6.42, 5.92, 0.36, 0.36, 8, true, C.purple, 'center');
  t('Azure Key Vault', 6.87, 5.94, 1.88, 0.22, 10, true);
  t('Credentials & Secrets', 6.87, 6.12, 1.88, 0.18, 7.5, false, C.grayText);
  ln(7.57, 5.64, 7.57, 5.82, C.purple, 1.8);

  // LEGEND
  rr(0.15, 5.38, 3.0, 1.08, C.white, C.grayBdr, 1);
  t('LEGENDE', 0.28, 5.44, 2.8, 0.2, 7, true, '9AA5B4');
  ln(0.28, 5.73, 0.73, 5.73, C.green, 2);
  t('Automatisierungs-Flow / App Registration', 0.82, 5.64, 2.2, 0.22, 8, false, '4A5568');
  ln(0.28, 5.94, 0.73, 5.94, C.green, 2.5);
  t('PULL - Hybrid Worker (outbound)', 0.82, 5.85, 2.2, 0.22, 8, false, '4A5568');
  ln(0.28, 6.15, 0.73, 6.15, '4A8EDD', 1.5, true);
  t('Code Deployment (PAT)', 0.82, 6.06, 2.2, 0.22, 8, false, '4A5568');
  ln(0.28, 6.36, 0.73, 6.36, C.blue, 1.5, true);
  t('Azure Arc (Registrierung / Extension)', 0.82, 6.27, 2.2, 0.22, 8, false, '4A5568');

  // SECURITY CALLOUT
  rr(10.55, 5.78, 2.63, 0.8, 'FFF8F0', 'E09040', 1.5);
  t('Security-Vorteil', 10.6, 5.83, 2.53, 0.22, 9, true, 'B06010', 'center');
  t('Hybrid Worker initiiert alle Verbindungen.', 10.6, 6.01, 2.53, 0.18, 7.5, false, '906030', 'center');
  t('Kein Inbound! Port 443 outbound only.', 10.6, 6.17, 2.53, 0.18, 7.5, true, '906030', 'center');
  t('Firewall-freundlich.', 10.6, 6.33, 2.53, 0.18, 7.5, false, '906030', 'center');

  return pres.writeFile({ fileName: 'au2mator-automation-architecture.pptx' });
}

// ═══════════════════════════════════════════
// SVG
// ═══════════════════════════════════════════
function generateSVG() {
  // We'll build a proper standalone SVG that wraps the diagram
  // with au2mator header + footer

  const html = fs.readFileSync('au2mator-architecture.html', 'utf8');
  const firstSvg  = html.indexOf('<svg ');
  const lastClose = html.lastIndexOf('</svg>');
  if (firstSvg === -1) { console.log('SVG not found'); return; }

  // Extract inner SVG content (strip outer svg tag, keep children)
  let svgTag  = html.substring(firstSvg, html.indexOf('>', firstSvg) + 1);
  let svgBody = html.substring(html.indexOf('>', firstSvg) + 1, lastClose);

  // Parse width/height from inner SVG
  const wMatch = svgTag.match(/width="(\d+)"/);
  const hMatch = svgTag.match(/height="(\d+)"/);
  const innerW = wMatch ? parseInt(wMatch[1]) : 1044;
  const innerH = hMatch ? parseInt(hMatch[1]) : 620;

  const HEADER_H = 54;
  const FOOTER_H = 44;
  const totalH   = innerH + HEADER_H + FOOTER_H;
  const totalW   = innerW;

  const svgOut = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">

  <!-- HEADER -->
  <rect x="0" y="0" width="${totalW}" height="${HEADER_H}" fill="#2D2D2D"/>
  <!-- Logo (white, embedded base64) -->
  <image href="data:image/png;base64,${logoB64}"
         x="20" y="9" width="140" height="36"/>
  <!-- Green tag -->
  <rect x="${totalW - 260}" y="11" width="238" height="30" rx="5" fill="#96C15C"/>
  <text x="${totalW - 141}" y="31" font-family="Helvetica,Arial,sans-serif" font-size="11"
        font-weight="bold" fill="#2D2D2D" text-anchor="middle">AUTOMATION ARCHITECTURE</text>

  <!-- DIAGRAM (shifted down by HEADER_H) -->
  <g transform="translate(0, ${HEADER_H})">
    ${svgBody}
  </g>

  <!-- FOOTER -->
  <rect x="0" y="${innerH + HEADER_H}" width="${totalW}" height="${FOOTER_H}" fill="#2D2D2D"/>
  <text x="20" y="${innerH + HEADER_H + 27}" font-family="Helvetica,Arial,sans-serif"
        font-size="11" fill="#999999">Automatisierung einfacher machen - au2mator GmbH</text>
  <!-- Footer green pill -->
  <rect x="${totalW - 310}" y="${innerH + HEADER_H + 9}" width="288" height="26" rx="13" fill="#96C15C"/>
  <text x="${totalW - 166}" y="${innerH + HEADER_H + 27}" font-family="Helvetica,Arial,sans-serif"
        font-size="10" font-weight="bold" fill="#2D2D2D" text-anchor="middle">au2mator.com  |  info@au2mator.com</text>
</svg>`;

  fs.writeFileSync('au2mator-automation-architecture.svg', svgOut, 'utf8');
  console.log('SVG saved: au2mator-automation-architecture.svg');
}

generateSVG();
generatePPTX()
  .then(() => console.log('PPTX saved: au2mator-automation-architecture.pptx'))
  .catch(e => console.error('PPTX error:', e.message));
