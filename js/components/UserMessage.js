import { ComponentFactory } from './ComponentFactory.js';
import { Component } from './Component.js';
import * as config from '../config.js';

export class UserMessage {
  _messageConfig = null;

  constructor(messageType) {
    this._setMessageConfig(messageType);
  }

  _setMessageConfig(messageType) {
    const messageConfig = config?.FORM_MESSAGES?.[messageType] ?? null;

    if (!messageConfig) {
      throw new Error(`В конфигурации form_messages отсутствуют данные для messageType ${messageType}`);
    }

    this._messageConfig = messageConfig;
  }

  getMessageCard() {
    if (!this._messageConfig) {
      return;
    }

    // Collect message data.
    const messageData = {
      iconId: this._messageConfig?.iconId ?? null,
      title: this._messageConfig?.title ?? null,
      message: this._messageConfig?.message ?? null,
    }

    const missingProps = [];

    for (const key in messageData) {
      if (messageData[key] === null) {
        missingProps.push(key);
      }
    }

    if (missingProps.length > 0) {
      throw new Error(`Отсутствуют следующие данные, необходимые для отображения сообщения пользователю: ${missingProps.join(', ')}`);
    }

    // Message card.
    const messageCard = ComponentFactory.getEl('div', ['user-message']);
    messageCard.innerHTML = `
      <svg class="user-message__icon" width="44" height="44" aria-hidden="true">
        <use xlink:href="${config.SVG_SPRITE_PATH}${messageData.iconId}"></use>
      </svg>
      <div class="user-message__content">
        <h2 class="user-message__title">${messageData.title}</h2>
        <p class="user-message__text">${messageData.message}</p>
      </div>
    `;

    return messageCard;
  }
}