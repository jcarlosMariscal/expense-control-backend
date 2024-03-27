import { Request, Response } from "express";
import prismaExpense from "../models/categoriesExpenses.model";
import prismaIncome from "../models/categoriesIncomes.model";

const createCategory =
  (prismaMethod: any) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, icon, color } = req.body;
      const category = await prismaMethod.create({
        data: { name, description, icon, color },
      });
      res.status(201).json({ data: category });
    } catch (error: any) {
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  };

const getAllCategories =
  (prismaMethod: any) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await prismaMethod.findMany();
      res.status(200).json({ data: categories });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  };
const getCategoryById =
  (prismaMethod: any) =>
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
      const category = await prismaMethod.findUnique({
        where: { id: id },
      });
      if (!category) {
        res.status(404).json({ error: "El usuario no fue encontrado" });
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  };

export const updateCategory =
  (prismaMethod: any) =>
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const { name, description, icon, color } = req.body;
    try {
      let dataToUpdate: any = { ...req.body };

      if (name) dataToUpdate.name = name;
      if (description) dataToUpdate.description = description;
      if (icon) dataToUpdate.icon = icon;
      if (color) dataToUpdate.color = color;
      const category = await prismaMethod.update({
        where: {
          id: id,
        },
        data: dataToUpdate,
      });
      res.status(200).json({ data: category });
    } catch (error: any) {
      if (error?.code === "P2025") {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  };

const deleteCategory =
  (prismaMethod: any) =>
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
      await prismaMethod.delete({ where: { id: id } });
      res
        .status(200)
        .json({ message: `La categoría ${id} ha sido eliminado.` })
        .end();
    } catch (error: any) {
      if (error?.code === "P2025") {
        res.status(404).json({ error: "Categoría no encontrado" });
        return;
      }
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  };

export const createExpenseCategory = createCategory(prismaExpense);
export const createIncomeCategory = createCategory(prismaIncome);
export const getAllExpenseCategories = getAllCategories(prismaExpense);
export const getAllIncomeCategories = getAllCategories(prismaIncome);
export const getExpenseCategoryById = getCategoryById(prismaExpense);
export const getIncomeCategoryById = getCategoryById(prismaIncome);
export const updateExpenseCategory = updateCategory(prismaExpense);
export const updateIncomeCategory = updateCategory(prismaIncome);
