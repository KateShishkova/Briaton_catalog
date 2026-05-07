export const SVG_SPRITE_PATH = 'images/sprite.svg#';

export const CITY_NAMES = {
  moscow: 'Москва',
  orenburg: 'Оренбург',
  saintPetersburg: 'Санкт-Петербург',
};

export const PRODUCT_LIST_CONFIG = {
  'catalog__list': {
    listItemClass: 'catalog__item',
    paginationListClass: 'catalog__pagination',

    addBasketSelector: 'button[data-id], a[data-id]',
  },

  'day-products__list': {
    listItemClass: 'day-products__item',
    paginationListClass: null,

    addBasketSelector: 'button[data-id], a[data-id]',
  }
};

export const PAGINATION_LIST_CLASSES = {
  'catalog__pagination': {
    listItemClass: 'catalog__pagination-item',
    listLinkClass: 'catalog__pagination-link',
  },
};

export const PRODUCT_OBJECT_CONFIG = {
  id: {
    type: 'number',
  },
  name: {
    type: 'string',
  },
  price: {
    type: 'object',
    keys: ['new', 'old'],
    valuesType: 'number',
  },
  image: {
    type: 'string',
  },
  availability: {
    type: 'object',
    keys: ['moscow', 'orenburg', 'saintPetersburg'],
    valuesType: 'number',
  },
  type: {
    type: 'object',
    isArray: true,
    values: ['pendant', 'nightlights', 'overhead', 'point', 'ceiling'],
    valuesType: 'string',
  },
  rating: {
    type: 'number',
  },
  goodsOfDay: {
    type: 'boolean',
  },
};

export const STATEFUL_COMPONENTS_CONFIG = {
  BurgerMenu: {
    componentSelector: '.main-menu',
    controllerSelector: '.main-menu__close',

    stateClasses: {
      default: 'main-menu',
      active: 'main-menu--active',
    },
  },
  
  LocationMenu: {
    componentSelector: '.location',
    controllerSelector: '.location__city',

    stateClasses: {
      default: 'location__city',
      active: 'location__city--active',
    },

    locationSelector: '.location__city-name',
    optionsSelector: '.location__sublink',
  },

  Basket: {
    componentSelector: '.basket',
    controllerSelector: null,

    stateClasses: {
      default: 'basket',
      active: 'basket--active',
    },

    productListClass: 'basket__list',
    productItemClass: 'basket__item',

    visibleSelectorsWhenFilled: ['.basket__list', '.basket__link'],
    visibleSelectorsWhenEmpty: ['.basket__empty-block'],
  },

  AccordionItem: {
    componentSelector: '.accordion__element',
    controllerSelector: '.accordion__btn',

    stateClasses: {
      default: 'accordion__btn',
      active: 'accordion__btn--active',
    }
  },
};

export const CHECKBOX_COUNTER_CONFIG = {
  // parentSelector: counterSelector
  '.custom-checkbox': '.custom-checkbox__count',
};

export const SLIDER_CONFIG = {
  componentSelector: '.swiper',

  productListClass: 'swiper-wrapper',
  productItemClass: 'swiper-slide',
};

export const FORM_MESSAGES = {
  success: {
    iconId: 'icon-success',
    title: 'Благодарим за обращение!',
    message: 'Мы получили вашу заявку и свяжемся с вами в ближайшее время',
  },
  error: {
    iconId: 'icon-error',
    title: 'Не удалось отправить обращение',
    message: 'Что-то пошло не так, попробуйте отправить форму еще раз. Если ошибка повторится — свяжитесь со службой поддержки.',
  },
};

export const TOOLTIP_CONFIG = {
  componentSelector: '.tooltip',

  btnSelector: '.tooltip__btn',
  contentSelector: '.tooltip__content',
};