export const siteConfig = {
  name: "BrewOS",
  tagline: "Sistema de Gestión de Producción Artesanal",
  company: "Insular Origins",
  author: "Carlos Romero Ramírez",
  version: "0.1.0 Alpha",
  loginRoute: "/login",
  defaultRoute: "/control-center",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://tv.quillotana.cl",
} as const;
