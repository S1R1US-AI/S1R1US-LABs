import { createFileRoute } from "@tanstack/react-router";
import { LaunchPage } from "@/components/launch-desk";

export const Route = createFileRoute("/launch")({ component: LaunchPage });
