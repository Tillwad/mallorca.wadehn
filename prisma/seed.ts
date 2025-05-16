// prisma/seed.ts
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  const password = await hash("TillWadehn15.", 10);

  const admin = await prisma.user.upsert({
    where: { email: "till.wadehn@gmail.com" },
    update: { role: "FAMILY" },
    create: {
      email: "till.wadehn@gmail.com",
      name: "Till Wadehn",
      passwordHash: password,
      role: "FAMILY",
      mustChangePassword: false,
    },
  });

  console.log("Admin-User erstellt:", admin);
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit());
