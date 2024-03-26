import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prisma from "../models/user";

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(404).json({ error: "El usuario no fue encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { name, last_name, email, password, picture } = req.body;
  try {
    let dataToUpdate: any = { ...req.body };
    if (password) {
      const hashedPassword = await hashPassword(password);
      dataToUpdate.password = hashedPassword;
    }
    if (email) {
      dataToUpdate.email = email;
    }
    if (name) {
      dataToUpdate.name = name;
    }
    if (last_name) {
      dataToUpdate.last_name = last_name;
    }
    if (picture) {
      dataToUpdate.picture = picture;
    }
    const user = await prisma.update({
      where: {
        id: userId,
      },
      data: dataToUpdate,
    });
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ error: "El email ingresado ya existe" });
    } else if (error?.code === "P2025") {
      res.status(404).json({ error: "Usuario no encontrado" });
    } else {
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  }
};
