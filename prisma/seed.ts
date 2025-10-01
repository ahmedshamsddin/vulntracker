import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.vulnerability.create({
    data: {
      title: "SQL Injection in login form",
      description: "User input not sanitized allowing ' OR 1=1 --",
      severity: "HIGH",
      status: "OPEN",
      tags: {
        create: [{ name: "sqli" }, { name: "auth" }],
      },
    },
  });

  await prisma.vulnerability.create({
    data: {
      title: "Reflected XSS on search",
      description: "q parameter reflected without encoding",
      severity: "MEDIUM",
      status: "IN_PROGRESS",
      tags: {
        create: [{ name: "xss" }],
      },
    },
  });

  await prisma.vulnerability.create({
    data: {
      title: "Privilege escalation via misconfig",
      description: "Role check missing on /admin routes",
      severity: "CRITICAL",
      status: "OPEN",
      tags: {
        create: [{ name: "auth" }, { name: "acl" }],
      },
    },
  });

  await prisma.user.create({
  data: {
    name: "Admin",
    email: "admin@example.com",
    role: "ADMIN",
  },
});

}

main().finally(() => prisma.$disconnect());
