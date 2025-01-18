import { sortByInputs, filterInputs, actionsForFolders, actionsForTasks, getTasksStatus, taskState } from "./dataUtils.js";
import { changeTaskDataStateAttr } from "./logicUtils.js";

// Create Control
export function createControl(type, actions) {
    const ctrl = document.createElement("div");
    ctrl.id = type
    ctrl.className = "ctrl";

    type === "folder"
        ? ctrl.classList.add("folder-ctrl")
        : type === "task"
            ? ctrl.classList.add("task-ctrl")
            : ctrl.classList.add("hidden");

    const ul = document.createElement("ul");
    ul.className = "actions-list";
    ctrl.appendChild(ul);

    // Convert object to array
    const entries = Object.entries(actions);
    entries.forEach((a, i) => {
        const li = document.createElement("li");
        li.id = entries[i][0]
        li.className = entries[i][0];
        li.type = type
        ul.appendChild(li);

        const span = document.createElement("span");
        span.className = "btn";
        span.innerHTML = entries[i][1];
        li.appendChild(span);
    });

    return ctrl;

}

// Create Popup
export function createPopup(type, inputType, isInFolder) {
    const popup = document.createElement("div");
    popup.className = "popup";

    const title = document.createElement("h2");
    title.className = "title";
    title.textContent = `${type} ${inputType}`;
    popup.appendChild(title);

    if (type === "search") {
        popup.classList.add("search")
        popup.appendChild(searchForm(inputType));
    } else if (type === "create") {
        popup.classList.add("create")
        popup.appendChild(createWarringMessage())
        popup.appendChild(createFolderForm(inputType));
    } else if (type === "sort-by") {
        popup.classList.add("sort-by")
        popup.appendChild(sortByForm(inputType));
    } else if (type === "filter") {
        popup.classList.add("filter")
        popup.appendChild(filterForm(inputType));
    } else {
        popup.classList.add("clear")
        popup.appendChild(clearForm(inputType));
    };

    const closePopup = document.createElement("button");
    closePopup.className = "close-popup";
    if (isInFolder) closePopup.className = "close-popup-in-folder";
    closePopup.innerText = "Close";
    popup.appendChild(closePopup);
    return popup;
}

function searchForm(type) {
    const cont = document.createElement("div");
    cont.className = "cont";

    const searchInput = document.createElement("input")
    searchInput.type = "search";
    cont.appendChild(searchInput);
    searchInput.placeholder = `Search in ${type}`

    const searchBtn = document.createElement("span");
    searchBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
    cont.appendChild(searchBtn)

    return cont;
};

function createFolderForm(type, isInFolder) {
    const cont = document.createElement("div");
    cont.className = "cont";

    // Inputs Container
    const inputs = document.createElement("div");
    inputs.className = "inputs";
    cont.appendChild(inputs);

    // Top Area
    const topArea = document.createElement("div");
    topArea.className = "top-area";
    inputs.appendChild(topArea);

    const fOrTNameInput = document.createElement("input");
    fOrTNameInput.className = "folder-or-task-name";
    fOrTNameInput.type = "text";
    fOrTNameInput.placeholder = `${type} name`;
    fOrTNameInput.value = `New ${type}`;

    topArea.appendChild(fOrTNameInput);

    if (type === "task") {
        const addToFolderInput = document.createElement("input");
        addToFolderInput.className = "add-to-folder-input";
        addToFolderInput.placeholder = "Folder name"
        addToFolderInput.setAttribute("list", "foldersName")
        topArea.appendChild(addToFolderInput);

        const dataList = document.createElement("datalist");
        dataList.id = "foldersName";
        topArea.appendChild(dataList);

        // Description Area
        const descArea = document.createElement("div");
        descArea.className = "desc-area";
        inputs.appendChild(descArea);

        const descInput = document.createElement("textarea");
        descInput.className = "desc-input";
        descInput.placeholder = "Description task";
        descArea.appendChild(descInput);

        const count = document.createElement("span");
        count.className = "count";
        count.innerText = `0/150`
        descArea.appendChild(count);

    };

    // Is Start Area 
    const isStarArea = document.createElement("div");
    isStarArea.className = "is-star-area";
    inputs.appendChild(isStarArea);

    const isStartLabel = document.createElement("label");
    isStartLabel.setAttribute("for", `isStar${type}`)
    isStartLabel.innerHTML = `Add the ${type} to Featured`
    isStarArea.appendChild(isStartLabel);

    const isStarInputArea = document.createElement("span");
    isStarInputArea.className = "input-area";
    isStarInputArea.innerHTML = 
    `<input id='isStar${type}' type='checkbox' class='is-star-btn'></input>
    <span class='icon'> <i class="fa-solid fa-check"></i> </span>`
    isStartLabel.appendChild(isStarInputArea);

    const createBtn = document.createElement("button");
    createBtn.className = "create-btn";
    createBtn.textContent = `Create ${type}`;
    inputs.appendChild(createBtn);

    return cont;
}

function sortByForm(type) {
    return createRadioInput(type, "sort", sortByInputs);
};

function filterForm(type) {
    return createRadioInput(type, "filter", filterInputs);
}

function clearForm(type) {
    const cont = document.createElement("div");
    cont.className = "cont";

    const clearBtn = document.createElement("button");
    clearBtn.id = `${type}Clear`
    clearBtn.innerText = `Clear all ${type}s`
    cont.appendChild(clearBtn);

    const length = document.createElement("span");
    length.className = "data-length";
    clearBtn.append(length)

    return cont;
}

function createRadioInput(type, inputType, inputsName) {

    const cont = document.createElement("div");
    cont.className = "cont";
    cont.classList.add("radio-cont");

    let classis = inputsName.map((c) => c.replace(" ", "-"));

    inputsName.forEach((e, i) => {
        // Input Area
        const inputArea = document.createElement("span");
        cont.appendChild(inputArea);

        const label = document.createElement("label");
        label.setAttribute("for", `${type}${inputType}By${classis[i]}`);
        inputArea.appendChild(label);

        const input = document.createElement("input");
        input.id = `${type}${inputType}By${classis[i]}`;
        input.type = "radio";
        input.name = inputType;
        label.appendChild(input);

        label.appendChild(createLabelText(inputsName[i]));

    });
    return cont;
}

function createLabelText(string) {
    const labelText = document.createElement("span");
    labelText.innerText = string;
    return labelText
}

export function createWarringMessage() {
    const message = document.createElement("span");
    message.className = "warring-message-form";
    return message;
}

// Create Light Page
export function lightPage() {
    const page = document.createElement("div");
    page.id = "lightPage"
    page.className = "light-page";
    document.body.appendChild(page);
};

// Create One Folder Element To Page
export function createOneFolderElement(folderD, folderCont, addToFolderInput, lightPageEl) {
    const folder = document.createElement("div");
    folder.id = folderD.id;
    folder.className = "folder";
    folder.setAttribute("linkedId", folderD.id);
    folderCont.appendChild(folder);

    let handle = setTimeout(() => {
        folder.classList.add("show")
        clearTimeout(handle);
    }, 100)

    // Top Area
    const topArea = document.createElement("div");
    topArea.className = "top-area";
    folder.appendChild(topArea);

    const name = document.createElement("h1");
    name.className = "folder-name";
    name.append(document.createTextNode(folderD.name));
    topArea.appendChild(name);

    const folderControl = document.createElement("span");
    folderControl.className = "menu-icon folder-control";
    folderControl.innerHTML = `<i class="fa-solid fa-ellipsis-vertical"></i>`;
    folderControl.setAttribute("parentId", `${folderD.id}-folder-id`);
    topArea.appendChild(folderControl);

    // Center Area
    const centerArea = document.createElement("div");
    centerArea.className = "center-area";
    folder.appendChild(centerArea);

    const topCenterArea = document.createElement("div");
    topCenterArea.className = "top";

    const taskStatusEl = document.createElement("div");
    taskStatusEl.className = "task-status-el";
    centerArea.appendChild(taskStatusEl);

    taskState.forEach((e, i) => {
        const span = document.createElement("span");
        span.className = "data-card";
        taskStatusEl.appendChild(span);

        const state = document.createElement("span");
        state.className = "state-word";
        state.innerHTML = taskState[i];
        span.appendChild(state);

        const stateNum = document.createElement("span");
        stateNum.className = "state-num";
        stateNum.innerText = getTasksStatus(folderD.tasks, taskState[i]);
        span.appendChild(stateNum);
         
    });

    const buttonsArea = document.createElement("div");
    buttonsArea.className = "buttons-area";
    folder.appendChild(buttonsArea);
    
    const openButton = document.createElement("button");
    openButton.className = "open-page-btn";
    openButton.innerHTML = `<i class="fa-regular fa-folder-open"></i> Open folder`;
    openButton.setAttribute("linked-page", folderD.id);
    buttonsArea.appendChild(openButton);

    const addTaskButton = document.createElement("button");
    addTaskButton.className = "add-task-btn";
    addTaskButton.setAttribute("linkedFolder", folderD.name)
    addTaskButton.innerHTML = `<i class="fa-solid fa-plus"></i> Add new task`;
    buttonsArea.appendChild(addTaskButton)

    // Bottom Area
    const bottomArea = document.createElement("div");
    bottomArea.className = "bottom-area";
    folder.appendChild(bottomArea);

    let fDate = new Date(folderD.date);

    const date = document.createElement("span");
    date.className = "folder-date";
    date.textContent = fDate.toLocaleString("en-eg");
    bottomArea.appendChild(date);

    const starInputArea = document.createElement("span");
    starInputArea.className = "star-input-area folder-star";
    starInputArea.setAttribute("folder-id", folderD.id);
    bottomArea.appendChild(starInputArea);

    const starIcon = document.createElement("span");
    starIcon.className = "icon";
    starIcon.innerHTML = `<i class="fa-regular fa-star"></i>`;
    starInputArea.appendChild(starIcon);
    if (folderD.isStar) {
        starIcon.classList.add("star");
        starIcon.innerHTML = `<i class="fa-solid fa-star"></i>`;
    };

    // Overflow Menu
    folder.appendChild(overflowMenu("folder", actionsForFolders, folderD));

    // Pages
    createPages(folderD, lightPageEl);
    
    // Warring Message
    folder.prepend(createWarringMessage());

};

// Create Folder Elements To Page
export function createAndAppendFolderElementsToPage(folders, folderCont, addToFolderInput, lightPageEl) {
    if (addToFolderInput) {
        addToFolderInput.innerHTML = ""
    };
    for (let i = 0; i < folders.length; i++) {
        createOneFolderElement(folders[i], folderCont, addToFolderInput, lightPageEl);
        if (addToFolderInput) {
            createAndAppendFolderNameOptions(folders[i].name, addToFolderInput, folders[i].id);
        };
    };
};

// Create and append folder name options
export function createAndAppendFolderNameOptions(folderName, datalist, folderId) {
    const folderOption = document.createElement("option");
    folderOption.value = folderName;
    folderOption.setAttribute("data-id", folderId)
    datalist.appendChild(folderOption);
} 

// Recreate and add folder items
export function recreateAndAddItems(type, data, cont, addToFolderInput, lightPageEl) {
    cont.innerHTML = ""
    if (type === "folder") {
        createAndAppendFolderElementsToPage(data, cont, addToFolderInput, lightPageEl);
    } else if (type === "task") {
        createAndAppendTaskElementsToPage(data, cont);
    };
};

// Create Page Func
function createPages(data, lightPageEl) {
    const page = document.createElement("div");
    page.id = `folder-${data.id}`;
    page.className = "page";
    lightPageEl.appendChild(page);

    // Top Area 
    const pageTopArea = document.createElement("div");
    pageTopArea.className = "top-area";
    page.appendChild(pageTopArea);

    const pageTitle = document.createElement("h2");
    pageTitle.className = "page-title";
    pageTitle.append(document.createTextNode(data.name));
    pageTopArea.appendChild(pageTitle);
    if (data.isStar) {
        pageTitle.innerHTML += ` <i class="fa-solid fa-star"></i>`
    }

    const pageClose = document.createElement("span");
    pageClose.className = "page-close";
    pageClose.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;
    pageTopArea.appendChild(pageClose);

    // Page Content
    const content = document.createElement("div");
    content.className = "content";
    page.appendChild(content);

    const createTaskBtn = document.createElement("button");
    createTaskBtn.className = "create-task-btn";
    createTaskBtn.setAttribute("linkedFolder", data.name);
    createTaskBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
    page.appendChild(createTaskBtn);
};

// Create Overflow Menu For Folder Elements
function overflowMenu(type, actions, data) {
    const ul = document.createElement("ul");
    ul.className = "overflow-menu";
    ul.setAttribute(`${type}-id`, `${data.id}-${type}-ids`)

    const entries = Object.entries(actions)
    entries.forEach((e, i) => {
        const li = document.createElement("li");
        li.className = `user-${type}-action`;
        li.classList.add(`${entries[i][0]}-${type}-btn`);
        li.innerHTML = entries[i][1];
        ul.appendChild(li);
    });
    return ul;
}

// Create Edit name Input
export function editNameInput(type, text) {
    const input = document.createElement("input");
    input.className = "edit-name-input";
    input.classList.add("edit-name" + "-" + type);
    input.value = text
    return input;

}

// Create Edit Desc Textarea
export function editDescTextArea(text) {
    const textarea = document.createElement("textarea");
    textarea.className = "edit-task-desc";
    textarea.value = text;
    return textarea;
};

// Create Submit Edit and Cancel Area
export function submitAndCancelEditArea(type, id) {

    const area = document.createElement("div");
    area.className = "submit-and-cancel-edit-area";
    area.setAttribute(`data-${type}-id`, id)

    const submitButton = document.createElement("button");
    submitButton.className = "submit-edit-btn";
    submitButton.classList.add(`submit-edit-${type}-btn`);
    submitButton.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save`;
    area.appendChild(submitButton);

    const cancelButton = document.createElement("button");
    cancelButton.className = "cancel-edit-btn";
    cancelButton.classList.add(`cancel-edit-${type}-btn`);
    cancelButton.innerHTML = "Cancel"
    area.appendChild(cancelButton);

    return area;
}

// Not Result in Search Message
export function notResultMessage(msg) {
    const message = document.createElement("span");
    message.className = "not-result-in-search-msg";
    message.innerHTML = msg;
    return message;
}   

// Create One Folder Element To Page
export function createOneTaskElement(taskD, taskCont) {
    const task = document.createElement("div");
    task.className = `task`
    task.setAttribute("linkedId", taskD.id);
    task.setAttribute("parentFolderId", taskD.parentId);
    taskCont.appendChild(task);

    changeTaskDataStateAttr(taskD.state, task);

    let handle = setTimeout(() => {
        task.classList.add("show");
        clearTimeout(handle);
    }, 100);

    // Top Area
    const topArea = document.createElement("div");
    topArea.className = "top-area";
    task.appendChild(topArea);

    const topAreaTop = document.createElement("div");
    topAreaTop.className = "top";
    topArea.appendChild(topAreaTop);

    const topAreaLeft = document.createElement("div");
    topAreaLeft.className = "top-area-top-left";
    topAreaTop.appendChild(topAreaLeft);

    const name = document.createElement("h1");
    name.className = "task-name";
    name.innerHTML = taskD.name
    topAreaLeft.appendChild(name);

    const markState = document.createElement("span");
    markState.className = "mark-state";
    topAreaLeft.appendChild(markState);

    const topAreaTopRight = document.createElement("div");
    topAreaTopRight.className = "top-area-top-right";
    topAreaTop.appendChild(topAreaTopRight);

    const stateInput = document.createElement("select");
    stateInput.className = "change-task-state";
    stateInput.setAttribute("linkedTask", taskD.id);
    topAreaTopRight.appendChild(stateInput);

    taskState.forEach((e, i) => {
        const option = document.createElement("option");
        option.value = e;
        option.innerText = e;
        stateInput.appendChild(option);
    })
    stateInput.value = taskD.state

    const taskControl = document.createElement("span");
    taskControl.className = "menu-icon task-control";
    taskControl.innerHTML = `<i class="fa-solid fa-ellipsis-vertical"></i>`;
    taskControl.setAttribute("parentId", `${taskD.id}-task-id`);
    topAreaTopRight.appendChild(taskControl);

    const desc = document.createElement("p");
    desc.className = "task-desc";
    desc.innerText = taskD.desc;
    topArea.appendChild(desc);

    // Bottom Area
    const bottomArea = document.createElement("div");
    bottomArea.className = "bottom-area";
    task.appendChild(bottomArea);

    // Left
    let tDate = new Date(taskD.date);
    const bottomLeft = document.createElement("div");
    bottomLeft.className = "left";
    bottomLeft.innerHTML = `<span class='task-date'>${tDate.toLocaleString("en-eg")}</span>`;
    bottomArea.appendChild(bottomLeft);

    // Right
    const bottomRight = document.createElement("div");
    bottomRight.className = "right";
    bottomRight.innerHTML = 
    `<a href='#' class='folder-name'>${taskD.parentFolder}</a>`;
    bottomArea.appendChild(bottomRight);

    const starInputArea = document.createElement("span");
    starInputArea.className = "star-input-area task-star";
    starInputArea.setAttribute("task-id", taskD.id);
    bottomRight.appendChild(starInputArea);

    const starIcon = document.createElement("span");
    starIcon.className = "icon";
    starIcon.innerHTML = `<i class="fa-regular fa-star"></i>`
    starInputArea.appendChild(starIcon);
    if (taskD.isStar) {
        starIcon.classList.add("star");
        starIcon.innerHTML = `<i class="fa-solid fa-star"></i>`;
    };

    // Overflow Menu
    task.appendChild(overflowMenu("task", actionsForTasks, taskD));

    // Warring Message
    task.prepend(createWarringMessage());
};

// Create Folder Elements To Page
export function createAndAppendTaskElementsToPage(tasks, taskCont) {
    for (let i = 0; i < tasks.length; i++) {
        createOneTaskElement(tasks[i], taskCont);
    };
};
