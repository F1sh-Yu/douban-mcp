import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client(
  {
    name: "mcp-tools-test",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

const transport = new StdioClientTransport({
  command: "node",
  args: ["dist/index.js"]
});

try {
  await client.connect(transport);
  const { tools } = await client.listTools();
  const toolNames = tools.map((tool) => tool.name);

  assert(toolNames.includes("get-movie-detail"), "Expected get-movie-detail to be registered");
  assert(toolNames.includes("get-tv-detail"), "Expected get-tv-detail to be registered");

  const searchResult = await client.callTool({
    name: "search-movie",
    arguments: { q: "霸王别姬" }
  });
  const searchText = searchResult.content[0].text;
  assert(searchText.includes("result 1:"));
  assert(searchText.includes("title: 霸王别姬"));
  assert(searchText.includes("id: 1291546"));
  assert(searchText.includes("raw_json:"));

  const movieResult = await client.callTool({
    name: "get-movie-detail",
    arguments: { id: "1291546" }
  });
  const movieText = movieResult.content[0].text;
  assert(movieText.includes("title: 霸王别姬"));
  assert(movieText.includes("type: movie"));
  assert(movieText.includes("\"id\": \"1291546\""));
  assert(movieText.includes("raw_json:"));

  const tvResult = await client.callTool({
    name: "get-tv-detail",
    arguments: { id: "2995166" }
  });
  const tvText = tvResult.content[0].text;
  assert(tvText.includes("type: tv"));
  assert(tvText.includes("\"id\": \"2995166\""));
  assert(tvText.includes("raw_json:"));

  console.log("MCP tools registered:", toolNames.join(", "));
} finally {
  await client.close();
}
