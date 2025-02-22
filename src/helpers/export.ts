import * as XLSX from 'xlsx';

export const exportToXLSX = (columns : any[], rows : any[], filename = 'billing.xlsx') => {
    // Map columns to headers
    const headers = columns.map(col => col);

    // Combine headers and rows into a single array
    const data = [headers.reverse(), ...rows.map(row => Object.values(row.reverse()))];

    // Create a worksheet from the data array
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a file
    XLSX.writeFile(workbook, filename);
};
