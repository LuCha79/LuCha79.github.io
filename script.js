// 设置当前时间显示并每秒更新
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24小时制
    });
    document.getElementById('current-time').textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

// 创建任务元素，同时检查是否星标
function createTaskElement(taskText, isStarred = false) {
    const taskItem = document.createElement('li');
    taskItem.className = 'todo-item';
    taskItem.innerHTML = `
        <div class="checkbox"></div>
        <span>${taskText}</span>
        <button class="star-button">${isStarred ? '&#9733;' : '&#9734;'}</button>
    `;
    taskItem.querySelector('.star-button').classList.toggle('starred', isStarred);
    return taskItem;
}

// 添加任务
document.getElementById('add-btn').addEventListener('click', function() {
    const input = document.getElementById('todo-input');
    const taskText = input.value.trim();
    if (taskText) {
        const taskItem = createTaskElement(taskText);
        
        // 找到所有置顶任务，将新任务添加在其后
        const starredTasks = document.querySelectorAll('.starred');
        if (starredTasks.length > 0) {
            // 添加新任务在最后一个置顶任务之后
            starredTasks[starredTasks.length - 1].parentElement.insertAdjacentElement('afterend', taskItem);
        } else {
            // 如果没有置顶任务，直接添加到列表顶部
            document.getElementById('incomplete-list').prepend(taskItem);
        }

        input.value = '';
    } else {
        alert("Please enter a task.");
    }
});

// 切换完成状态
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('checkbox')) {
        const taskItem = e.target.closest('li');
        e.target.classList.toggle('checked');
        if (e.target.classList.contains('checked')) {
            document.getElementById('completed-list').prepend(taskItem);
            taskItem.classList.add('completed-item');
            taskItem.classList.remove('todo-item');
            taskItem.querySelector('.star-button').classList.add('completed'); // 禁用星号
            taskItem.querySelector('.star-button').classList.remove('starred'); // 确保星号不显示为黄色
            // 显示完成栏标题
            document.getElementById('completed-title').style.display = 'block';
        } else {
            document.getElementById('incomplete-list').prepend(taskItem);
            taskItem.classList.add('todo-item');
            taskItem.classList.remove('completed-item');
            taskItem.querySelector('.star-button').classList.remove('completed'); // 启用星号
        }

        // 显示或隐藏完成栏
        updateCompletedListVisibility();
    }
});

// 切换星号状态
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('star-button') && !e.target.classList.contains('completed')) {
        const taskItem = e.target.closest('li');
        const isStarred = e.target.classList.contains('starred');
        const taskList = taskItem.parentElement;

        if (!isStarred) {
            e.target.classList.add('starred');
            e.target.innerHTML = '&#9733;'; // 实星
            taskList.prepend(taskItem); // 置顶
        } else {
            e.target.classList.remove('starred');
            e.target.innerHTML = '&#9734;'; // 空星

            // 将任务移至未完成列表的最上方
            if (taskList.id === 'incomplete-list') {
                taskList.prepend(taskItem);
            }
        }
    }
});

// 双击标题切换亮色/暗色模式
document.getElementById('app-title').addEventListener('dblclick', function() {
    document.body.classList.toggle('dark-mode');
    const input = document.getElementById('todo-input');
    if (document.body.classList.contains('dark-mode')) {
        document.getElementById('add-btn').style.backgroundColor = '#8fbc8f'; // 深绿色
        document.getElementById('add-btn').style.color = '#2e3e46'; // 深绿色背景下的文本颜色
        document.getElementById('more-btn').style.color = '#8fbc8f'; // 更改更多键颜色为绿色

        // 强制重绘
        document.body.offsetWidth;
        document.getElementById('more-btn').offsetWidth; // 强制重绘更多按钮
    } else {
        document.getElementById('add-btn').style.backgroundColor = '#e00022'; // 更新为新的橙色
        document.getElementById('add-btn').style.color = '#fff'; // 默认文本颜色
        document.getElementById('more-btn').style.color = '#e00022'; // 更改更多键颜色为橙色

        // 强制重绘
        document.body.offsetWidth;
        document.getElementById('more-btn').offsetWidth; // 强制重绘更多按钮
    }
    saveModeToLocalStorage();
});

// 在加载模式状态时更新更多按钮的颜色
function loadModeFromLocalStorage() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('add-btn').style.backgroundColor = '#8fbc8f'; // 深绿色
        document.getElementById('add-btn').style.color = '#2e3e46'; // 深绿色背景下的文本颜色
        document.getElementById('more-btn').style.color = '#8fbc8f'; // 更改更多键颜色为绿色

        // 延迟执行强制重绘，给浏览器时间应用CSS
        setTimeout(() => {
            document.body.offsetWidth;
            document.getElementById('more-btn').offsetWidth; // 强制重绘更多按钮
        }, 0);
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('add-btn').style.backgroundColor = '#e00022'; // 更新为新的橙色
        document.getElementById('add-btn').style.color = '#fff'; // 默认文本颜色
        document.getElementById('more-btn').style.color = '#e00022'; // 更改更多键颜色为橙色

        // 延迟执行强制重绘，给浏览器时间应用CSS
        setTimeout(() => {
            document.body.offsetWidth;
            document.getElementById('more-btn').offsetWidth; // 强制重绘更多按钮
        }, 0);
    }
    // 调用你的toggleDarkMode()函数，如果需要更新其他UI元素
    toggleDarkMode();
}

// 页面加载时加载模式状态
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadModeFromLocalStorage, 0);
});

// 保存模式状态到localStorage
function saveModeToLocalStorage() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// 更多按钮切换
document.getElementById('more-btn').addEventListener('click', function() {
    const menu = document.getElementById('more-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// 导航至未完成任务列表
document.getElementById('goto-incomplete').addEventListener('click', function() {
    document.getElementById('incomplete-list').scrollIntoView({ behavior: 'smooth' });
});

// 导航至已完成任务列表
document.getElementById('goto-complete').addEventListener('click', function() {
    document.getElementById('completed-list').scrollIntoView({ behavior: 'smooth' });
});

// 添加长按删除任务功能（支持移动设备）
document.addEventListener('mousedown', handleMouseDownOrTouchStart);
document.addEventListener('touchstart', handleMouseDownOrTouchStart);

function handleMouseDownOrTouchStart(e) {
    if (e.target.closest('li')) {
        const taskItem = e.target.closest('li');
        let timeoutId = setTimeout(function() {
            if (confirm('Are you sure you want to delete this task?')) {
                taskItem.remove();
                updateCompletedListVisibility();
                // 在删除DOM元素之后，立即更新localStorage
                saveTodosToLocalStorage();
            }
        }, 1000);

        function clearDeleteTimeout() {
            clearTimeout(timeoutId);
        }

        document.addEventListener('mouseup', clearDeleteTimeout, { once: true });
        document.addEventListener('touchend', clearDeleteTimeout, { once: true });
        document.addEventListener('touchcancel', clearDeleteTimeout, { once: true });
    }
}

// 更新完成栏的显示状态
function updateCompletedListVisibility() {
    const completedList = document.getElementById('completed-list');
    const completedTitle = document.getElementById('completed-title');
    if (completedList.children.length > 0) {
        completedTitle.style.display = 'block';
        completedList.style.display = 'block';
    } else {
        completedTitle.style.display = 'none';
        completedList.style.display = 'none';
    }
}

// 从localStorage中读取待办事项，确保星标任务被置顶
function loadTodosFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const taskItem = createTaskElement(todo.text, todo.starred);
        if (todo.completed) {
            taskItem.querySelector('.checkbox').classList.add('checked');
            document.getElementById('completed-list').prepend(taskItem);
            taskItem.classList.add('completed-item');
            taskItem.classList.remove('todo-item');
            taskItem.querySelector('.star-button').classList.add('completed');
        } else {
            // 如果任务被星标，则将其置顶
            if (todo.starred) {
                document.getElementById('incomplete-list').prepend(taskItem);
            } else {
                document.getElementById('incomplete-list').append(taskItem);
            }
        }
        // 确保星标状态正确
        taskItem.querySelector('.star-button').classList.toggle('starred', todo.starred);
        
        // 显示完成栏标题，如果至少有一个已完成任务
        if (todo.completed) {
            document.getElementById('completed-title').style.display = 'block';
        }
    });
}

// 保存待办事项到localStorage
function saveTodosToLocalStorage() {
    const incompleteList = document.getElementById('incomplete-list');
    const completedList = document.getElementById('completed-list');
    const todos = [];
    [...incompleteList.children, ...completedList.children].forEach(task => {
        const todo = {
            text: task.querySelector('span').textContent,
            completed: task.querySelector('.checkbox').classList.contains('checked'),
            starred: task.querySelector('.star-button').classList.contains('starred')
        };
        todos.push(todo);
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 在添加新任务后保存
document.getElementById('add-btn').addEventListener('click', function() {
    saveTodosToLocalStorage();
});

// 在切换完成状态后保存
document.addEventListener('click', function(e) {
    saveTodosToLocalStorage();
});

// 在切换星号状态后保存
document.addEventListener('click', function(e) {
    saveTodosToLocalStorage();
});

// 在删除任务后保存
document.addEventListener('mouseup', function() {
    saveTodosToLocalStorage();
});

// 页面加载时加载待办事项
document.addEventListener('DOMContentLoaded', loadTodosFromLocalStorage);