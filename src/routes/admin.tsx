import { createFileRoute } from "@tanstack/react-router";
import { AdminPanel } from "@/components/admin-panel";

export const Route = createFileRoute("/admin")({ component: AdminPanel });
