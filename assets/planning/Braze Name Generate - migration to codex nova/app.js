document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear().toString();
    let activeTab = 'campaignCanvas'; 
    
    const tabCampaignCanvas = document.getElementById('tabCampaignCanvas');
    const tabSegment = document.getElementById('tabSegment');
    const tabMyList = document.getElementById('tabMyList'); 

    const campaignCanvasContent = document.getElementById('campaignCanvasContent');
    const segmentContent = document.getElementById('segmentContent');
    const myListContent = document.getElementById('myListContent'); 
    const currentYearFooter = document.getElementById('currentYearFooter');

    // Saved Names List Elements
    const savedCampaignsListDiv = document.getElementById('savedCampaignsList');
    const emptyCampaignsMessage = document.getElementById('emptyCampaignsMessage');
    const savedSegmentsListDiv = document.getElementById('savedSegmentsList');
    const emptySegmentsMessage = document.getElementById('emptySegmentsMessage');
    
    const copyAllSavedButton = document.getElementById('copyAllSavedButton');
    const clearSavedListButton = document.getElementById('clearSavedListButton');
    const savedListMessage = document.getElementById('savedListMessage');

    let savedNamesData = []; // Array to store objects: { name: "...", type: "Campaign/Canvas" | "Segment" }

    const elementSelectors = {
        campaignCanvas: {
            purposeCodeSelect: 'purposeCodeSelect', brandSelect: 'brandSelect', packageSelect: 'packageSelect',
            mainCommTypeSelect: 'mainCommTypeSelect', specificCommTypeContainer: 'specificCommTypeContainer',
            specificCommTypeSelect: 'specificCommTypeSelect', resetButton: 'resetButtonCampaign',
            addToListButton: 'addToListButtonCampaign', 
            outputArea: 'outputAreaCampaign', copyButton: 'copyButtonCampaign', 
            copyMessage: 'copyMessageCampaign', form: 'nameFormCampaign',
            formCard: campaignCanvasContent.querySelector('.w-full.bg-white.p-6.md\\:p-8.shadow-xl.rounded-b-xl')
        },
        segment: {
            purposeCodeSelect: 'purposeCodeSelect_segment', brandSelect: 'brandSelect_segment', packageSelect: 'packageSelect_segment',
            mainCommTypeSelect: 'mainCommTypeSelect_segment', specificCommTypeContainer: 'specificCommTypeContainer_segment',
            specificCommTypeSelect: 'specificCommTypeSelect_segment', 
            customSuffixContainer: 'customSuffixContainer_segment', 
            customSuffixInput: 'customSuffix_segment', 
            resetButton: 'resetButtonSegment',
            addToListButton: 'addToListButtonSegment', 
            outputArea: 'outputAreaSegment', copyButton: 'copyButtonSegment', 
            copyMessage: 'copyMessageSegment', form: 'nameFormSegment',
            formCard: segmentContent.querySelector('.w-full.bg-white.p-6.md\\:p-8.shadow-xl.rounded-b-xl')
        },
        myList: { 
            formCard: myListContent.querySelector('.w-full.bg-white.p-6.md\\:p-8.shadow-xl.rounded-b-xl')
        }
    };

    const tabStates = {
        campaignCanvas: {
            selectedPurposeCodeValue: null, selectedBrandValue: null, selectedPackageValue: null,
            selectedMainCommTypeValue: null, selectedSpecificCommTypeValue: null,
        },
        segment: {
            selectedPurposeCodeValue: null, selectedBrandValue: null, selectedPackageValue: null,
            selectedMainCommTypeValue: null, selectedSpecificCommTypeValue: null, 
            selectedCustomSuffixValue: '' 
        }
    };

    const activeTabClasses = ['bg-white', 'text-blue-700', 'shadow-sm', '-mb-px', 'z-10', 'relative', 'rounded-t-lg'];
    const inactiveTabClasses = ['text-slate-500', 'hover:text-blue-600', 'hover:bg-slate-100', 'rounded-t-lg'];

    function getEl(tabId, selectorKey) {
        if (selectorKey === 'formCard' && elementSelectors[tabId]) { 
            return elementSelectors[tabId][selectorKey];
        }
        if (elementSelectors[tabId] && elementSelectors[tabId][selectorKey]) {
            return document.getElementById(elementSelectors[tabId][selectorKey]);
        }
        return null; 
    }

    function populateDropdown(selectElement, items, valueField, textField, placeholder, previousValue = null, addNoPackageOption = false) {
        if(!selectElement) return false; 
        if (addNoPackageOption) {
            selectElement.innerHTML = `<option value="">-- No Package --</option>`;
        } else {
            selectElement.innerHTML = `<option value="">-- ${placeholder} --</option>`;
        }
        let valueFound = false;
        if (items) { 
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item[valueField];
                if ((item.initial === 'FT' || item.initial === 'SP') && addNoPackageOption) {
                     option.textContent = `${item.fullName} (${item.initial})`;
                } else {
                     option.textContent = item[textField];
                }
                selectElement.appendChild(option);
                if (previousValue && item[valueField] === previousValue) {
                    valueFound = true;
                }
            });
        }
        if (valueFound && previousValue) {
            selectElement.value = previousValue;
        } else {
            selectElement.value = "";
        }
        return valueFound && !!previousValue;
    }

    function resetDropdownToPlaceholder(selectElement, placeholder, isPackageDropdown = false) {
        if(!selectElement) return; 
        if (isPackageDropdown) {
            selectElement.innerHTML = `<option value="">-- No Package --</option>`;
        } else {
            selectElement.innerHTML = `<option value="">-- ${placeholder} --</option>`;
        }
        selectElement.value = "";
    }

    function updateFormState(tabId) {
        if (tabId !== 'campaignCanvas' && tabId !== 'segment') return;

        const state = tabStates[tabId];
        const brandSel = getEl(tabId, 'brandSelect');
        const packageSel = getEl(tabId, 'packageSelect');
        const mainCommTypeSel = getEl(tabId, 'mainCommTypeSelect');
        const specificCommTypeCont = getEl(tabId, 'specificCommTypeContainer');
        const specificCommTypeSel = getEl(tabId, 'specificCommTypeSelect');
        const output = getEl(tabId, 'outputArea');
        const copyBtn = getEl(tabId, 'copyButton');
        const addToListBtn = getEl(tabId, 'addToListButton');
        
        const customSuffixCont = getEl(tabId, 'customSuffixContainer'); 
        const customSuffixInp = getEl(tabId, 'customSuffixInput'); 

        if (brandSel) brandSel.disabled = !state.selectedPurposeCodeValue;
        if (packageSel) packageSel.disabled = !state.selectedBrandValue;
        if (mainCommTypeSel) mainCommTypeSel.disabled = !state.selectedBrandValue || !state.selectedPurposeCodeValue;
        
        const currentCommTypes = (tabId === 'segment') ? segmentCommunicationTypes : communicationTypes;
        const mainCommTypeData = currentCommTypes.find(ct => ct.name === state.selectedMainCommTypeValue);
        const hasSubTypes = mainCommTypeData && mainCommTypeData.subTypes && mainCommTypeData.subTypes.length > 0;

        if (specificCommTypeCont) {
            if (hasSubTypes) {
                specificCommTypeCont.classList.remove('hidden');
                if(specificCommTypeSel) specificCommTypeSel.disabled = !state.selectedMainCommTypeValue;
            } else {
                specificCommTypeCont.classList.add('hidden');
                if(specificCommTypeSel) specificCommTypeSel.disabled = true;
                state.selectedSpecificCommTypeValue = null; 
                if (specificCommTypeSel && specificCommTypeSel.options.length > 0) specificCommTypeSel.value = "";
            }
        }
        
        if (tabId === 'segment' && customSuffixCont && customSuffixInp) {
            if (state.selectedMainCommTypeValue) { 
                customSuffixCont.classList.remove('hidden');
                customSuffixInp.disabled = false;
            } else {
                customSuffixCont.classList.add('hidden');
                customSuffixInp.disabled = true;
                customSuffixInp.value = ""; 
                state.selectedCustomSuffixValue = ""; 
            }
        }

        let canGenerate = state.selectedPurposeCodeValue && state.selectedBrandValue && state.selectedMainCommTypeValue;
        if (hasSubTypes) { 
            canGenerate = canGenerate && state.selectedSpecificCommTypeValue;
        }

        if (canGenerate) {
            generateName(tabId);
            if (addToListBtn) addToListBtn.disabled = false;
        } else {
            if(output) {
                output.textContent = 'Your generated name will appear here...';
                output.classList.add('text-slate-400');
                output.classList.remove('text-slate-700');
            }
            if(copyBtn) copyBtn.disabled = true;
            if (addToListBtn) addToListBtn.disabled = true;
        }
    }

    function generateName(tabId) {
        const state = tabStates[tabId];
        const output = getEl(tabId, 'outputArea');
        const copyBtn = getEl(tabId, 'copyButton');
        const addToListBtn = getEl(tabId, 'addToListButton');
        
        let codePart = state.selectedPurposeCodeValue === 'YEAR' ? currentYear : state.selectedPurposeCodeValue;
        const brandData = brands.find(b => b.fullName === state.selectedBrandValue);
        let brandAndPackagePart = brandData ? brandData.initial : 'XX';

        if (state.selectedPackageValue) { 
            const packageData = brandPackages.find(p => p.fullName === state.selectedPackageValue);
            if (packageData) {
                brandAndPackagePart += `_${packageData.initial}`;
            }
        }

        let commPart = '';
        const currentCommTypes = (tabId === 'segment') ? segmentCommunicationTypes : communicationTypes;
        const mainTypeData = currentCommTypes.find(ct => ct.name === state.selectedMainCommTypeValue);
        if (mainTypeData) {
            if (mainTypeData.subTypes && mainTypeData.subTypes.length > 0 && state.selectedSpecificCommTypeValue) {
                const subTypeData = mainTypeData.subTypes.find(st => st.name === state.selectedSpecificCommTypeValue);
                commPart = subTypeData ? subTypeData.generatedString : '';
            } else {
                commPart = mainTypeData.generatedString || '';
            }
        }

        let finalName = `${codePart}_${brandAndPackagePart}_${commPart}`;

        if (tabId === 'segment' && state.selectedCustomSuffixValue) {
            const sanitizedSuffix = state.selectedCustomSuffixValue.trim().replace(/\s+/g, '_');
            if (sanitizedSuffix) {
                finalName += `_${sanitizedSuffix}`;
            }
        }

        if(output) {
            output.textContent = finalName;
            output.classList.remove('text-slate-400');
            output.classList.add('text-slate-700');
        }
        if(copyBtn) copyBtn.disabled = false;
        if(addToListBtn) addToListBtn.disabled = false;
    }

    function setupEventListeners(tabId) {
        if (tabId !== 'campaignCanvas' && tabId !== 'segment') return;

        const state = tabStates[tabId];
        const purposeCodeSel = getEl(tabId, 'purposeCodeSelect');
        const brandSel = getEl(tabId, 'brandSelect');
        const packageSel = getEl(tabId, 'packageSelect');
        const mainCommTypeSel = getEl(tabId, 'mainCommTypeSelect');
        const specificCommTypeSel = getEl(tabId, 'specificCommTypeSelect');
        const customSuffixInp = getEl(tabId, 'customSuffixInput'); 
        const resetBtn = getEl(tabId, 'resetButton');
        const copyBtn = getEl(tabId, 'copyButton');
        const addToListBtn = getEl(tabId, 'addToListButton');
        const output = getEl(tabId, 'outputArea');
        const copyMsg = getEl(tabId, 'copyMessage');

        purposeCodeSel.addEventListener('change', () => {
            state.selectedPurposeCodeValue = purposeCodeSel.value;
            const previousBrand = state.selectedBrandValue;
            if (state.selectedPurposeCodeValue) {
                const brandPreserved = populateDropdown(brandSel, brands, 'fullName', 'fullName', 'Select Brand', previousBrand);
                if (!brandPreserved) {
                    state.selectedBrandValue = null;
                    state.selectedPackageValue = null; 
                }
            } else {
                resetDropdownToPlaceholder(brandSel, 'Select Brand');
                state.selectedBrandValue = null;
                resetDropdownToPlaceholder(packageSel, 'No Package', true);
                state.selectedPackageValue = null;
            }
            handleBrandChange(tabId);
        });

        brandSel.addEventListener('change', () => {
            state.selectedBrandValue = brandSel.value;
            const previousPackage = state.selectedPackageValue;
            if (state.selectedBrandValue) {
                const packagePreserved = populateDropdown(packageSel, brandPackages, 'fullName', 'fullName', 'No Package', previousPackage, true);
                if (!packagePreserved) {
                    state.selectedPackageValue = ""; 
                    if(packageSel) packageSel.value = "";
                } else {
                     state.selectedPackageValue = packageSel.value; 
                }
            } else {
                resetDropdownToPlaceholder(packageSel, 'No Package', true);
                state.selectedPackageValue = null;
            }
            handleBrandChange(tabId);
        });

        packageSel.addEventListener('change', () => {
            state.selectedPackageValue = packageSel.value;
            updateFormState(tabId);
        });

        mainCommTypeSel.addEventListener('change', () => {
            state.selectedMainCommTypeValue = mainCommTypeSel.value;
            if (tabId === 'segment') {
                const customSuffixContainer = getEl('segment', 'customSuffixContainer');
                const customSuffixInputElement = getEl('segment', 'customSuffixInput');
                if (state.selectedMainCommTypeValue) {
                    if(customSuffixContainer) customSuffixContainer.classList.remove('hidden');
                    if(customSuffixInputElement) customSuffixInputElement.disabled = false;
                } else {
                    if(customSuffixContainer) customSuffixContainer.classList.add('hidden');
                    if(customSuffixInputElement) {
                        customSuffixInputElement.disabled = true;
                        customSuffixInputElement.value = ''; 
                    }
                    state.selectedCustomSuffixValue = ''; 
                }
            }
            handleMainCommTypeChange(tabId);
        });

        if(specificCommTypeSel) { 
            specificCommTypeSel.addEventListener('change', () => {
                state.selectedSpecificCommTypeValue = specificCommTypeSel.value;
                updateFormState(tabId);
            });
        }

        if (tabId === 'segment' && customSuffixInp) {
            customSuffixInp.addEventListener('input', () => {
                state.selectedCustomSuffixValue = customSuffixInp.value;
                updateFormState(tabId); 
            });
        }
        
        resetBtn.addEventListener('click', () => {
            state.selectedPurposeCodeValue = null;
            state.selectedBrandValue = null;
            state.selectedPackageValue = null;
            state.selectedMainCommTypeValue = null;
            state.selectedSpecificCommTypeValue = null;
            if (tabId === 'segment') { 
                state.selectedCustomSuffixValue = '';
                const suffixInp = getEl('segment', 'customSuffixInput');
                if (suffixInp) suffixInp.value = '';
                const suffixCont = getEl('segment', 'customSuffixContainer');
                if (suffixCont) suffixCont.classList.add('hidden');
            }

            if(purposeCodeSel) purposeCodeSel.value = "";
            resetDropdownToPlaceholder(brandSel, 'Select Brand');
            resetDropdownToPlaceholder(packageSel, 'No Package', true);
            if(packageSel) packageSel.disabled = true;
            resetDropdownToPlaceholder(mainCommTypeSel, 'Select Main Type');
            resetDropdownToPlaceholder(specificCommTypeSel, 'Select Specific Type');
            
            const specificContainer = getEl(tabId, 'specificCommTypeContainer');
            if(specificContainer) specificContainer.classList.add('hidden');
            
            if(output) {
                output.textContent = 'Your generated name will appear here...';
                output.classList.add('text-slate-400');
                output.classList.remove('text-slate-700');
            }
            if(copyBtn) copyBtn.disabled = true;
            if(addToListBtn) addToListBtn.disabled = true;
            if(copyMsg) copyMsg.textContent = '';
            updateFormState(tabId);
        });

        copyBtn.addEventListener('click', () => {
            if (output && output.textContent && output.textContent !== 'Your generated name will appear here...') {
                navigator.clipboard.writeText(output.textContent)
                    .then(() => {
                        if(copyMsg) copyMsg.textContent = 'Copied to clipboard!';
                        setTimeout(() => { if(copyMsg) copyMsg.textContent = ''; }, 2000);
                    })
                    .catch(err => {
                        if(copyMsg) copyMsg.textContent = 'Failed to copy.';
                        console.error('Failed to copy text: ', err);
                        setTimeout(() => { if(copyMsg) copyMsg.textContent = ''; }, 2000);
                    });
            }
        });

        addToListBtn.addEventListener('click', () => {
            const nameToAdd = output.textContent;
            const typeOfName = tabId === 'campaignCanvas' ? 'Campaign/Canvas' : 'Segment';
            
            if (nameToAdd && nameToAdd !== 'Your generated name will appear here...') {
                // Check for duplicates based on both name and type
                const isDuplicate = savedNamesData.some(item => item.name === nameToAdd && item.type === typeOfName);

                if (!isDuplicate) {
                    savedNamesData.push({ name: nameToAdd, type: typeOfName });
                    renderSavedNamesList();
                    if (savedListMessage) { 
                        savedListMessage.textContent = `"${nameToAdd}" (${typeOfName}) added to list!`;
                        savedListMessage.classList.remove('text-red-500');
                        savedListMessage.classList.add('text-green-600');
                        setTimeout(() => { if (savedListMessage) savedListMessage.textContent = ''; }, 2500);
                    }
                } else {
                    if (savedListMessage) { 
                        savedListMessage.textContent = `"${nameToAdd}" (${typeOfName}) is already in the list.`;
                        savedListMessage.classList.add('text-red-500');
                        savedListMessage.classList.remove('text-green-600');
                        setTimeout(() => { if (savedListMessage) savedListMessage.textContent = ''; }, 2500);
                    }
                }
            }
        });
    }

    function handleBrandChange(tabId) {
        const state = tabStates[tabId];
        const packageSel = getEl(tabId, 'packageSelect');
        const mainCommTypeSel = getEl(tabId, 'mainCommTypeSelect');
        const previousMainCommType = state.selectedMainCommTypeValue;

        if (state.selectedBrandValue && state.selectedPurposeCodeValue) {
            if(packageSel) packageSel.disabled = false; 
            const currentCommTypes = (tabId === 'segment') ? segmentCommunicationTypes : communicationTypes;
            const validCommTypes = currentCommTypes.filter(ct => ct.validCodes.includes(state.selectedPurposeCodeValue));
            const mainCommTypePreserved = populateDropdown(mainCommTypeSel, validCommTypes, 'name', 'name', 'Select Main Type', previousMainCommType);
            if (!mainCommTypePreserved) state.selectedMainCommTypeValue = null;
        } else {
            resetDropdownToPlaceholder(mainCommTypeSel, 'Select Main Type');
            state.selectedMainCommTypeValue = null;
            resetDropdownToPlaceholder(packageSel, 'No Package', true);
            if(packageSel) packageSel.disabled = true;
            state.selectedPackageValue = null;
        }
        if (tabId === 'segment' && !state.selectedMainCommTypeValue) {
            const customSuffixContainer = getEl('segment', 'customSuffixContainer');
            const customSuffixInputElement = getEl('segment', 'customSuffixInput');
            if(customSuffixContainer) customSuffixContainer.classList.add('hidden');
            if(customSuffixInputElement) {
                customSuffixInputElement.disabled = true;
                customSuffixInputElement.value = '';
            }
            state.selectedCustomSuffixValue = '';
        }
        handleMainCommTypeChange(tabId);
    }

    function handleMainCommTypeChange(tabId) {
        const state = tabStates[tabId];
        const specificCommTypeSel = getEl(tabId, 'specificCommTypeSelect');
        const previousSpecificCommType = state.selectedSpecificCommTypeValue;
        const currentCommTypes = (tabId === 'segment') ? segmentCommunicationTypes : communicationTypes;
        const mainTypeData = currentCommTypes.find(ct => ct.name === state.selectedMainCommTypeValue);

        if (mainTypeData && mainTypeData.subTypes && mainTypeData.subTypes.length > 0) {
            const specificPreserved = populateDropdown(specificCommTypeSel, mainTypeData.subTypes, 'name', 'name', 'Select Specific Type', previousSpecificCommType);
            if (!specificPreserved) state.selectedSpecificCommTypeValue = null;
        } else {
            resetDropdownToPlaceholder(specificCommTypeSel, 'Select Specific Type');
            state.selectedSpecificCommTypeValue = null;
        }
        updateFormState(tabId);
    }

    function switchTab(targetTabId) {
        activeTab = targetTabId;
        
        tabCampaignCanvas.classList.toggle('active', targetTabId === 'campaignCanvas');
        tabSegment.classList.toggle('active', targetTabId === 'segment');
        tabMyList.classList.toggle('active', targetTabId === 'myList');

        if (targetTabId === 'campaignCanvas') {
            tabCampaignCanvas.classList.remove(...inactiveTabClasses);
            tabCampaignCanvas.classList.add(...activeTabClasses);
            tabSegment.classList.remove(...activeTabClasses);
            tabSegment.classList.add(...inactiveTabClasses);
            tabMyList.classList.remove(...activeTabClasses);
            tabMyList.classList.add(...inactiveTabClasses);
        } else if (targetTabId === 'segment') {
            tabSegment.classList.remove(...inactiveTabClasses);
            tabSegment.classList.add(...activeTabClasses);
            tabCampaignCanvas.classList.remove(...activeTabClasses);
            tabCampaignCanvas.classList.add(...inactiveTabClasses);
            tabMyList.classList.remove(...activeTabClasses);
            tabMyList.classList.add(...inactiveTabClasses);
        } else { // myList
            tabMyList.classList.remove(...inactiveTabClasses);
            tabMyList.classList.add(...activeTabClasses);
            tabCampaignCanvas.classList.remove(...activeTabClasses);
            tabCampaignCanvas.classList.add(...inactiveTabClasses);
            tabSegment.classList.remove(...activeTabClasses);
            tabSegment.classList.add(...inactiveTabClasses);
        }

        campaignCanvasContent.classList.toggle('hidden', targetTabId !== 'campaignCanvas');
        segmentContent.classList.toggle('hidden', targetTabId !== 'segment');
        myListContent.classList.toggle('hidden', targetTabId !== 'myList');
        
        const campaignFormCard = getEl('campaignCanvas', 'formCard');
        const segmentFormCard = getEl('segment', 'formCard');
        const myListCard = getEl('myList', 'formCard');

        [campaignFormCard, segmentFormCard, myListCard].forEach(card => {
            if (card) {
                card.classList.remove('rounded-tr-xl', 'rounded-tl-xl');
            }
        });
        
        // Adjust rounding based on the active tab
        if (targetTabId === 'campaignCanvas' && campaignFormCard) {
            campaignFormCard.classList.add('rounded-tr-xl'); // First tab, round top-right
        } else if (targetTabId === 'segment' && segmentFormCard) {
            segmentFormCard.classList.add('rounded-tr-xl', 'rounded-tl-xl'); // Middle tab can have both if it's the only one or first shown
        } else if (targetTabId === 'myList' && myListCard) {
            myListCard.classList.add('rounded-tl-xl'); // Last tab, round top-left
        }
        // Special handling if only one tab is "active" in terms of card display
        if (targetTabId === 'campaignCanvas' && campaignFormCard) {
             // If it's the first tab, it should have rounded-tr-xl
        } else if (targetTabId === 'segment' && segmentFormCard) {
            if (campaignFormCard) campaignFormCard.classList.add('rounded-tr-xl'); // Ensure left neighbour is also rounded
            segmentFormCard.classList.add('rounded-tl-xl');
        } else if (targetTabId === 'myList' && myListCard) {
            if (segmentFormCard) segmentFormCard.classList.add('rounded-tr-xl'); // Ensure left neighbour is also rounded
             myListCard.classList.add('rounded-tl-xl');
        }


        if (targetTabId === 'segment') {
            transferCampaignToSegmentValues();
        }
        if (targetTabId === 'campaignCanvas' || targetTabId === 'segment') {
            updateFormState(activeTab); 
        } else if (targetTabId === 'myList') {
            renderSavedNamesList(); 
        }
    }
    
    function transferCampaignToSegmentValues() {
        const campaignState = tabStates.campaignCanvas;
        const segmentState = tabStates.segment;

        segmentState.selectedPurposeCodeValue = campaignState.selectedPurposeCodeValue;
        segmentState.selectedBrandValue = campaignState.selectedBrandValue;
        segmentState.selectedPackageValue = campaignState.selectedPackageValue;
        segmentState.selectedMainCommTypeValue = campaignState.selectedMainCommTypeValue; 
        segmentState.selectedSpecificCommTypeValue = campaignState.selectedSpecificCommTypeValue;
        segmentState.selectedCustomSuffixValue = ''; 

        const segPurposeSel = getEl('segment', 'purposeCodeSelect');
        const segBrandSel = getEl('segment', 'brandSelect');
        const segPackageSel = getEl('segment', 'packageSelect');
        const segMainCommTypeSel = getEl('segment', 'mainCommTypeSelect');
        const segSpecificCommTypeSel = getEl('segment', 'specificCommTypeSelect');
        const segCustomSuffixInp = getEl('segment', 'customSuffixInput');
        const segCustomSuffixCont = getEl('segment', 'customSuffixContainer');

        if (segPurposeSel) {
            segPurposeSel.value = segmentState.selectedPurposeCodeValue || "";
        }

        if (segmentState.selectedPurposeCodeValue) {
            populateDropdown(segBrandSel, brands, 'fullName', 'fullName', 'Select Brand', segmentState.selectedBrandValue);
            if(segBrandSel) segBrandSel.disabled = false;
        } else {
            resetDropdownToPlaceholder(segBrandSel, 'Select Brand');
            if(segBrandSel) segBrandSel.disabled = true;
        }

        if (segmentState.selectedBrandValue) {
            populateDropdown(segPackageSel, brandPackages, 'fullName', 'fullName', 'No Package', segmentState.selectedPackageValue, true);
            if(segPackageSel) segPackageSel.disabled = false;
        } else {
            resetDropdownToPlaceholder(segPackageSel, 'No Package', true);
            if(segPackageSel) segPackageSel.disabled = true;
        }
        
        if (segmentState.selectedBrandValue && segmentState.selectedPurposeCodeValue) {
            const currentCommTypes = segmentCommunicationTypes; 
            const validCommTypes = currentCommTypes.filter(ct => ct.validCodes.includes(segmentState.selectedPurposeCodeValue));
            populateDropdown(segMainCommTypeSel, validCommTypes, 'name', 'name', 'Select Main Type', segmentState.selectedMainCommTypeValue);
            if(segMainCommTypeSel) segMainCommTypeSel.disabled = false;
        } else {
            resetDropdownToPlaceholder(segMainCommTypeSel, 'Select Main Type');
            if(segMainCommTypeSel) segMainCommTypeSel.disabled = true;
        }

        const mainTypeData = segmentCommunicationTypes.find(ct => ct.name === segmentState.selectedMainCommTypeValue);
        if (mainTypeData && mainTypeData.subTypes && mainTypeData.subTypes.length > 0) {
            populateDropdown(segSpecificCommTypeSel, mainTypeData.subTypes, 'name', 'name', 'Select Specific Type', segmentState.selectedSpecificCommTypeValue);
            if(segSpecificCommTypeSel) segSpecificCommTypeSel.disabled = false;
        } else {
            resetDropdownToPlaceholder(segSpecificCommTypeSel, 'Select Specific Type');
            if(segSpecificCommTypeSel) segSpecificCommTypeSel.disabled = true;
        }
        
        if (segCustomSuffixInp) segCustomSuffixInp.value = ''; 
        if (segmentState.selectedMainCommTypeValue) {
            if(segCustomSuffixCont) segCustomSuffixCont.classList.remove('hidden');
            if(segCustomSuffixInp) segCustomSuffixInp.disabled = false;
        } else {
            if(segCustomSuffixCont) segCustomSuffixCont.classList.add('hidden');
            if(segCustomSuffixInp) segCustomSuffixInp.disabled = true;
        }
        
        updateFormState('segment');
    }

    function initializeAppForTab(tabId) {
        if (tabId !== 'campaignCanvas' && tabId !== 'segment') return;

        const state = tabStates[tabId];
        const purposeCodeSel = getEl(tabId, 'purposeCodeSelect');
        
        if (purposeCodeSel && purposeCodeSel.options.length <= 1) { 
            purposeCodes.forEach(pc => {
                const option = document.createElement('option');
                option.value = pc.codeValue;
                option.textContent = pc.display;
                purposeCodeSel.appendChild(option);
            });
        }
        
        state.selectedPurposeCodeValue = null;
        state.selectedBrandValue = null;
        state.selectedPackageValue = null;
        state.selectedMainCommTypeValue = null;
        state.selectedSpecificCommTypeValue = null;
        if (tabId === 'segment') {
            state.selectedCustomSuffixValue = '';
        }

        if(purposeCodeSel) purposeCodeSel.value = "";
        resetDropdownToPlaceholder(getEl(tabId, 'brandSelect'), 'Select Brand');
        resetDropdownToPlaceholder(getEl(tabId, 'packageSelect'), 'No Package', true);
        const packageElement = getEl(tabId, 'packageSelect');
        if(packageElement) packageElement.disabled = true;
        
        resetDropdownToPlaceholder(getEl(tabId, 'mainCommTypeSelect'), 'Select Main Type');
        resetDropdownToPlaceholder(getEl(tabId, 'specificCommTypeSelect'), 'Select Specific Type');
        
        const specificContainer = getEl(tabId, 'specificCommTypeContainer');
        if(specificContainer) specificContainer.classList.add('hidden');

        if (tabId === 'segment') {
            const customSuffixContainer = getEl('segment', 'customSuffixContainer');
            const customSuffixInputElement = getEl('segment', 'customSuffixInput');
            if(customSuffixContainer) customSuffixContainer.classList.add('hidden');
            if(customSuffixInputElement) {
                customSuffixInputElement.value = '';
                customSuffixInputElement.disabled = true;
            }
        }
        
        const output = getEl(tabId, 'outputArea');
        if(output) {
            output.textContent = 'Your generated name will appear here...';
            output.classList.add('text-slate-400');
            output.classList.remove('text-slate-700');
        }
        
        const copyBtn = getEl(tabId, 'copyButton');
        const addToListBtn = getEl(tabId, 'addToListButton');
        if(copyBtn) copyBtn.disabled = true;
        if(addToListBtn) addToListBtn.disabled = true;

        const copyMsg = getEl(tabId, 'copyMessage');
        if(copyMsg) copyMsg.textContent = '';
        
        updateFormState(tabId); 
    }

    function renderSavedNamesList() {
        if (!savedCampaignsListDiv || !emptyCampaignsMessage || !savedSegmentsListDiv || !emptySegmentsMessage || !copyAllSavedButton || !clearSavedListButton) return;

        savedCampaignsListDiv.innerHTML = ''; 
        savedSegmentsListDiv.innerHTML = '';

        const campaignNames = savedNamesData.filter(item => item.type === 'Campaign/Canvas');
        const segmentNames = savedNamesData.filter(item => item.type === 'Segment');

        if (campaignNames.length === 0) {
            emptyCampaignsMessage.classList.remove('hidden');
        } else {
            emptyCampaignsMessage.classList.add('hidden');
            const ul = document.createElement('ul');
            campaignNames.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.name;
                li.className = 'p-2 border-b border-slate-200 text-sm font-mono text-slate-700 break-all last:border-b-0';
                ul.appendChild(li);
            });
            savedCampaignsListDiv.appendChild(ul);
        }

        if (segmentNames.length === 0) {
            emptySegmentsMessage.classList.remove('hidden');
        } else {
            emptySegmentsMessage.classList.add('hidden');
            const ul = document.createElement('ul');
            segmentNames.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.name;
                li.className = 'p-2 border-b border-slate-200 text-sm font-mono text-slate-700 break-all last:border-b-0';
                ul.appendChild(li);
            });
            savedSegmentsListDiv.appendChild(ul);
        }
        
        const anyNamesSaved = savedNamesData.length > 0;
        copyAllSavedButton.disabled = !anyNamesSaved;
        clearSavedListButton.disabled = !anyNamesSaved;
    }

    if(copyAllSavedButton) {
        copyAllSavedButton.addEventListener('click', () => {
            if (savedNamesData.length > 0) {
                // Copy all names, with a separator for clarity if needed, or just raw list.
                // For now, join with newline.
                const allNamesString = savedNamesData.map(item => item.name).join('\n');
                navigator.clipboard.writeText(allNamesString)
                    .then(() => {
                        if (savedListMessage) {
                            savedListMessage.textContent = 'All saved names copied to clipboard!';
                            savedListMessage.classList.remove('text-red-500');
                            savedListMessage.classList.add('text-green-600');
                            setTimeout(() => { if (savedListMessage) savedListMessage.textContent = ''; }, 2500);
                        }
                    })
                    .catch(err => {
                        if (savedListMessage) {
                            savedListMessage.textContent = 'Failed to copy all names.';
                            savedListMessage.classList.add('text-red-500');
                            savedListMessage.classList.remove('text-green-600');
                            setTimeout(() => { if (savedListMessage) savedListMessage.textContent = ''; }, 2500);
                        }
                        console.error('Failed to copy all names: ', err);
                    });
            }
        });
    }

    if(clearSavedListButton) {
        clearSavedListButton.addEventListener('click', () => {
            savedNamesData = [];
            renderSavedNamesList();
            if (savedListMessage) {
                savedListMessage.textContent = 'List cleared!';
                savedListMessage.classList.remove('text-red-500');
                savedListMessage.classList.add('text-green-600');
                setTimeout(() => { if (savedListMessage) savedListMessage.textContent = ''; }, 2500);
            }
        });
    }

    tabCampaignCanvas.addEventListener('click', () => switchTab('campaignCanvas'));
    tabSegment.addEventListener('click', () => switchTab('segment'));
    if (tabMyList) { 
        tabMyList.addEventListener('click', () => switchTab('myList'));
    }
    
    if (currentYearFooter) {
        currentYearFooter.textContent = currentYear;
    }

    setupEventListeners('campaignCanvas');
    setupEventListeners('segment');
    
    initializeAppForTab('campaignCanvas');
    initializeAppForTab('segment');
        
    renderSavedNamesList(); 
    switchTab('campaignCanvas');
});
