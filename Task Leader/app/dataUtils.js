// Folders Data
export let folders = [];

// Return Folders Data Func
export function getFolders() {
    return folders;
};

// Push Folder to Folders Array
export function pushFolder(folder) {
    folders.push(folder);
};

// Tasks Data
let tasks = [];

// Return Tasks Data Func
export function getTasks() {
    return tasks;
};

// Push Task to Folders Array
export function pushTask(task, folderName) {
    folders.forEach((f) => {
        if (f.name === folderName.trim()) {
            f.tasks.push(task);
        };
    });
    addDataToLocalStorage("folder");
};

// Search Folder From Folders Array
export function searching(data, value) {
    return data.filter((d) => d.name.toLowerCase().startsWith(value.toLowerCase()));
}

// Sort Items
export function sorting(data, sortCase) {
    if (sortCase === "Date") {
        return data.sort((a, b) => a.parsingDate - b.parsingDate);
    } else {
        return data.sort((a, b) => a.name.localeCompare(b.name));
    };
};

// Filter Items 
export function filtering(data, filterCase) {
    if (filterCase === "Default") {
        return data
    } else {
        return data.filter((d) => d.state === filterCase);
    };
};

// Clear All Data
export function clearData(type) {
    if (type === "folder") {
        folders = []; 
        tasks = [];
    } else {
        folders.forEach((f) => f.tasks = []);
        tasks = [];
    };
};

// Delete Item From Arrays Func
export function deleteItem(type, id) {
    if (type === "folder") {
        folders = folders.filter((f, i) => f.id !== +id);
        tasks = tasks.filter((t) => t.parentId !== +id);
        addDataToLocalStorage("folder");
        addDataToLocalStorage("task");
    } else if (type === "task") {
        folders.find((folder) => {
            if (folder.tasks && folder.tasks.some((task) => task.id === +id)) {
                folder.tasks = folder.tasks.filter((t) => t.id !== +id);
            };
        });
        tasks = tasks.filter((t, i) => t.id !== +id);
        addDataToLocalStorage("task");
        addDataToLocalStorage("folder");
    } else {
        throw new Error("Type unknown");
    };
};

// Delete All Tasks From Folder
export function deleteAllTasks(folderId) {
    folders.forEach((e, i) => {
        if (e.id === folderId) {
            e.tasks = [];
            addDataToLocalStorage("folder");
        };
    });

    tasks = tasks.filter((t) => t.parentFolder !== getFolderNameById(folderId));
    addDataToLocalStorage("task");
}

// Update Item By Id
export function updateItemById(type, id, newName, newDesc) {
    if (type === "folder") {
        for (let i = 0; i < folders.length; i++) {
            if (folders[i].id === id) {
                folders[i].name = newName;
            };
        };
    } else {
        findFolder("item", id, newName, newDesc);
        addDataToLocalStorage("folder");
    };
    addDataToLocalStorage(type);
};

// Update Tasks Parent name folder
export function updateTasksParentNameFolder(folderId, newName) {
    tasks.map((t) => {
        if (t.parentId === +folderId) {
            t.parentFolder = newName;
        };
    })
    folders.find((folder) => {
        if (folder.id === +folderId) {
            folder.tasks.map((t) => {
                t.parentFolder = newName;
            });
        };
    });
    addDataToLocalStorage("task");
    addDataToLocalStorage("folder");
};

// Update Item Star By Id Func
export function updateItemStarById(type, id, isStar) {
    if (type === "folder") {
        for (let i = 0; i < folders.length; i++) {
            if (folders[i].id === id) {
                folders[i].isStar = isStar
            };
        };
    } else {
        findFolder("star", id, isStar);
        addDataToLocalStorage("folder");
    };
    addDataToLocalStorage(type);
}

// Find Folder
function findFolder(type, taskId, newData, newDesc) {
    folders.find((folder) => {
        if (folder.tasks.some((task) => task.id === taskId)) {
            for (let i = 0; i < folder.tasks.length; i++) {
                if (folder.tasks[i].id === taskId) {
                    if (type === "star") {
                        folder.tasks[i].isStar = newData;
                    } else if (type === "item") {
                        folder.tasks[i].name = newData;
                        folder.tasks[i].desc = newDesc
                    };
                };
            };
        };
    });
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            if (type === "star") {
                tasks[i].isStar = newData;
            } else if (type === "item") {
                tasks[i].name = newData;
                tasks[i].desc = newDesc;
            };
        };
    };
}

// Extract all tasks from folders
export function extractAllTasksFormFolders() {
    folders.forEach((f) => {
        tasks.push(...f.tasks);
    })
    addDataToLocalStorage("task");
}

// Extract Task from Folders
export function extractTaskFromFolders(task) {
    tasks.push(task);
    addDataToLocalStorage("task");
}

// Get folder id by name
export function getFolderIdByName(folderName) {
    return folders.filter((f) => f.name === folderName.trim() ? f.id : "")[0].id
}

// Get folder name by id
export function getFolderNameById(folderId) {
    return folders.reduce((a, c) =>  a.id === folderId ? a : c).name;
}

// Get folder by id
export function getFolderBy(type, folderIdOrName) {
    if (type === "id") {
        return folders.reduce((a, c) =>  a.id === folderIdOrName ? a : c);
    } else { 
        return folders.reduce((a, c) =>  a.name === folderIdOrName ? a : c);
    };
};

// Get folder by task id
export function getFolderByTaskId(taskId) {
    return folders.find((folder) => {
        return folder.tasks.some((t) => t.id === +taskId);
    });
}

// Get Tasks Status 
export function getTasksStatus(tasks, state) {
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].state === state) {
            count++
        }
    }
    return count
}

// Change Task State
export function changeTaskState(taskId, state) {
    folders.find((folder) => {
        if (folder.tasks.some((t) => t.id === taskId)) {
            for (let i = 0; i < folder.tasks.length; i++) {
                if (folder.tasks[i].id === taskId) {
                    folder.tasks[i].state = state;
                };
            };
        };
    });
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            tasks[i].state = state;
        };
    };
    addDataToLocalStorage("task");
    addDataToLocalStorage("folder");

}

// Save Items Array to Local Storage
export function saveItemsToLocalStorage(type) {
    if (type === "folder") {
        let foldersFLS = localStorage.getItem("folders");
        if (foldersFLS) {
            folders = JSON.parse(foldersFLS);
            localStorage.setItem("folders", JSON.stringify(folders));
        };
    } else if (type === "task") {
        extractAllTasksFormFolders();
        let tasksFLS = localStorage.getItem("tasks");
        if (tasksFLS) {
            tasks = JSON.parse(tasksFLS);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        };
    } else {
        throw new Error("Type unknown");
    };
};

// Add Data To LocalStorage
export function addDataToLocalStorage(type) {
    if (type === "folder") {
        localStorage.setItem("folders", JSON.stringify(folders));
    } else if (type === "task") {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
        throw new Error("Type unknown");
    };
};

// Actions that the user is allowed to do
export const actions = {
    "search": `<i class="fa-solid fa-magnifying-glass"></i>`,
    "create": `<i class="fa-solid fa-plus"></i>`,
    "sort-by": `<i class="fa-solid fa-sort"></i>`,
    "filter": `<i class="fa-solid fa-filter"></i>`,
    "clear": `<i class="fa-solid fa-c"></i>`,
};

// Sort By Inputs
export const sortByInputs = ["Name", "Date"];

// Filter Inputs
export const filterInputs = ["Default", "Not Started", "In Progress", "Done"];

// Actions that the user is allowed to do on folders
export const actionsForFolders = {
    update: `<i class="fa-solid fa-pen"></i> Update`,
    delete: `<i class="fa-solid fa-trash-can"></i> Delete`,
    deleteAllTasks: `<i class="fa-solid fa-c"></i> Delete Tasks`,
};

// Actions that the user is allowed to do on tasks
export const actionsForTasks = {
    update: `<i class="fa-solid fa-pen"></i> Update`,
    delete: `<i class="fa-solid fa-trash-can"></i> Delete`,
};

// Task State
export const taskState = ["Not Started", "In Progress", "Done"];

export const descInputMaxLength = 150;