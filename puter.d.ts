declare module "puterjs" {
  interface PuterAI {
    complete(prompt: string, options?: { model?: string; temperature?: number }): Promise<{
      text?: string;
      choices?: Array<{ message: { content: string } }>;
    }>;
  }

  interface Puter {
    ai: PuterAI;
  }

  const puter: Puter;
  export default puter;
}
