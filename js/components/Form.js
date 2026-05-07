import { Component } from './Component.js';
import { ComponentFactory } from './ComponentFactory.js';
import { MockApi } from '../api/MockApi.js';
import { Popup } from './Popup.js';
import { UserMessage } from './UserMessage.js';

export class Form extends Component {
  constructor(targetSelectorOrElement, container = document.body) {
    super(targetSelectorOrElement, container);

    if (this.componentEl && this.componentEl.tagName.toLowerCase() === 'form') {
      this.componentEl.reset();
    }

    this._initValidation();
  }

  _initValidation() {
    if (!this.componentEl || this.componentEl.tagName.toLowerCase() !== 'form') {
      return;
    }

    if (typeof JustValidate !== 'function') {
      throw new Error('just-validate.js не подключен');
    }

    const validatedForm = new JustValidate(this.componentEl);

    const formFieldEls = ComponentFactory.getDomEls('input, select, textarea', this.componentEl);

    formFieldEls.forEach(fieldEl => {
      const rule = this._getValidateRule(fieldEl);
      if (rule) validatedForm.addField(fieldEl, rule);
    });

    validatedForm.onSuccess(async () => await this._handleSubmit());
  }

  _getValidateRule(formFieldEl) {
    if (!(formFieldEl instanceof Element) || !(formFieldEl?.name)) {
      throw new Error('Для добавления правила валидации поле должно существовать в DOM и иметь атрибут name');
    }

    switch (formFieldEl.name) {
      case 'name':
        return [
          {
            rule: 'required',
            errorMessage: 'Введите ваше имя',
          },
          {
            rule: 'minLength',
            value: 3,
            errorMessage: 'Минимальная длина три символа', 
          },
          {
            rule: 'maxLength',
            value: 20,
            errorMessage: 'Максимальная длина двадцать символов',
          },
        ];
      
      case 'email':
        return [
          {
            rule: 'required',
            errorMessage: 'Введите вашу почту',
          },
          {
            rule: 'email',
            errorMessage: 'Почта введена неверно',
          },
        ];

      case 'agree':
        return [
          {
            rule: 'required',
            errorMessage: 'Согласие обязательно',
          },
        ];
      
      default:
        throw new Error(`Валидация для поля ${formFieldEl} не предусмотрена`);
    }
  }

  _createPopupWithUserMessage(messageType) {
    if (!this.componentEl) {
      return;
    }

    const userMessage = new UserMessage(messageType);
    
    const popup = new Popup();
    popup.addContent(userMessage.getMessageCard());
    popup.showPopup();
  }

  async _handleSubmit() {
    if (!this.componentEl || this.componentEl.tagName.toLowerCase() !== 'form') {
      return;
    }

    try {
      const formData = new FormData(this.componentEl);
      await MockApi.postUserFeedback(formData);
      this.componentEl.reset();

      try {
        this._createPopupWithUserMessage('success');
      } catch (error) {
        console.error(error);
      }

    } catch (error) {
      console.error(error);
      
      try {
        this._createPopupWithUserMessage('error');
      } catch (error) {
        console.error(error);
      }
    }
  }
}