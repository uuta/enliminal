export function makeStreamResponse<T>(
  iterable: AsyncIterable<T>,
  getText: (chunk: T) => string,
): Response {
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of iterable) {
          const text = getText(chunk);
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/event-stream" } },
  );
}
