import Joi from "joi";

const baseContactSchema = {
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
};

export const createContactSchema = Joi.object({
  ...baseContactSchema,
  name: baseContactSchema.name.required(),
  phoneNumber: baseContactSchema.phoneNumber.required(),
  contactType: baseContactSchema.contactType.required(),
});

export const updateContactSchema = Joi.object(baseContactSchema).min(1);
