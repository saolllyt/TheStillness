import Joi from 'joi';

export const validateRegistration = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Введите корректный email',
      'any.required': 'Email обязателен'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Пароль должен быть не менее 6 символов',
      'any.required': 'Пароль обязателен'
    }),
    firstName: Joi.string().allow('', null),
    lastName: Joi.string().allow('', null),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Введите корректный email',
      'any.required': 'Email обязателен'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Пароль обязателен'
    }),
  });

  return schema.validate(data, { abortEarly: false });
};