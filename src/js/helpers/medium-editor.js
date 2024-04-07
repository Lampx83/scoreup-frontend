import MediumEditor from 'medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/beagle.css';

import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';

export const initEditor = () => {
  rangy.init();

  function Highlighter(color) {
    this.button = document.createElement('button');
    this.button.className = 'medium-editor-action';
    this.button.innerHTML = '<span style="color:' + color + '; font-size: 20px;">&#9632;</span>';
    // this.button.innerHTML = color;
    this.button.onclick = this.onClick.bind(this);
    this.classApplier = rangy.createClassApplier("highlight-" + color, {
      elementTagName: 'mark',
      normalize: true
    });
  }
  Highlighter.prototype.onClick = function () {
    this.classApplier.toggleSelection();
  };
  Highlighter.prototype.getButton = function () {
    return this.button;
  };
  Highlighter.prototype.checkState = function (node) {
    if (node.tagName == 'MARK') {
      this.button.classList.add('medium-editor-button-active');
    }
  };

  const editors = document.querySelectorAll('.editor');
  var e = new MediumEditor(editors, {
    toolbar: {
      buttons: [
        'highlight-yellow',
        'highlight-green',
        'highlight-red',
        'bold',
        'underline',
        {
          name: 'anchor',
          contentDefault: '<b>Notes</b>',
          aria: 'Notes',
          style: {
            prop: 'color',
            value: 'red'
          }
        }
      ], // Thêm các nút highlight với màu khác nhau
      align: 'center',
      updateOnEmptySelection: true,
      buttonLabels: 'fontawesome'
    },
    extensions: {
      'highlight-yellow': new Highlighter('yellow'), // Tạo các extension mới với màu khác nhau
      'highlight-green': new Highlighter('green'),
      'highlight-red': new Highlighter('red')
    },
    anchor: {
      linkValidation: false,
      placeholderText: 'Type a note...',
    },
    disableReturn: true,
    disableDoubleReturn: true,
    disableExtraSpaces: true,
  });

  editors.forEach(editor => {
    editor.onkeydown = function (e) {
      return false;
    };
  });

  const toggleEditorBtn = document.querySelector('.toggle-editor-btn').querySelector('input');
  if (toggleEditorBtn) {
    toggleEditorBtn.addEventListener('change', () => {
      console.log('toggleEditorBtn.checked', toggleEditorBtn.checked);
      if (toggleEditorBtn.checked) {
        editors.forEach(editor => {
          editor.setAttribute('contenteditable', 'true');
        });
      } else {
        editors.forEach(editor => {
          editor.setAttribute('contenteditable', 'false');
        });
      }
    });
  }
}