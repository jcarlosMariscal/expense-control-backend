import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, last_name, email, password } = req.body;
  const defaul_picture =
    "https://cdn.mos.cms.futurecdn.net/QUEdTns68F2Hkj2dgpLFM8-1200-80.jpg";

  try {
    if (!email) {
      res.status(400).json({ error: "El email es obligatorio" });
      return;
    }
    if (!password) {
      res.status(400).json({ error: "El password es obligatorio" });
      return;
    }
    const hashedPassword = await hashPassword(password);

    const user = await prisma.create({
      data: {
        name,
        last_name,
        email,
        password: hashedPassword,
        picture: defaul_picture,
      },
    });

    const token = generateToken({ id: user.id, email: user.email });
    res.status(201).json({ token });
    console.log(token);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ error: "El email ingresado ya existe en bd" });
    }
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ error: "El email es obligatorio" });
      return;
    }
    if (!password) {
      res.status(400).json({ error: "El password es obligatorio" });
      return;
    }
    const user = await prisma.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
    const pass = user?.password || "";
    const id = user?.id || 0;
    const passwordMatch = await comparePasswords(password, pass);
    if (!passwordMatch) {
      res.status(401).json({ error: "Usuario y contraseña no coinciden." });
    }
    const token = generateToken({ id, email });
    res.status(200).json({ token });
  } catch (error: any) {
    console.log(error);
  }
};
