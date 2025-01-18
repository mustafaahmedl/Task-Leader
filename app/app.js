import { actions, getFolders, saveItemsToLocalStorage, searching, sorting, clearData, deleteItem, updateItemById, updateItemStarById, getTasks, deleteAllTasks, descInputMaxLength, getFolderByTaskId, getFolderBy } from "./dataUtils.js";
import { createControl, createPopup, lightPage, createAndAppendFolderElementsToPage, createAndAppendTaskElementsToPage, recreateAndAddItems } from "./domUtils.js";
import * as logUtils from "./logicUtils.js";
import * as dataUtils from "./dataUtils.js"; 


// Append Actions List In Control El
const control = document.querySelector("#control");
control.appendChild(createControl("folder", actions));
control.appendChild(createControl("task", actions));
control.appendChild(createControl("calender", actions));

// Append A Popups In Control Elements
const controls = Array.from(document.querySelectorAll("#control .ctrl"));
controls.forEach((c, index) => {
    const controlActions = Array.from(c.querySelectorAll("li"));
    const controlABtn = Array.from(c.querySelectorAll("li .btn"));
    controlActions.forEach((CA, i) => {
        // Append Popups
        if (index !== 2) {
            CA.appendChild(createPopup(CA.id, CA.type));
        };
    });

    // Handle Action Btn
    const popups = Array.from(c.querySelectorAll(".popup"));
    controlABtn.forEach((a, i) => {
        a.onclick = function () {
            controlABtn.forEach((a) => a.classList.remove("active"));
            popups.forEach((p) => p.classList.remove("active"));

            a.classList.add("active");
            popups[i].classList.add("active");
        };
    });
});

// Handle Close Popup
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-popup")) {
        const activePopup = document.querySelector("#control .popup.active");
        const activeBtn = activePopup.previousElementSibling;
        activePopup.classList.remove("active");
        activeBtn.classList.remove("active");
    };
});

// Close Popup Using Escape Keyword
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const activePopup = document.querySelector("#control .popup.active");
        if (activePopup) {
            const activeBtn = activePopup.previousElementSibling;
            activePopup.classList.remove("active");
            activeBtn.classList.remove("active");
        };
    };
});

// Navigation Section
const navBar = document.getElementById("nav");
const navCloseBtn = document.querySelector(".nav > .close");

const lis = Array.from(document.querySelectorAll(".nav .links li.link"));
const taps = Array.from(document.querySelectorAll("#content .container > div"));

const closeNav = () => navBar.classList.toggle("close");
navCloseBtn.onclick = closeNav;

lis.forEach((e, i) => {

    // Make first control active
    if (i == 0) controls[i].classList.add("active");

    e.onclick = function () {
        lis.forEach((e) => e.classList.remove("active"));
        controls.forEach((c) => c.classList.remove("active"));
        taps.forEach((t) => t.classList.remove("active"));

        this.classList.add("active");
        controls[i].classList.add("active");
        taps[i].classList.add("active");

        // Close Active Popup and Active Btn
        const activePopup = document.querySelector("#control .popup.active");
        const activeBtn = document.querySelector("#control li .btn.active");
        if (activePopup) activePopup.classList.remove("active");
        if (activeBtn) activeBtn.classList.remove("active");
    };
});

// Handle Them System
const themButton = document.getElementById("themButton");
themButton.onclick = function () {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("them", "light");
    } else {
        localStorage.setItem("them", "dark");
    };
};

// Get the Them From local 
const themFLS = localStorage.getItem("them");
if (themFLS) {
    if (themFLS === "light") {
        document.body.classList.add("light-mode");
        themButton.checked = "checked";
    };
};

// Append Light Page
lightPage();

const foldersCont = document.getElementById("folders");
const addToFolderInput = document.querySelector(".popup.create #foldersName");
const lightPageEl = document.getElementsByClassName("light-page")[0];

// Handle Create Folder Button
const fCreateFolderBtn = document.querySelector("#folder .popup.create .create-btn");
const folderWarringMessage = document.querySelector("#folder .popup.create .warring-message-form");
fCreateFolderBtn.addEventListener("click", function () {
    const popup = document.querySelector("#folder .popup.create");
    logUtils.handleCreatingButton("folder", foldersCont, popup, folderWarringMessage, addToFolderInput, lightPageEl);
});

// Submit Form Using Enter Keyword
document.addEventListener("keydown", (e) => {
    logUtils.submitFormUsingEnterKeyword(e, "folder", fCreateFolderBtn);
});

saveItemsToLocalStorage("folder");

// Create And Append Folders El
createAndAppendFolderElementsToPage(getFolders(), foldersCont, addToFolderInput, lightPageEl);

// Handle Search System In Folders
const fSearchInput = document.querySelector("li#search[type='folder'] input");
fSearchInput.addEventListener("input", () => {
    let resultData = searching(getFolders(), fSearchInput.value);
    logUtils.searchingSystem("folder", resultData, foldersCont, addToFolderInput, lightPageEl);
});

// Handle Sort System In Folders
const fSortInputs = Array.from(document.querySelectorAll("li#sort-by[type='folder'] input"));

fSortInputs.forEach((input) => {
    input.onchange = function () {
        if (input.checked) {
            recreateAndAddItems(
                "folder",
                sorting(getFolders(), input.nextElementSibling.innerText),
                foldersCont, addToFolderInput, lightPageEl
            );
        };
    };
});

// Filter Block 

// Handle Clear System In Folders
const folderClearBtn = document.getElementById("folderClear");

logUtils.lockClearBtn(getFolders(), folderClearBtn);

folderClearBtn.onclick = function () {
    clearData("folder");
    logUtils.clearSystem("folders", foldersCont);
    logUtils.lockClearBtn(getFolders(), folderClearBtn);
    recreateAndAddItems("task", getTasks(), tasksCont);
};

// Handle Open the folder's overflow menu.
document.addEventListener("click", (e) => {
    if (e.target.closest(".folder-control")) {
        logUtils.openOverflowMenu("folder", e);
    };
});

// Handle Edit Folder Form overflow menu.
let state = true;
foldersCont.addEventListener("click", (e) => {
    if (e.target.closest(".update-folder-btn")) {
        if (state) {
            const overflowMenu = e.target.closest(".update-folder-btn").parentElement;
            const folderId = parseInt(overflowMenu.getAttribute("folder-id"));
            const folderItem = document.querySelector(`.folder[id='${folderId}']`);
            const folderName = folderItem.querySelector(".folder-name");
            logUtils.addAndDisplayEditFormInFolder("folder", folderItem, folderName, overflowMenu);
        }
        state = false;
        
    } else if (e.target.closest(".submit-edit-folder-btn")) {
        
        const folderId = parseInt(e.target.closest(".submit-edit-folder-btn").parentElement.getAttribute("data-folder-id"));
        const folderItem = document.querySelector(`.folder[id='${folderId}']`);
        const folderName = folderItem.querySelector(".folder-name");
        const inputEditName = folderName.querySelector("input");
        const submitAndCancelEditArea = folderItem.querySelector(".submit-and-cancel-edit-area");
        const warringMessage = folderItem.querySelector(".warring-message-form");

        if (logUtils.isFolderNameValid(getFolders(), inputEditName.value)) {
            updateItemById("folder", folderId, inputEditName.value);
            dataUtils.updateTasksParentNameFolder(folderId, inputEditName.value);
            logUtils.removeInputs("folder", folderItem, inputEditName, submitAndCancelEditArea);
            logUtils.updateNameAndDescription("folder", folderName, inputEditName.value);
            logUtils.rewriteTasksFolderName(folderId, inputEditName.value);
            warringMessage.classList.remove("active");
        } else {
            warringMessage.innerHTML =  "Name already exists";
            warringMessage.classList.add("active");
        };
        state = true;
        
    } else if (e.target.closest(".cancel-edit-folder-btn")) {
        const folderId = parseInt(e.target.closest(".cancel-edit-btn").parentElement.getAttribute("data-folder-id"));
        const folderItem = document.querySelector(`.folder[id='${folderId}']`);
        const folderName = folderItem.querySelector(".folder-name");
        const inputEditName = folderName.querySelector("input");
        const submitAndCancelEditArea = folderItem.querySelector(".submit-and-cancel-edit-area");
        const warringMessage = folderItem.querySelector(".warring-message-form");
        logUtils.handleCancelEditItemBtn(
            "folder",
            folderId, 
            folderItem, 
            folderName, 
            inputEditName,
            submitAndCancelEditArea, 
            getFolders()
        );
        warringMessage.classList.remove("active");
        state = true;
    };
});

// Handle Delete Folder Form overflow menu.
foldersCont.addEventListener("click", (e) => {
    if (e.target.closest(".delete-folder-btn")) {
        const folderId = parseInt(e.target.closest(".delete-folder-btn").parentElement.getAttribute("folder-id"));
        deleteItem("folder", folderId);
        const folder = document.querySelector(`.folder[id='${folderId}']`);
        logUtils.removeItemFromPage(folder);
        recreateAndAddItems("task", getTasks(), tasksCont);
        logUtils.lockClearBtn(getFolders(), folderClearBtn);
    };
});

// Handle Delete All Tasks From overflow menu.
foldersCont.addEventListener("click", (e) => {
    if (e.target.closest(".deleteAllTasks-folder-btn")) {
        const overflowMenu = e.target.closest(".deleteAllTasks-folder-btn").parentElement;
        const folderId = parseInt(e.target.closest(".deleteAllTasks-folder-btn").parentElement.getAttribute("folder-id"));
        deleteAllTasks(folderId);
        logUtils.rewriteTaskStatusesInFolder(getFolderBy("id", folderId));
        recreateAndAddItems("task", getTasks(), tasksCont);
        overflowMenu.classList.remove("active");
        logUtils.removeAllTasksFromPage(folderId)
    }
});

// Handle Update Item Star 
foldersCont.addEventListener("click", (e) => {
    if (e.target.closest(".folder-star")) {
        let isStar;
        const folderId = +e.target.closest(".folder-star").getAttribute("folder-id");
        const icon = e.target.closest(".folder-star").querySelector(".icon");

        icon.classList.toggle("star");
        if (icon.classList.contains("star")) {
            icon.innerHTML = `<i class="fa-solid fa-star"></i>`;
        } else {
            icon.innerHTML = `<i class="fa-regular fa-star"></i>`;
        };     
        isStar = icon.classList.contains("star");    
        updateItemStarById("folder", folderId, isStar);
    }
});

// Handle Open Page Button
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("open-page-btn")) {
        const activePage = document.querySelector(`.page#folder-${e.target.getAttribute("linked-page")}`);
        lightPageEl.classList.add("active");
        activePage.classList.add("active");
    };
});

// Handle Close Page Button
document.addEventListener("click", (e) => {
    if (e.target.closest(".page-close")) {
        const activePage = document.querySelector(".page.active");
        lightPageEl.classList.remove("active");
        activePage.classList.remove("active");
    };
});

// Handle Create Task Button
const tasksCont = document.getElementById("tasks");
const createTaskBtn = document.querySelector("#task .popup.create .create-btn");
const taskWarringMessage = document.querySelector("#task .popup.create .warring-message-form");

createTaskBtn.addEventListener("click", () => {
    const popup = document.querySelector("#task .popup.create");
    logUtils.handleCreatingButton("task", tasksCont, popup, taskWarringMessage, addToFolderInput, lightPageEl);
});

document.addEventListener("keydown", (e) => {
    logUtils.submitFormUsingEnterKeyword(e, "task", createTaskBtn);
})

// Show Text Length desc input OnInput
const descInput = document.querySelector("#task .popup.create textarea.desc-input");
const lengthSpan = descInput.nextElementSibling;
descInput.oninput = function () {
    logUtils.showTextLength(descInput, lengthSpan);
};

// Save Tasks To LocalStorage
saveItemsToLocalStorage("task");

// Create and Append Task Elements In Task Container
createAndAppendTaskElementsToPage(getTasks(), tasksCont);

// Create and Append Task Elements In Page Container
const pages = Array.from(document.querySelectorAll(".page .content"));
getFolders().forEach((e, i) => {
    createAndAppendTaskElementsToPage(e.tasks, pages[i])
})

// Handle Search System
const tSearchInput = document.querySelector("li#search[type='task'] input");
tSearchInput.addEventListener("input", (e) => {
    let resultData = searching(getTasks(), tSearchInput.value);
    logUtils.searchingSystem("task", resultData, tasksCont, addToFolderInput, lightPageEl);
});

// Handle Sort System In Folders
const tSortInputs = Array.from(document.querySelectorAll("li#sort-by[type='task'] input"));

tSortInputs.forEach((input) => {
    input.onchange = function () {
        if (input.checked) {
            recreateAndAddItems(
                "task",
                sorting(getTasks(), input.nextElementSibling.innerText),
                tasksCont
            );
        };
    };
});

// Handle Filter System In Tasks
const tFilterInputs = Array.from(document.querySelectorAll("li#filter[type='task'] input"));
logUtils.filteringSystem("task", getTasks(), tFilterInputs, tasksCont);

// Handle Clear System In Tasks
const taskClearBtn = document.getElementById("taskClear");

logUtils.lockClearBtn(getTasks(), taskClearBtn);

taskClearBtn.onclick = function () {
    clearData("task");
    logUtils.clearSystem("tasks", tasksCont);
    logUtils.lockClearBtn(getTasks(), taskClearBtn);
    recreateAndAddItems("folder", getFolders(), foldersCont, addToFolderInput, lightPageEl);
};

// Handle Open the task's overflow menu.
document.addEventListener("click", (e) => {
    if (e.target.closest(".task-control")) {
        logUtils.openOverflowMenu("task", e);
    };
});

// Handle Edit Task Form overflow menu.
let taskState = true;
document.addEventListener("click", (e) => {
    if (e.target.closest(".update-task-btn")) {
        if (taskState) {
            const overflowMenu = e.target.closest(".update-task-btn").parentElement;
            const taskId = parseInt(overflowMenu.getAttribute("task-id"));
            const taskItem = e.target.closest(`.task[linkedId='${taskId}']`);
            const taskName = taskItem.querySelector(".task-name");
            const taskDesc = taskItem.querySelector(".task-desc");
            logUtils.addAndDisplayEditFormInFolder("task", taskItem, taskName, overflowMenu, taskDesc);
        }
        taskState = false;
        
    } else if (e.target.closest(".submit-edit-task-btn")) {
        
        const taskId = parseInt(e.target.closest(".submit-edit-task-btn").parentElement.getAttribute("data-task-id"));
        const taskItem = e.target.closest(`.task[linkedId='${taskId}']`);
        const taskItems = Array.from(document.querySelectorAll(`.task[linkedId='${taskId}']`));
        const inputEditName = taskItem.querySelector("input");
        const submitAndCancelEditArea = taskItem.querySelector(".submit-and-cancel-edit-area");
        const warringMessage = taskItem.querySelector(".warring-message-form");

        const taskDesc = taskItem.querySelector(".edit-task-desc");
        if (taskDesc.value !== "" && taskDesc.value.length <= descInputMaxLength) {
            updateItemById("task", +taskId, inputEditName.value, taskDesc.value);
            logUtils.removeInputs("task", taskItem, inputEditName, submitAndCancelEditArea, taskDesc);
            taskItems.forEach((t) => {
                logUtils.updateNameAndDescription(
                    "task", 
                    t.querySelector(".task-name"), 
                    inputEditName.value, 
                    t.querySelector(".task-desc"), 
                    taskDesc.value
                );
            })
            warringMessage.classList.remove("active");
        } else {
            warringMessage.innerHTML =  "The mission description seems long or empty.";
            warringMessage.classList.add("active");
        };
        taskState = true;

    } else if (e.target.closest(".cancel-edit-task-btn")) {
        const taskId = parseInt(e.target.closest(".cancel-edit-btn").parentElement.getAttribute("data-task-id"));
        const taskItem = e.target.closest(`.task[linkedId='${taskId}']`);
        const taskName = taskItem.querySelector(".task-name");
        const inputEditName = taskName.querySelector("input");
        const submitAndCancelEditArea = taskItem.querySelector(".submit-and-cancel-edit-area");
        const warringMessage = taskItem.querySelector(".warring-message-form");

        const taskDesc = taskItem.querySelector(".edit-task-desc");
        const taskArea = taskItem.querySelector(".task-desc");

        logUtils.handleCancelEditItemBtn(
            "task",
            taskId, 
            taskItem, 
            taskName, 
            inputEditName,
            submitAndCancelEditArea, 
            getTasks(),
            taskDesc,
            taskArea
        );
        warringMessage.classList.remove("active");
        taskState = true;
    };
});

// Handle Delete Task Form overflow menu.
document.addEventListener("click", (e) => {
    if (e.target.closest(".delete-task-btn")) {
        const taskId = parseInt(e.target.closest(".delete-task-btn").parentElement.getAttribute("task-id"));
        const parentFolder = getFolderByTaskId(taskId);

        deleteItem("task", taskId);
        logUtils.rewriteTaskStatusesInFolder(parentFolder);

        const taskItems = Array.from(document.querySelectorAll(`.task[linkedId='${taskId}']`));
        taskItems.forEach((e) => logUtils.removeItemFromPage(e));
        logUtils.lockClearBtn(getTasks(), taskClearBtn);
    };
});

// Handle Update Item Star 
document.addEventListener("click", (e) => {
    if (e.target.closest(".task-star")) {
        let isStar;
        const taskId = +e.target.closest(".task-star").getAttribute("task-id");
        const icon = e.target.closest(".task-star").querySelector(".icon");

        const taskItems = document.querySelectorAll(`.task[linkedId='${taskId}']`);
        taskItems.forEach((t) => {
            const icon = t.querySelector(".task-star .icon");
            icon.classList.toggle("star");
            if (icon.classList.contains("star")) {
                icon.innerHTML = `<i class="fa-solid fa-star"></i>`;
            } else {
                icon.innerHTML = `<i class="fa-regular fa-star"></i>`;
            };     
        })

        isStar = icon.classList.contains("star");    
        updateItemStarById("task", taskId, isStar);
    }
});

// Handle Change Task State
document.addEventListener("change", (e) => {
    if (e.target.closest(".change-task-state")) {
        const input = e.target.closest(".change-task-state");
        const taskId = +e.target.closest(".change-task-state").getAttribute("linkedTask");
        const taskItems = Array.from(document.querySelectorAll(`.task[linkedId='${taskId}']`))
        dataUtils.changeTaskState(taskId, input.value);

        const allInputs = Array.from(document.querySelectorAll(`.task[linkedId='${taskId}'] .change-task-state`));

        allInputs.forEach((t) => {
            t.value = input.value;
        })

        taskItems.forEach((t) => {
            logUtils.changeTaskDataStateAttr(input.value, t);
        });

        logUtils.rewriteTaskStatusesInFolder(getFolderByTaskId(taskId));
    }
});

// Open create task form and to folder
const container = document.querySelector("#content .container");
container.appendChild(createPopup("create", "task", true));

const createTaskPopup = container.querySelector(".create");
const createTaskInFolderBtn = createTaskPopup.querySelector(".create-btn");
const taskPopupWarringMessage = createTaskPopup.querySelector(".warring-message-form");

// Handle open create task popup from add new task btn
document.addEventListener("click", (e) => {
    if (e.target.closest(".add-task-btn")) {
        const folderName = e.target.closest(".add-task-btn").getAttribute("linkedFolder");
        logUtils.openCreateTask(createTaskPopup, folderName);
    };
});

// Handle open create task popup form create task btn form pages
document.addEventListener("click", (e) => {
    if (e.target.closest(".page .create-task-btn")) {
        const folderName = e.target.closest(".page .create-task-btn").getAttribute("linkedFolder");
        logUtils.openCreateTask(createTaskPopup, folderName);
        logUtils.rewriteTaskStatusesInFolder(getFolderBy("name", folderName))
    }
})

// Handle Create Task In folder
createTaskInFolderBtn.addEventListener("click", () => {
    logUtils.handleCreatingButton("task", tasksCont, createTaskPopup, taskPopupWarringMessage);
})

// Handle Close Create Task Popup
const closeBtn = createTaskPopup.querySelector(".close-popup-in-folder");
closeBtn.addEventListener("click", (e) => {
    const popup = e.target.closest(".popup");
    popup.classList.remove("active");
});

let offsetX = 0, offsetY = 0, isDragging = false;
createTaskPopup.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - createTaskPopup.offsetLeft;
    offsetY = e.clientY - createTaskPopup.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    createTaskPopup.style.left = `${x}px`;
    createTaskPopup.style.top = `${y}px`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});


// Clock 
const hourThread = document.getElementById("hourThread");
const minuteThread = document.getElementById("minuteThread");
const secondThread = document.getElementById("secondThread");

let id = setInterval(clock, 1000);

function tran(value) {
    return `translate(-50%, -50%) rotate(${value}deg)`
}

function clock () {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    secondThread.style.setProperty("transform", tran(seconds * 6));
    minuteThread.style.setProperty("transform", tran(minutes * 6));
    hourThread.style.setProperty("transform", tran(hours * 30));
}