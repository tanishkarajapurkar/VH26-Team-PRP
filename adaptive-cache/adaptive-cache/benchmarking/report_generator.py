from typing import list


class ReportGenerator:
    """Generates markdown reports and charts from benchmark results."""

    def __init__(self, results: list[dict]):
        self.results = results

    def generate_markdown(self) -> str:
        """Generate a markdown summary report."""
        lines = [
            "# Adaptive Cache Benchmark Report",
            "",
            "## Summary",
            "",
            "| Policy | Scenario | Workload | Hit Rate | Total Cost | Evictions |",
            "|--------|----------|----------|----------|------------|-----------|",
        ]

        for r in self.results:
            lines.append(
                f"| {r['policy']} | {r['scenario']} | {r['workload']} | "
                f"{r['hit_rate']:.3f} | ${r['total_cost']:.4f} | {r['evictions']} |"
            )

        lines.extend([
            "",
            "## Analysis",
            "",
        ])

        # Group by scenario
        scenarios = {}
        for r in self.results:
            key = (r['scenario'], r['workload'])
            if key not in scenarios:
                scenarios[key] = []
            scenarios[key].append(r)

        for (scenario, workload), runs in scenarios.items():
            lines.append(f"### {scenario.title()} - {workload.replace('_', ' ').title()}")
            lines.append("")

            # Find best hit rate
            best = max(runs, key=lambda x: x['hit_rate'])
            lines.append(f"- **Best hit rate:** {best['policy']} ({best['hit_rate']:.3f})")

            # Find lowest cost
            cheapest = min(runs, key=lambda x: x['total_cost'])
            lines.append(f"- **Lowest cost:** {cheapest['policy']} (${cheapest['total_cost']:.4f})")

            # Adaptive comparison
            adaptive = next((r for r in runs if r['policy'] == 'adaptive'), None)
            if adaptive:
                lru = next((r for r in runs if r['policy'] == 'lru'), None)
                if lru:
                    diff = adaptive['hit_rate'] - lru['hit_rate']
                    lines.append(f"- **Adaptive vs LRU:** {'+' if diff >= 0 else ''}{diff:.3f} hit rate")

            lines.append("")

        return "\n".join(lines)

    def generate_comparison_data(self) -> dict:
        """Generate structured data for dashboard charts."""
        by_policy = {}
        for r in self.results:
            policy = r['policy']
            if policy not in by_policy:
                by_policy[policy] = []
            by_policy[policy].append(r)

        return {
            "policies": list(by_policy.keys()),
            "results": self.results,
            "by_policy": by_policy,
        }
