export function cls(...xs: (string | false | undefined | null)[]) {
  return xs.filter(Boolean).join(" ");
}
