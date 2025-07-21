// 翻译内容
const translations = {
    'zh-TW': {
        title: 'Accuracy CPK',
        uploadFolder: '上傳資料夾',
        chooseFolder: '選擇資料夾',
        executeAccuracyCpk: '執行 Accuracy CPK',
        exportCpkExcel: '導出 CPK Excel',
        showAiChat: '顯示AI聊天',
        hideAiChat: '隱藏AI聊天',
        aiChat: 'AI詢問聊天',
        inputPlaceholder: '請輸入您的問題...',
        send: '發送',
        help: '1.點擊選擇資料夾，上傳包含Accuracy測試數據的txt文件\n2.點擊"執行 Accuracy CPK"分析數據\n3.點擊"導出 CPK Excel"匯出結果'
    },
    'en': {
        title: 'Accuracy CPK',
        uploadFolder: 'Upload Folder',
        chooseFolder: 'Choose Folder',
        executeAccuracyCpk: 'Execute Accuracy CPK',
        exportCpkExcel: 'Export CPK Excel',
        showAiChat: 'Show AI Chat',
        hideAiChat: 'Hide AI Chat',
        aiChat: 'AI Chat',
        inputPlaceholder: 'Enter your question...',
        send: 'Send',
        help: '1. Click to choose folder and upload txt files containing Accuracy test data\n2. Click "Execute Accuracy CPK" to analyze data\n3. Click "Export CPK Excel" to export results'
    },
    'vi': {
        title: 'Accuracy CPK',
        uploadFolder: 'Tải lên thư mục',
        chooseFolder: 'Chọn thư mục',
        executeAccuracyCpk: 'Thực hiện Accuracy CPK',
        exportCpkExcel: 'Xuất CPK Excel',
        showAiChat: 'Hiện AI Chat',
        hideAiChat: 'Ẩn AI Chat',
        aiChat: 'Hỏi đáp AI',
        inputPlaceholder: 'Nhập câu hỏi của bạn...',
        send: 'Gửi',
        help: '1. Nhấp để chọn thư mục và tải lên các tệp txt chứa dữ liệu thử nghiệm Accuracy\n2. Nhấp "Thực hiện Accuracy CPK" để phân tích dữ liệu\n3. Nhấp "Xuất CPK Excel" để xuất kết quả'
    }
};

// 选择文件夹按钮和执行Accuracy CPK按钮
document.addEventListener('DOMContentLoaded', function() {
    var chooseBtn = document.getElementById('chooseFolderBtn');
    var folderInput = document.getElementById('folderUpload');
    var statusDiv = document.getElementById('uploadStatus');
    var execBtn = document.getElementById('execAccuracyCpkBtn');
    var exportBtn = document.getElementById('exportCpkBtn');
    
    chooseBtn.onclick = function() { folderInput.click(); };
    
    folderInput.addEventListener('change', function(event) {
        const files = event.target.files;
        const list = document.getElementById('folderFileList');
        list.innerHTML = '';
        statusDiv.textContent = '';
        
        if (files.length === 0) {
            list.innerHTML = '<li>未選擇任何文件</li>';
            statusDiv.textContent = '';
            return;
        }
        
        // 创建表格展示文件信息
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        ['名稱', '格式', '大小 (KB)', '相對路徑'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.border = '1px solid #ccc';
            th.style.background = '#f5f5f7';
            th.style.padding = '6px 8px';
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        // 默认收起
        tbody.style.display = 'none';
        
        for (const file of files) {
            const tr = document.createElement('tr');
            
            // 名稱
            const tdName = document.createElement('td');
            tdName.textContent = file.name;
            tdName.style.border = '1px solid #ccc';
            tdName.style.padding = '6px 8px';
            tr.appendChild(tdName);
            
            // 格式
            const tdType = document.createElement('td');
            tdType.textContent = file.type || '未知';
            tdType.style.border = '1px solid #ccc';
            tdType.style.padding = '6px 8px';
            tr.appendChild(tdType);
            
            // 大小
            const tdSize = document.createElement('td');
            tdSize.textContent = (file.size / 1024).toFixed(2);
            tdSize.style.border = '1px solid #ccc';
            tdSize.style.padding = '6px 8px';
            tr.appendChild(tdSize);
            
            // 相對路徑
            const tdPath = document.createElement('td');
            tdPath.textContent = file.webkitRelativePath || '';
            tdPath.style.border = '1px solid #ccc';
            tdPath.style.padding = '6px 8px';
            tr.appendChild(tdPath);
            
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        list.appendChild(table);
        
        // 鼠标悬停表头展开，移开收起
        trHead.addEventListener('mouseenter', function() {
            tbody.style.display = '';
        });
        thead.addEventListener('mouseleave', function() {
            tbody.style.display = 'none';
        });
        
        // 显示上传完成标识
        statusDiv.textContent = '✅ 資料夾上傳完成';
    });
    
    // 执行Accuracy CPK按钮事件（预留，实际功能可扩展）
    execBtn.onclick = function() {
        let cpkTableDiv = document.getElementById('accuracyCpkTable');
        if (!cpkTableDiv) {
            cpkTableDiv = document.createElement('div');
            cpkTableDiv.id = 'accuracyCpkTable';
            document.querySelector('.data-panel').appendChild(cpkTableDiv);
        }
        
        const folderInput = document.getElementById('folderUpload');
        const files = folderInput.files;
        let txtFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.txt'));
        
        if (txtFiles.length === 0) {
            cpkTableDiv.innerHTML = '<div>未找到txt文件</div>';
            return;
        }
        
        let readCount = 0;
        let snMap = {};
        let modelName = ''; // 添加变量来存储Model Name
        
        txtFiles.forEach(function(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                let match = text.match(/Serial No\s*[:：]?\s*([\w\-]+)/i);
                let sn = match && match[1] ? match[1] : '(未识别)';
                
                // 提取Model Name
                if (!modelName) { // 只在第一次找到时设置
                    let modelMatch = text.match(/Model Name\s*[:：]\s*([A-Za-z0-9\-]+)/i);
                    if (modelMatch && modelMatch[1]) {
                        modelName = modelMatch[1].trim();
                    }
                }
                
                let lines = text.split(/\r?\n/);
                
                // 记录所有AC Input和Load Setup的内容及行号
                let acInputs = [];
                let loadSetups = [];
                for (let i = 0; i < lines.length; i++) {
                    if (/^STEP\..*: AC Input/.test(lines[i])) {
                        if (lines[i+1] && /^Describe\s*:/.test(lines[i+1])) {
                            let desc = lines[i+1].replace(/^Describe\s*: /, '').trim();
                            acInputs.push({idx: i, desc: desc});
                        }
                    }
                    if (/^STEP\..*: Load Setup/.test(lines[i])) {
                        let desc = '';
                        if (lines[i+1] && /^Describe\s*:/.test(lines[i+1])) {
                            desc = lines[i+1].replace(/^Describe\s*: /, '').trim();
                        }
                        loadSetups.push({idx: i, desc: desc});
                    }
                }
                
                // 查找Accuracy Test块
                let blockStartIdxs = [];
                for (let i = 0; i < lines.length; i++) {
                    if (/^STEP\..*Accuracy Test.*PASS/.test(lines[i])) {
                        blockStartIdxs.push(i);
                    }
                }
                
                let accuracyArr = [];
                for (let b = 0; b < blockStartIdxs.length; b++) {
                    let start = blockStartIdxs[b] + 1;
                    let end = lines.length;
                    for (let j = start; j < lines.length; j++) {
                        if (/^-+/.test(lines[j]) || /^STEP\\./.test(lines[j])) {
                            end = j;
                            break;
                        }
                    }
                    
                    // 查找最近的AC Input和Load Setup（在当前Accuracy Test之前）
                    let testCondition = '';
                    let closestAcInput = '';
                    let closestLoad = '';
                    
                    // 找到最近的AC Input（在当前Accuracy Test之前的最后一个）
                    for (let a = 0; a < acInputs.length; a++) {
                        if (acInputs[a].idx < blockStartIdxs[b]) {
                            closestAcInput = acInputs[a].desc;
                        }
                    }
                    
                    // 找到最近的Load Setup（在当前Accuracy Test之前的最后一个）
                    for (let l = 0; l < loadSetups.length; l++) {
                        if (loadSetups[l].idx < blockStartIdxs[b]) {
                            closestLoad = loadSetups[l].desc;
                        }
                    }
                    
                    // 组合测试条件：优先使用 AC Input + Load Setup 的组合
                    if (closestAcInput && closestLoad) {
                        testCondition = closestAcInput + ' ' + closestLoad;
                    } else if (closestLoad) {
                        testCondition = closestLoad;
                    } else if (closestAcInput) {
                        testCondition = closestAcInput;
                    } else {
                        // 如果没有找到AC Input和Load Setup，才使用Accuracy Test本身的Describe行
                        if (blockStartIdxs[b] + 1 < lines.length && /^Describe\s*:/.test(lines[blockStartIdxs[b] + 1])) {
                            testCondition = lines[blockStartIdxs[b] + 1].replace(/^Describe\s*:\s*/, '').trim();
                        }
                    }
                    
                    let accuracyData = {};
                    let foundParameters = [];
                    
                    // 动态识别所有参数
                    for (let k = start; k < end; k++) {
                        let line = lines[k];
                        
                        // 尝试匹配第一种格式: 参数名: 数值1, 数值2 ... [单位]
                        let m = line.match(/^\s*([A-Za-z0-9]+)\s*:\s*([\d\.]+)\s*,\s*([\d\.]+)\s+.*\[(.*?)\]/);
                        
                        // 如果第一种格式不匹配，尝试第二种格式: 参数名: 数值1, 数值2±百分比% [单位]
                        if (!m) {
                            // 匹配格式如: Vmeter to Vset:  150.050, 150.000-0.03%   [0.5%]
                            let m2 = line.match(/^\s*([A-Za-z\s]+to\s+[A-Za-z]+)\s*:\s*([\d\.]+)\s*,\s*([\d\.]+)([+-][\d\.]+%)\s+\[(.*?)\]/);
                            if (m2) {
                                let paramName = m2[1].trim().replace(/\s+/g, '_'); // 将空格替换为下划线
                                let measuredValue = parseFloat(m2[2].trim());
                                let referenceValue = parseFloat(m2[3].trim());
                                let percentageStr = m2[4].trim(); // 如: -0.03% 或 +0.02%
                                let unit = m2[5].trim();
                                
                                // 记录找到的参数名称
                                if (!foundParameters.includes(paramName)) {
                                    foundParameters.push(paramName);
                                }
                                
                                accuracyData[paramName + '_M'] = isNaN(measuredValue) ? '' : measuredValue;
                                accuracyData[paramName + '_R'] = isNaN(referenceValue) ? '' : referenceValue;
                                
                                // 提取规格限值
                                let specLimit = parseFloat(unit.replace('%', ''));
                                if (!isNaN(specLimit)) {
                                    // 如果是百分比，转换为小数
                                    if (unit.includes('%')) {
                                        specLimit = specLimit / 100;
                                    }
                                    accuracyData[paramName + '_SpecLimit'] = specLimit;
                                } else {
                                    accuracyData[paramName + '_SpecLimit'] = '';
                                }
                                
                                // 直接使用文件中的百分比值
                                accuracyData[paramName + '_Spec'] = percentageStr;
                                continue;
                            }
                        }
                        
                        if (m) {
                            let paramName = m[1].trim();
                            let a = parseFloat(m[2].trim());
                            let b = parseFloat(m[3].trim());
                            let unit = m[4].trim();
                            
                            // 记录找到的参数名称
                            if (!foundParameters.includes(paramName)) {
                                foundParameters.push(paramName);
                            }
                            
                            accuracyData[paramName + '_M'] = isNaN(a) ? '' : a;
                            accuracyData[paramName + '_R'] = isNaN(b) ? '' : b;
                            
                            // 提取规格限值
                            let specLimit = parseFloat(unit.replace('%', ''));
                            if (!isNaN(specLimit)) {
                                // 如果是百分比，转换为小数
                                if (unit.includes('%')) {
                                    specLimit = specLimit / 100;
                                }
                                accuracyData[paramName + '_SpecLimit'] = specLimit;
                            } else {
                                accuracyData[paramName + '_SpecLimit'] = '';
                            }
                            
                            if (!isNaN(a) && !isNaN(b)) {
                                if (unit.includes('%') && a !== 0) {
                                    let specVal = ((b - a) / a * 100).toFixed(2) + '%';
                                    accuracyData[paramName + '_Spec'] = specVal;
                                } else {
                                    let specVal = (b - a).toFixed(2);
                                    accuracyData[paramName + '_Spec'] = specVal;
                                }
                            } else {
                                accuracyData[paramName + '_Spec'] = '';
                            }
                        }
                    }
                    
                    accuracyArr.push({testCondition: testCondition, accuracyData: accuracyData, parameters: foundParameters});
                }
                
                if (!snMap[sn]) snMap[sn] = [];
                accuracyArr.forEach(arr => {
                    let idx = snMap[sn].findIndex(item => item.testCondition === arr.testCondition);
                    if (idx >= 0) {
                        snMap[sn][idx] = arr;
                    } else {
                        snMap[sn].push(arr);
                    }
                });
                
                readCount++;
                if (readCount === txtFiles.length) {
                    // 收集所有测试条件和参数
                    let allTestConditions = [];
                    let allParameters = [];
                    
                    Object.values(snMap).forEach(arr => {
                        arr.forEach(item => {
                            if (!allTestConditions.includes(item.testCondition)) {
                                allTestConditions.push(item.testCondition);
                            }
                            if (item.parameters) {
                                item.parameters.forEach(param => {
                                    if (!allParameters.includes(param)) {
                                        allParameters.push(param);
                                    }
                                });
                            }
                        });
                    });
                    
                    // 过滤掉没有有效数据的参数 - 只保留至少在一个测试条件下有完整有效数据的参数
                    let validParameters = [];
                    allParameters.forEach(param => {
                        let hasValidDataInAnyCondition = false;
                        
                        // 检查每个测试条件下该参数是否有有效数据
                        for (let tc of allTestConditions) {
                            let hasValidDataInThisCondition = false;
                            let totalRecordsInCondition = 0;
                            let validRecordsInCondition = 0;
                            
                            // 统计该测试条件下该参数的数据情况
                            for (let sn of Object.keys(snMap)) {
                                let found = snMap[sn].find(item => item.testCondition === tc);
                                if (found) {
                                    totalRecordsInCondition++;
                                    let mValue = found.accuracyData[param + '_M'];
                                    let rValue = found.accuracyData[param + '_R'];
                                    let specValue = found.accuracyData[param + '_Spec'];
                                    
                                    // 检查该记录是否有有效数据（至少M、R、Spec中有一个有效）
                                    let hasValidRecord = false;
                                    if ((mValue && mValue !== '' && mValue !== '(未识别)' && mValue !== '-' && !isNaN(parseFloat(mValue))) ||
                                        (rValue && rValue !== '' && rValue !== '(未识别)' && rValue !== '-' && !isNaN(parseFloat(rValue))) ||
                                        (specValue && specValue !== '' && specValue !== '(未识别)' && specValue !== '-')) {
                                        hasValidRecord = true;
                                        validRecordsInCondition++;
                                    }
                                }
                            }
                            
                            // 如果该测试条件下有任何有效记录，则认为该参数在此条件下是有效的
                            if (validRecordsInCondition > 0) {
                                hasValidDataInThisCondition = true;
                                hasValidDataInAnyCondition = true;
                                break; // 找到一个有效条件就足够了
                            }
                        }
                        
                        // 只有至少在一个测试条件下有有效数据的参数才添加到显示列表
                        if (hasValidDataInAnyCondition) {
                            validParameters.push(param);
                        }
                    });
                    
                    // 使用过滤后的参数列表
                    allParameters = validParameters;
                    
                    // 保存modelName到全局变量，用于导出Excel文件名
                    window.currentModelName = modelName || 'Unknown';
                    
                    // 调试信息：显示过滤结果
                    console.log('原始参数:', Object.values(snMap).flatMap(arr => arr.flatMap(item => item.parameters || [])).filter((p, i, arr) => arr.indexOf(p) === i));
                    console.log('过滤后参数:', allParameters);
                    console.log('Model Name:', window.currentModelName);
                    
                    // 检查是否有有效的参数可以显示
                    if (allParameters.length === 0) {
                        cpkTableDiv.innerHTML = '<div style="text-align:center;padding:20px;color:#666;">未找到有效的Accuracy数据参数</div>';
                        return;
                    }
                    
                    let html = '<table class="data-table">';
                    html += '<tr>';
                    html += '<td class="header-cell">Test Condition</td>';
                    allTestConditions.forEach(tc => {
                        html += `<td colspan="${allParameters.length*3}" class="header-cell">${tc || '(无条件)'}</td>`;
                    });
                    html += '</tr>';
                    
                    html += '<tr>';
                    html += '<td class="header-cell">Serial No</td>';
                    allTestConditions.forEach(tc => {
                        allParameters.forEach(function(param){
                            html += `<td class="header-cell">${param}_M</td>`;
                            html += `<td class="header-cell">${param}_R</td>`;
                            html += `<td class="header-cell">${param}_Spec</td>`;
                        });
                    });
                    html += '</tr>';
                    
                    Object.keys(snMap).forEach(sn => {
                        html += '<tr>';
                        html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;\">${sn}</td>`;
                        allTestConditions.forEach(tc => {
                            let found = snMap[sn].find(item => item.testCondition === tc);
                            if (found) {
                                allParameters.forEach(function(param){
                                    let mVal = found.accuracyData[param+'_M'];
                                    let rVal = found.accuracyData[param+'_R'];
                                    let specVal = found.accuracyData[param+'_Spec'];
                                    
                                    // 如果值为空、未识别或无效，显示为"-"
                                    mVal = (mVal && mVal !== '' && mVal !== '(未识别)') ? mVal : '-';
                                    rVal = (rVal && rVal !== '' && rVal !== '(未识别)') ? rVal : '-';
                                    specVal = (specVal && specVal !== '' && specVal !== '(未识别)') ? specVal : '-';
                                    
                                    html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;\">${mVal}</td>`;
                                    html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;\">${rVal}</td>`;
                                    html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;\">${specVal}</td>`;
                                });
                            } else {
                                for(let i=0;i<allParameters.length*3;i++) html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;\">-</td>`;
                            }
                        });
                        html += '</tr>';
                    });
                    
                    // 添加Unit行到最后
                    html += '<tr>';
                    html += '<td class="header-cell">Unit</td>';
                    allTestConditions.forEach(tc => {
                        allParameters.forEach(function(param){
                            // 为每个参数确定单位
                            let unit = '';
                            let paramLower = param.toLowerCase();
                            if (paramLower.includes('vin') || paramLower.includes('vout') || paramLower.includes('v') || paramLower.includes('vmeter')) {
                                unit = 'V';
                            } else if (paramLower.includes('iin') || paramLower.includes('iout') || paramLower.includes('i')) {
                                unit = 'A';
                            } else if (paramLower.includes('ein') || paramLower.includes('eout') || paramLower.includes('pin') || paramLower.includes('pout') || paramLower.includes('p')) {
                                unit = 'W';
                            } else if (paramLower.includes('thd')) {
                                unit = '%';
                            } else {
                                unit = '';
                            }
                            
                            html += `<td class="header-cell">${unit}</td>`; // M列单位
                            html += `<td class="header-cell">${unit}</td>`; // R列单位
                            html += `<td class="header-cell">%</td>`;       // Spec列单位固定为%
                        });
                    });
                    html += '</tr>';
                    
                    // 添加统计分析行
                    const analysisRows = [
                        'Lowest', 'Highest', 'Xbar', 'S', 'MAX_SPEC', 
                        'MIN_SPEC', 'Ca', 'Cp', 'CPL', 'CPU', 'CPK', 'Conclusion'
                    ];
                    
                    // 预先计算所有统计数据
                    let analysisData = {};
                    
                    // 为每个测试条件和参数计算统计值
                    allTestConditions.forEach(tc => {
                        allParameters.forEach(param => {
                            let specValues = []; // 只收集Spec列的值
                            
                            // 收集所有该条件下该参数的Spec值
                            Object.keys(snMap).forEach(sn => {
                                let found = snMap[sn].find(item => item.testCondition === tc);
                                if (found && found.accuracyData[param + '_Spec']) {
                                    let specVal = found.accuracyData[param + '_Spec'];
                                    if (typeof specVal === 'string') {
                                        // 如果是百分比形式，转换为小数形式
                                        if (specVal.includes('%')) {
                                            specVal = parseFloat(specVal.replace('%', '')) / 100;
                                        } else {
                                            specVal = parseFloat(specVal);
                                        }
                                    }
                                    if (!isNaN(specVal)) {
                                        specValues.push(specVal);
                                    }
                                }
                            });
                            
                            let key = tc + '_' + param;
                            analysisData[key] = {};
                            
                            if (specValues.length > 0) {
                                // 计算Lowest
                                analysisData[key]['Lowest'] = Math.min(...specValues);
                                
                                // 计算Highest
                                analysisData[key]['Highest'] = Math.max(...specValues);
                                
                                // 计算Xbar (平均值)
                                analysisData[key]['Xbar'] = specValues.reduce((sum, val) => sum + val, 0) / specValues.length;
                                
                                // 计算S (总体标准差)
                                let mean = analysisData[key]['Xbar'];
                                let variance = specValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / specValues.length;
                                analysisData[key]['S'] = Math.sqrt(variance);
                                
                                // 获取规格限值
                                let specLimit = '';
                                Object.keys(snMap).forEach(sn => {
                                    let found = snMap[sn].find(item => item.testCondition === tc);
                                    if (found && found.accuracyData[param + '_SpecLimit']) {
                                        specLimit = found.accuracyData[param + '_SpecLimit'];
                                    }
                                });
                                
                                if (specLimit !== '') {
                                    analysisData[key]['MAX_SPEC'] = parseFloat(specLimit);
                                    analysisData[key]['MIN_SPEC'] = -parseFloat(specLimit);
                                    
                                    let maxSpec = analysisData[key]['MAX_SPEC'];
                                    let minSpec = analysisData[key]['MIN_SPEC'];
                                    let xbar = analysisData[key]['Xbar'];
                                    let s = analysisData[key]['S'];
                                    
                                    // 计算Ca
                                    if ((maxSpec - minSpec) !== 0) {
                                        analysisData[key]['Ca'] = (xbar - (maxSpec + minSpec) / 2) / ((maxSpec - minSpec) / 2);
                                    }
                                    
                                    // 计算Cp
                                    if (s !== 0) {
                                        analysisData[key]['Cp'] = (maxSpec - minSpec) / (6 * s);
                                    }
                                    
                                    // 计算CPL
                                    if (s !== 0) {
                                        analysisData[key]['CPL'] = (xbar - minSpec) / (3 * s);
                                    }
                                    
                                    // 计算CPU
                                    if (s !== 0) {
                                        analysisData[key]['CPU'] = (maxSpec - xbar) / (3 * s);
                                    }
                                    
                                    // 计算CPK (取CPL和CPU的最小值)
                                    if (analysisData[key]['CPL'] !== undefined && analysisData[key]['CPU'] !== undefined) {
                                        analysisData[key]['CPK'] = Math.min(analysisData[key]['CPL'], analysisData[key]['CPU']);
                                        
                                        // 计算Conclusion
                                        if (analysisData[key]['CPK'] > 1.67) {
                                            analysisData[key]['Conclusion'] = 'PASS';
                                        } else {
                                            analysisData[key]['Conclusion'] = 'FAIL';
                                        }
                                    }
                                }
                            }
                        });
                    });
                    
                    analysisRows.forEach(rowName => {
                        html += '<tr>';
                        html += `<td class="header-cell">${rowName}</td>`;
                        allTestConditions.forEach(tc => {
                            allParameters.forEach(function(param){
                                let key = tc + '_' + param;
                                let value = '-';
                                
                                if (analysisData[key] && analysisData[key][rowName] !== undefined) {
                                    if (rowName === 'Conclusion') {
                                        value = analysisData[key][rowName];
                                    } else {
                                        value = parseFloat(analysisData[key][rowName]).toFixed(4);
                                        // 去掉尾随的零
                                        value = parseFloat(value).toString();
                                    }
                                }
                                
                                // 根据行类型设置背景色
                                let backgroundColor = '#ffffff';
                                let textColor = '#000000';
                                
                                if (rowName === 'MAX_SPEC' || rowName === 'MIN_SPEC') {
                                    backgroundColor = '#ffe599';
                                } else if (rowName === 'Conclusion') {
                                    if (value === 'PASS') {
                                        backgroundColor = '#90EE90';
                                        textColor = '#006400';
                                    } else if (value === 'FAIL') {
                                        backgroundColor = '#FFB6C1';
                                        textColor = '#8B0000';
                                    }
                                }
                                
                                if (rowName === 'MAX_SPEC' || rowName === 'MIN_SPEC') {
                                    html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;background-color:#ffe599;\">${value}</td>`; // Spec列 - 黄色背景
                                } else if (rowName === 'Conclusion') {
                                    html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;background-color:${backgroundColor};color:${textColor};\">${value}</td>`; // Spec列
                                } else {
                                    html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;\">${value}</td>`; // M列
                                }
                                html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;\">${value}</td>`; // R列
                                if (rowName === 'MAX_SPEC' || rowName === 'MIN_SPEC') {
                                    html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;background-color:#ffe599;\">${value}</td>`; // Spec列 - 黄色背景
                                } else if (rowName === 'Conclusion') {
                                    html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;background-color:${backgroundColor};color:${textColor};\">${value}</td>`; // Spec列
                                } else {
                                    html += `<td style=\"border:1px solid #ccc;padding:8px 12px;text-align:center;\">${value}</td>`; // Spec列
                                }
                            });
                        });
                        html += '</tr>';
                    });
                    
                    html += '</table>';
                    cpkTableDiv.innerHTML = html;
                    
                    // 显示导出按钮
                    document.getElementById('exportCpkBtn').style.display = 'inline-block';
                }
            };
            reader.readAsText(file);
        });
    };
    
    // 导出CPK按钮事件
    exportBtn.onclick = function() {
        const table = document.querySelector('#accuracyCpkTable table');
        if (!table) {
            alert('請先執行 Accuracy CPK 生成數據');
            return;
        }
        
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        
        // 转换表格为工作表数据
        const ws_data = [];
        const rows = table.querySelectorAll('tr');
        
        // 处理表头行
        rows.forEach((row, rowIndex) => {
            const rowData = [];
            const cells = row.querySelectorAll('td, th');
            cells.forEach(cell => {
                const colspan = parseInt(cell.getAttribute('colspan')) || 1;
                const cellValue = cell.textContent.trim();
                
                // 添加单元格数据
                rowData.push(cellValue);
                
                // 处理合并单元格
                for (let i = 1; i < colspan; i++) {
                    rowData.push(''); // 空单元格用于合并
                }
            });
            ws_data.push(rowData);
        });
        
        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        
        // 添加公式到Spec列
        if (ws_data.length > 2) {
            const headerRow = ws_data[1]; // 第二行是详细的列标题
            
            // 找到各个统计行的索引
            let unitRowIdx = -1, lowestRowIdx = -1, highestRowIdx = -1, xbarRowIdx = -1, sRowIdx = -1;
            let maxSpecRowIdx = -1, minSpecRowIdx = -1, caRowIdx = -1, cpRowIdx = -1;
            let cplRowIdx = -1, cpuRowIdx = -1, cpkRowIdx = -1, conclusionRowIdx = -1;
            
            for (let i = 0; i < ws_data.length; i++) {
                switch(ws_data[i][0]) {
                    case 'Unit': unitRowIdx = i; break;
                    case 'Lowest': lowestRowIdx = i; break;
                    case 'Highest': highestRowIdx = i; break;
                    case 'Xbar': xbarRowIdx = i; break;
                    case 'S': sRowIdx = i; break;
                    case 'MAX_SPEC': maxSpecRowIdx = i; break;
                    case 'MIN_SPEC': minSpecRowIdx = i; break;
                    case 'Ca': caRowIdx = i; break;
                    case 'Cp': cpRowIdx = i; break;
                    case 'CPL': cplRowIdx = i; break;
                    case 'CPU': cpuRowIdx = i; break;
                    case 'CPK': cpkRowIdx = i; break;
                    case 'Conclusion': conclusionRowIdx = i; break;
                }
            }
            
            for (let rowIdx = 2; rowIdx < ws_data.length; rowIdx++) {
                let colIdx = 1; // 从第二列开始（跳过Serial No列）
                
                // 遍历每个测试条件组
                for (let groupIdx = 0; colIdx < headerRow.length; groupIdx++) {
                    // 计算当前组的参数数量
                    let paramCount = 0;
                    let startColIdx = colIdx;
                    
                    // 计算参数数量（每个参数3列：M, R, Spec）
                    while (colIdx < headerRow.length && (colIdx - startColIdx) % 3 !== 0 || colIdx === startColIdx) {
                        if (headerRow[colIdx] && headerRow[colIdx].endsWith('_M')) {
                            paramCount++;
                        }
                        colIdx++;
                    }
                    
                    colIdx = startColIdx; // 重置到组开始位置
                    
                    // 处理当前组的每个参数
                    for (let paramIdx = 0; paramIdx < paramCount && colIdx < headerRow.length; paramIdx++) {
                        let mColIdx = colIdx;
                        let rColIdx = colIdx + 1;
                        let specColIdx = colIdx + 2;
                        
                        // 添加Spec列的公式（只在数据行，不包括统计行）
                        if (rowIdx < unitRowIdx) {
                            let mCol = XLSX.utils.encode_col(mColIdx);
                            let rCol = XLSX.utils.encode_col(rColIdx);
                            let specCol = XLSX.utils.encode_col(specColIdx);
                            let row = rowIdx + 1; // Excel行号从1开始
                            
                            // 创建公式：((R-M)/M)*100，但需要检查除零
                            let formula = `=IF(AND(ISNUMBER(${mCol}${row}),ISNUMBER(${rCol}${row}),${mCol}${row}<>0),ROUND(((${rCol}${row}-${mCol}${row})/${mCol}${row})*100,2),"")`;
                            
                            // 创建单元格地址
                            let cellRef = XLSX.utils.encode_cell({r: rowIdx, c: specColIdx});
                            
                            // 设置公式
                            if (!ws[cellRef]) ws[cellRef] = {};
                            ws[cellRef].f = formula.substring(1); // 去掉开头的=号，XLSX.js会自动添加
                            ws[cellRef].t = 'n'; // 数字类型
                        }
                        
                        colIdx += 3; // 移动到下一个参数（跳过M, R, Spec三列）
                    }
                }
            }
        }
        
        // 在处理合并单元格前，重新设置所有样式（确保样式不被公式覆盖）
        const range = XLSX.utils.decode_range(ws['!ref']);
        
        // 为所有单元格设置基本样式（居中对齐和边框）
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({r: R, c: C});
                if (!ws[cellRef]) ws[cellRef] = {v: '', t: 's'};
                if (!ws[cellRef].s) ws[cellRef].s = {};
                
                // 设置对齐方式
                ws[cellRef].s.alignment = {
                    horizontal: 'center',
                    vertical: 'center'
                };
                
                // 设置边框
                ws[cellRef].s.border = {
                    top: {style: 'thin', color: {rgb: 'CCCCCC'}},
                    bottom: {style: 'thin', color: {rgb: 'CCCCCC'}},
                    left: {style: 'thin', color: {rgb: 'CCCCCC'}},
                    right: {style: 'thin', color: {rgb: 'CCCCCC'}}
                };
            }
        }
        
        // 重新为表头行设置背景色和字体样式
        const headerRows = [0, 1]; // 第一行和第二行是表头
        headerRows.forEach(rowIdx => {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({r: rowIdx, c: C});
                if (!ws[cellRef]) ws[cellRef] = {v: '', t: 's'};
                if (!ws[cellRef].s) ws[cellRef].s = {};
                
                // 表头背景色和字体
                ws[cellRef].s.fill = {
                    patternType: 'solid',
                    fgColor: {rgb: 'F5F5F7'}
                };
                ws[cellRef].s.font = {
                    bold: true,
                    color: {rgb: '1D1D1F'}
                };
            }
        });
        
        // 查找Unit行索引
        let unitRowIdx = -1;
        for (let i = 0; i < ws_data.length; i++) {
            if (ws_data[i][0] === 'Unit') {
                unitRowIdx = i;
                break;
            }
        }
        
        // 为Unit行及其后的统计行设置表头样式
        if (unitRowIdx >= 0) {
            for (let R = unitRowIdx; R <= range.e.r; ++R) {
                const firstCellRef = XLSX.utils.encode_cell({r: R, c: 0});
                if (!ws[firstCellRef]) ws[firstCellRef] = {v: '', t: 's'};
                if (!ws[firstCellRef].s) ws[firstCellRef].s = {};
                
                // 第一列（行标题）设置为表头样式
                ws[firstCellRef].s.fill = {
                    patternType: 'solid',
                    fgColor: {rgb: 'F5F5F7'}
                };
                ws[firstCellRef].s.font = {
                    bold: true,
                    color: {rgb: '1D1D1F'}
                };
            }
        }
        
        // 为MAX_SPEC和MIN_SPEC行设置黄色背景
        const specialRows = ['MAX_SPEC', 'MIN_SPEC'];
        for (let i = 0; i < ws_data.length; i++) {
            if (specialRows.includes(ws_data[i][0])) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cellRef = XLSX.utils.encode_cell({r: i, c: C});
                    if (!ws[cellRef]) ws[cellRef] = {v: '', t: 's'};
                    if (!ws[cellRef].s) ws[cellRef].s = {};
                    
                    // 设置黄色背景
                    ws[cellRef].s.fill = {
                        patternType: 'solid',
                        fgColor: {rgb: 'FFE599'}
                    };
                }
            }
        }
        
        // 为Conclusion行设置条件格式
        for (let i = 0; i < ws_data.length; i++) {
            if (ws_data[i][0] === 'Conclusion') {
                for (let C = 1; C <= range.e.c; ++C) { // 跳过第一列（行标题）
                    const cellRef = XLSX.utils.encode_cell({r: i, c: C});
                    if (ws[cellRef] && ws[cellRef].v) {
                        if (!ws[cellRef].s) ws[cellRef].s = {};
                        
                        if (ws[cellRef].v === 'PASS') {
                            ws[cellRef].s.fill = {
                                patternType: 'solid',
                                fgColor: {rgb: '90EE90'}
                            };
                            ws[cellRef].s.font = {
                                color: {rgb: '006400'},
                                bold: true
                            };
                        } else if (ws[cellRef].v === 'FAIL') {
                            ws[cellRef].s.fill = {
                                patternType: 'solid',
                                fgColor: {rgb: 'FFB6C1'}
                            };
                            ws[cellRef].s.font = {
                                color: {rgb: '8B0000'},
                                bold: true
                            };
                        }
                    }
                }
            }
        }
        
        // 处理合并单元格
        if (ws_data.length > 0) {
            const merges = [];
            const firstRow = ws_data[0];
            let colIndex = 1; // 跳过第一列
            
            // 处理第一行的合并单元格
            for (let i = 1; i < firstRow.length; i++) {
                if (firstRow[i] && firstRow[i].trim() !== '') {
                    // 计算这个测试条件需要合并的列数
                    let mergeCount = 0;
                    let nextNonEmpty = i + 1;
                    
                    // 找到下一个非空单元格
                    while (nextNonEmpty < firstRow.length && (!firstRow[nextNonEmpty] || firstRow[nextNonEmpty].trim() === '')) {
                        mergeCount++;
                        nextNonEmpty++;
                    }
                    
                    // 如果需要合并
                    if (mergeCount > 0) {
                        merges.push({
                            s: {c: i, r: 0}, // 开始位置
                            e: {c: i + mergeCount, r: 0} // 结束位置
                        });
                    }
                    
                    i += mergeCount; // 跳过已合并的列
                }
            }
            
            if (merges.length > 0) {
                ws['!merges'] = merges;
            }
        }
        
        // 设置列宽
        const colWidths = [];
        for (let i = 0; i < (ws_data[1] || []).length; i++) {
            if (i === 0) {
                colWidths.push({wch: 15}); // Serial No列稍宽
            } else {
                colWidths.push({wch: 12}); // 其他列标准宽度
            }
        }
        ws['!cols'] = colWidths;
        
        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(wb, ws, 'Accuracy CPK');
        
        // 生成文件名
        const modelName = window.currentModelName || 'Unknown';
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `${modelName}_Accuracy_CPK_${timestamp}.xlsx`;
        
        // 导出文件
        XLSX.writeFile(wb, filename);
    };
    
    // AI聊天功能
    const toggleChatBtn = document.getElementById('toggleChatBtn');
    const aiChatBox = document.getElementById('ai-chat-box');
    const aiChatInput = document.getElementById('ai-chat-input');
    const aiChatSend = document.getElementById('ai-chat-send');
    const aiChatHistory = document.getElementById('ai-chat-history');
    
    let isChatVisible = false;
    
    // 切换聊天框显示
    toggleChatBtn.onclick = function() {
        isChatVisible = !isChatVisible;
        if (isChatVisible) {
            aiChatBox.style.display = 'block';
            toggleChatBtn.innerHTML = '<i class="fa-solid fa-comments"></i> 隱藏AI聊天';
        } else {
            aiChatBox.style.display = 'none';
            toggleChatBtn.innerHTML = '<i class="fa-solid fa-comments"></i> 顯示AI聊天';
        }
    };
    
    // 发送消息
    function sendMessage() {
        const message = aiChatInput.value.trim();
        if (message) {
            // 添加用户消息
            const userMsg = document.createElement('div');
            userMsg.style.cssText = 'margin-bottom: 10px; padding: 8px; background: #e3f2fd; border-radius: 8px; text-align: right;';
            userMsg.innerHTML = `<strong>您:</strong> ${message}`;
            aiChatHistory.appendChild(userMsg);
            
            // 添加AI回复（模拟）
            const aiMsg = document.createElement('div');
            aiMsg.style.cssText = 'margin-bottom: 10px; padding: 8px; background: #f0f4f8; border-radius: 8px;';
            aiMsg.innerHTML = `<strong>AI:</strong> 我理解您的問題："${message}"。這是一個關於Accuracy CPK分析的問題，我會盡力協助您。`;
            aiChatHistory.appendChild(aiMsg);
            
            // 清空输入框并滚动到底部
            aiChatInput.value = '';
            aiChatHistory.scrollTop = aiChatHistory.scrollHeight;
        }
    }
    
    aiChatSend.onclick = sendMessage;
    aiChatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 语言切换功能
    const langSelect = document.getElementById('langSelect');
    langSelect.onchange = function() {
        const selectedLang = this.value;
        const t = translations[selectedLang];
        
        if (t) {
            // 更新页面元素
            document.querySelector('h1').innerHTML = `<i class="fa-solid fa-bullseye" style="margin-right: 16px;"></i>${t.title}`;
            document.querySelector('.custom-file-label').innerHTML = `<i class="fa-solid fa-folder-open" style="margin-right: 8px;"></i> ${t.uploadFolder}`;
            document.getElementById('chooseFolderBtn').textContent = t.chooseFolder;
            document.getElementById('execAccuracyCpkBtn').textContent = t.executeAccuracyCpk;
            document.getElementById('exportCpkBtn').innerHTML = `<i class="fa-solid fa-download" style="margin-right: 8px;"></i>${t.exportCpkExcel}`;
            document.querySelector('#ai-chat-drag').innerHTML = `<i class="fa-solid fa-robot"></i> ${t.aiChat}`;
            document.getElementById('ai-chat-input').placeholder = t.inputPlaceholder;
            document.getElementById('ai-chat-send').innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${t.send}`;
            
            // 更新聊天按钮文字
            if (isChatVisible) {
                toggleChatBtn.innerHTML = `<i class="fa-solid fa-comments"></i> ${t.hideAiChat}`;
            } else {
                toggleChatBtn.innerHTML = `<i class="fa-solid fa-comments"></i> ${t.showAiChat}`;
            }
            
            // 更新帮助提示
            document.querySelector('.help-icon').title = t.help;
        }
    };
    
    // 拖拽功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    const dragElement = document.getElementById('ai-chat-drag');
    const dragContainer = document.getElementById('ai-chat-box');
    
    dragElement.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if (e.target === dragElement) {
            isDragging = true;
        }
    }
    
    function dragMove(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            dragContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }
    
    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
});
