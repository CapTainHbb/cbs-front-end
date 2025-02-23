import * as XLSX from 'xlsx';

export const exportToXLSX = (columns : any[], rows : any[], filename = 'billing') => {
    // Map columns to headers
    const headers = columns.map(col => col);
    // Combine headers and rows into a single array
    const data = [headers.reverse(), ...rows.map(row => {
        const { type, ...rest } = row;  // Destructure and exclude 'type'
        return Object.values(rest).reverse();  // Reverse the array of values
    })];

    // Create a worksheet from the data array
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a file
    XLSX.writeFile(workbook, filename + '.xlsx');
};
