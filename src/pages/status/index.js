import useSWR from "swr";
import fetcher from "src/hooks/fetcher";

import {
  LuDatabase,
  LuGithub,
  LuNetwork,
  LuUsers,
  LuArrowUpDown,
  LuGitBranch,
  LuTriangle,
} from "react-icons/lu";

export default function StatusPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Status</h1>
      <UpdatedAt />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DatabaseStatus />
        <DatabaseVersion />
        <MaxConnections />
        <OpenConnections />
        <VercelStatus />
        <GitHubStatus />
      </div>
    </div>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetcher, {
    refreshInterval: 10000,
  });

  let updatedAtText = "Loading...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <div className="mb-4 mt-2">
      <span className="text-sm text-gray-600">
        <strong>Last updated: </strong> {updatedAtText}
      </span>
    </div>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetcher, {
    refreshInterval: 10000,
  });

  let databaseStatusText = "Loading...";
  let statusColor = "bg-[#ffea00]";

  if (!isLoading && data) {
    databaseStatusText = data.dependencies.database.version
      ? "Healthy"
      : "Degraded";
    statusColor =
      databaseStatusText === "Healthy" ? "bg-[#22c55e]" : "bg-[#ef4444]";
  }

  return (
    <div
      className="
      transform
      rounded-lg
      bg-white
      p-6
      shadow-sm
      transition
      duration-200
      hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LuDatabase className="h-6 w-6 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">Database Status</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
          <span className="text-sm font-medium text-gray-600">
            {databaseStatusText}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LuArrowUpDown className="h-4 w-4 text-gray-600" />
        <span className="text-base text-gray-600">
          <a href="https://neonstatus.com/" target="_blank">
            Click to check <strong>Neon</strong> status
          </a>
        </span>
      </div>
    </div>
  );
}

function DatabaseVersion() {
  const { isLoading, data } = useSWR("/api/v1/status", fetcher, {
    refreshInterval: 10000,
  });

  let databaseVersionText = "...";

  if (!isLoading && data) {
    databaseVersionText = data.dependencies.database.version;
  }

  return (
    <div className="transform rounded-lg bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LuGitBranch className="h-6 w-6 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">
            Database Version
          </h2>
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">
        {databaseVersionText}
      </p>
      <p className="mt-1 text-sm text-gray-500">PostgreSQL</p>
    </div>
  );
}

function MaxConnections() {
  const { isLoading, data } = useSWR("/api/v1/status", fetcher, {
    refreshInterval: 10000,
  });

  let maxConnectionsText = "...";

  if (!isLoading && data) {
    maxConnectionsText = data.dependencies.database.max_connections;
  }

  return (
    <div className="transform rounded-lg bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center justify between">
        <div className="flex items-center gap-3">
          <LuNetwork className="h-6 w-6 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">Max Connections</h2>
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">
        {maxConnectionsText}
      </p>
      <p className="mt-1 text-sm text-gray-500">Maximum allowed</p>
    </div>
  );
}

function OpenConnections() {
  const { isLoading, data } = useSWR("/api/v1/status", fetcher, {
    refreshInterval: 10000,
  });

  let openConnectionsText = "...";
  let labelText = "Connections";

  if (!isLoading && data) {
    openConnectionsText = data.dependencies.database.open_connections;
    labelText = openConnectionsText > 1 ? "Connections" : "Connection";
  }

  return (
    <div className="transform rounded-lg bg-white p-6 shadow-sm trasition duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex items-center gap-3">
          <LuUsers className="h-6 w-6 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">
            Open Connections
          </h2>
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">
        {openConnectionsText}
      </p>
      <p className="mt-1 text-sm text-gray-500">{labelText}</p>
    </div>
  );
}

function VercelStatus() {
  const { isLoading, data } = useSWR(
    "https://www.vercel-status.com/api/v2/status.json",
    fetcher,
    {
      refreshInterval: 60000,
    },
  );

  let vercelStatusText = "Loading...";
  let labelText = "Loading...";
  let statusColor = "bg-[#ffea00]";

  if (!isLoading && data) {
    vercelStatusText =
      data.status.description === "All Systems Operational"
        ? "Healthy"
        : "Degraded";
    labelText = data.status.description;
    statusColor =
      vercelStatusText === "Healthy" ? "bg-[#22c55e]" : "bg-[#ef4444]";
  }

  return (
    <div className="transform rounded-lg bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LuTriangle className="h-6 w-6 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">Vercel Status</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
          <span className="text-sm font-medium text-gray-600">
            {vercelStatusText}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LuArrowUpDown className="h-4 w-4 text-gray-600" />
        <span className="text-base text-gray-600">{labelText}</span>
      </div>
    </div>
  );
}

function GitHubStatus() {
  const { isLoading, data } = useSWR(
    "https://www.githubstatus.com/api/v2/status.json",
    fetcher,
    {
      refreshInterval: 60000,
    },
  );

  let githubStatusText = "Loading...";
  let labelText = "Loading...";
  let statusColor = "bg-[#ffea00]";

  if (!isLoading && data) {
    githubStatusText =
      data.status.description === "All Systems Operational"
        ? "Healthy"
        : "Degraded";
    labelText = data.status.description;
    statusColor =
      githubStatusText === "Healthy" ? "bg-[#22c55e]" : "bg-[#ef4444]";
  }

  return (
    <div className="transform rounded-lg bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LuGithub className="h-6 w-6 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">GitHub Status</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
          <span className="text-sm font-medium text-gray-600">
            {githubStatusText}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LuArrowUpDown className="h-4 w-4 text-gray-600" />
        <span className="text-base text-gray-600">{labelText}</span>
      </div>
    </div>
  );
}
