import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
export default function ExcelDataViewer({ fileUrl }) {
    const [excelData, setExcelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchAndParseExcel = async () => {
        try {
          setLoading(true);
          // Fetch the Excel file
          const response = await fetch(fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          
          // Parse the Excel file using xlsx
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          setExcelData(jsonData);
          setLoading(false);
        } catch (err) {
          console.error('Error parsing Excel file:', err);
          setError('Không thể đọc file Excel. Vui lòng tải xuống để xem.');
          setLoading(false);
        }
      };
  
      if (fileUrl) {
        fetchAndParseExcel();
      }
    }, [fileUrl]);
  
    if (loading) {
      return (
        <div className="flex items-center justify-center p-6 bg-white rounded-lg border">
          <svg className="animate-spin h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Đang tải dữ liệu...</span>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-center text-orange-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-50 p-3 rounded border hover:bg-blue-100 text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Tải xuống file Excel
          </a>
        </div>
      );
    }
  
    if (!excelData || excelData.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500 bg-white rounded-lg border">
          Không có dữ liệu trong file Excel
        </div>
      );
    }
  
    // Determine if the first row is headers
    const hasHeaders = excelData.length > 0;
    const headers = hasHeaders ? excelData[0] : [];
    const tableData = hasHeaders ? excelData.slice(1) : excelData;
  
    return (
      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          {hasHeaders && (
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, index) => (
                  <th 
                    key={index}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, cellIndex) => {
                  // Determine if this is a numeric cell to apply right alignment
                  const isNumeric = !isNaN(cell) && cell !== '';
                  return (
                    <td 
                      key={cellIndex}
                      className={`px-4 py-2 whitespace-nowrap text-sm ${isNumeric ? 'text-right' : 'text-left'}`}
                    >
                      {cell !== undefined && cell !== null ? cell.toString() : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }