import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            "string.empty": "Please provide a name for the contact",
            "any.required": "Name is required",
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Please provide an email address",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),
    phone: Joi.string()
        .required()
        .messages({
            "string.empty": "Please provide a phone number",
            "any.required": "Phone number is required",
        }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().messages({
        "string.empty": "Name cannot be empty",
    }),
    email: Joi.string().email().messages({
        "string.email": "Please provide a valid email address",
    }),
    phone: Joi.string().messages({
        "string.empty": "Phone number cannot be empty",
    }),
})
    .min(1)
    .unknown(false)
    .messages({
        "object.min": "Body must have at least one field",
    });
