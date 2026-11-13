const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("node:crypto");

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}

const email = process.env.NEXO_INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.NEXO_INITIAL_ADMIN_PASSWORD;
const name = process.env.NEXO_INITIAL_ADMIN_NAME?.trim() || "Administrador Nexo";
if (!email || !password || password.length < 12) {
  throw new Error("Define NEXO_INITIAL_ADMIN_EMAIL, NEXO_INITIAL_ADMIN_NAME y NEXO_INITIAL_ADMIN_PASSWORD (mínimo 12 caracteres) antes de ejecutar db:seed.");
}

const prisma = new PrismaClient();
prisma.usuario.upsert({
  where: { correo: email },
  update: { nombre: name, rol: "ADMINISTRADOR", activo: true, debeCambiarPassword: false },
  create: { nombre: name, correo: email, rol: "ADMINISTRADOR", passwordHash: hashPassword(password), debeCambiarPassword: false },
}).then(() => console.log(`Administrador provisionado: ${email}`)).finally(() => prisma.$disconnect());
