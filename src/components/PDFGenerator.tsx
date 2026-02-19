import { Download } from 'lucide-react';
import { Reporte, CheckItem } from './UserContext';

interface PDFGeneratorProps {
  reporte: Reporte;
  checkItems: CheckItem[];
}

export function PDFGenerator({ reporte, checkItems }: PDFGeneratorProps) {
  
  const generatePDF = () => {
    const itemsHTML = reporte.items
      .map(item => {
        const checkItem = checkItems.find(ci => ci.id === item.itemId);
        if (!checkItem) return '';

        const estadoColor = item.estado === 'bien' ? '#10b981' : item.estado === 'regular' ? '#f59e0b' : '#ef4444';
        const estadoText = item.estado === 'bien' ? 'BIEN' : item.estado === 'regular' ? 'REGULAR' : 'MAL';
        const estadoBg = item.estado === 'bien' ? '#d1fae5' : item.estado === 'regular' ? '#fef3c7' : '#fee2e2';

        return `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <strong style="color: #111827; font-size: 14px;">${checkItem.nombre}</strong>
              <span style="background: ${estadoBg}; color: ${estadoColor}; font-weight: bold; padding: 6px 12px; border-radius: 9999px; font-size: 12px;">${estadoText}</span>
            </div>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">
              <strong>Módulo:</strong> ${checkItem.modulo}
            </p>
            ${item.observacion ? `
              <div style="margin-top: 12px; padding: 12px; background: #f9fafb; border-left: 3px solid ${estadoColor}; border-radius: 4px;">
                <p style="margin: 0; font-size: 13px; color: #374151;">
                  <strong style="color: #111827;">Observación:</strong> ${item.observacion}
                </p>
              </div>
            ` : ''}
            ${item.adjuntos.length > 0 ? `
              <div style="margin-top: 15px;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #374151;"><strong>Evidencias Adjuntas (${item.adjuntos.length}):</strong></p>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 10px;">
                  ${item.adjuntos.map(adj => {
                    if (adj.type.startsWith('image/')) {
                      return `
                        <div style="page-break-inside: avoid; margin-bottom: 20px;">
                          <img src="${adj.url}" style="width: 100%; max-height: 800px; object-fit: contain; border: 3px solid #e5e7eb; border-radius: 8px; background: white;" />
                          <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280; text-align: center; font-weight: 500;">${adj.name}</p>
                        </div>
                      `;
                    } else {
                      return `
                        <div style="padding: 40px; border: 2px solid #e5e7eb; border-radius: 8px; text-align: center; background: #f9fafb;">
                          <div style="font-size: 48px; margin-bottom: 10px;">📄</div>
                          <strong style="color: #374151; font-size: 14px;">${adj.type.split('/')[1]?.toUpperCase() || 'DOC'}</strong>
                          <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">${adj.name}</p>
                        </div>
                      `;
                    }
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      })
      .join('');

    // Agrupar items por módulo
    const groupedByModule: Record<string, typeof reporte.items> = {};
    reporte.items.forEach(item => {
      const checkItem = checkItems.find(ci => ci.id === item.itemId);
      if (!checkItem) return;
      
      if (!groupedByModule[checkItem.modulo]) {
        groupedByModule[checkItem.modulo] = [];
      }
      groupedByModule[checkItem.modulo].push(item);
    });

    const modulesHTML = Object.entries(groupedByModule).map(([modulo, items]) => `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px; border-radius: 8px 8px 0 0; margin-bottom: 0;">
          <h3 style="color: white; margin: 0; font-size: 16px;">${modulo}</h3>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 12px;">${items.length} ítems verificados</p>
        </div>
        <div style="border: 2px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 20px; background: white;">
          ${items.map(item => {
            const checkItem = checkItems.find(ci => ci.id === item.itemId);
            if (!checkItem) return '';

            const estadoColor = item.estado === 'bien' ? '#10b981' : item.estado === 'regular' ? '#f59e0b' : '#ef4444';
            const estadoText = item.estado === 'bien' ? 'BIEN' : item.estado === 'regular' ? 'REGULAR' : 'MAL';
            const estadoBg = item.estado === 'bien' ? '#d1fae5' : item.estado === 'regular' ? '#fef3c7' : '#fee2e2';

            return `
              <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <strong style="color: #111827; font-size: 14px;">${checkItem.nombre}</strong>
                  <span style="background: ${estadoBg}; color: ${estadoColor}; font-weight: bold; padding: 6px 12px; border-radius: 9999px; font-size: 12px;">${estadoText}</span>
                </div>
                ${item.observacion ? `
                  <div style="margin-top: 12px; padding: 12px; background: #f9fafb; border-left: 3px solid ${estadoColor}; border-radius: 4px;">
                    <p style="margin: 0; font-size: 13px; color: #374151;">
                      <strong style="color: #111827;">Observación:</strong> ${item.observacion}
                    </p>
                  </div>
                ` : ''}
                ${item.adjuntos.length > 0 ? `
                  <div style="margin-top: 15px;">
                    <p style="margin: 0 0 10px 0; font-size: 13px; color: #374151;"><strong>Evidencias (${item.adjuntos.length}):</strong></p>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 10px;">
                      ${item.adjuntos.map(adj => {
                        if (adj.type.startsWith('image/')) {
                          return `
                            <div style="page-break-inside: avoid; margin-bottom: 20px;">
                              <img src="${adj.url}" style="width: 100%; max-height: 800px; object-fit: contain; border: 3px solid #e5e7eb; border-radius: 8px; background: white;" />
                              <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280; text-align: center; font-weight: 500;">${adj.name}</p>
                            </div>
                          `;
                        } else {
                          return `
                            <div style="padding: 40px; border: 2px solid #e5e7eb; border-radius: 8px; text-align: center; background: #f9fafb;">
                              <div style="font-size: 48px; margin-bottom: 10px;">📄</div>
                              <strong style="color: #374151; font-size: 14px;">${adj.type.split('/')[1]?.toUpperCase() || 'DOC'}</strong>
                              <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">${adj.name}</p>
                            </div>
                          `;
                        }
                      }).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    // Documentos generales HTML con imágenes grandes
    const documentosGeneralesHTML = reporte.documentosGenerales && reporte.documentosGenerales.length > 0 ? `
      <div style="margin: 40px 0; padding: 25px; background: linear-gradient(135deg, #f8f5ff 0%, #faf5ff 100%); border: 2px solid #9333ea; border-radius: 12px; page-break-before: always;">
        <h2 style="color: #9333ea; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center;">
          <span style="font-size: 28px; margin-right: 12px;">📁</span>
          Documentos y Evidencias Generales
        </h2>
        <p style="margin: 0 0 25px 0; color: #6b7280; font-size: 14px;">
          ${reporte.documentosGenerales.length} documento(s) adjunto(s) al chequeo
        </p>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px;">
          ${reporte.documentosGenerales.map(doc => {
            if (doc.type.startsWith('image/')) {
              return `
                <div style="page-break-inside: avoid;">
                  <img src="${doc.url}" style="width: 100%; height: 550px; object-fit: contain; border: 3px solid #9333ea; border-radius: 12px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
                  <p style="margin: 12px 0 0 0; text-align: center; font-size: 13px; color: #6b7280; font-weight: 500;">${doc.name}</p>
                </div>
              `;
            } else {
              return `
                <div style="padding: 50px; border: 3px solid #9333ea; border-radius: 12px; text-align: center; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 64px; color: #9333ea; margin-bottom: 15px;">📄</div>
                  <strong style="color: #9333ea; font-size: 16px; display: block; margin-bottom: 8px;">${doc.type.split('/')[1]?.toUpperCase() || 'DOC'}</strong>
                  <p style="margin: 0; font-size: 13px; color: #6b7280;">${doc.name}</p>
                </div>
              `;
            }
          }).join('')}
        </div>
      </div>
    ` : '';

    // Alerta de bloqueo
    const alertaBloqueoHTML = reporte.documentacionVencida && reporte.motivoBloqueo ? `
      <div style="margin: 30px 0; padding: 25px; background: #fef2f2; border: 3px solid #dc2626; border-radius: 12px; page-break-inside: avoid;">
        <div style="display: flex; align-items: start; gap: 20px;">
          <div style="font-size: 48px; color: #dc2626;">⚠️</div>
          <div style="flex: 1;">
            <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px;">VEHÍCULO/CONDUCTOR BLOQUEADO</h3>
            <div style="padding: 15px; background: #fee2e2; border: 2px solid #dc2626; border-radius: 8px;">
              <p style="margin: 0; color: #991b1b; font-weight: bold; font-size: 14px;">${reporte.motivoBloqueo}</p>
            </div>
            <p style="margin: 15px 0 0 0; color: #7f1d1d; font-size: 13px;">
              ⚠️ Este vehículo NO debe ser despachado hasta renovar la documentación correspondiente.
            </p>
          </div>
        </div>
      </div>
    ` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte Chequeo - ${reporte.vehiculo.placa}</title>
        <style>
          @page {
            size: letter;
            margin: 1.5cm;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          @media print {
            .no-print { display: none; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🚛</div>
          <h1 style="margin: 0 0 10px 0; font-size: 28px;">TRANSTIMBIO</h1>
          <h2 style="margin: 0; font-size: 18px; font-weight: normal; opacity: 0.95;">Reporte de Chequeo Pre-Operacional</h2>
        </div>

        ${alertaBloqueoHTML}

        <!-- Información General -->
        <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            📋 Información del Chequeo
          </h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div>
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Tipo de Chequeo</p>
              <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${reporte.tipo}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Fecha y Hora</p>
              <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">
                ${new Date(reporte.fecha).toLocaleDateString('es-CO', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} - ${new Date(reporte.fecha).toLocaleTimeString('es-CO')}
              </p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Vehículo</p>
              <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">
                ${reporte.vehiculo.placa} - ${reporte.vehiculo.marca} ${reporte.vehiculo.modelo}
              </p>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #6b7280;">Tipo: ${reporte.vehiculo.tipo}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Conductor</p>
              <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${reporte.conductor.nombre}</p>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #6b7280;">CC: ${reporte.conductor.cedula}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Inspector</p>
              <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${reporte.inspector.nombre}</p>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #6b7280;">Rol: ${reporte.inspector.rol}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">ID Reporte</p>
              <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600; font-family: monospace;">${reporte.id}</p>
            </div>
          </div>
        </div>

        <!-- Items por Módulo -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">
            ✅ Resultados de la Inspección
          </h2>
          ${modulesHTML}
        </div>

        ${documentosGeneralesHTML}

        <!-- Firmas -->
        <div class="page-break"></div>
        <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin-top: 30px;">
          <h2 style="color: #1f2937; margin: 0 0 25px 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            ✍️ Firmas Digitales
          </h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px;">
            <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; background: #f9fafb;">
              <p style="margin: 0 0 15px 0; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                Firma del Inspector
              </p>
              <div style="border: 2px solid #d1d5db; border-radius: 8px; padding: 15px; background: white; margin-bottom: 15px; min-height: 150px; display: flex; align-items: center; justify-content: center;">
                <img src="${reporte.firmaInspector}" style="max-width: 100%; max-height: 140px; object-fit: contain;" />
              </div>
              <p style="margin: 0; font-size: 15px; color: #111827; font-weight: 600;">${reporte.inspector.nombre}</p>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #6b7280;">${reporte.inspector.rol}</p>
            </div>
            <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; background: #f9fafb;">
              <p style="margin: 0 0 15px 0; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                Firma del Conductor
              </p>
              <div style="border: 2px solid #d1d5db; border-radius: 8px; padding: 15px; background: white; margin-bottom: 15px; min-height: 150px; display: flex; align-items: center; justify-content: center;">
                <img src="${reporte.firmaConductor}" style="max-width: 100%; max-height: 140px; object-fit: contain;" />
              </div>
              <p style="margin: 0; font-size: 15px; color: #111827; font-weight: 600;">${reporte.conductor.nombre}</p>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #6b7280;">CC: ${reporte.conductor.cedula}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            Este documento fue generado automáticamente por el sistema de chequeo pre-operacional de TRANSTIMBIO
          </p>
          <p style="margin: 8px 0 0 0; font-size: 11px; color: #9ca3af;">
            Fecha de generación: ${new Date().toLocaleString('es-CO')}
          </p>
        </div>

        <div class="no-print" style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            🖨️ Imprimir / Guardar como PDF
          </button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor habilite las ventanas emergentes para generar el PDF');
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
    
    // Auto-print después de cargar todas las imágenes
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
      }, 500);
    };
  };

  return (
    <button
      onClick={generatePDF}
      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
      title="Descargar reporte en PDF"
    >
      <Download className="size-4" />
    </button>
  );
}