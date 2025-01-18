import * as dataUtils from './dataUtils.js'
import { createOneFolderElement, createOneTaskElement, recreateAndAddItems, notResultMessage, editNameInput, editDescTextArea, submitAndCancelEditArea, createAndAppendFolderNameOptions } from "./domUtils.js";

// Handle Create Button Func
export function handleCreatingButton(type, cont, popup, warringMessage, addToFolderInput, lightPageEl) {
    const nameInput = popup.querySelector(".folder-or-task-name");
    const folderName = popup.querySelector(".add-to-folder-input");
    const taskDesc = popup.querySelector("textarea.desc-input");
    const isStarBtn = popup.querySelector(".is-star-btn");
    
    if (type === "folder") {
        if (isFolderNameValid(dataUtils.getFolders(), nameInput.value) && nameInput.value !== "") {
                
            createItem("folder", cont, popup, nameInput, folderName, taskDesc, isStarBtn, warringMessage, addToFolderInput, lightPageEl);
            showAndHideWarringMsg("hide", warringMessage);

        } else {
            showAndHideWarringMsg("show", warringMessage, "Folder name not valid");
        };
    } else if (type === "task") {
        if (nameInput.value !== "") {
            if (!isFolderNameValid(dataUtils.getFolders(), folderName.value) && folderName.value !== "") {
                if (taskDesc.value !== "" && taskDesc.value.length <= dataUtils.descInputMaxLength) {

                    createItem("task", cont, popup, nameInput, folderName, taskDesc, isStarBtn, warringMessage);
                    showAndHideWarringMsg("hide", warringMessage);

                } else {
                    showAndHideWarringMsg("show", warringMessage, "Task description not valid");
                };   
            } else {
                showAndHideWarringMsg("show", warringMessage, "Folder name not valid");
            };
        } else {
            showAndHideWarringMsg("show", warringMessage, "Task name not valid");
        }
    } else {
        throw new Error("Type unknown");
    };
};

// Create Item Func
export function createItem(type, cont, popup, nameInput, folderName, taskDesc, isStarBtn, warringMessage, addToFolderInput, lightPageEl) {
    if (type === "folder") {
        const folder = {
            name: nameInput.value,
            id: Date.now(),
            isStar: isStarBtn.checked,
            date: getCurrentDate(),
            parsingDate: Date.parse(getCurrentDate()),
            state: "Not Started",
            tasks: [],
        };
        dataUtils.pushFolder(folder);

        // Add Folders to Local Storage
        dataUtils.addDataToLocalStorage("folder");

        // Create Folder Element and Append
        createOneFolderElement(folder, cont, addToFolderInput, lightPageEl);

        // Create and append folder name options
        createAndAppendFolderNameOptions(folder.name, addToFolderInput);

        // Open Clear Btn
        lockClearBtn(dataUtils.getFolders(), document.getElementById("folderClear"));

        // Remove Not Result Message
        searchingSystem("folder", dataUtils.getFolders(), cont, addToFolderInput, lightPageEl);


    } else if (type === "task") {
        const task = {
            name: nameInput.value,
            desc: taskDesc.value,
            id: Date.now(),
            isStar: isStarBtn.checked,
            date: getCurrentDate(),
            parsingDate: Date.parse(getCurrentDate()),
            state: "Not Started",
            parentFolder: folderName.value,
            parentId: dataUtils.getFolderIdByName(folderName.value)
        };
        
        dataUtils.pushTask(task, folderName.value);

        dataUtils.extractTaskFromFolders(task);

        // Create and Append Task El In Task Container
        createOneTaskElement(task, cont);
        
        // Create and Append Task El In Folder
        const pageCont = document.querySelector(`.page[id='folder-${dataUtils.getFolderIdByName(folderName.value)}'] .content`)
        createOneTaskElement(task, pageCont);

        // Rewrite Task Statues In Current Folder
        rewriteTaskStatusesInFolder(dataUtils.getFolderBy("name", folderName.value));

        // Open Clear Btn
        lockClearBtn(dataUtils.getTasks(), document.getElementById("taskClear"));
        
        // // Remove Not Result Message
        searchingSystem("task", dataUtils.getTasks(), cont);
        
        // Hide warring message if it is visible
        showAndHideWarringMsg("hide", warringMessage); 
    } else {
        throw new Error("Type unknown");
    };

    // Close Popup
    closePopup(popup, popup.previousElementSibling);

    // Reset Name Input
    nameInput.value = "";
};

// show and Hide Warring Msg
export function showAndHideWarringMsg(action, msg, text) {
    if (action === "show") {
        msg.innerHTML = text
        msg.classList.add("active");
    } else if (action === "hide") {
        if (msg.classList.contains("active")) {
            msg.classList.remove("active");
        };
    } else {
        throw new Error("Action unknown");
    };
};

// Submit Form Using Enter Keyword Func
export function submitFormUsingEnterKeyword(e, type, btn) {
    if (e.key === "Enter") {
        const folderPopup = document.querySelector(`li[type='${type}']#create .popup.active`);
        if (folderPopup) {
            btn.click();
        };
    };
}

// Show Text Length desc input OnInput
export function showTextLength(input, lengthSpan) {
    if (input.value.length <= dataUtils.descInputMaxLength) {
        lengthSpan.innerText = `${input.value.length}/${dataUtils.descInputMaxLength}`;
        lengthSpan.style.color = '';
    } else {
        lengthSpan.style.color = 'red';
    };
};

// Close Popup Func
export function closePopup(popup, btn) {
    popup.classList.remove("active");
    btn.classList.remove("active");
};

// Get Current Date
export function getCurrentDate() {
    const CD = new Date();
    return `${CD.getFullYear()}/${CD.getMonth() + 1}/${CD.getDate()},${CD.getHours()}:${CD.getMinutes()}`
}

// Is Folder Name Valid
export function isFolderNameValid(data, folderName) {
    const names = data.map((n) => n.name);
    return names.every((n) => n.trim() !== folderName.trim());
}

// Searching System
export function searchingSystem(type, resultData, container, addToFolderInput, lightPageEl) {
    container.innerHTML = ""
    if (resultData.length > 0) {
        recreateAndAddItems(type, resultData, container, addToFolderInput, lightPageEl);
    } else {
        container.appendChild(notResultMessage("Not Result"));
    };
};

// Filtering System
export function filteringSystem(type, data, inputs, cont) {
    inputs.forEach((e, i) => {
        e.onchange = function () {
            if (e.checked) {
                const resultData = dataUtils.filtering(data, e.nextElementSibling.innerText.trim());
                if (resultData.length > 0) {
                    recreateAndAddItems(
                        type,
                        resultData,
                        cont
                    );
                } else {
                    cont.innerHTML = ""
                    cont.appendChild(notResultMessage("Not Result"));
                };
            };
        };
    });
};

// Clear System
export function clearSystem(dataName, container) {
    if (dataName === "folders") {
        if (localStorage.getItem(dataName)) {
            localStorage.removeItem(dataName);
        };
    } else if (dataName === "tasks") {
        if (localStorage.getItem(dataName)) {
            localStorage.removeItem(dataName);
        };
        localStorage.setItem("folders", JSON.stringify(dataUtils.getFolders()));
    } else {
        throw new Error("Type unknown");
    };
    container.innerHTML = "";
};

// Open overflow menu.
export function openOverflowMenu(type, e) {
    const allOverFlow = Array.from(document.querySelectorAll(`.${type} .overflow-menu`));        
    const btn = e.target.closest(`.${type}-control`);
    const taskId = parseInt(btn.getAttribute("parentId"));
    const overflowMenu = e.target.closest(`.${type}`).querySelector(".overflow-menu");

    // Remove Active Class From All Overflow
    function removeActiveClass() {
        allOverFlow.forEach((e) => e.classList.remove("active"));
    };

    if (!(overflowMenu.classList.contains("active"))) {
        removeActiveClass();
        overflowMenu.classList.add("active");
    } else {
        removeActiveClass();
        overflowMenu.classList.remove("active");
    };
}

// Add and display the edit form in the folder
export function addAndDisplayEditFormInFolder(type, item, nameInput, menu, descInput) {
    let text = nameInput.innerHTML
    nameInput.innerHTML = ""
    nameInput.appendChild(editNameInput(type, text));
    nameInput.querySelector("input").select();

    if (type === "task") {
        let descText = descInput.innerText;
        descInput.innerHTML = "";
        descInput.appendChild(editDescTextArea(descText));
        item.appendChild(submitAndCancelEditArea(type, item.getAttribute("linkedId")));
    } else {
        item.appendChild(submitAndCancelEditArea(type, item.id));
    }
    menu.classList.remove("active");
};

// Edit Item System
export function removeInputs(type, item, inputName, buttonsArea, taskDesc) {
    inputName.remove();
    item.removeChild(buttonsArea);
    if (type === "task") {
        taskDesc.remove();
    };
};

// Update name and description
export function updateNameAndDescription(type, nameArea, newName, descArea, newDesc) {
    nameArea.innerHTML = newName;
    if (type === "task") {
        descArea.innerHTML = newDesc;
    };
};

// Cancel Edit Item Btn
export function handleCancelEditItemBtn(type, id, item, nameArea, inputName, buttonsArea, data, taskDesc, descArea) {
    inputName.remove();
    if (type === "task") {
        taskDesc.remove();
    };
    item.removeChild(buttonsArea);
    data.forEach((e) => {
        if (e.id === id) {
            nameArea.innerHTML = e.name;
            if (type === "task") {
                descArea.innerHTML = e.desc;
            };
        };
    });
};

// Lock Clear Btn
export function lockClearBtn(data, btn) {
    btn.querySelector(".data-length").innerHTML = ` (${data.length})`
    if (data.length === 0) {
        btn.classList.add("hidden");
    } else {
        btn.classList.remove("hidden");
    };
};

// Remove Item From Page
export function removeItemFromPage(item) {
    item.remove();
}

// Rewrite task statuses in folder
export function rewriteTaskStatusesInFolder(folder) {
    const folderItem = document.querySelector(`.folder[id='${folder.id}']`);
    const folderStatusEl = Array.from(folderItem.getElementsByClassName("state-num"));
    folderStatusEl.forEach((e, i) => e.innerHTML = dataUtils.getTasksStatus(folder.tasks, dataUtils.taskState[i]));
};

// Rewrite tasks folder name
export function rewriteTasksFolderName(folderId, newName) {
    const tasks = Array.from(document.querySelectorAll(`.task[parentFolderId='${folderId}']`));
    tasks.forEach((t) => {
        const folderNameArea = t.querySelector("a.folder-name");
        folderNameArea.innerHTML = newName;
    });

    const addTaskBtn = document.querySelector(`.folder[id='${folderId}'] button.add-task-btn`);
    addTaskBtn.setAttribute("linkedFolder", newName);

    const createTaskBtn = document.querySelector(`.page[id='folder-${folderId}'] button.create-task-btn`);
    createTaskBtn.setAttribute("linkedFolder", newName);

    // Update folder name option
    getFolderNameOption(folderId).value = newName;
};

// Get Folder Name Option From Select Task Folder Name
function getFolderNameOption(folderId) {
    const options = Array.from(document.querySelectorAll("#foldersName option"));
    for (let i = 0; i < options.length; i++) {
        if (+options[i].getAttribute("data-id") === folderId) return options[i];
    };
};

// Change task class name
export function changeTaskDataStateAttr(taskState, item) {
    if (taskState === "Not Started") {
        item.setAttribute("data-state", "not-started");
    } else if (taskState === "In Progress") {
        item.setAttribute("data-state", "in-progress");
    } else {
        item.setAttribute("data-state", "done");
    };
};

// Open Create Task In folder Popup
export function openCreateTask(popup, folderName) {
    const addToFolderInput = popup.querySelector(".add-to-folder-input");
    addToFolderInput.value = folderName;
    popup.classList.add("active");
};

// Remove all tasks from page
export function removeAllTasksFromPage(folderId) {
    const page = document.querySelector(`.page[id='folder-${folderId}'] .content`);
    page.innerHTML = ""
};