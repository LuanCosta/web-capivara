export function formatPoliticianRole(role: string) {
  const value = role.trim().toLowerCase();
  if (value === "president") return "Pré-candidato à Presidência";
  if (value === "senator") return "Senado";
  return role.replace(/^./, (letter) => letter.toUpperCase());
}
