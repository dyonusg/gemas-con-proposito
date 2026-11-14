export const normalizarAlias = (alias: string) => alias.trim().toLocaleLowerCase("es");
export const aliasValido = (alias: string) => alias.trim().length >= 2 && alias.trim().length <= 20;
export const rutaPublica = (path: string) => ["/", "/auth", "/reset-password", "/donar", "/donar/gracias"].includes(path);