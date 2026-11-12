import * as Generator from "@effect/graphql-generator/Generator";
import * as NodeServices from "@effect/platform-node/NodeServices";
import { assert, it } from "@effect/vitest";
import * as Effect from "effect/Effect";

import config from "../../graphql.config.ts";

// Each version has https://docs.github.com/public/ghes-<version>/schema.docs-enterprise.graphql in
// `schema/`. GitHub publishes supported versions only, and 3.19 is the oldest of them.
it.effect.each(["3.19"])(
  "Enterprise Server %s accepts every document outside githubDotCom",
  (version) =>
    Generator.generate(
      {
        ...config,
        schema: `./schema/github-enterprise-${version}.graphql`,
        documents: ["src/server/*.graphql"],
      },
      { cwd: `${import.meta.dirname}/../..` },
    ).pipe(
      Effect.map(({ diagnostics }) => assert.deepStrictEqual(diagnostics, [])),
      Effect.provide(NodeServices.layer),
    ),
);
