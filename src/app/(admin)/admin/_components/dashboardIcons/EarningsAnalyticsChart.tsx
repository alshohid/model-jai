"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    ChartOptions,
    Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

type Props = {
    className?: string;
};

const verticalHoverLine: Plugin<"line"> = {
    id: "verticalHoverLine",
    afterDatasetsDraw(chart) {
        const tooltip = chart.tooltip;
        if (!tooltip || !tooltip.getActiveElements().length) return;

        const { ctx, chartArea } = chart;
        const active = tooltip.getActiveElements()[0];
        const x = active.element.x;

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([3, 6]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,46,200,0.75)";
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.stroke();
        ctx.restore();
    },
};

function getOrCreateTooltipEl(chart: any) {
    let el = chart.canvas.parentNode.querySelector(".app-chart-tooltip");
    if (!el) {
        el = document.createElement("div");
        el.className = "app-chart-tooltip";
        el.style.position = "absolute";
        el.style.pointerEvents = "none";
        el.style.transform = "translate(-50%, -110%)";
        el.style.transition = "all .08s ease";
        chart.canvas.parentNode.style.position = "relative";
        chart.canvas.parentNode.appendChild(el);
    }
    return el;
}

const externalTooltipHandler = (context: any) => {
    const { chart, tooltip } = context;
    const el = getOrCreateTooltipEl(chart);

    if (tooltip.opacity === 0) {
        el.style.opacity = "0";
        return;
    }

    const title = tooltip.title?.[0] ?? "";
    const value = tooltip.dataPoints?.[0]?.raw ?? 0;

    el.innerHTML = `
    <div style="
      background:#fff;
      border-radius:10px;
      padding:10px 12px;
      min-width:160px;
      box-shadow:0 18px 45px rgba(0,0,0,.35);
      font-family:Inter, system-ui, sans-serif;
    ">
      <div style="color:#FF2EC8;font-weight:600;font-size:12px;margin-bottom:6px;">${title}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div style="display:flex;align-items:center;gap:6px;color:#222;font-size:12px;">
          <span style="color:#16a34a;font-weight:700;">↗</span>
          <span style="opacity:.8;">Income</span>
        </div>
        <div style="color:#111;font-weight:600;font-size:12px;">$${value}</div>
      </div>
    </div>
  `;

    const { offsetLeft: posX, offsetTop: posY } = chart.canvas;
    el.style.opacity = "1";
    el.style.left = posX + tooltip.caretX + "px";
    el.style.top = posY + tooltip.caretY + "px";
};

export default function EarningsAnalyticsChart({ className }: Props) {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const values = [600, 520, 780, 640, 760, 720, 610, 650, 820, 560, 430, 590];

    const data = React.useMemo(() => {
        return {
            labels,
            datasets: [
                {
                    label: "Income",
                    data: values,
                    borderColor: "#FF2EC8",
                    borderWidth: 2.5,
                    tension: 0.35,
                    fill: true,
                    pointRadius: 0,              // ✅ default hide points (like screenshot)
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 3,
                    pointHoverBorderColor: "#FF2EC8",
                    pointHoverBackgroundColor: "#FFFFFF",
                    backgroundColor: (ctx: any) => {
                        const { chart } = ctx;
                        const { ctx: c, chartArea } = chart;
                        if (!chartArea) return "rgba(255,46,200,0.20)";

                        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                        g.addColorStop(0, "rgba(255,46,200,0.30)");
                        g.addColorStop(1, "rgba(255,46,200,0.00)");
                        return g;
                    },
                },
            ],
        };
    }, []);

    const options = React.useMemo<ChartOptions<"line">>(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: false,               // ✅ we render custom tooltip
                    external: externalTooltipHandler,
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "rgba(255,255,255,0.45)", font: { size: 12 } },
                    border: { display: false },
                },
                y: {
                    ticks: { color: "rgba(255,255,255,0.45)", font: { size: 12 } },
                    grid: {
                        color: "rgba(255,255,255,0.18)",
                        borderDash: [3, 6],         // ✅ dotted horizontal grid
                    },
                    border: { display: false },
                },
            },
        };
    }, []);

    return (
        <div
            className={cn(
                "w-full rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-xl",
                "p-4 sm:p-5",
                className
            )}
        >
            <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-white font-semibold text-[16px] sm:text-[18px]">
                    Earnings Analytics
                </h3>

                <div className="px-3 py-2 rounded-[10px] bg-white/10 border border-white/10 text-white/85 text-sm">
                    Last Year ▾
                </div>
            </div>

            <div className="relative h-[260px] sm:h-[320px]">
                <Line data={data} options={options} plugins={[verticalHoverLine]} />
            </div>
        </div>
    );
}
