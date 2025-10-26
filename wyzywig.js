function initWyzywigEditor(textareaId) {
    const textarea = document.getElementById(textareaId);
    if (!textarea) {
        console.error('Textarea with ID "' + textareaId + '" not found.');
        return;
    }

    textarea.style.display = 'none';

    const editor = document.createElement('div');
    editor.className = 'editor';
    editor.contentEditable = true;
    editor.innerHTML = textarea.value;

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';

    const buttons = [
        { command: 'undo', icon: 'Undo' },
        { command: 'redo', icon: 'Redo' },
        { command: 'bold', icon: '<b>B</b>' },
        { command: 'italic', icon: '<i>I</i>' },
        { command: 'underline', icon: '<u>U</u>' },
        { command: 'justifyLeft', icon: 'Left' },
        { command: 'justifyCenter', icon: 'Center' },
        { command: 'justifyRight', icon: 'Right' },
        { command: 'justifyFull', icon: 'Justify' },
        { command: 'insertOrderedList', icon: 'OL' },
        { command: 'insertUnorderedList', icon: 'UL' },
        { command: 'indent', icon: 'Indent' },
        { command: 'outdent', icon: 'Outdent' },
        { command: 'createLink', icon: 'Link' },
        { command: 'unlink', icon: 'Unlink' },
        { command: 'insertImage', icon: 'Image' },
        { command: 'source', icon: '< >' }
    ];

    buttons.forEach(buttonInfo => {
        const button = document.createElement('button');
        button.innerHTML = buttonInfo.icon;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (buttonInfo.command === 'createLink') {
                const url = prompt('Enter the URL:');
                document.execCommand(buttonInfo.command, false, url);
            } else if (buttonInfo.command === 'insertImage') {
                document.getElementById('imageModal').style.display = 'block';
            } else if (buttonInfo.command === 'source') {
                if (editor.style.display === 'none') {
                    // Switch to WYSIWYG view
                    editor.innerHTML = textarea.value;
                    editor.style.display = 'block';
                    textarea.style.display = 'none';
                } else {
                    // Switch to HTML view
                    textarea.value = editor.innerHTML;
                    textarea.style.display = 'block';
                    editor.style.display = 'none';
                }
            } else {
                document.execCommand(buttonInfo.command, false, null);
            }
        });
        toolbar.appendChild(button);
    });

    textarea.parentNode.insertBefore(toolbar, textarea);
    textarea.parentNode.insertBefore(editor, textarea);

    editor.addEventListener('input', () => {
        textarea.value = editor.innerHTML;
    });

    editor.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (event.ctrlKey) {
                document.execCommand('insertLineBreak');
            } else {
                document.execCommand('insertParagraph');
            }
        }
    });

    const modal = document.getElementById('imageModal');
    const closeButton = document.querySelector('.close-button');
    const uploadButton = document.getElementById('uploadButton');
    const imageInput = document.getElementById('imageInput');

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    uploadButton.addEventListener('click', () => {
        const file = imageInput.files[0];
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        fetch('wyz.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.execCommand('insertImage', false, data.url);
                modal.style.display = 'none';
            } else {
                document.getElementById('uploadMessage').textContent = 'Error: ' + data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('uploadMessage').textContent = 'An error occurred.';
        });
    });
}
