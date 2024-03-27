import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Middleware para verificar categorias
const categorySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "El nombre es obligatorio",
    "string.empty": "El nombre no puede estar vacío",
  }),
  description: Joi.string().required().messages({
    "any.required": "La descripción es obligatorio",
    "string.empty": "La descripción no puede estar vacío",
  }),
  icon: Joi.string().required().messages({
    "any.required": "El icono es obligatorio",
    "string.empty": "El icono no puede estar vacío",
  }),
  color: Joi.string().required().messages({
    "any.required": "El color es obligatorio",
    "string.empty": "El color no puede estar vacío",
  }),
});
export const validateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
