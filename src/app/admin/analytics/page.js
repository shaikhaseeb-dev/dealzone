"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAnalytics } from "@/lib/supabase";
import { formatNumber, formatPrice } from "@/lib/utils";
import {
  MousePointerClick,
  TrendingUp,
  Package,
  ArrowUpRight,
} from "lucide-react";

const COLORS = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold text-[var(--text)] mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {formatNumber(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    const { data } = await getAnalytics();

    setData(data);
  }
  if (!data) {
    return (
      <div className="p-6 text-[var(--text-secondary)]">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Analytics</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Performance overview — last 7 days
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Clicks",
            value: formatNumber(data.totalClicks),
            icon: MousePointerClick,
            change: "+12.5%",
          },
          {
            label: "Today's Clicks",
            value: formatNumber(data.todayClicks),
            icon: TrendingUp,
            change: "+8%",
          },
          {
            label: "Products",
            value: data.topProducts.length + "+",
            icon: Package,
            change: null,
          },
          {
            label: "Top CTR",
            value: "6.4%",
            icon: ArrowUpRight,
            change: "+1.1%",
          },
        ].map(({ label, value, icon: Icon, change }) => (
          <div key={label} className="card p-4">
            <Icon size={18} className="text-accent mb-3" />
            <div className="text-2xl font-bold text-[var(--text)]">{value}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">
              {label}
            </div>
            {change && (
              <div className="text-xs text-green-500 font-medium mt-1">
                {change} vs last week
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Clicks over time */}
      <div className="card p-5">
        <h2 className="font-semibold text-[var(--text)] mb-5">
          Clicks Over Time
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={data?.clicksOverTime || []}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={{ fill: "#3B82F6", r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="Clicks"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category bar chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-[var(--text)] mb-5">
            Clicks by Category
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data.categoryBreakdown}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="category"
                tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="clicks"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
                name="Clicks"
              >
                {(data?.categoryBreakdown || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-[var(--text)] mb-5">
            Distribution
          </h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={data?.categoryBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="clicks"
                >
                  {(data?.categoryBreakdown || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {(data?.categoryBreakdown || []).map((cat, i) => (
                <div
                  key={cat.category}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-[var(--text-secondary)] flex-1">
                    {cat.category}
                  </span>
                  <span className="font-semibold text-[var(--text)]">
                    {cat.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top products table */}
      <div className="card p-5">
        <h2 className="font-semibold text-[var(--text)] mb-4">
          Top Products by Performance
        </h2>
        <div className="space-y-3">
          {(data?.topProducts || []).map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-secondary)]"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                ${
                  i === 0
                    ? "bg-amber-500/20 text-amber-500"
                    : i === 1
                      ? "bg-gray-400/20 text-gray-400"
                      : i === 2
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-accent/10 text-accent"
                }`}
              >
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--text)] truncate text-sm">
                  {p.short_title || p.shortTitle || p.title}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {formatPrice(p.best_price || p.price || 0)}
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-[var(--text)]">
                  {formatNumber(p.clicks)}
                </div>
                <div className="text-xs text-[var(--text-muted)]">clicks</div>
              </div>
              {/* Bar */}
              <div className="hidden sm:block w-24 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{
                    width: `${(p.clicks / data?.topProducts?.[0]?.clicks || 1) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
