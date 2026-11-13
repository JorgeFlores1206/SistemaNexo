import type { Request } from "express";

export type AppRole = "ADMINISTRADOR" | "USUARIO";

export type AuthenticatedUser = {
  id: string;
  nombre: string;
  correo: string;
  rol: AppRole;
  activo: boolean;
  debeCambiarPassword: boolean;
};

export type AuthenticatedRequest = Request & { user: AuthenticatedUser; sessionId: string };

export function displayRole(role: AppRole): "Administrador" | "Usuario" {
  return role === "ADMINISTRADOR" ? "Administrador" : "Usuario";
}
