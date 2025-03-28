// // 页面加载时初始化
// window.onload = loadTodos;// 获取元素
const newTodoInput = document.getElementById('new-todo');
const submitButton = document.getElementById('submit-button');
const todoItems = document.getElementById('todo-items');
const exportBtn = document.getElementById('outBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const completedBtn = document.getElementById('completedBtn');
const recycleBinBtn = document.getElementById('recycleBinBtn');
const allBtn = document.getElementById('allBtn');
// 用于模拟回收站的数组
let recycleBin = [];
// 用于标记是否有内容被删除过
let hasContentBeenDeleted = localStorage.getItem('hasContentBeenDeleted') === 'true';

// 初始化默认内容
const DEFAULT_TIPS = [
    '添加你的第一个待办事项',
    '输入内容后按回车或提交按钮保存',
    '点击右侧×可删除单个事项',
    '刷新页面数据依然保留',
    '双击文字内容可以修改文字'
];

// 从LocalStorage加载数据并渲染
function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        try {
            const todos = JSON.parse(storedTodos);
            todoItems.innerHTML = '';
            todos.forEach((todo) => {
                const todoItemDiv = document.createElement('div');
                todoItemDiv.classList.add('todo-item');

                // 添加勾选框
                const checkBox = document.createElement('span');
                checkBox.classList.add('check-box');
                if (todo.completed) {
                    checkBox.classList.add('checked');
                }
                checkBox.addEventListener('click', () => {
                    todo.completed =!todo.completed;
                    localStorage.setItem('todos', JSON.stringify(todos));
                    loadTodos();
                });

                const newItem = document.createElement('li');
                newItem.textContent = todo.text;
                newItem.style.wordBreak = 'break-all';
                if (todo.completed) {
                    newItem.style.textDecoration = 'line-through';
                }

                const deleteButton = document.createElement('span');
                deleteButton.classList.add('delete-btn');
                deleteButton.textContent = '×';
                deleteButton.addEventListener('click', function () {
                    const currentTodos = JSON.parse(localStorage.getItem('todos'));
                    const index = currentTodos.findIndex(t => t.id === todo.id);
                    if (index!== -1) {
                        const removedTodo = currentTodos.splice(index, 1)[0];
                        recycleBin.push(removedTodo);
                        localStorage.setItem('todos', JSON.stringify(currentTodos));
                        loadTodos();
                        hasContentBeenDeleted = true;
                        localStorage.setItem('hasContentBeenDeleted', 'true');
                        recycleBinBtn.classList.remove('hide');
                        if (currentTodos.length === 0) {
                            showDefaultTips();
                        }
                    }
                });

                // 双击修改功能
                newItem.addEventListener('dblclick', function () {
                    const originalText = newItem.textContent;
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = originalText;
                    input.style.width = 'auto';
                    input.style.border = '1px solid #ccc';
                    input.style.padding = '5px';
                    input.style.borderRadius = '5px';
                    input.style.outline = 'none';
                    input.focus();
                    input.addEventListener('blur', function () {
                        const newText = input.value.trim();
                        if (newText) {
                            todo.text = newText;
                            localStorage.setItem('todos', JSON.stringify(todos));
                            loadTodos();
                        } else {
                            todo.text = originalText;
                            loadTodos();
                        }
                    });
                    input.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter') {
                            input.blur();
                        }
                    });
                    newItem.textContent = '';
                    newItem.appendChild(input);
                });

                todoItemDiv.appendChild(checkBox);
                todoItemDiv.appendChild(newItem);
                todoItemDiv.appendChild(deleteButton);
                todoItems.appendChild(todoItemDiv);
            });
            // 显示功能按钮
            if (todos.length > 0) {
                exportBtn.classList.remove('hide');
                clearAllBtn.classList.remove('hide');
                completedBtn.classList.remove('hide');
            } else {
                exportBtn.classList.add('hide');
                clearAllBtn.classList.add('hide');
                completedBtn.classList.add('hide');
            }
            // 根据记录决定是否显示回收站按钮
            if (hasContentBeenDeleted) {
                recycleBinBtn.classList.remove('hide');
            }
        } catch (error) {
            console.error('数据解析错误，已重置存储');
            localStorage.removeItem('todos');
            showDefaultTips();
        }
    } else {
        showDefaultTips();
    }
}

// 显示默认提示
function showDefaultTips() {
    todoItems.innerHTML = '';
    DEFAULT_TIPS.forEach((tip) => {
        const li = document.createElement('li');
        li.textContent = tip;
        li.classList.add('default-tip');
        li.style.wordBreak = 'break-all';
        todoItems.appendChild(li);
    });
    exportBtn.classList.add('hide');
    clearAllBtn.classList.add('hide');
    completedBtn.classList.add('hide');
    if (hasContentBeenDeleted) {
        recycleBinBtn.classList.remove('hide');
    } else {
        recycleBinBtn.classList.add('hide');
    }
}

// 提交按钮事件
submitButton.addEventListener('click', function () {
    const inputValue = newTodoInput.value.trim();
    if (!inputValue) return;

    let todos = localStorage.getItem('todos') 
       ? JSON.parse(localStorage.getItem('todos')) 
        : [];

    // 为新事项添加唯一id
    const newTodo = {
        id: new Date().getTime(),
        text: inputValue,
        completed: false
    };
    todos.unshift(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));

    loadTodos();
    newTodoInput.value = '';
});

// 回车键提交
newTodoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        submitButton.click();
    }
});

// 全部标为完成按钮功能
completedBtn.addEventListener('click', function () {
    const todos = JSON.parse(localStorage.getItem('todos'));
    if (todos) {
        todos.forEach((todo) => todo.completed = true);
        localStorage.setItem('todos', JSON.stringify(todos));
        loadTodos();
    }
});

// 清除全部按钮功能
clearAllBtn.addEventListener('click', function () {
    const todos = localStorage.getItem('todos') 
       ? JSON.parse(localStorage.getItem('todos')) 
        : [];
    recycleBin = recycleBin.concat(todos); // 将所有待办事项添加到回收站
    localStorage.removeItem('todos');
    todoItems.innerHTML = '';
    showDefaultTips();
    hasContentBeenDeleted = true;
    localStorage.setItem('hasContentBeenDeleted', 'true');
    recycleBinBtn.classList.remove('hide'); 
});

// 回收站按钮点击事件
recycleBinBtn.addEventListener('click', function () {
    todoItems.innerHTML = '';
    recycleBin.forEach((todo) => {
        const recycleBinItemDiv = document.createElement('div');
        recycleBinItemDiv.classList.add('recycle-bin-item');

        const checkBox = document.createElement('span');
        checkBox.classList.add('check-box');
        if (todo.completed) {
            checkBox.classList.add('checked');
        }
        checkBox.addEventListener('click', () => {
            todo.completed =!todo.completed;
            // 这里可以添加更新回收站状态到本地存储等逻辑
        });

        const newItem = document.createElement('li');
        newItem.textContent = todo.text;
        newItem.style.wordBreak = 'break-all';
        if (todo.completed) {
            newItem.style.textDecoration = 'line-through';
        }

        const restoreButton = document.createElement('span');
        restoreButton.classList.add('restore-btn');
        restoreButton.textContent = '';
        restoreButton.addEventListener('click', function () {
            const index = recycleBin.findIndex(t => t.id === todo.id);
            if (index!== -1) {
                const restoredTodo = recycleBin.splice(index, 1)[0];
                let todos = localStorage.getItem('todos') 
                   ? JSON.parse(localStorage.getItem('todos')) 
                    : [];
                todos.unshift(restoredTodo);
                localStorage.setItem('todos', JSON.stringify(todos));
                loadTodos();
                if (recycleBin.length === 0) {
                    recycleBinBtn.classList.add('hide');
                    hasContentBeenDeleted = false;
                    localStorage.setItem('hasContentBeenDeleted', 'false');
                    // 回收站为空时，跳转到显示全部待办事项
                    loadTodos(); 
                }
            }
        });

        recycleBinItemDiv.appendChild(checkBox);
        recycleBinItemDiv.appendChild(newItem);
        recycleBinItemDiv.appendChild(restoreButton);
        todoItems.appendChild(recycleBinItemDiv);
    });
});

// 全部按钮点击事件（展示所有笔记）
allBtn.addEventListener('click', function () {
    loadTodos();
});

// 页面加载时初始化
window.onload = loadTodos;