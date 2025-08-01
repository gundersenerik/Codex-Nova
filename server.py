#!/usr/bin/env python3
import http.server
import socketserver
import os

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()
        http.server.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        # Set CORS headers
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        
        # Set correct MIME type for WASM files
        if self.path.endswith('.wasm'):
            self.send_header("Content-Type", "application/wasm")
            print(f"Serving {self.path} as application/wasm")

    def guess_type(self, path):
        mimetype = super().guess_type(path)
        if path.endswith('.wasm'):
            return 'application/wasm'
        return mimetype

PORT = 8080
Handler = MyHTTPRequestHandler

print(f"Server starting on port {PORT}")
print(f"Visit http://localhost:{PORT}")
print("WASM files will be served with correct MIME type")
print("Press Ctrl+C to stop\n")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()