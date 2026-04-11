import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { searchPlans, type SearchPlansArgs } from "./tools/search-plans.js";
import { listProviders } from "./tools/list-providers.js";
import { getDeals } from "./tools/get-deals.js";
import { checkDeviceCompatibility } from "./tools/check-device.js";
import { listCountries } from "./tools/list-countries.js";

export function createServer(): Server {
  const server = new Server(
    {
      name: "esimagent-mcp",
      version: "0.2.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "search_esim_plans",
        description:
          "Search eSIM data plans for a specific country. Returns plans ranked by server-side relevance (matchScore, valueScore) with deal-fused finalPriceUSD and affiliate purchase links. Pass optional duration and data bands to get opinionated matches; omit bands to get the full catalog sorted by value. Data bands exclude unlimited plans — omit them to see unlimited.",
        inputSchema: {
          type: "object" as const,
          properties: {
            country: {
              type: "string",
              description:
                'ISO 3166-1 alpha-2 country code (e.g., "JP", "US") or country name (e.g., "Japan")',
            },
            minDays: {
              type: "integer",
              minimum: 1,
              maximum: 365,
              description: "Minimum plan duration in days (inclusive)",
            },
            maxDays: {
              type: "integer",
              minimum: 1,
              maximum: 365,
              description: "Maximum plan duration in days (inclusive)",
            },
            minGb: {
              type: "number",
              minimum: 0,
              maximum: 1000,
              description:
                "Minimum plan data capacity in GB (inclusive). Setting this excludes unlimited plans.",
            },
            maxGb: {
              type: "number",
              minimum: 0,
              maximum: 1000,
              description:
                "Maximum plan data capacity in GB (inclusive). Setting this excludes unlimited plans.",
            },
          },
          required: ["country"],
        },
      },
      {
        name: "list_providers",
        description:
          "List all available eSIM providers with ratings, features, and links.",
        inputSchema: {
          type: "object" as const,
          properties: {},
        },
      },
      {
        name: "get_deals",
        description:
          "Get current active eSIM deals, discounts, and promo codes.",
        inputSchema: {
          type: "object" as const,
          properties: {},
        },
      },
      {
        name: "check_device_compatibility",
        description:
          "Check if a specific phone or tablet supports eSIM and get installation instructions.",
        inputSchema: {
          type: "object" as const,
          properties: {
            device: {
              type: "string",
              description:
                'Device name (e.g., "iPhone 15 Pro", "Galaxy S24", "Pixel 9")',
            },
          },
          required: ["device"],
        },
      },
      {
        name: "list_supported_countries",
        description:
          "List countries where eSIM plans are available. Use this to find the right country code for search_esim_plans.",
        inputSchema: {
          type: "object" as const,
          properties: {
            search: {
              type: "string",
              description:
                "Optional filter to search by country name or code",
            },
          },
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let text: string;

      switch (name) {
        case "search_esim_plans":
          text = await searchPlans(args as unknown as SearchPlansArgs);
          break;
        case "list_providers":
          text = await listProviders();
          break;
        case "get_deals":
          text = await getDeals();
          break;
        case "check_device_compatibility":
          text = checkDeviceCompatibility(args as unknown as { device: string });
          break;
        case "list_supported_countries":
          text = listCountries(args as unknown as { search?: string });
          break;
        default:
          text = `Unknown tool: ${name}. Available tools: search_esim_plans, list_providers, get_deals, check_device_compatibility, list_supported_countries.`;
      }

      return { content: [{ type: "text", text }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error executing ${name}: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

export async function startServer(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
