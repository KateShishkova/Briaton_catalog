import * as config from '../config.js';
import { Product } from '../components/Product.js';

export class ProductData {

  static isObjectValid(productObj) {
    // Object validation.
    if (!productObj || typeof productObj !== 'object' || Array.isArray(productObj)) {
      throw new Error('productObj должен быть объектом');
    }

    const allowedFields = Object.keys(config.PRODUCT_OBJECT_CONFIG);
    const missingFields = allowedFields.filter(field => !(field in productObj));
    const extraFields = Object.keys(productObj).filter(field => !(allowedFields.includes(field)));

    if (missingFields.length > 0) {
      throw new Error(`productObj не содержит следующие поля: ${missingFields.join(', ')}`);
    }

    if (extraFields.length > 0) {
      console.warn(`productObj содержит дополнительные поля: ${extraFields.join(', ')}`);
    }

    // Entries validation.
    for (const fieldName of allowedFields) {
      const fieldConfig = config.PRODUCT_OBJECT_CONFIG[fieldName];
      const fieldValue = productObj[fieldName];

      // General validation.
      switch (fieldConfig.type) {
        case 'number':
          ProductData._checkNumber(fieldValue, fieldName);
          break;

        case 'string':
          ProductData._checkString(fieldValue, fieldName);
          break;

        case 'boolean':
          ProductData._checkBoolean(fieldValue, fieldName);
          break;

        case 'object':
          fieldConfig.isArray ? ProductData._checkArray(fieldValue, fieldName) : ProductData._checkObject(fieldValue, fieldName);
          if (fieldConfig.keys) {
            ProductData._checkArray(fieldConfig.keys, `config_${fieldName}`);
            ProductData._checkAllowedValues(Object.keys(fieldValue), fieldConfig.keys, fieldName);
          }
          if (fieldConfig.values) {
            ProductData._checkArray(fieldConfig.values, `config_${fieldName}`);
            ProductData._checkAllowedValues(fieldValue, fieldConfig.values, fieldName);
          }
          if (fieldConfig.valuesType) {
            ProductData._checkValuesType(Object.values(fieldValue), fieldConfig.valuesType, fieldName);
          }
          break;

        default:
          throw new Error(`Проверка для типа данных ${fieldConfig.type} не предусмотрена`);
      }

      // Specific validation.
      if (fieldName === 'price') {
        for (const key in fieldValue) {
          ProductData._checkPriceValue(fieldValue[key], key);
        }
      }

      if (fieldName === 'availability') {
        for (const key in fieldValue) {
          ProductData._checkAvailabilityValue(fieldValue[key], key);
        }
      }

      if (fieldName === 'rating') {
        ProductData._checkRatingValue(fieldValue);
      }
    }

    return true;
  }

  static isProductsArrayValid(products) {
    if (!(Array.isArray(products)) || (products.length > 0 && !(products.every(obj => obj instanceof Product)))) {
      throw new Error('Для корректной работы необходим массив экземпляров Product');
    }

    return true;
  }

  // General methods for validating field types and value.
  static _checkNumber(fieldValue, fieldName) {
    if (typeof fieldValue !== 'number' || Number.isNaN(fieldValue)) {
      throw new Error(`Значение в поле ${fieldName} должно быть числом`);
    }
  }

  static _checkString(fieldValue, fieldName) {
    if (typeof fieldValue !== 'string' || fieldValue.trim() === '') {
      throw new Error(`Значение в поле ${fieldName} должно быть непустой строкой`);
    }
  }

  static _checkBoolean(fieldValue, fieldName) {
    if (typeof fieldValue !== 'boolean') {
      throw new Error(`Значение в поле ${fieldName} должно быть булевым`);
    }
  }

  static _checkObject(fieldValue, fieldName) {
    if (typeof fieldValue !== 'object' || Array.isArray(fieldValue) || fieldValue === null) {
      throw new Error(`Значение в поле ${fieldName} должно быть объектом`);
    }
  }

  static _checkArray(fieldValue, fieldName) {
    if (!(Array.isArray(fieldValue)) || fieldValue.length === 0) {
      throw new Error(`Значение в поле ${fieldName} должно быть непустым массивом`);
    }
  }

  static _checkAllowedValues(checkedValues, allowedValues, fieldName) {
    const extraFields = checkedValues.filter(value => !(allowedValues.includes(value)));

    if (extraFields.length > 0) {
      throw new Error(`Поле ${fieldName} содержит неучтенные в конфигурации значения: ${extraFields.join(', ')}`);
    }
  }

  static _checkValuesType(checkedValues, allowedType, fieldName) {
    const invalidValues = checkedValues.filter(value => typeof value !== allowedType);

    if (invalidValues.length > 0) {
      throw new Error(`Поле ${fieldName} должно содержать значения с типом данных ${allowedType}. Значения с некорректным типом: ${invalidValues.join(', ')}`);
    }
  }

  // Specific methods for validating field.
  static _checkPriceValue(value, valueName) {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error(`Поле price.${valueName} должно содержать целое число, > 0. Указано значение: ${value}`);
    }
  }

  static _checkAvailabilityValue(value, valueName) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error(`Поле availability.${valueName} должно содержать целое число, >= 0. Указано значение: ${value}`);
    }
  }

  static _checkRatingValue(value) {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error(`Поле rating должно содержать целое число, > 0. Указано значение: ${value}`);
    }
  }

}