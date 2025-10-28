import React, { useState } from 'react';
import './SpreadsheetEditor.css';

interface Cell {
  value: string;
  formula?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    backgroundColor?: string;
    textColor?: string;
    align?: 'left' | 'center' | 'right';
  };
}

interface Sheet {
  id: string;
  name: string;
  cells: { [key: string]: Cell };
}

const SpreadsheetEditor: React.FC = () => {
  const [sheets, setSheets] = useState<Sheet[]>([
    { id: '1', name: 'Sheet1', cells: {} },
  ]);
  
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [selectedCell, setSelectedCell] = useState<string | null>('A1');
  const [formulaBar, setFormulaBar] = useState('');
  const [showChartModal, setShowChartModal] = useState(false);
  const [showFunctionsMenu, setShowFunctionsMenu] = useState(false);
  
  const activeSheet = sheets[activeSheetIndex];
  const rows = 50;
  const cols = 26;
  
  const columnLabels = Array.from({ length: cols }, (_, i) => 
    String.fromCharCode(65 + i)
  );
  
  const getCellKey = (col: number, row: number) => {
    return `${columnLabels[col]}${row + 1}`;
  };
  
  const getCell = (key: string): Cell => {
    return activeSheet.cells[key] || { value: '' };
  };
  
  const updateCell = (key: string, updates: Partial<Cell>) => {
    const newSheets = [...sheets];
    newSheets[activeSheetIndex] = {
      ...activeSheet,
      cells: {
        ...activeSheet.cells,
        [key]: { ...getCell(key), ...updates },
      },
    };
    setSheets(newSheets);
  };
  
  const evaluateFormula = (formula: string): string => {
    try {
      // Simple formula evaluation (SUM, AVERAGE, etc.)
      if (formula.startsWith('=SUM(')) {
        const range = formula.match(/=SUM\(([A-Z]+\d+):([A-Z]+\d+)\)/);
        if (range) {
          const [_, start, end] = range;
          const values = getRangeValues(start, end);
          return values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toString();
        }
      }
      
      if (formula.startsWith('=AVERAGE(')) {
        const range = formula.match(/=AVERAGE\(([A-Z]+\d+):([A-Z]+\d+)\)/);
        if (range) {
          const [_, start, end] = range;
          const values = getRangeValues(start, end);
          const sum = values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
          return (sum / values.length).toString();
        }
      }
      
      if (formula.startsWith('=')) {
        // Basic arithmetic
        const expr = formula.substring(1).replace(/([A-Z]+\d+)/g, (match) => {
          return getCell(match).value || '0';
        });
        return eval(expr).toString();
      }
      
      return formula;
    } catch (e) {
      return '#ERROR!';
    }
  };
  
  const getRangeValues = (start: string, end: string): string[] => {
    const values: string[] = [];
    const startCol = start.charCodeAt(0) - 65;
    const startRow = parseInt(start.substring(1)) - 1;
    const endCol = end.charCodeAt(0) - 65;
    const endRow = parseInt(end.substring(1)) - 1;
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const key = getCellKey(col, row);
        values.push(getCell(key).value);
      }
    }
    
    return values;
  };
  
  const handleCellChange = (key: string, value: string) => {
    if (value.startsWith('=')) {
      const evaluated = evaluateFormula(value);
      updateCell(key, { value: evaluated, formula: value });
    } else {
      updateCell(key, { value, formula: undefined });
    }
  };
  
  const handleCellClick = (key: string) => {
    setSelectedCell(key);
    const cell = getCell(key);
    setFormulaBar(cell.formula || cell.value);
  };
  
  const addSheet = () => {
    const newSheet: Sheet = {
      id: Date.now().toString(),
      name: `Sheet${sheets.length + 1}`,
      cells: {},
    };
    setSheets([...sheets, newSheet]);
    setActiveSheetIndex(sheets.length);
  };
  
  const deleteSheet = () => {
    if (sheets.length === 1) return;
    const newSheets = sheets.filter((_, idx) => idx !== activeSheetIndex);
    setSheets(newSheets);
    setActiveSheetIndex(Math.max(0, activeSheetIndex - 1));
  };
  
  const insertFunction = (func: string) => {
    setFormulaBar(func);
    setShowFunctionsMenu(false);
  };
  
  const functions = [
    { name: 'SUM', syntax: '=SUM(A1:A10)', description: 'Sum of values' },
    { name: 'AVERAGE', syntax: '=AVERAGE(A1:A10)', description: 'Average of values' },
    { name: 'COUNT', syntax: '=COUNT(A1:A10)', description: 'Count of numbers' },
    { name: 'MAX', syntax: '=MAX(A1:A10)', description: 'Maximum value' },
    { name: 'MIN', syntax: '=MIN(A1:A10)', description: 'Minimum value' },
    { name: 'IF', syntax: '=IF(A1>10,"Yes","No")', description: 'Conditional' },
    { name: 'VLOOKUP', syntax: '=VLOOKUP(A1,A:B,2,FALSE)', description: 'Vertical lookup' },
    { name: 'CONCATENATE', syntax: '=CONCATENATE(A1," ",B1)', description: 'Join text' },
  ];
  
  const chartTypes = [
    { type: 'bar', name: 'Bar Chart', icon: '📊' },
    { type: 'line', name: 'Line Chart', icon: '📈' },
    { type: 'pie', name: 'Pie Chart', icon: '🥧' },
    { type: 'scatter', name: 'Scatter Plot', icon: '⚫' },
  ];
  
  const exportSpreadsheet = (format: 'csv' | 'xlsx' | 'pdf') => {
    alert(`Exporting spreadsheet as ${format.toUpperCase()}...`);
  };
  
  return (
    <div className="spreadsheet-editor">
      {/* Header */}
      <div className="spreadsheet-header">
        <div className="spreadsheet-title">
          <h1>📈 Spreadsheet Editor</h1>
          <input 
            type="text" 
            placeholder="Untitled Spreadsheet"
            className="spreadsheet-name-input"
          />
        </div>
        
        <div className="spreadsheet-actions">
          <button className="action-btn" onClick={() => setShowChartModal(true)}>
            📊 Insert Chart
          </button>
          <button className="action-btn" onClick={() => setShowFunctionsMenu(true)}>
            ƒx Functions
          </button>
          <div className="export-dropdown">
            <button className="action-btn">📥 Export</button>
            <div className="dropdown-menu">
              <button onClick={() => exportSpreadsheet('csv')}>Export as CSV</button>
              <button onClick={() => exportSpreadsheet('xlsx')}>Export as XLSX</button>
              <button onClick={() => exportSpreadsheet('pdf')}>Export as PDF</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="spreadsheet-toolbar">
        <div className="toolbar-group">
          <button className="toolbar-btn" title="Bold">
            <strong>B</strong>
          </button>
          <button className="toolbar-btn" title="Italic">
            <em>I</em>
          </button>
          <button className="toolbar-btn" title="Underline">
            <u>U</u>
          </button>
        </div>
        
        <div className="toolbar-group">
          <button className="toolbar-btn" title="Align Left">☰</button>
          <button className="toolbar-btn" title="Align Center">☷</button>
          <button className="toolbar-btn" title="Align Right">☱</button>
        </div>
        
        <div className="toolbar-group">
          <label>
            <input type="color" defaultValue="#ffffff" />
            Fill
          </label>
          <label>
            <input type="color" defaultValue="#000000" />
            Text
          </label>
        </div>
        
        <div className="toolbar-group">
          <select className="toolbar-select">
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Courier New</option>
          </select>
          <select className="toolbar-select">
            <option>10</option>
            <option>12</option>
            <option>14</option>
            <option>16</option>
            <option>18</option>
          </select>
        </div>
      </div>
      
      {/* Formula Bar */}
      <div className="formula-bar">
        <div className="cell-reference">{selectedCell}</div>
        <input
          type="text"
          value={formulaBar}
          onChange={(e) => setFormulaBar(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && selectedCell) {
              handleCellChange(selectedCell, formulaBar);
            }
          }}
          placeholder="Enter value or formula (e.g., =SUM(A1:A10))"
        />
      </div>
      
      {/* Spreadsheet Grid */}
      <div className="spreadsheet-container">
        <div className="spreadsheet-grid">
          {/* Column Headers */}
          <div className="grid-row header-row">
            <div className="grid-cell corner-cell"></div>
            {columnLabels.map((label) => (
              <div key={label} className="grid-cell header-cell">
                {label}
              </div>
            ))}
          </div>
          
          {/* Data Rows */}
          {Array.from({ length: rows }, (_, rowIdx) => (
            <div key={rowIdx} className="grid-row">
              <div className="grid-cell header-cell">{rowIdx + 1}</div>
              {columnLabels.map((_, colIdx) => {
                const key = getCellKey(colIdx, rowIdx);
                const cell = getCell(key);
                const isSelected = selectedCell === key;
                
                return (
                  <div
                    key={key}
                    className={`grid-cell data-cell ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCellClick(key)}
                    style={{
                      backgroundColor: cell.style?.backgroundColor,
                      color: cell.style?.textColor,
                      fontWeight: cell.style?.bold ? 'bold' : 'normal',
                      fontStyle: cell.style?.italic ? 'italic' : 'normal',
                      textAlign: cell.style?.align || 'left',
                    }}
                  >
                    {isSelected ? (
                      <input
                        type="text"
                        value={formulaBar}
                        onChange={(e) => setFormulaBar(e.target.value)}
                        onBlur={() => handleCellChange(key, formulaBar)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleCellChange(key, formulaBar);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <span>{cell.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Sheet Tabs */}
      <div className="sheet-tabs">
        <div className="tabs-list">
          {sheets.map((sheet, idx) => (
            <div
              key={sheet.id}
              className={`sheet-tab ${idx === activeSheetIndex ? 'active' : ''}`}
              onClick={() => setActiveSheetIndex(idx)}
            >
              {sheet.name}
            </div>
          ))}
        </div>
        <div className="tabs-actions">
          <button className="tab-action-btn" onClick={addSheet} title="Add Sheet">
            +
          </button>
          <button 
            className="tab-action-btn" 
            onClick={deleteSheet} 
            disabled={sheets.length === 1}
            title="Delete Sheet"
          >
            −
          </button>
        </div>
      </div>
      
      {/* Functions Menu */}
      {showFunctionsMenu && (
        <div className="modal-overlay" onClick={() => setShowFunctionsMenu(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>ƒx Insert Function</h2>
            <div className="functions-list">
              {functions.map((func) => (
                <div
                  key={func.name}
                  className="function-item"
                  onClick={() => insertFunction(func.syntax)}
                >
                  <div className="function-name">{func.name}</div>
                  <div className="function-syntax">{func.syntax}</div>
                  <div className="function-desc">{func.description}</div>
                </div>
              ))}
            </div>
            <button className="modal-close" onClick={() => setShowFunctionsMenu(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Chart Modal */}
      {showChartModal && (
        <div className="modal-overlay" onClick={() => setShowChartModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>📊 Insert Chart</h2>
            <p>Select a chart type:</p>
            <div className="chart-types-grid">
              {chartTypes.map((chart) => (
                <div
                  key={chart.type}
                  className="chart-type-card"
                  onClick={() => {
                    alert(`Inserting ${chart.name}...`);
                    setShowChartModal(false);
                  }}
                >
                  <span className="chart-icon">{chart.icon}</span>
                  <span className="chart-name">{chart.name}</span>
                </div>
              ))}
            </div>
            <button className="modal-close" onClick={() => setShowChartModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpreadsheetEditor;

