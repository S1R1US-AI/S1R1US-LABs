import { createFileRoute } from "@tanstack/react-router";
import { HeliosLab } from "@/components/helios-lab";

export const Route = createFileRoute("/helios")({ component: HeliosLab });
