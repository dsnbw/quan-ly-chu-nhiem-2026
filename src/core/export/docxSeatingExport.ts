// ============================================================================
// SEATING PLAN WORD (DOCX) EXPORT GENERATOR (CLS-003.8, DOC-006)
// Exports A4 editable Word Document with school header & GVCN signature blocks
// ============================================================================

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  HeadingLevel,
  PageOrientation
} from 'docx';
import { saveAs } from 'file-saver';
import { SeatingLayout, SchoolConfig, ClassRoom } from '../../types';

export async function exportSeatingPlanDocx(
  layout: SeatingLayout,
  school: SchoolConfig,
  classRoom: ClassRoom
) {
  // Group seats by row
  const rowsCount = layout.rows;
  const colsCount = layout.cols;

  // Header paragraphs
  const titleParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
          bold: true,
          size: 24,
          font: 'Times New Roman'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'Độc lập - Tự do - Hạnh phúc',
          bold: true,
          underline: {},
          size: 24,
          font: 'Times New Roman'
        })
      ]
    }),
    new Paragraph({ text: '', spacing: { after: 200 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `SƠ ĐỒ BỐ TRÍ CHỖ NGỒI VÀ PHÂN CHIA TỔ HỌC TẬP`,
          bold: true,
          size: 32,
          color: '196df5',
          font: 'Times New Roman'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${classRoom.name.toUpperCase()} - NĂM HỌC ${school.academicYear}`,
          bold: true,
          size: 26,
          font: 'Times New Roman'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Trường: ${school.name}  |  GVCN: ${classRoom.homeroomTeacherName}  |  Phòng học: ${classRoom.roomName}`,
          italics: true,
          size: 22,
          font: 'Times New Roman'
        })
      ],
      spacing: { after: 300 }
    }),
    // Board representation
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: '================== [ BẢNG GIÁO VIÊN & BÀN GIẢNG ] ==================',
          bold: true,
          color: '475569',
          size: 22,
          font: 'Times New Roman'
        })
      ],
      spacing: { after: 200 }
    })
  ];

  // Build grid table rows
  const tableRows: TableRow[] = [];

  // Header row
  const headerCells = [
    new TableCell({
      width: { size: 10, type: WidthType.PERCENTAGE },
      children: [new Paragraph({ text: 'Hàng', alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Hàng', bold: true })] })]
    })
  ];

  for (let c = 1; c <= colsCount; c++) {
    const deskNum = Math.floor((c - 1) / 2) + 1;
    const seatInDesk = ((c - 1) % 2) + 1;
    headerCells.push(
      new TableCell({
        width: { size: Math.floor(90 / colsCount), type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Dãy ${deskNum} (G${seatInDesk})`,
                bold: true,
                size: 18
              })
            ]
          })
        ]
      })
    );
  }
  tableRows.push(new TableRow({ children: headerCells }));

  // Content rows
  for (let r = 1; r <= rowsCount; r++) {
    const cells: TableCell[] = [
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `Bàn ${r}`, bold: true, size: 20 })]
          })
        ]
      })
    ];

    for (let c = 1; c <= colsCount; c++) {
      const seat = layout.seats.find(s => s.row === r && s.col === c);
      const studentName = seat?.studentName || (seat?.isVacant ? '(Trống)' : '-');
      const groupText = seat?.groupName ? ` [${seat.groupName}]` : '';

      cells.push(
        new TableCell({
          width: { size: Math.floor(90 / colsCount), type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: studentName,
                  bold: !!seat?.studentName,
                  size: 20
                }),
                new TextRun({
                  text: groupText,
                  italics: true,
                  size: 16,
                  color: '64748b'
                })
              ]
            })
          ]
        })
      );
    }

    tableRows.push(new TableRow({ children: cells }));
  }

  const seatingTable = new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  // Footer & Signatures
  const footerParagraphs = [
    new Paragraph({ text: '', spacing: { before: 300 } }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Ghi chú: ${layout.notes || 'Học sinh ngồi đúng vị trí quy định, luân chuyển bàn theo kế hoạch của GVCN.'}`,
          italics: true,
          size: 20
        })
      ]
    }),
    new Paragraph({ text: '', spacing: { after: 300 } }),
    // Signature Table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'BAN GIÁM HIỆU PHÊ DUYỆT', bold: true, size: 22 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: '(Ký, đóng dấu và ghi rõ họ tên)', italics: true, size: 18 })]
                }),
                new Paragraph({ text: '', spacing: { after: 600 } }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: school.principalName, bold: true, size: 22 })]
                })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `Hà Nội, ngày 01 tháng 09 năm 2026`, italics: true, size: 20 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'GIÁO VIÊN CHỦ NHIỆM', bold: true, size: 22 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: '(Ký và ghi rõ họ tên)', italics: true, size: 18 })]
                }),
                new Paragraph({ text: '', spacing: { after: 600 } }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: classRoom.homeroomTeacherName, bold: true, size: 22 })]
                })
              ]
            })
          ]
        })
      ]
    })
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE
            }
          }
        },
        children: [...titleParagraphs, seatingTable, ...footerParagraphs]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `So_do_cho_ngoi_${classRoom.code}_NamHoc_2026_2027.docx`);
}
