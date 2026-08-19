import { createServerEntry } from "@tanstack/react-start/server-entry";
import { defaultStreamHandler, createStartHandler } from "@tanstack/react-start/server";

export default createServerEntry({
  fetch: createStartHandler(defaultStreamHandler),
});

