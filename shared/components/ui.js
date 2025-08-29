// UI component utilities
const UI = {
    // Show notification
    showNotification: (message, type = 'info', duration = 3000) => {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${UI.getNotificationClasses(type)}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${UI.getNotificationIcon(type)}</span>
                <span>${message}</span>
                <button class="ml-4 text-lg leading-none" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, duration);
        }
        
        return notification;
    },

    getNotificationClasses: (type) => {
        const classes = {
            'info': 'bg-blue-500 text-white',
            'success': 'bg-green-500 text-white',
            'warning': 'bg-yellow-500 text-black',
            'error': 'bg-red-500 text-white'
        };
        return classes[type] || classes.info;
    },

    getNotificationIcon: (type) => {
        const icons = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        };
        return icons[type] || icons.info;
    },

    // Show loading spinner
    showLoading: (container, message = 'Loading...') => {
        const loading = document.createElement('div');
        loading.className = 'flex items-center justify-center p-8';
        loading.innerHTML = `
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <span class="text-gray-600">${message}</span>
        `;
        
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        container.innerHTML = '';
        container.appendChild(loading);
        
        return loading;
    },

    // Hide loading
    hideLoading: (container) => {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        const loading = container.querySelector('.animate-spin');
        if (loading) {
            loading.parentElement.remove();
        }
    },

    // Create modal
    createModal: (title, content, options = {}) => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        
        const modalContent = document.createElement('div');
        modalContent.className = `bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto ${options.size === 'large' ? 'max-w-4xl' : ''}`;
        
        modalContent.innerHTML = `
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-bold">${title}</h2>
                    <button class="close-modal text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeModal = () => modal.remove();
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // ESC key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        return modal;
    },

    // Create button
    createButton: (text, type = 'primary', onClick = null) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = UI.getButtonClasses(type);
        
        if (onClick) {
            button.addEventListener('click', onClick);
        }
        
        return button;
    },

    getButtonClasses: (type) => {
        const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2';
        const typeClasses = {
            'primary': 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
            'secondary': 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300',
            'success': 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300',
            'danger': 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
            'outline': 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-300',
            'ghost': 'text-blue-500 hover:bg-blue-50 focus:ring-blue-300'
        };
        
        return `${baseClasses} ${typeClasses[type] || typeClasses.primary}`;
    },

    // Create input field
    createInput: (options = {}) => {
        const { 
            type = 'text', 
            placeholder = '', 
            value = '', 
            label = '', 
            required = false,
            id = '',
            className = ''
        } = options;
        
        const container = document.createElement('div');
        container.className = 'mb-4';
        
        if (label) {
            const labelEl = document.createElement('label');
            labelEl.textContent = label + (required ? ' *' : '');
            labelEl.className = 'block text-sm font-medium text-gray-700 mb-2';
            if (id) labelEl.setAttribute('for', id);
            container.appendChild(labelEl);
        }
        
        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.value = value;
        input.required = required;
        if (id) input.id = id;
        input.className = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`;
        
        container.appendChild(input);
        
        return { container, input };
    },

    // Create select dropdown
    createSelect: (options = {}) => {
        const { 
            choices = [], 
            value = '', 
            label = '', 
            required = false,
            id = '',
            className = ''
        } = options;
        
        const container = document.createElement('div');
        container.className = 'mb-4';
        
        if (label) {
            const labelEl = document.createElement('label');
            labelEl.textContent = label + (required ? ' *' : '');
            labelEl.className = 'block text-sm font-medium text-gray-700 mb-2';
            if (id) labelEl.setAttribute('for', id);
            container.appendChild(labelEl);
        }
        
        const select = document.createElement('select');
        select.required = required;
        if (id) select.id = id;
        select.className = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`;
        
        choices.forEach(choice => {
            const option = document.createElement('option');
            option.value = typeof choice === 'object' ? choice.value : choice;
            option.textContent = typeof choice === 'object' ? choice.label : choice;
            if (option.value === value) option.selected = true;
            select.appendChild(option);
        });
        
        container.appendChild(select);
        
        return { container, select };
    },

    // Create checkbox
    createCheckbox: (options = {}) => {
        const { 
            label = '', 
            checked = false,
            id = '',
            className = ''
        } = options;
        
        const container = document.createElement('div');
        container.className = 'mb-4 flex items-center';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        if (id) checkbox.id = id;
        checkbox.className = `h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`;
        
        container.appendChild(checkbox);
        
        if (label) {
            const labelEl = document.createElement('label');
            labelEl.textContent = label;
            labelEl.className = 'ml-2 text-sm text-gray-700';
            if (id) labelEl.setAttribute('for', id);
            container.appendChild(labelEl);
        }
        
        return { container, checkbox };
    },

    // Create card container
    createCard: (title, content, options = {}) => {
        const { className = '', actions = [] } = options;
        
        const card = document.createElement('div');
        card.className = `bg-white rounded-lg shadow-sm border p-6 ${className}`;
        
        if (title) {
            const header = document.createElement('div');
            header.className = 'mb-4';
            
            const titleEl = document.createElement('h3');
            titleEl.className = 'text-lg font-semibold text-gray-900';
            titleEl.textContent = title;
            header.appendChild(titleEl);
            
            card.appendChild(header);
        }
        
        const body = document.createElement('div');
        body.className = 'card-body';
        if (typeof content === 'string') {
            body.innerHTML = content;
        } else {
            body.appendChild(content);
        }
        card.appendChild(body);
        
        if (actions.length > 0) {
            const footer = document.createElement('div');
            footer.className = 'mt-4 pt-4 border-t flex gap-2';
            
            actions.forEach(action => {
                const button = UI.createButton(action.text, action.type, action.onClick);
                footer.appendChild(button);
            });
            
            card.appendChild(footer);
        }
        
        return card;
    },

    // Create tabs
    createTabs: (tabs) => {
        const container = document.createElement('div');
        container.className = 'tabs-container';
        
        // Tab headers
        const tabHeaders = document.createElement('div');
        tabHeaders.className = 'border-b border-gray-200';
        
        const tabNav = document.createElement('nav');
        tabNav.className = 'flex space-x-8';
        
        // Tab content
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content mt-4';
        
        tabs.forEach((tab, index) => {
            // Create tab header
            const tabHeader = document.createElement('a');
            tabHeader.href = '#';
            tabHeader.textContent = tab.label;
            tabHeader.className = `py-2 px-1 border-b-2 font-medium text-sm ${
                index === 0 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`;
            
            // Create tab content
            const tabPane = document.createElement('div');
            tabPane.className = `tab-pane ${index === 0 ? '' : 'hidden'}`;
            if (typeof tab.content === 'string') {
                tabPane.innerHTML = tab.content;
            } else {
                tabPane.appendChild(tab.content);
            }
            
            // Tab switching logic
            tabHeader.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update headers
                tabNav.querySelectorAll('a').forEach(h => {
                    h.className = 'py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
                });
                tabHeader.className = 'py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600';
                
                // Update content
                tabContent.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.add('hidden');
                });
                tabPane.classList.remove('hidden');
            });
            
            tabNav.appendChild(tabHeader);
            tabContent.appendChild(tabPane);
        });
        
        tabHeaders.appendChild(tabNav);
        container.appendChild(tabHeaders);
        container.appendChild(tabContent);
        
        return container;
    },

    // Progress bar
    createProgressBar: (percentage, options = {}) => {
        const { className = '', showLabel = true, color = 'blue' } = options;
        
        const container = document.createElement('div');
        container.className = `progress-container ${className}`;
        
        if (showLabel) {
            const label = document.createElement('div');
            label.className = 'text-sm text-gray-600 mb-2';
            label.textContent = `${Math.round(percentage)}%`;
            container.appendChild(label);
        }
        
        const track = document.createElement('div');
        track.className = 'w-full bg-gray-200 rounded-full h-2';
        
        const bar = document.createElement('div');
        bar.className = `bg-${color}-500 h-2 rounded-full transition-all duration-300`;
        bar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        
        track.appendChild(bar);
        container.appendChild(track);
        
        return { container, bar, update: (newPercentage) => {
            bar.style.width = `${Math.max(0, Math.min(100, newPercentage))}%`;
            if (showLabel) {
                container.querySelector('.text-sm').textContent = `${Math.round(newPercentage)}%`;
            }
        }};
    },

    // Copy to clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            UI.showNotification('Copied to clipboard!', 'success');
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                UI.showNotification('Copied to clipboard!', 'success');
                return true;
            } catch (fallbackErr) {
                UI.showNotification('Failed to copy to clipboard', 'error');
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    },

    // Download file
    downloadFile: (content, filename, type = 'text/plain') => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};