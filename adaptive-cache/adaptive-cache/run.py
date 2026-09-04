#!/usr/bin/env python3
"""Main entry point for Adaptive Cache System."""

import sys
import os
import argparse

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def main():
    parser = argparse.ArgumentParser(description='Adaptive Cache Management System')
    subparsers = parser.add_subparsers(dest='command', help='Command to run')

    # Demo command
    demo_parser = subparsers.add_parser('demo', help='Run the demo scenario')
    demo_parser.add_argument('--duration', type=float, default=120.0, help='Demo duration in seconds')

    # Server command
    server_parser = subparsers.add_parser('server', help='Start the dashboard server')
    server_parser.add_argument('--host', default='0.0.0.0', help='Host to bind to')
    server_parser.add_argument('--port', type=int, default=5000, help='Port to listen on')

    # Benchmark command
    bench_parser = subparsers.add_parser('benchmark', help='Run benchmark suite')
    bench_parser.add_argument('--output', default='benchmark_results.md', help='Output file')

    args = parser.parse_args()

    if args.command == 'demo':
        from demo_surge import run_demo
        run_demo()

    elif args.command == 'server':
        from server.app import start_server
        start_server(host=args.host, port=args.port)

    elif args.command == 'benchmark':
        from benchmarking.benchmark_runner import BenchmarkRunner
        from benchmarking.report_generator import ReportGenerator

        runner = BenchmarkRunner()
        print("Running benchmark suite (24 runs)...")
        results = runner.run_all(verbose=True)

        report = ReportGenerator(results)
        md = report.generate_markdown()

        with open(args.output, 'w') as f:
            f.write(md)
        print(f"\nReport saved to {args.output}")

    else:
        parser.print_help()


if __name__ == '__main__':
    main()
