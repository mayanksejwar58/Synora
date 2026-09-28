import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Menu,
  Moon,
  Monitor,
  Search,
  Settings,
  Sun,
  X,
} from "lucide-react";

const watchedFolder = "C:\\Users\\admin\\Downloads\\ImportantPDFs";

const initialDocuments = [
  {
    id: 1,
    name: "DRDO-RAC-Scientist-B-CSE-Topics.pdf",
    pages: 2,
    status: "Processed",
    added: "Just now",
    insight: "Exam and examination information detected",
  },
  {
    id: 2,
    name: "College_Exam_Notice.pdf",
    pages: 4,
    status: "Processed",
    added: "Today",
    insight: "Registration deadline detected",
  },
  {
    id: 3,
    name: "Semester_Schedule.pdf",
    pages: 3,
    status: "Processed",
    added: "Yesterday",
    insight: "Important dates detected",
  },
];

const initialAlerts = [
  {
    id: 1,
    title: "Exam registration deadline",
    detail: "Registration must be completed by September 30.",
    priority: "High",
    source: "College_Exam_Notice.pdf",
  },
  {
    id: 2,
    title: "Semester examinations",
    detail: "Mid-semester examinations begin October 15.",
    priority: "Medium",
    source: "College_Exam_Notice.pdf",
  },
];

const initialTasks = [
  {
    id: 1,
    title: "Complete exam registration",
    due: "September 30",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Review semester examination schedule",
    due: "October 10",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Review DRDO examination topics",
    due: "No deadline",
    priority: "Low",
    completed: true,
  },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "tasks", label: "Tasks", icon: CheckCircle2 },
  { id: "settings", label: "Settings", icon: Settings },
];

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <Icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const classes = {
    High: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
    Medium:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    Low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        classes[priority] || classes.Low
      }`}
    >
      {priority}
    </span>
  );
}

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("synora-theme") === "dark"
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [monitoring, setMonitoring] = useState(true);

  const [search, setSearch] = useState("");

  const [documents, setDocuments] = useState(initialDocuments);

  const [alerts, setAlerts] = useState(initialAlerts);

  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    localStorage.setItem(
      "synora-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return documents;
    }

    return documents.filter((doc) =>
      `${doc.name} ${doc.insight}`.toLowerCase().includes(query)
    );
  }, [documents, search]);

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function removeAlert(id) {
    setAlerts((current) =>
      current.filter((alert) => alert.id !== id)
    );
  }

  function pageTitle() {
    return (
      navItems.find((item) => item.id === activePage)?.label ||
      "Dashboard"
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside
          className={`${
            sidebarOpen ? "w-72" : "w-20"
          } hidden shrink-0 border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 md:flex md:flex-col`}
        >
          <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
            {sidebarOpen ? (
              <div>
                <div className="text-xl font-bold tracking-tight">
                  Synora
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Document intelligence
                </div>
              </div>
            ) : (
              <div className="mx-auto text-xl font-bold">S</div>
            )}

            <button
              onClick={() =>
                setSidebarOpen((value) => !value)
              }
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {sidebarOpen ? (
                <ChevronLeft size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map(
              ({ id, label, icon: Icon }) => {
                const active = activePage === id;

                return (
                  <button
                    key={id}
                    onClick={() => setActivePage(id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon size={19} />

                    {sidebarOpen && label}
                  </button>
                );
              }
            )}
          </nav>

          {sidebarOpen && (
            <div className="m-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    monitoring
                      ? "bg-emerald-500"
                      : "bg-slate-400"
                  }`}
                />

                <span className="text-sm font-semibold">
                  {monitoring
                    ? "Monitoring active"
                    : "Monitoring paused"}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Synora watches your configured PDF folder
                for new documents.
              </p>
            </div>
          )}
        </aside>

        {/* MAIN */}

        <main className="min-w-0 flex-1">

          {/* HEADER */}

          <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8 dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  setSidebarOpen((value) => !value)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-xl font-bold">
                  {pageTitle()}
                </h1>

                <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                  Synora local document workspace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">

              {/* DARK/LIGHT MODE */}

              <button
                onClick={() =>
                  setDarkMode((value) => !value)
                }
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                title={
                  darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
              </button>

              {/* MONITORING STATUS */}

              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 sm:flex dark:border-slate-700">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    monitoring
                      ? "bg-emerald-500"
                      : "bg-slate-400"
                  }`}
                />

                <span className="text-xs font-semibold">
                  {monitoring ? "Monitoring" : "Paused"}
                </span>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8">

            {/* DASHBOARD */}

            {activePage === "dashboard" && (
              <div className="space-y-6">

                <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm dark:bg-slate-900 md:p-8">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

                    <div>
                      <p className="text-sm font-medium text-slate-300">
                        Welcome to Synora
                      </p>

                      <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
                        Your important PDFs,
                        organized into useful
                        actions and insights.
                      </h2>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                        Synora monitors your local folder,
                        processes new PDFs, and prepares
                        important information for review.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setMonitoring((value) => !value)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
                    >
                      <Monitor size={17} />

                      {monitoring
                        ? "Pause monitoring"
                        : "Start monitoring"}
                    </button>

                  </div>
                </section>

                {/* STATS */}

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  <StatCard
                    icon={FileText}
                    label="Documents"
                    value={documents.length}
                    description="Processed documents"
                  />

                  <StatCard
                    icon={Bell}
                    label="Alerts"
                    value={alerts.length}
                    description="Needs your attention"
                  />

                  <StatCard
                    icon={CheckCircle2}
                    label="Tasks"
                    value={tasks.length}
                    description={`${completedTasks} completed`}
                  />

                  <StatCard
                    icon={CircleAlert}
                    label="High priority"
                    value={
                      alerts.filter(
                        (a) => a.priority === "High"
                      ).length
                    }
                    description="Important alerts"
                  />

                </section>

                {/* DOCUMENTS + ALERTS */}

                <section className="grid gap-6 xl:grid-cols-3">

                  <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <h3 className="font-bold">
                          Recent documents
                        </h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Latest processed PDFs
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setActivePage("documents")
                        }
                        className="text-sm font-semibold text-slate-700 hover:underline dark:text-slate-200"
                      >
                        View all
                      </button>

                    </div>

                    <div className="mt-5 space-y-3">

                      {documents
                        .slice(0, 3)
                        .map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
                          >
                            <div className="rounded-lg bg-slate-100 p-2.5 dark:bg-slate-800">
                              <FileText size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {doc.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {doc.pages} pages · {doc.added}
                              </p>
                            </div>

                            <span className="hidden rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:block dark:bg-emerald-950/50 dark:text-emerald-300">
                              {doc.status}
                            </span>
                          </div>
                        ))}

                    </div>
                  </div>

                  {/* ALERTS */}

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

                    <h3 className="font-bold">
                      Important alerts
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Items detected from your PDFs
                    </p>

                    <div className="mt-5 space-y-3">

                      {alerts.length === 0 ? (
                        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                          No active alerts.
                        </p>
                      ) : (
                        alerts.slice(0, 3).map((alert) => (
                          <div
                            key={alert.id}
                            className="rounded-xl border border-slate-100 p-3 dark:border-slate-800"
                          >
                            <div className="flex items-start justify-between gap-2">

                              <p className="text-sm font-semibold">
                                {alert.title}
                              </p>

                              <PriorityBadge
                                priority={alert.priority}
                              />

                            </div>

                            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                              {alert.detail}
                            </p>

                          </div>
                        ))
                      )}

                    </div>
                  </div>

                </section>

                {/* WATCHED FOLDER */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <h3 className="font-bold">
                        Watched folder
                      </h3>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        PDFs arriving here will be processed
                        by the backend later.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
                      <FolderOpen size={17} />

                      <span className="max-w-[280px] truncate text-xs font-medium">
                        {watchedFolder}
                      </span>
                    </div>

                  </div>
                </section>

              </div>
            )}

            {/* DOCUMENTS */}

            {activePage === "documents" && (
              <div className="space-y-5">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>
                    <h2 className="text-2xl font-bold">
                      Documents
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      PDFs processed by Synora.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-80">

                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={17}
                    />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search documents..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-slate-500"
                    />

                  </div>

                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-b-0 sm:flex-row sm:items-center dark:border-slate-800"
                    >

                      <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                        <FileText size={22} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate font-semibold">
                          {doc.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {doc.pages} pages · {doc.added}
                        </p>

                        <p className="mt-2 text-sm">
                          Insight:{" "}
                          <span className="text-slate-600 dark:text-slate-300">
                            {doc.insight}
                          </span>
                        </p>

                      </div>

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {doc.status}
                      </span>

                    </div>
                  ))}

                  {filteredDocuments.length === 0 && (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No documents found.
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* ALERTS */}

            {activePage === "alerts" && (
              <div className="space-y-5">

                <div>
                  <h2 className="text-2xl font-bold">
                    Alerts
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Important information detected in
                    your documents.
                  </p>
                </div>

                {alerts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
                    <CheckCircle2 className="mx-auto" />

                    <p className="mt-3 font-semibold">
                      No active alerts
                    </p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                    >

                      <div className="flex items-start gap-4">

                        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                          <CircleAlert size={21} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-bold">
                              {alert.title}
                            </h3>

                            <PriorityBadge
                              priority={alert.priority}
                            />

                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {alert.detail}
                          </p>

                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Source: {alert.source}
                          </p>

                        </div>

                        <button
                          onClick={() =>
                            removeAlert(alert.id)
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                          title="Dismiss alert"
                        >
                          <X size={17} />
                        </button>

                      </div>

                    </div>
                  ))
                )}

              </div>
            )}

            {/* TASKS */}

            {activePage === "tasks" && (
              <div className="space-y-5">

                <div>
                  <h2 className="text-2xl font-bold">
                    Tasks
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Actions generated from important PDF
                    information.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

                  <div className="mb-5 flex items-center justify-between">

                    <span className="text-sm font-semibold">
                      Progress
                    </span>

                    <span className="text-sm text-slate-500">
                      {completedTasks}/{tasks.length}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                    <div
                      className="h-full rounded-full bg-slate-950 transition-all dark:bg-white"
                      style={{
                        width: `${
                          tasks.length
                            ? (completedTasks /
                                tasks.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />

                  </div>

                </div>

                <div className="space-y-3">

                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-4 rounded-2xl border p-5 ${
                        task.completed
                          ? "border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                      }`}
                    >

                      <button
                        onClick={() =>
                          toggleTask(task.id)
                        }
                        className="shrink-0"
                        aria-label="Toggle task"
                      >
                        <CheckCircle2
                          className={
                            task.completed
                              ? "text-emerald-500"
                              : "text-slate-300 dark:text-slate-600"
                          }
                        />
                      </button>

                      <div className="min-w-0 flex-1">

                        <p
                          className={`font-semibold ${
                            task.completed
                              ? "text-slate-400 line-through"
                              : ""
                          }`}
                        >
                          {task.title}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">

                          <span className="flex items-center gap-1">
                            <Clock3 size={13} />
                            {task.due}
                          </span>

                          <PriorityBadge
                            priority={task.priority}
                          />

                        </div>

                      </div>

                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* SETTINGS */}

            {activePage === "settings" && (
              <div className="space-y-5">

                <div>
                  <h2 className="text-2xl font-bold">
                    Settings
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Configure how Synora behaves on your
                    computer.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

                  {/* FOLDER */}

                  <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                    <div>
                      <p className="font-semibold">
                        Watched folder
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Folder monitored for new PDF files.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800">

                      <FolderOpen size={16} />

                      <span className="max-w-[360px] truncate text-xs">
                        {watchedFolder}
                      </span>

                    </div>

                  </div>

                  {/* MONITORING */}

                  <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">

                    <div>
                      <p className="font-semibold">
                        Monitoring
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Automatically process new PDFs.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setMonitoring((value) => !value)
                      }
                      className={`relative h-7 w-12 rounded-full transition ${
                        monitoring
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >

                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                          monitoring
                            ? "left-6"
                            : "left-1"
                        }`}
                      />

                    </button>

                  </div>

                  {/* APPEARANCE */}

                  <div className="flex items-center justify-between p-5">

                    <div>
                      <p className="font-semibold">
                        Appearance
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Choose dark or light mode.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setDarkMode((value) => !value)
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-700"
                    >

                      {darkMode ? (
                        <Sun size={16} />
                      ) : (
                        <Moon size={16} />
                      )}

                      {darkMode
                        ? "Light mode"
                        : "Dark mode"}

                    </button>

                  </div>

                </div>

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;