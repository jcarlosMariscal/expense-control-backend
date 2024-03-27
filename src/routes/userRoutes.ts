import express from "express";
import { getUserById, updateUser } from "../controllers/userController";
import {
  createExpenseCategory,
  createIncomeCategory,
  getAllExpenseCategories,
  getAllIncomeCategories,
  getExpenseCategoryById,
  updateExpenseCategory,
  updateIncomeCategory,
} from "../controllers/categoryController";
import { authenticateToken } from "../middlewares/authenticateToken";
import { validateCategory } from "../middlewares/validateCategory";

const router = express.Router();

// Rutas relacionadas con el usuario
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);

// Rutas relacionadas con las categorías
router.use(authenticateToken); // Aplicar authenticateToken a todas las rutas debajo
router.post("/expenses/categories/", validateCategory, createExpenseCategory);
router.post("/incomes/categories/", validateCategory, createIncomeCategory);
router.get("/expenses/categories/", getAllExpenseCategories);
router.get("/incomes/categories/", getAllIncomeCategories);
router.get("/expenses/categories/:id", getExpenseCategoryById);
router.get("/incomes/categories/:id", getExpenseCategoryById);
router.put("/expenses/categories/:id", validateCategory, updateExpenseCategory);
router.put("/incomes/categories/:id", validateCategory, updateIncomeCategory);
export default router;
