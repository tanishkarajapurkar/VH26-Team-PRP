import sys
import os
import time
import threading

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit

from core.adaptive_cache import AdaptiveCache
from core.cost_model import ReadHeavyAPICostModel, ComputeHeavyRecommenderCostModel
from workload.workload_generator import WorkloadGenerator
from workload.workload_configs import ReadHeavyAPIConfig
from workload.traffic_patterns import SpikePattern


app = Flask(__name__, template_folder='../dashboard/public', static_folder='../dashboard/public')
app.config['SECRET_KEY'] = 'adaptive-cache-hackathon'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Global state
cache = None
workload_thread = None
running = False


def create_cache():
    """Create adaptive cache instance."""
    global cache
    config = ReadHeavyAPIConfig
    cost_model = ReadHeavyAPICostModel()
    cache = AdaptiveCache(config.cache_capacity, cost_model, name="adaptive")

    # Register event callback
    def on_event(event_type, data):
        socketio.emit(event_type, data)

    cache.on_event = on_event
    return cache


def run_workload():
    """Run workload in background thread."""
    global running
    config = ReadHeavyAPIConfig
    pattern = SpikePattern(base_rate=config.request_rate)
    generator = WorkloadGenerator(config, pattern)

    now = 0.0
    snapshot_interval = 100
    request_count = 0

    running = True
    while running:
        for req in generator.generate(start_time=now):
            if not running:
                break

            now = req.time

            # Get from cache
            result = cache.get(req.key, now=now)
            if result is None:
                # Cache miss
                cache.put(req.key, f"value_{req.key}", req.size_bytes, req.miss_cost, now=now)

            request_count += 1

            # Send periodic snapshot
            if request_count % snapshot_interval == 0:
                state = cache.get_state()
                socketio.emit('metrics', {
                    'hit_rate': state['hit_rate'],
                    'request_count': state['request_count'],
                    'entries': state['entries'],
                    'size_utilization': state['size_utilization'],
                    'phase': state['weight_controller']['phase'],
                    'time': now,
                })

            # Small sleep to prevent overwhelming
            socketio.sleep(0.01)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/state')
def get_state():
    if cache:
        return jsonify(cache.get_state())
    return jsonify({"error": "Cache not initialized"})


@app.route('/api/start', methods=['POST'])
def start_workload():
    global workload_thread, running
    if workload_thread and workload_thread.is_alive():
        return jsonify({"status": "already running"})

    create_cache()
    workload_thread = threading.Thread(target=run_workload, daemon=True)
    workload_thread.start()
    return jsonify({"status": "started"})


@app.route('/api/stop', methods=['POST'])
def stop_workload():
    global running
    running = False
    return jsonify({"status": "stopped"})


@socketio.on('connect')
def handle_connect():
    print("Client connected")
    if cache:
        emit('state', cache.get_state())


@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")


def start_server(host='0.0.0.0', port=5000):
    """Start the Flask-SocketIO server."""
    create_cache()
    print(f"Starting server at http://localhost:{port}")
    socketio.run(app, host=host, port=port, debug=False, allow_unsafe_werkzeug=True)


if __name__ == '__main__':
    start_server()
