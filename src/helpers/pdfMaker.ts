
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import fs from 'fs';

export interface IObjToPdf {
    title?: string,
    fontSizeTitle?: number,
    fontSizeContent?: number,
    subtitle?: string,
    fillColor?: number[],
    textColor?: number[],
    spaceEnd?: boolean,
    columns?: string[],
    values: Array<string[]>
    styles?: any
    theme?: any
    untitled?: boolean,
    headStyles?: any
}

export function makePdfPlus(tables: IObjToPdf[], pdfName: string) {
    var doc = new jsPDF();

    for (const table of tables) {
        const { columns = [], values = [], title = "", subtitle = "", spaceEnd, styles = {}, theme, untitled, headStyles, fontSizeContent, fontSizeTitle, fillColor, textColor, ...tableConfig } = table;

        if (title) {
            autoTable(doc, {
                head: [[title]],
                theme: 'plain',
                styles: {
                    fontSize: 16,
                    cellPadding: 1,
                },
            });
        }

        if (subtitle) {
            autoTable(doc, {
                body: [[subtitle]],
                theme: 'plain',
                styles: {
                    fontSize: fontSizeTitle ?? 10,
                    cellPadding: 0,
                },
                margin: {
                    bottom: 0,
                    top: 0
                },
                showFoot: false,
                showHead: false
            });
        }

        if (columns && values) {

            autoTable(doc, {
                head: [columns],
                body: values,
                /*   tableWidth: 180, */
                styles: {
                    fontSize: fontSizeContent ?? 12,
                    cellPadding: 2,
                    cellWidth: 'wrap',
                    ...styles
                },
                headStyles: {
                    fillColor: fillColor ?? [27, 83, 46],
                    textColor: textColor ?? [255, 255, 255],
                    cellPadding: untitled ? 0 : 2,
                    fontSize: untitled ? 2 : 12,
                    ...headStyles
                },
                margin: { left: 15 },
                //foot: [colunas],
                theme,
                ...tableConfig
            });
        }

        if (spaceEnd) {
            autoTable(doc, {
                head: [[""]],
                theme: 'plain',
                styles: {
                    fontSize: 25,
                    cellPadding: 0,
                },
            });
        }
    }
    doc.save(`${pdfName}.pdf`);
    const buffer = fs.readFileSync(`${pdfName}.pdf`);
    fs.unlinkSync(`${pdfName}.pdf`);
    return buffer;

}

function getFormatedNumber(number: any, index = 2) {
    if (number) {
        number = Number(number)
    }
    if (number) {
        return number.toFixed(index);
    }

    if (number == 0) {
        return 0;
    }

    return "-";
}

const isUserDeleted = (user: any) => user && user.name === 'DELETED' && user.identification === 'DELETED' && (user.telephone === 'DELETED' || user.phone === 'DELETED');
