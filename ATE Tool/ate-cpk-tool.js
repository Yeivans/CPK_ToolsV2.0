let excelData = null;
let tableContainer = null;
let excelFileName = null; // 存储Excel文件名用于导出命名

// 分页参数
const PAGE_SIZE = 30; // 每页显示30行（可根据需要调整）
let currentPage = 1;
let currentData = null;

document.addEventListener('DOMContentLoaded', function() {
    tableContainer = document.getElementById('tableContainer');
    
    // 初始化多语言支持
    initializeLanguageSupport();
    
    // 初始化通道输入框监听
    initializeChannelInputs();
    
    // 初始化重新解析按钮
    initializeReparseButton();
});

const translations = {
    'zh-TW': {
        title: 'CPK 分析工具',
        uploadExcel: '上傳 Excel',
        uploadAteReport: '上傳 ATE Report',
        confirm: '確認',
        reparse: '重新解析',
        executeCpk: '執行 CPK',
        exportCpk: '導出CPK',
        exportImage: '導出圖片',
        showAiChat: '顯示AI聊天',
        hideAiChat: '隱藏AI聊天',
        aiChat: 'AI詢問聊天',
        inputPlaceholder: '請輸入您的問題...',
        send: '發送',
        help: '1.點擊導入Excel，導入Chromra ATE Data\n2.上傳ATE Report txt文件\n3.輸入Testlog對應每組訊號\n4.點擊"執行CPK"\n5.點擊"導出CPK"或"導出圖片"',
        uploadFirst: '請先上傳並計算 CPK！',
        fileName: '檔案名稱',
        modelName: '提取的型號'
    },
    'en': {
        title: 'CPK Analysis Tool',
        uploadExcel: 'Upload Excel',
        uploadAteReport: 'Upload ATE Report',
        confirm: 'Confirm',
        reparse: 'Reparse',
        executeCpk: 'Execute CPK',
        exportCpk: 'Export CPK',
        exportImage: 'Export Image',
        showAiChat: 'Show AI Chat',
        hideAiChat: 'Hide AI Chat',
        aiChat: 'AI Chat',
        inputPlaceholder: 'Enter your question...',
        send: 'Send',
        help: '1. Click to import Excel and import Chromra ATE Data\n2. Upload ATE Report txt file\n3. Enter signal groups corresponding to Testlog\n4. Click "Execute CPK"\n5. Click "Export CPK" or "Export Image"',
        uploadFirst: 'Please upload and calculate CPK first!',
        fileName: 'File Name',
        modelName: 'Extracted Model'
    },
    'vi': {
        title: 'Công cụ Phân tích CPK',
        uploadExcel: 'Tải lên Excel',
        uploadAteReport: 'Tải lên ATE Report',
        executeCpk: 'Thực hiện CPK',
        exportCpk: 'Xuất CPK',
        exportImage: 'Xuất ảnh',
        showAiChat: 'Hiện AI Chat',
        hideAiChat: 'Ẩn AI Chat',
        aiChat: 'Hỏi đáp AI',
        inputPlaceholder: 'Nhập câu hỏi của bạn...',
        send: 'Gửi',
        help: '1. Nhấp để nhập Excel, nhập Chromra ATE Data\n2. Tải lên tệp txt ATE Report\n3. Nhập tín hiệu tương ứng với Testlog\n4. Nhấp "Thực hiện CPK"\n5. Nhấp "Xuất CPK" hoặc "Xuất ảnh"',
        uploadFirst: 'Vui lòng tải lên và tính CPK trước!',
        fileName: 'Tên Tệp',
        modelName: 'Mô Hình Trích Xuất'
    }
};

// 工具函数
function findRowIdx(data, name) {
    return data.findIndex(row => String(row[0]).toUpperCase().trim() === name.toUpperCase());
}
function findRowIdxByCell(data, keyword) {
    return data.findIndex(row => row.some(cell => String(cell).includes(keyword)));
}
function safeParse(v) {
    return isNaN(parseFloat(v)) ? 0 : parseFloat(v);
}

// 从Excel文件名提取Model Name
function extractModelName(fileName) {
    if (!fileName) return 'Unknown_Model';
    
    // 移除文件扩展名
    const nameWithoutExt = fileName.replace(/\.(xlsx|xls)$/i, '');
    
    // 根据您的例子：PS-2422-4D_EVT_PREATE IMON (50PCS)-A1 -> PS-2422-4D
    // 但您说应该是PS-2322-4D，所以我假设这是个打字错误，按照模式匹配
    
    // 匹配模式1：XX-XXXX-XX格式（字母-数字-字母数字组合）
    const modelMatch1 = nameWithoutExt.match(/^([A-Z]{2}-\d{4}-\d[A-Z])/);
    if (modelMatch1) {
        return modelMatch1[1];
    }
    
    // 匹配模式2：更通用的型号格式，直到遇到下划线
    const modelMatch2 = nameWithoutExt.match(/^([A-Z]{2}-\d{4}-[A-Z0-9]+)(?=_)/);
    if (modelMatch2) {
        return modelMatch2[1];
    }
    
    // 匹配模式3：字母数字组合直到第一个下划线或空格
    const modelMatch3 = nameWithoutExt.match(/^([A-Z0-9\-]+)(?=[\s_])/);
    if (modelMatch3) {
        return modelMatch3[1];
    }
    
    // 如果上述模式不匹配，尝试匹配到第一个括号、下划线或空格前的部分
    const alternativeMatch = nameWithoutExt.match(/^([^_\(\s]+)/);
    if (alternativeMatch) {
        return alternativeMatch[1].trim();
    }
    
    // 如果都不匹配，返回去除扩展名的完整文件名（限制长度）
    return nameWithoutExt.substring(0, 20);
}

// 生成导出文件名
function generateExportFileName(type = 'excel') {
    const modelName = extractModelName(excelFileName);
    const now = new Date();
    const timestamp = now.getFullYear().toString() + 
                     (now.getMonth() + 1).toString().padStart(2, '0') + 
                     now.getDate().toString().padStart(2, '0') + '_' +
                     now.getHours().toString().padStart(2, '0') + 
                     now.getMinutes().toString().padStart(2, '0') + 
                     now.getSeconds().toString().padStart(2, '0');
    
    if (type === 'excel') {
        return `${modelName}_ATE CPK_${timestamp}.xlsx`;
    } else if (type === 'image') {
        return `${modelName}_ATE CPK_${timestamp}.png`;
    }
    
    return `${modelName}_ATE CPK_${timestamp}`;
}

// Excel上传处理函数
function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/octet-stream' // 有时Excel文件可能被识别为这种类型
    ];
    
    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (!['xlsx', 'xls'].includes(fileExtension)) {
        alert('請選擇正確的Excel文件格式（.xlsx 或 .xls）！');
        return;
    }
    
    // 检查文件大小（最大10MB）
    if (file.size > 10 * 1024 * 1024) {
        alert('文件太大，請選擇小於10MB的Excel文件！');
        return;
    }
    
    const reader = new FileReader();
    reader.onerror = function() {
        alert('文件讀取失敗，請檢查文件是否損壞！');
    };
    
    reader.onload = function(e) {
        try {
            // 檢查XLSX庫是否可用
            if (typeof XLSX === 'undefined') {
                alert('Excel處理庫未加載，請刷新頁面重試！');
                return;
            }
            
            const data = new Uint8Array(e.target.result);
            
            // 嘗試讀取工作簿
            const workbook = XLSX.read(data, { 
                type: 'array',
                cellFormula: false,
                cellHTML: false,
                cellNF: false,
                cellStyles: false,
                sheetStubs: false,
                dense: false
            });
            
            // 檢查工作簿是否有效
            if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
                alert('Excel文件為空或格式不正確，請檢查文件內容！');
                return;
            }
            
            // 獲取第一個工作表
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            if (!worksheet) {
                alert('無法讀取Excel工作表，請檢查文件格式！');
                return;
            }
            
            // 轉換為JSON數組
            excelData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1,
                defval: '',
                blankrows: false
            });
            
            // 檢查數據是否有效
            if (!excelData || excelData.length === 0) {
                alert('Excel文件中沒有找到有效數據！');
                return;
            }
            
            // 過濾空行
            excelData = excelData.filter(row => row.some(cell => cell !== '' && cell !== null && cell !== undefined));
            
            if (excelData.length === 0) {
                alert('Excel文件中沒有找到有效的非空數據行！');
                return;
            }
            
            console.log('Excel數據加載成功，共', excelData.length, '行數據');
            
            // 保存Excel文件名用于导出命名
            excelFileName = file.name;
            const modelName = extractModelName(file.name);
            
            console.log('原始文件名:', file.name);
            console.log('提取的型号名:', modelName);
            
            displayTablePaged(excelData, 1); // 使用分页预览
            
            // 获取当前语言
            const currentLang = localStorage.getItem('selectedLanguage') || 'zh-TW';
            const lang = translations[currentLang];
            
            // 顯示成功提示
            const statusDiv = document.createElement('div');
            statusDiv.style.cssText = 'color: #28CD41; font-weight: 500; margin: 10px 0; text-align: center;';
            statusDiv.innerHTML = `
                ✅ Excel文件上傳成功！共加載 ${excelData.length} 行數據<br>
                <span style="color: #007acc; font-size: 14px;">📁 ${lang.fileName}: ${file.name}</span><br>
                <span style="color: #007acc; font-size: 14px;">🏷️ ${lang.modelName}: ${modelName}</span>
            `;
            
            const inputBar = document.querySelector('.input-bar');
            const existingStatus = inputBar.querySelector('.upload-status');
            if (existingStatus) {
                existingStatus.remove();
            }
            statusDiv.className = 'upload-status';
            inputBar.appendChild(statusDiv);
            
        } catch (error) {
            console.error('Excel processing error:', error);
            let errorMessage = 'Excel處理出錯：';
            
            if (error.message.includes('Unsupported file')) {
                errorMessage += '不支持的文件格式，請使用標準的Excel文件';
            } else if (error.message.includes('Invalid')) {
                errorMessage += '文件格式無效或已損壞';
            } else if (error.message.includes('password')) {
                errorMessage += '無法處理受密碼保護的文件';
            } else {
                errorMessage += '請檢查文件是否為有效的Excel格式';
            }
            
            alert(errorMessage + '\n\n詳細錯誤：' + error.message);
        }
    };
    
    reader.readAsArrayBuffer(file);
}
// 可以删除这一段，因为在后面的 initEventListeners() 已经绑定了 excelUpload 的 change 事件。
// 如果保留会导致重复绑定，可能多次触发 handleExcelUpload。
// 建议删除，不影响功能。

// 表格显示函数
function displayTable(data) {
    if (!data || !data.length) return;
    
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
    const table = document.createElement('table');
    
    data.forEach((row, rowIdx) => {
        const tr = document.createElement('tr');
        row.forEach((cell, colIdx) => {
            const td = document.createElement('td');
            if (typeof cell === 'number') {
                td.textContent = cell.toFixed(3);
            } else {
                td.textContent = cell || '';
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    
    tableContainer.appendChild(table);
}

// 删除重复的Excel上传监听器，使用上面的handleExcelUpload函数

// 表格预览渲染
function displayTable(data) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
    const table = document.createElement('table');
    data.forEach((row, rowIdx) => {
        const tr = document.createElement('tr');
        const firstCell = (row[0] || '').toString().toUpperCase().trim();
        const isMergeRow = (row[0] === 'Test Item' || row[0] === 'Input Condition' || row[0] === 'Test Condition');
        if (isMergeRow) {
            let col = 0;
            while (col < row.length) {
                let colspan = 1;
                while (
                    col + colspan < row.length &&
                    row[col] !== undefined &&
                    row[col] === row[col + colspan]
                ) colspan++;
                const td = document.createElement('td');
                td.textContent = row[col] ?? '';
                if (colspan > 1) td.colSpan = colspan;
                tr.appendChild(td);
                col += colspan;
            }
            table.appendChild(tr);
            return;
        }
        row.forEach((cell, idx) => {
            const td = document.createElement('td');
            if (typeof cell === 'number' && !isNaN(cell)) {
                td.textContent = cell.toFixed(3);
            } else if (!isNaN(parseFloat(cell)) && cell !== '' && cell !== null) {
                td.textContent = Number(cell).toFixed(3);
            } else {
                td.textContent = cell ?? '';
            }
            // 恢复颜色
            if (firstCell === 'MAX_SPEC' || firstCell === 'CPU') {
                td.style.backgroundColor = '#ffe599';
            } else if (firstCell === 'MIN_SPEC' || firstCell === 'CPL') {
                td.style.backgroundColor = '#d9ead3';
            } else if (firstCell === 'CONCLUSION') {
                if (idx > 0 && cell === 'PASS') {
                    td.style.backgroundColor = '#38761d';
                    td.style.color = '#fff';
                } else if (idx > 0 && cell === 'FAIL') {
                    td.style.backgroundColor = '#e06666';
                    td.style.color = '#fff';
                }
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    tableContainer.appendChild(table);
}

// ATE Report txt上传 - 初始化时绑定
document.getElementById('ateReportUpload')?.addEventListener('change', handleAteReportUpload);

function displayAteReportContent(content, fileName) {
    // 創建或獲取ATE Report預覽區域
    let ateReportPreview = document.getElementById('ateReportPreview');
    if (!ateReportPreview) {
        ateReportPreview = document.createElement('div');
        ateReportPreview.id = 'ateReportPreview';
        ateReportPreview.style.cssText = 'margin: 20px 0; padding: 16px; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;';
        
        // 插入到輸入欄後面
        const inputBar = document.querySelector('.input-bar');
        inputBar.insertAdjacentElement('afterend', ateReportPreview);
    }
    
    // 顯示文件信息和內容預覽
    const lines = content.split('\n');
    const previewLines = lines.slice(0, 20); // 只顯示前20行
    
    ateReportPreview.innerHTML = `
        <h4 style="margin: 0 0 12px 0; color: #495057;">
            <i class="fa-solid fa-file-text" style="margin-right: 8px;"></i>
            ATE Report 預覽: ${fileName}
        </h4>
        <div style="font-size: 13px; color: #6c757d; margin-bottom: 12px;">
            文件總行數: ${lines.length} | 顯示前 ${previewLines.length} 行
        </div>
        <pre style="background: white; padding: 12px; border-radius: 4px; font-size: 12px; line-height: 1.4; max-height: 300px; overflow-y: auto; white-space: pre-wrap; word-wrap: break-word;">${previewLines.join('\n')}</pre>
        ${lines.length > 20 ? '<div style="font-size: 12px; color: #6c757d; text-align: center; margin-top: 8px;">... 還有更多內容 ...</div>' : ''}
    `;
    
    // 存儲ATE Report內容供後續使用
    window.ateReportData = {
        content: content,
        fileName: fileName,
        lines: lines
    };
}

// “確認”按钮功能
document.getElementById('confirmBtn').addEventListener('click', function() {
    const inputs = document.querySelectorAll('.input-bar .custom-input');
    const values = Array.from(inputs).map(input => input.value.trim());
    let html = '<table style="margin-top:20px;"><tr>';
    for (let i = 0; i < values.length; i++) html += `<th>CH${i+1}</th>`;
    html += '</tr><tr>';
    for (let v of values) html += `<td>${v || ''}</td>`;
    html += '</tr></table>';
    let exist = document.getElementById('chTablePreview');
    if (!exist) {
        exist = document.createElement('div');
        exist.id = 'chTablePreview';
        document.querySelector('.input-bar').after(exist);
    }
    exist.innerHTML = html;
});

// “執行CPK”按钮功能
document.getElementById('executeCpkBtn').addEventListener('click', function() {
    // 替換S/N行中的 _1_ ~ _10_，保留“_”
    const chInputs = document.querySelectorAll('.input-bar .custom-input');
    const chValues = Array.from(chInputs).map(input => input.value.trim());
    if (excelData && excelData.length > 0) {
        const snRowIdx = excelData.findIndex(row => row.some(cell => String(cell).toUpperCase().includes('S/N')));
        if (snRowIdx !== -1) {
            for (let i = 0; i < chValues.length; i++) {
                const target = `_${i + 1}_`;
                const value = chValues[i];
                for (let col = 0; col < excelData[snRowIdx].length; col++) {
                    if (typeof excelData[snRowIdx][col] === 'string' && excelData[snRowIdx][col].includes(target)) {
                        excelData[snRowIdx][col] = excelData[snRowIdx][col].replaceAll(target, `_${value}_`);
                    }
                }
            }
        }
    }

    // 在 S/N 行中，每个单元格只保留第二个下划线前的内容（第二根下划线也删除）
    const snRowIdx = excelData.findIndex(row => row.some(cell => String(cell).toUpperCase().includes('S/N')));
    if (snRowIdx !== -1) {
        for (let col = 0; col < excelData[snRowIdx].length; col++) {
            let cell = excelData[snRowIdx][col];
            if (typeof cell === 'string') {
                // 找到第二个下划线的位置
                let firstIdx = cell.indexOf('_');
                let secondIdx = cell.indexOf('_', firstIdx + 1);
                if (secondIdx !== -1) {
                    // 保留第二个下划线之前的内容（不包含第二根下划线）
                    excelData[snRowIdx][col] = cell.substring(0, secondIdx);
                }
            }
        }
    }

    // 工具函数
    const findRowIdx = (data, name) => data.findIndex(row => String(row[0]).toUpperCase().trim() === name.toUpperCase());
    const findRowIdxByCell = (data, keyword) => data.findIndex(row => row.some(cell => String(cell).includes(keyword)));
    const safeParse = v => isNaN(parseFloat(v)) ? 0 : parseFloat(v);

    // 1. 保留 "S/N" 的上一行及其后内容
    const snRowIndex = findRowIdxByCell(excelData, 'S/N');
    if (snRowIndex === -1) {
        alert('未找到含有 "S/N" 的行！');
        return;
    }
    let filteredData = excelData.slice(Math.max(0, snRowIndex - 1));

    // 2. 在 S/N 上一行的下一行插入 Input Condition 和 Test Condition 空白行
    if (filteredData.length > 0) {
        const inputConditionRow = Array(filteredData[0].length).fill('');
        inputConditionRow[0] = 'Input Condition';
        filteredData.splice(1, 0, inputConditionRow);
        
        const testConditionRow = Array(filteredData[0].length).fill('');
        testConditionRow[0] = 'Test Condition';
        filteredData.splice(2, 0, testConditionRow);
    }

    // 3. 在 MAX_SPEC 那一行前插入 Lowest、Hightest、Xbar、S
    const insertRowsBefore = (arr, idx, names) => {
        for (let i = 0; i < names.length; i++) {
            const newRow = Array(arr[0].length).fill('');
            newRow[0] = names[i];
            arr.splice(idx + i, 0, newRow);
        }
    };
    let maxSpecIdx = findRowIdxByCell(filteredData, 'MAX_SPEC');
    if (maxSpecIdx !== -1) {
        insertRowsBefore(filteredData, maxSpecIdx, ['Lowest', 'Hightest', 'Xbar', 'S']);
    }

    // 4. 在 MIN_SPEC 那一行后插入6行
    const minSpecIdx = findRowIdxByCell(filteredData, 'MIN_SPEC');
    if (minSpecIdx !== -1) {
        const names = ['Ca', 'Cp', 'CPL', 'CPU', 'CPK', 'Conclusion'];
        for (let i = 0; i < names.length; i++) {
            const newRow = Array(filteredData[0].length).fill('');
            newRow[0] = names[i];
            filteredData.splice(minSpecIdx + 1 + i, 0, newRow);
        }
    }

    // 5. 第一行第一格输入 "Test Item"
    if (filteredData[0]?.length) filteredData[0][0] = 'Test Item';

    // 6. 剪切所有括号里的内容到“Test Condition”行，并删除“Test Item”行的所有括号及内容
    if (filteredData.length > 2) {
        const inputConditionRowIdx = 1;  // Input Condition 行索引
        const testConditionRowIdx = 2;   // Test Condition 行索引
        
        for (let col = 0; col < filteredData[0].length; col++) {
            const cell = filteredData[0][col];
            if (typeof cell === 'string') {
                const matches = [...cell.matchAll(/[（(]([^）)]+)[）)]/g)];
                if (matches.length > 0) {
                    let inputConditions = [];
                    let testConditions = [];
                    
                    // 遍历所有括号内容
                    matches.forEach(match => {
                        const fullMatch = match[0]; // 完整匹配（包括括号）
                        const content = match[1]; // 括号内的内容（不包括括号）
                        
                        // 识别电压/频率条件：只识别带有DC/AC或频率的完整电压条件
                        const voltagePattern = /(\d+V(?:DC|AC|\/\d+Hz))/i;
                        const voltageMatch = content.match(voltagePattern);
                        
                        if (voltageMatch) {
                            // 提取电压/频率部分作为输入条件
                            inputConditions.push(voltageMatch[1]);
                            
                            // 将剩余内容作为测试条件
                            const remaining = content.replace(voltagePattern, '').replace(/^[_,\s]+|[_,\s]+$/g, '');
                            if (remaining) {
                                testConditions.push(remaining);
                            }
                        } else {
                            // 没有电压条件，全部作为测试条件
                            testConditions.push(content);
                        }
                    });
                    
                    // 设置 Input Condition 行
                    if (inputConditions.length > 0) {
                        filteredData[inputConditionRowIdx][col] = inputConditions.join(', ');
                    }
                    
                    // 设置 Test Condition 行
                    if (testConditions.length > 0) {
                        filteredData[testConditionRowIdx][col] = testConditions.join(', ');
                    }
                    
                    // 从原始 Test Item 行中删除所有括号内容
                    filteredData[0][col] = cell.replace(/[（(][^）)]+[）)]/g, '').trim();
                }
            }
        }
    }

    // 7. 删除第二列中等于 0 的行
    filteredData = filteredData.filter((row, idx) => idx === 0 || row[1] !== 0);

    // 8. 删除列的条件：
    // 1) 整列（除表头外）全为0的列要删除
    // 2) S/N下一行到Lowest上一行中，全为0、1或2的列也要删除
    if (filteredData.length > 0) {
        const snIdx = findRowIdx(filteredData, 'S/N');
        const lowestIdx = findRowIdx(filteredData, 'Lowest');
        
        if (snIdx !== -1 && lowestIdx !== -1) {
            const keepCols = [];
            for (let col = 0; col < filteredData[0].length; col++) {
                let shouldKeep = false;
                let hasNonZeroOneTwoVal = false;

                // 检查整列是否全为0（除表头外）
                for (let row = 1; row < filteredData.length; row++) {
                    const val = filteredData[row][col];
                    if (val !== 0 && val !== '0' && val !== '' && val !== null) {
                        shouldKeep = true;
                    }
                }

                // 检查S/N下一行到Lowest上一行是否全为0、1或2
                for (let row = snIdx + 1; row < lowestIdx; row++) {
                    const val = Number(filteredData[row][col]);
                    if (val !== 0 && val !== 1 && val !== 2) {
                        hasNonZeroOneTwoVal = true;
                        break;
                    }
                }

                // 只有满足以下条件才保留该列：
                // 1) 不是整列都为0
                // 2) S/N到Lowest之间不是全为0、1或2
                if (shouldKeep && hasNonZeroOneTwoVal) {
                    keepCols.push(col);
                }
            }
            filteredData = filteredData.map(row => keepCols.map(col => row[col]));
        }
    }

    // 9. 删除 MAX_SPEC & MIN_SPEC 行中同一列同时为 "*" 或空白的列
    maxSpecIdx = findRowIdxByCell(filteredData, 'MAX_SPEC');
    const minSpecIdx2 = findRowIdxByCell(filteredData, 'MIN_SPEC');
    if (maxSpecIdx !== -1 && minSpecIdx2 !== -1) {
        const keepCols = [];
        for (let col = 0; col < filteredData[0].length; col++) {
            const maxCell = filteredData[maxSpecIdx][col];
            const minCell = filteredData[minSpecIdx2][col];
            const isMaxEmptyOrStar = maxCell == null || String(maxCell).trim() === '' || String(maxCell).trim() === '*';
            const isMinEmptyOrStar = minCell == null || String(minCell).trim() === '' || String(minCell).trim() === '*';
            if (!(isMaxEmptyOrStar && isMinEmptyOrStar)) keepCols.push(col);
        }
        filteredData = filteredData.map(row => keepCols.map(col => row[col]));
    }

    // 10. 计算 Lowest 行 - 使用简化公式
    const lowestRowIdx = findRowIdx(filteredData, 'Lowest');
    const snIdx = findRowIdxByCell(filteredData, 'S/N');
    if (lowestRowIdx !== -1 && snIdx !== -1) {
        for (let col = 1; col < filteredData[0].length; col++) {
            const values = [];
            for (let row = snIdx + 1; row < lowestRowIdx; row++) {
                const val = safeParse(filteredData[row][col]);
                if (!isNaN(val)) values.push(val);
            }
            if (values.length > 0) {
                filteredData[lowestRowIdx][col] = Math.min(...values);
            }
        }
    }

    // 11. 计算 Highest 行 - 使用简化公式
    const hightestRowIdx = findRowIdx(filteredData, 'Hightest');
    if (hightestRowIdx !== -1 && snIdx !== -1) {
        for (let col = 1; col < filteredData[0].length; col++) {
            const values = [];
            for (let row = snIdx + 1; row < hightestRowIdx; row++) {
                const val = safeParse(filteredData[row][col]);
                if (!isNaN(val)) values.push(val);
            }
            if (values.length > 0) {
                filteredData[hightestRowIdx][col] = Math.max(...values);
            }
        }
    }

    // 12. 计算 Xbar 行 - 使用简化公式
    const xbarRowIdx = findRowIdx(filteredData, 'Xbar');
    if (xbarRowIdx !== -1 && lowestRowIdx !== -1 && snIdx !== -1) {
        for (let col = 1; col < filteredData[0].length; col++) {
            const values = [];
            for (let row = snIdx + 1; row < lowestRowIdx; row++) {
                const val = safeParse(filteredData[row][col]);
                if (!isNaN(val)) values.push(val);
            }
            if (values.length > 0) {
                filteredData[xbarRowIdx][col] = values.reduce((a, b) => a + b, 0) / values.length;
            }
        }
    }

    // 13. 计算 S 行（总体标准差）- 使用简化公式
    const sRowIdx = findRowIdx(filteredData, 'S');
    if (sRowIdx !== -1 && lowestRowIdx !== -1 && snIdx !== -1) {
        for (let col = 1; col < filteredData[0].length; col++) {
            const values = [];
            for (let row = snIdx + 1; row < lowestRowIdx; row++) {
                const val = safeParse(filteredData[row][col]);
                if (!isNaN(val)) values.push(val);
            }
            if (values.length > 0) {
                const mean = values.reduce((a, b) => a + b, 0) / values.length;
                const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
                filteredData[sRowIdx][col] = Math.sqrt(variance);
            }
        }
    }

    // 14. 计算 Ca 行 - 使用简化公式
    const caRowIdx = findRowIdx(filteredData, 'Ca');
    const xbarRowIdx2 = findRowIdx(filteredData, 'Xbar');
    const maxSpecIdx2 = findRowIdx(filteredData, 'MAX_SPEC');
    const minSpecIdx3 = findRowIdx(filteredData, 'MIN_SPEC');
    if (caRowIdx !== -1 && xbarRowIdx2 !== -1 && maxSpecIdx2 !== -1 && minSpecIdx3 !== -1) {
        for (let col = 1; col < filteredData[0].length; col++) {
            const xbar = safeParse(filteredData[xbarRowIdx2][col]);
            const maxSpec = safeParse(filteredData[maxSpecIdx2][col]);
            const minSpec = safeParse(filteredData[minSpecIdx3][col]);
            const specCenter = (maxSpec + minSpec) / 2;
            const specRange = (maxSpec - minSpec) / 2;
            if (specRange !== 0) {
                filteredData[caRowIdx][col] = Math.abs((xbar - specCenter) / specRange);
            }
        }
    }

    // 15. 计算 Cp 行 - 使用简化公式
    const cpRowIdx = findRowIdx(filteredData, 'Cp');
    const sRowIdx2 = findRowIdx(filteredData, 'S');
    const maxSpecIdx3 = findRowIdx(filteredData, 'MAX_SPEC');
    const minSpecIdx4 = findRowIdx(filteredData, 'MIN_SPEC');
    if (cpRowIdx !== -1 && sRowIdx2 !== -1 && maxSpecIdx3 !== -1 && minSpecIdx4 !== -1) {
        for (let col = 1; col < filteredData[0].length; col++) {
            const maxSpec = safeParse(filteredData[maxSpecIdx3][col]);
            const minSpec = safeParse(filteredData[minSpecIdx4][col]);
            const s = safeParse(filteredData[sRowIdx2][col]);
            if (s !== 0 && maxSpec !== minSpec) {
                filteredData[cpRowIdx][col] = (maxSpec - minSpec) / (6 * s);
            }
        }
    }

    // 16. 计算 CPL 行 - 使用简化公式：(Xbar-MIN_SPEC)/(3*S)，只在 MIN_SPEC 有值时才计算
    const cplRowIdx = findRowIdx(filteredData, 'CPL');
    const xbarRowIdx3 = findRowIdx(filteredData, 'Xbar');
    const sRowIdx3 = findRowIdx(filteredData, 'S');
    const minSpecIdx5 = findRowIdx(filteredData, 'MIN_SPEC');
    if (cplRowIdx !== -1 && xbarRowIdx3 !== -1 && sRowIdx3 !== -1 && minSpecIdx5 !== -1) {
        for (let col = 1; col < filteredData[0].length; col++) {
            const xbar = safeParse(filteredData[xbarRowIdx3][col]);
            const minSpec = safeParse(filteredData[minSpecIdx5][col]);
            const s = safeParse(filteredData[sRowIdx3][col]);
            // 只有 MIN_SPEC 有值才计算
            if (!isNaN(xbar) && !isNaN(minSpec) && !isNaN(s) && s !== 0) {
                filteredData[cplRowIdx][col] = (xbar - minSpec) / (3 * s);
            }
        }
    }

    // 17. 计算 CPU 行：((MAX_SPEC-Xbar)/(3*S))，只在 MAX_SPEC 有值时计算
    const cpuRowIdx = findRowIdx(filteredData, 'CPU');
    const maxSpecIdx5 = findRowIdx(filteredData, 'MAX_SPEC');
    const xbarRowIdx4 = findRowIdx(filteredData, 'Xbar');
    const sRowIdx4 = findRowIdx(filteredData, 'S');
    if (
        cpuRowIdx !== -1 &&
        maxSpecIdx5 !== -1 &&
        xbarRowIdx4 !== -1 &&
        sRowIdx4 !== -1
    ) {
        for (let col = 1; col < filteredData[0].length; col++) {
            const maxSpec = parseFloat(filteredData[maxSpecIdx5][col]);
            const xbar = parseFloat(filteredData[xbarRowIdx4][col]);
            const s = parseFloat(filteredData[sRowIdx4][col]);
            // 只有 MAX_SPEC 有值才计算
            if (
                !isNaN(maxSpec) &&
                !isNaN(xbar) &&
                !isNaN(s) && s !== 0
            ) {
                filteredData[cpuRowIdx][col] = (maxSpec - xbar) / (3 * s);
            }
        }
    }

    // 18. 计算 CPK 行：MIN(CPL, CPU)
    const cpkRowIdx = findRowIdx(filteredData, 'CPK');
    const cplRowIdx2 = findRowIdx(filteredData, 'CPL');
    const cpuRowIdx2 = findRowIdx(filteredData, 'CPU');
    if (cpkRowIdx !== -1 && cplRowIdx2 !== -1 && cpuRowIdx2 !== -1) {
        for (let col = 1; col < filteredData[0].length; col++) {
            const cpl = parseFloat(filteredData[cplRowIdx2][col]);
            const cpu = parseFloat(filteredData[cpuRowIdx2][col]);
            if (!isNaN(cpl) && !isNaN(cpu)) {
                filteredData[cpkRowIdx][col] = Math.min(cpl, cpu);
            } else if (!isNaN(cpl)) {
                filteredData[cpkRowIdx][col] = cpl;
            } else if (!isNaN(cpu)) {
                filteredData[cpkRowIdx][col] = cpu;
            }
            // 若都不是数字则不赋值
        }
    }

    // 19. 计算 Conclusion 行：CPK>=1.67 显示 PASS，否则 FAIL
    const conclusionRowIdx = findRowIdx(filteredData, 'Conclusion');
    const cpkRowIdx2 = findRowIdx(filteredData, 'CPK');
    if (conclusionRowIdx !== -1 && cpkRowIdx2 !== -1) {
        for (let col = 1; col < filteredData[0].length; col++) {
            const cpk = parseFloat(filteredData[cpkRowIdx2][col]);
            if (!isNaN(cpk)) {
                filteredData[conclusionRowIdx][col] = cpk >= 1.67 ? 'PASS' : 'FAIL';
            }
        }
    }

    // 在所有计算完成后，显示表格之前，删除所有"*"字符
    if (filteredData.length > 0) {
        for (let row = 0; row < filteredData.length; row++) {
            for (let col = 0; col < filteredData[row].length; col++) {
                const cell = filteredData[row][col];
                if (typeof cell === 'string') {
                    // 删除单元格中的所有"*"字符
                    filteredData[row][col] = cell.replace(/\*/g, '');
                }
            }
        }
    }

    // 显示处理后的表格
    displayTablePaged(filteredData, 1);
    excelData = filteredData;

    alert('✅ 執行完成！');
});

// 導出Excel
document.getElementById('exportCpkBtn').addEventListener('click', function() {
    if (!excelData || excelData.length === 0) {
        alert('請先上傳並計算 CPK！');
        return;
    }
    const exportData = JSON.parse(JSON.stringify(excelData));
    const findRowIdx = (data, name) => data.findIndex(row => String(row[0]).toUpperCase().trim() === name.toUpperCase());
    const snRowIdx = findRowIdx(exportData, 'S/N');
    const lowestRowIdx = findRowIdx(exportData, 'Lowest');
    const hightestRowIdx = findRowIdx(exportData, 'Hightest');
    const xbarRowIdx = findRowIdx(exportData, 'Xbar');
    const sRowIdx = findRowIdx(exportData, 'S');
    const maxSpecIdx = findRowIdx(exportData, 'MAX_SPEC');
    const minSpecIdx = findRowIdx(exportData, 'MIN_SPEC');
    const caRowIdx = findRowIdx(exportData, 'Ca');      // ← 新增
    const cpRowIdx = findRowIdx(exportData, 'Cp');      // ← 新增
    const cplRowIdx = findRowIdx(exportData, 'CPL');
    const cpuRowIdx = findRowIdx(exportData, 'CPU');
    const cpkRowIdx = findRowIdx(exportData, 'CPK');
    const conclusionRowIdx = findRowIdx(exportData, 'Conclusion');

    const ws = XLSX.utils.aoa_to_sheet(exportData);

    // 居中和三位小数，并处理空值
    for (let row = 0; row < exportData.length; row++) {
        for (let col = 0; col < exportData[0].length; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = ws[cellAddress];
            if (cell) {
                cell.s = { alignment: { horizontal: "center", vertical: "center" } };
                
                // 处理数字格式
                if (typeof cell.v === 'number') {
                    cell.v = Number(cell.v.toFixed(3));
                    cell.z = '0.000';
                }
                // 处理空值或字符串，确保Excel能正确识别
                else if (cell.v === '' || cell.v === null || cell.v === undefined) {
                    // 对于MAX_SPEC和MIN_SPEC行的空值，设置为数字0
                    if ((row === maxSpecIdx || row === minSpecIdx) && col > 0) {
                        cell.v = 0;
                        cell.t = 'n'; // 明确设置为数字类型
                        cell.z = '0.000';
                    } else {
                        cell.v = '';
                        cell.t = 's'; // 设置为字符串类型
                    }
                }
                // 处理字符串转数字
                else if (typeof cell.v === 'string' && !isNaN(parseFloat(cell.v)) && isFinite(cell.v)) {
                    cell.v = parseFloat(cell.v);
                    cell.t = 'n'; // 设置为数字类型
                    cell.z = '0.000';
                }
                
                if (cell.f) cell.z = '0.000';
            }
        }
    }

    // 公式赋值（含MIN_SPEC/MAX_SPEC判斷）
    for (let col = 1; col < exportData[0].length; col++) {
        const colLetter = XLSX.utils.encode_col(col);
        // Lowest - 简化公式
        if (lowestRowIdx !== -1 && snRowIdx !== -1) {
            const start = colLetter + (snRowIdx + 2);
            const end = colLetter + (lowestRowIdx);
            ws[colLetter + (lowestRowIdx + 1)] = { 
                f: `MIN(${start}:${end})`, 
                z: '0.000' 
            };
        }
        // Highest - 简化公式
        if (hightestRowIdx !== -1 && snRowIdx !== -1) {
            const start = colLetter + (snRowIdx + 2);
            const end = colLetter + (hightestRowIdx);
            ws[colLetter + (hightestRowIdx + 1)] = { 
                f: `MAX(${start}:${end})`, 
                z: '0.000' 
            };
        }
        // Xbar - 简化公式
        if (xbarRowIdx !== -1 && lowestRowIdx !== -1 && snRowIdx !== -1) {
            const start = colLetter + (snRowIdx + 2);
            const end = colLetter + (lowestRowIdx);
            ws[colLetter + (xbarRowIdx + 1)] = { 
                f: `AVERAGE(${start}:${end})`, 
                z: '0.000' 
            };
        }
        // S - 简化公式
        if (sRowIdx !== -1 && lowestRowIdx !== -1 && snRowIdx !== -1) {
            const start = colLetter + (snRowIdx + 2);
            const end = colLetter + (lowestRowIdx);
            ws[colLetter + (sRowIdx + 1)] = { 
                f: `STDEV(${start}:${end})`, 
                z: '0.000' 
            };
        }
        // CPL - 简化公式，但保留必要检查
        if (cplRowIdx !== -1 && xbarRowIdx !== -1 && sRowIdx !== -1 && minSpecIdx !== -1) {
            const xbarCell = colLetter + (xbarRowIdx + 1);
            const sCell = colLetter + (sRowIdx + 1);
            const minSpecCell = colLetter + (minSpecIdx + 1);
            const minSpecValue = exportData[minSpecIdx][col];
            
            // 只有 MIN_SPEC 有值才设置公式
            if (minSpecValue !== '' && minSpecValue !== null && !isNaN(Number(minSpecValue))) {
                ws[colLetter + (cplRowIdx + 1)] = { 
                    f: `(${xbarCell}-${minSpecCell})/(3*${sCell})`, 
                    z: '0.000' 
                };
            } else {
                ws[colLetter + (cplRowIdx + 1)] = { v: '' };
            }
        }
        // CPU - 简化公式，但保留必要检查
        if (cpuRowIdx !== -1 && maxSpecIdx !== -1 && xbarRowIdx !== -1 && sRowIdx !== -1) {
            const maxSpecCell = colLetter + (maxSpecIdx + 1);
            const xbarCell = colLetter + (xbarRowIdx + 1);
            const sCell = colLetter + (sRowIdx + 1);
            const maxSpecValue = exportData[maxSpecIdx][col];
            
            // 只有 MAX_SPEC 有值才设置公式
            if (maxSpecValue !== '' && maxSpecValue !== null && !isNaN(Number(maxSpecValue))) {
                ws[colLetter + (cpuRowIdx + 1)] = { 
                    f: `(${maxSpecCell}-${xbarCell})/(3*${sCell})`, 
                    z: '0.000' 
                };
            } else {
                ws[colLetter + (cpuRowIdx + 1)] = { v: '' };
            }
        }
        // CPK - 简化公式，但考虑CPL/CPU可能为空的情况
        if (cpkRowIdx !== -1 && cplRowIdx !== -1 && cpuRowIdx !== -1) {
            const cplCell = colLetter + (cplRowIdx + 1);
            const cpuCell = colLetter + (cpuRowIdx + 1);
            const maxSpecValue = exportData[maxSpecIdx] ? exportData[maxSpecIdx][col] : null;
            const minSpecValue = exportData[minSpecIdx] ? exportData[minSpecIdx][col] : null;
            
            const hasMaxSpec = maxSpecValue !== '' && maxSpecValue !== null && !isNaN(Number(maxSpecValue));
            const hasMinSpec = minSpecValue !== '' && minSpecValue !== null && !isNaN(Number(minSpecValue));
            
            if (hasMaxSpec && hasMinSpec) {
                // 双边规格，使用 MIN(CPL,CPU)
                ws[colLetter + (cpkRowIdx + 1)] = { 
                    f: `MIN(${cplCell},${cpuCell})`, 
                    z: '0.000' 
                };
            } else if (hasMinSpec) {
                // 只有下限规格，使用 CPL
                ws[colLetter + (cpkRowIdx + 1)] = { 
                    f: `${cplCell}`, 
                    z: '0.000' 
                };
            } else if (hasMaxSpec) {
                // 只有上限规格，使用 CPU
                ws[colLetter + (cpkRowIdx + 1)] = { 
                    f: `${cpuCell}`, 
                    z: '0.000' 
                };
            } else {
                ws[colLetter + (cpkRowIdx + 1)] = { v: '' };
            }
        }
        // Conclusion - 简化公式
        if (conclusionRowIdx !== -1 && cpkRowIdx !== -1) {
            const cpkCell = colLetter + (cpkRowIdx + 1);
            ws[colLetter + (conclusionRowIdx + 1)] = { 
                f: `IF(${cpkCell}>=1.67,"PASS","FAIL")` 
            };
        }
        // Ca - 始终有公式，不检查数据有效性
        if (caRowIdx !== -1 && xbarRowIdx !== -1 && maxSpecIdx !== -1 && minSpecIdx !== -1) {
            const xbarCell = colLetter + (xbarRowIdx + 1);
            const maxSpecCell = colLetter + (maxSpecIdx + 1);
            const minSpecCell = colLetter + (minSpecIdx + 1);
            ws[colLetter + (caRowIdx + 1)] = {
                f: `ABS((${xbarCell}-(${maxSpecCell}+${minSpecCell})/2)/((${maxSpecCell}-${minSpecCell})/2))`,
                z: '0.000'
            };
        }
        // Cp - 始终有公式，不检查数据有效性
        if (cpRowIdx !== -1 && sRowIdx !== -1 && maxSpecIdx !== -1 && minSpecIdx !== -1) {
            const maxSpecCell = colLetter + (maxSpecIdx + 1);
            const minSpecCell = colLetter + (minSpecIdx + 1);
            const sCell = colLetter + (sRowIdx + 1);
            ws[colLetter + (cpRowIdx + 1)] = {
                f: `(${maxSpecCell}-${minSpecCell})/(6*${sCell})`,
                z: '0.000'
            };
        }
    }

    // 合并“Test Item”和“Test Condition”行相同内容的单元格
    const merges = [];
    
    // 首先处理Test Item行，记录合并范围
    const testItemMerges = [];
    const row0 = exportData[0]; // Test Item行
    let col = 0;
    while (col < row0.length) {
        let colspan = 1;
        while (
            col + colspan < row0.length &&
            row0[col] !== undefined &&
            row0[col] === row0[col + colspan]
        ) colspan++;
        
        if (colspan > 1) {
            const mergeRange = { start: col, end: col + colspan - 1 };
            testItemMerges.push(mergeRange);
            merges.push({
                s: { r: 0, c: col },
                e: { r: 0, c: col + colspan - 1 }
            });
        }
        col += colspan;
    }
    
    // Input Condition行按照Test Item的合并范围进行合并
    testItemMerges.forEach(range => {
        merges.push({
            s: { r: 1, c: range.start },
            e: { r: 1, c: range.end }
        });
    });
    
    // Test Condition行按自身内容合并
    const row2 = exportData[2]; // Test Condition行
    col = 0;
    while (col < row2.length) {
        let colspan = 1;
        while (
            col + colspan < row2.length &&
            row2[col] !== undefined &&
            row2[col] === row2[col + colspan]
        ) colspan++;
        
        if (colspan > 1) {
            merges.push({
                s: { r: 2, c: col },
                e: { r: 2, c: col + colspan - 1 }
            });
        }
        col += colspan;
    }
    ws['!merges'] = merges;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CPK結果");
    
    // 使用自定义文件名
    const fileName = generateExportFileName('excel');
    XLSX.writeFile(wb, fileName);
});

// 導出圖片
document.getElementById('exportImgBtn').addEventListener('click', function() {
    const tableContainer = document.getElementById('tableContainer');
    if (!tableContainer || tableContainer.innerHTML.trim() === '') {
        alert('請先上傳並計算 CPK！');
        return;
    }
    html2canvas(tableContainer, {
        backgroundColor: '#fff',
        scale: 2
    }).then(function(canvas) {
        const link = document.createElement('a');
        const fileName = generateExportFileName('image');
        link.download = fileName;
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();
    });
});

document.getElementById('ai-chat-send').addEventListener('click', function() {
    const input = document.getElementById('ai-chat-input');
    const history = document.getElementById('ai-chat-history');
    const question = input.value.trim();
    if (!question) return;
    // 显示用户问题
    history.innerHTML += `<div style="color:#333;margin-bottom:4px;"><b>你：</b>${question}</div>`;
    input.value = '';
    // 模拟AI回复（实际应用需接API）
    setTimeout(() => {
        history.innerHTML += `<div style="color:#38761d;margin-bottom:8px;"><b>AI：</b>很抱歉，當前為演示模式，暫不支持真實AI對話。</div>`;
        history.scrollTop = history.scrollHeight;
    }, 600);
});

// 聊天框拖动功能
(function() {
    const box = document.getElementById('ai-chat-box');
    const drag = document.getElementById('ai-chat-drag');
    let offsetX = 0, offsetY = 0, dragging = false;

    drag.addEventListener('mousedown', function(e) {
        dragging = true;
        // 鼠标点在窗口内的偏移
        offsetX = e.clientX - box.getBoundingClientRect().left;
        offsetY = e.clientY - box.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function(e) {
        if (dragging) {
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            // 限制不出屏幕
            x = Math.max(0, Math.min(window.innerWidth - box.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - box.offsetHeight, y));
            box.style.left = x + 'px';
            box.style.top = y + 'px';
            box.style.right = 'auto';
        }
    });
    document.addEventListener('mouseup', function() {
        dragging = false;
        document.body.style.userSelect = '';
    });
})();

// AI聊天框显隐切换
document.getElementById('toggleChatBtn').addEventListener('click', function() {
    const chatBox = document.getElementById('ai-chat-box');
    const isHidden = chatBox.style.display === 'none';
    chatBox.style.display = isHidden ? 'block' : 'none';
    this.innerHTML = isHidden ? 
        '<i class="fa-solid fa-comments"></i> 隱藏AI聊天' : 
        '<i class="fa-solid fa-comments"></i> 顯示AI聊天';
});

// 语言切换功能
document.getElementById('langSelect').addEventListener('change', function() {
    const lang = this.value;
    updateLanguage(lang);
    
    // 保存语言选择到 localStorage（可选）
    localStorage.setItem('preferred-language', lang);
});

// 添加语言切换函数
function updateLanguage(lang) {
    const t = translations[lang];
    
    // 更新标题
    document.querySelector('h1').innerHTML = `<i class="fa-solid fa-chart-column"></i>${t.title}`;
    
    // 更新按钮文本
    document.querySelector('.custom-file-label').innerHTML = 
        `<i class="fa-solid fa-file-excel icon" style="color:#217346"></i>${t.uploadExcel}<input type="file" id="excelUpload" accept=".xlsx, .xls">`;
    document.getElementById('executeCpkBtn').innerHTML = 
        `<i class="fa-solid fa-gears icon"></i>${t.executeCpk}`;
    document.getElementById('exportCpkBtn').innerHTML = 
        `<i class="fa-solid fa-download icon"></i>${t.exportCpk}`;
    document.getElementById('exportImgBtn').innerHTML = 
        `<i class="fa-solid fa-image icon"></i>${t.exportImage}`;
    
    // 更新帮助提示
    document.querySelector('.fa-circle-question').title = t.help;
    
    // 更新AI聊天相关文本
    document.getElementById('ai-chat-drag').innerHTML = 
        `<i class="fa-solid fa-robot"></i> ${t.aiChat}`;
    document.getElementById('ai-chat-input').placeholder = t.inputPlaceholder;
    document.getElementById('ai-chat-send').innerHTML = 
        `<i class="fa-solid fa-paper-plane"></i> ${t.send}`;
    
    // 更新按钮状态文本
    const toggleBtn = document.getElementById('toggleChatBtn');
    const isHidden = document.getElementById('ai-chat-box').style.display === 'none';
    toggleBtn.innerHTML = isHidden ? 
        `<i class="fa-solid fa-comments"></i> ${t.showAiChat}` : 
        `<i class="fa-solid fa-comments"></i> ${t.hideAiChat}`;
}

// DOMContentLoaded 事件中统一初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言
    updateLanguage('zh-TW');
    
    // 绑定事件监听器（确保只绑定一次）
    initEventListeners();
});

// 将所有事件监听器初始化函数集中管理
function initEventListeners() {
    // Excel上传 - 使用正确的函数名
    document.getElementById('excelUpload').addEventListener('change', handleExcelUpload);
    
    // 其他事件监听器已经在文件中单独绑定，无需重复
    // 确认按钮
    document.getElementById('confirmBtn').addEventListener('click', function() {
        const inputs = document.querySelectorAll('.input-bar .custom-input');
        const values = Array.from(inputs).map(input => input.value.trim());
        let html = '<table style="margin-top:20px;"><tr>';
        for (let i = 0; i < values.length; i++) html += `<th>CH${i+1}</th>`;
        html += '</tr><tr>';
        for (let v of values) html += `<td>${v || ''}</td>`;
        html += '</tr></table>';
        let exist = document.getElementById('chTablePreview');
        if (!exist) {
            exist = document.createElement('div');
            exist.id = 'chTablePreview';
            document.querySelector('.input-bar').after(exist);
        }
        exist.innerHTML = html;
    });
}

// 分页渲染表格
function displayTablePaged(data, page = 1) {
    if (!data || !data.length) return;
    currentData = data;
    currentPage = page;
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
    const table = document.createElement('table');

    // 表头始终显示
    const header = data[0];
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    header.forEach(cell => {
        const th = document.createElement('th');
        th.textContent = cell ?? '';
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    // 分页内容
    const startIdx = 1 + (page - 1) * PAGE_SIZE;
    const endIdx = Math.min(data.length, startIdx + PAGE_SIZE);
    const tbody = document.createElement('tbody');
    for (let i = startIdx; i < endIdx; i++) {
        const row = data[i];
        const tr = document.createElement('tr');
        // 判断行首内容
        const firstCell = (row[0] || '').toString().toUpperCase().trim();
        row.forEach((cell, colIdx) => {
            const td = document.createElement('td');
            td.textContent = cell ?? '';
            // 设置背景色
            if (firstCell === 'MIN_SPEC' || firstCell === 'CPL') {
                td.style.backgroundColor = '#ffe599'; // 黄色
            }
            if (firstCell === 'MAX_SPEC' || firstCell === 'CPU') {
                td.style.backgroundColor = '#d9ead3'; // 绿色
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // 渲染分页控件
    renderPagination(data.length - 1, page);
}

// 分页控件
function renderPagination(totalRows, page) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalRows / PAGE_SIZE);
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    let html = '';
    if (page > 1) {
        html += `<button class="cpk-btn" onclick="gotoPage(${page - 1})">上一页</button>`;
    }
    html += ` 第 ${page} / ${totalPages} 页 `;
    if (page < totalPages) {
        html += `<button class="cpk-btn" onclick="gotoPage(${page + 1})">下一页</button>`;
    }
    pagination.innerHTML = html;
}

// 跳转页面
window.gotoPage = function(page) {
    displayTablePaged(currentData, page);
};

// 多语言支持功能
function initializeLanguageSupport() {
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        // 设置默认语言
        const savedLang = localStorage.getItem('selectedLanguage') || 'zh-TW';
        langSelect.value = savedLang;
        updateTexts(savedLang);
        
        // 监听语言切换
        langSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            localStorage.setItem('selectedLanguage', selectedLang);
            updateTexts(selectedLang);
        });
    }
}

// 初始化通道输入框监听
function initializeChannelInputs() {
    const inputs = document.querySelectorAll('.custom-input');
    inputs.forEach(input => {
        input.addEventListener('input', updateChannelPreview);
        input.addEventListener('change', updateChannelPreview);
    });
}

// 初始化重新解析按钮
function initializeReparseButton() {
    const reparseBtn = document.getElementById('reparseBtn');
    if (reparseBtn) {
        reparseBtn.addEventListener('click', function() {
            if (window.ateReportData) {
                parseAndFillSignalNames(window.ateReportData);
            } else {
                alert('请先上传ATE Report文件！');
            }
        });
    }
}

function updateTexts(language) {
    const lang = translations[language];
    if (!lang) return;
    
    // 更新页面标题
    document.querySelector('h1').innerHTML = `<i class="fa-solid fa-chart-column icon"></i>${lang.title}`;
    
    // 更新按钮文本
    const uploadBtn = document.querySelector('label[for="excelUpload"]');
    if (uploadBtn) {
        uploadBtn.innerHTML = `<i class="fa-solid fa-file-excel icon" style="color:#217346"></i>${lang.uploadExcel}<input type="file" id="excelUpload" accept=".xlsx, .xls">`;
    }
    
    const ateReportBtn = document.querySelector('label[for="ateReportUpload"]');
    if (ateReportBtn) {
        ateReportBtn.innerHTML = `<i class="fa-solid fa-file-text icon" style="color:#185abd"></i>${lang.uploadAteReport}<input type="file" id="ateReportUpload" accept=".txt">`;
    }
    
    const executeCpkBtn = document.getElementById('executeCpkBtn');
    if (executeCpkBtn) {
        executeCpkBtn.innerHTML = `<i class="fa-solid fa-gears icon"></i>${lang.executeCpk}`;
    }
    
    const exportCpkBtn = document.getElementById('exportCpkBtn');
    if (exportCpkBtn) {
        exportCpkBtn.innerHTML = `<i class="fa-solid fa-download icon"></i>${lang.exportCpk}`;
    }
    
    const exportImgBtn = document.getElementById('exportImgBtn');
    if (exportImgBtn) {
        exportImgBtn.innerHTML = `<i class="fa-solid fa-image icon"></i>${lang.exportImage}`;
    }
    
    // 更新AI聊天相关
    const aiChatDrag = document.getElementById('ai-chat-drag');
    if (aiChatDrag) {
        aiChatDrag.innerHTML = `<i class="fa-solid fa-robot"></i> ${lang.aiChat}`;
    }
    
    const aiChatInput = document.getElementById('ai-chat-input');
    if (aiChatInput) {
        aiChatInput.placeholder = lang.inputPlaceholder;
    }
    
    const aiChatSend = document.getElementById('ai-chat-send');
    if (aiChatSend) {
        aiChatSend.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${lang.send}`;
    }
    
    const toggleChatBtn = document.getElementById('toggleChatBtn');
    if (toggleChatBtn) {
        const isShowing = toggleChatBtn.textContent.includes('顯示') || 
                         toggleChatBtn.textContent.includes('Show') || 
                         toggleChatBtn.textContent.includes('Hiện');
        const text = isShowing ? lang.showAiChat : lang.hideAiChat;
        toggleChatBtn.innerHTML = `<i class="fa-solid fa-comments"></i> ${text}`;
    }
    
    // 更新帮助文本
    const helpIcon = document.querySelector('.help-icon');
    if (helpIcon) {
        helpIcon.title = lang.help;
    }
    
    // 重新绑定事件监听器
    rebindEventListeners();
}

function rebindEventListeners() {
    // 重新绑定Excel上传事件
    const excelUpload = document.getElementById('excelUpload');
    if (excelUpload) {
        excelUpload.removeEventListener('change', handleExcelUpload);
        excelUpload.addEventListener('change', handleExcelUpload);
    }
    
    // 重新绑定ATE Report上传事件
    const ateReportUpload = document.getElementById('ateReportUpload');
    if (ateReportUpload) {
        ateReportUpload.removeEventListener('change', handleAteReportUpload);
        ateReportUpload.addEventListener('change', handleAteReportUpload);
    }
}

// ATE Report上传处理函数
function handleAteReportUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (fileExtension !== 'txt') {
        alert('請選擇 .txt 格式的 ATE Report 文件！');
        return;
    }
    
    // 检查文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
        alert('文件太大，請選擇小於5MB的txt文件！');
        return;
    }
    
    const reader = new FileReader();
    reader.onerror = function() {
        alert('文件讀取失敗，請檢查文件是否損壞！');
    };
    
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            
            // 檢查是否為有效的ATE Report格式
            if (!text.includes('ATE') && !text.includes('Test') && !text.includes('Report')) {
                alert('檔案內容似乎不是有效的ATE Report格式，請確認文件正確性！');
            }
            
            console.log('ATE Report文件加載成功，文件大小:', file.size, 'bytes');
            
            // 存储ATE Report数据
            window.ateReportData = text;
            
            // 解析并自动填入信号名称
            parseAndFillSignalNames(text);
            
            // 显示重新解析按钮
            showReparseButton();
            
            // 显示ATE Report内容预览
            displayAteReportContent(text, file.name);
            
            // 顯示成功提示
            const statusDiv = document.createElement('div');
            statusDiv.style.cssText = 'color: #28CD41; font-weight: 500; margin: 10px 0; text-align: center;';
            statusDiv.textContent = `✅ ATE Report文件上傳成功！文件名: ${file.name}`;
            
            const inputBar = document.querySelector('.input-bar');
            const existingStatus = inputBar.querySelector('.upload-status');
            if (existingStatus) {
                existingStatus.remove();
            }
            statusDiv.className = 'upload-status';
            inputBar.appendChild(statusDiv);
            
        } catch (error) {
            console.error('ATE Report processing error:', error);
            alert('ATE Report處理出錯：' + error.message);
        }
    };
    
    reader.readAsText(file, 'utf-8');
}

// 解析ATE Report中的信号名称并自动填入CH1~CH10
function parseAndFillSignalNames(content) {
    try {
        // 方法1: 查找标准的Load Name表格格式
        let signals = parseStandardLoadTable(content);
        
        // 方法2: 如果方法1失败，尝试查找其他可能的格式
        if (signals.length === 0) {
            signals = parseAlternativeFormats(content);
        }
        
        console.log('解析到的信号名称:', signals);
        
        if (signals.length > 0) {
            // 自动填入CH1~CH10输入框
            fillChannelInputs(signals);
            
            // 显示解析结果提示
            showSignalParseResult(signals);
        } else {
            showSignalParseResult([]);
        }
        
    } catch (error) {
        console.error('解析信号名称时出错:', error);
        showSignalParseResult([]);
    }
}

// 解析标准Load Name表格格式
function parseStandardLoadTable(content) {
    const signals = [];
    
    // 查找Load Name部分的多种可能格式
    const patterns = [
        // 标准格式: Load Name (A/Ohm/V)
        /Load\s+Loading\s*\n?\s*Name\s+\(A\/Ohm\/V\)\s*\n\s*[-\s]+\s*\n([\s\S]*?)(?=\n\s*\n|\n.*(?:Max|Min|Reading)|$)/i,
        // 简化格式: Load Name
        /Load\s*\n?\s*Name\s*\n\s*[-\s]+\s*\n([\s\S]*?)(?=\n\s*\n|\n.*(?:Max|Min|Reading)|$)/i,
        // 另一种格式
        /Load.*Name.*\n\s*[-\s]+\s*\n([\s\S]*?)(?=\n\s*\n|\n.*(?:Max|Min|Reading)|$)/i
    ];
    
    for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
            console.log('使用模式匹配到Load Name部分:', match[1]);
            
            const loadSection = match[1];
            const lines = loadSection.split('\n');
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine === '' || trimmedLine.includes('-') || trimmedLine.length < 2) continue;
                
                // 匹配信号名称，支持多种格式:
                // "12V               262.300"
                // "12VSB               3.000"
                // "Vin_Good            0.000"
                const signalPatterns = [
                    /^([A-Za-z][A-Za-z0-9_]*)\s+[\d\.-]+/,  // 字母开头，后跟数字
                    /^([A-Za-z_][A-Za-z0-9_]*)\s+[\d\.-]+/, // 字母或下划线开头
                    /^(\w+)\s+[\d\.-]+/                      // 任何单词字符开头
                ];
                
                for (const signalPattern of signalPatterns) {
                    const signalMatch = trimmedLine.match(signalPattern);
                    if (signalMatch) {
                        const signalName = signalMatch[1].trim();
                        if (signalName && 
                            signalName !== 'NA' && 
                            signalName.length > 1 && 
                            !signals.includes(signalName)) {
                            signals.push(signalName);
                            break;
                        }
                    }
                }
            }
            
            if (signals.length > 0) break;
        }
    }
    
    return signals;
}

// 解析其他可能的格式
function parseAlternativeFormats(content) {
    const signals = [];
    
    // 尝试查找其他可能包含信号名称的部分
    const alternativePatterns = [
        // 查找包含电压/电流名称的行
        /^[\s]*([A-Za-z][A-Za-z0-9_]*(?:V|SB|Good|OK|Alert|Share|mon))\s*[=:]\s*[\d\.-]+/gmi,
        // 查找测试项目名称
        /^[\s]*([A-Za-z][A-Za-z0-9_]*)\s*\([AVW]\)\s*=/gmi
    ];
    
    for (const pattern of alternativePatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const signalName = match[1].trim();
            if (signalName && 
                signalName !== 'NA' && 
                signalName.length > 1 && 
                !signals.includes(signalName)) {
                signals.push(signalName);
            }
        }
        if (signals.length > 0) break;
    }
    
    return signals.slice(0, 10); // 最多返回10个
}

// 填入通道输入框
function fillChannelInputs(signals) {
    const inputs = document.querySelectorAll('.custom-input');
    
    // 清空所有输入框
    inputs.forEach(input => input.value = '');
    
    // 填入解析到的信号名称（最多10个）
    for (let i = 0; i < Math.min(signals.length, inputs.length); i++) {
        inputs[i].value = signals[i];
    }
    
    // 触发预览更新
    updateChannelPreview();
}

// 显示信号解析结果
function showSignalParseResult(signals) {
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = 'color: #007acc; font-weight: 500; margin: 10px 0; padding: 10px; background: #f0f8ff; border-left: 4px solid #007acc; border-radius: 4px;';
    
    if (signals.length > 0) {
        statusDiv.innerHTML = `
            <div style="margin-bottom: 5px;">✅ 成功解析到 ${signals.length} 个信号名称：</div>
            <div style="font-size: 14px;">${signals.slice(0, 10).map((signal, index) => `CH${index + 1}: ${signal}`).join(', ')}</div>
            ${signals.length > 10 ? '<div style="font-size: 12px; color: #666; margin-top: 5px;">注：只显示前10个信号</div>' : ''}
        `;
    } else {
        statusDiv.innerHTML = '⚠️ 未能解析到有效的信号名称，请检查文件格式';
        statusDiv.style.color = '#ff6b35';
        statusDiv.style.borderLeftColor = '#ff6b35';
        statusDiv.style.background = '#fff5f5';
    }
    
    const inputBar = document.querySelector('.input-bar');
    const existingSignalStatus = inputBar.querySelector('.signal-parse-status');
    if (existingSignalStatus) {
        existingSignalStatus.remove();
    }
    statusDiv.className = 'signal-parse-status';
    inputBar.appendChild(statusDiv);
}

// 更新通道预览表格
function updateChannelPreview() {
    const inputs = document.querySelectorAll('.custom-input');
    const values = Array.from(inputs).map(input => input.value.trim());
    
    let html = '<table style="margin-top:20px; border-collapse: collapse; width: 100%;"><tr>';
    for (let i = 0; i < values.length; i++) {
        html += `<th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">CH${i+1}</th>`;
    }
    html += '</tr><tr>';
    for (let v of values) {
        html += `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${v || '-'}</td>`;
    }
    html += '</tr></table>';
    
    let exist = document.getElementById('chTablePreview');
    if (!exist) {
        exist = document.createElement('div');
        exist.id = 'chTablePreview';
        exist.style.cssText = 'margin-top: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0;';
        document.querySelector('.input-bar').after(exist);
    }
    exist.innerHTML = `<div style="font-weight: 600; margin-bottom: 10px; color: #333;">📊 通道配置预览</div>${html}`;
}

// 显示重新解析按钮
function showReparseButton() {
    const reparseBtn = document.getElementById('reparseBtn');
    if (reparseBtn) {
        reparseBtn.style.display = 'inline-block';
    }
}

