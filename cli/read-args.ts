export const readArgs = () =>
  Deno.args
    .filter((d) => d.startsWith("--"))
    .reduce(
      (
        r: Record<string, string | boolean>,
        d: string,
      ): Record<string, string | boolean> => {
        const [arg, value] = d.split("=");
        return { ...r, [arg.substring(2)]: value || true };
      },
      {},
    );
