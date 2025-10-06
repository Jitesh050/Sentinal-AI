from fastapi import FastAPI, UploadFile, File, Form
from crawling import crawl_website
from preprocessing import preprocess_nsl_kdd
from prediction import load_model
from network_analysis import build_graph, find_attack_paths
from firebase_sync import push_alert
import pandas as pd
import tempfile
import os

app = FastAPI()

# --- Add CORS middleware to allow frontend requests ---
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development/testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- End CORS middleware ---

model = None

def get_model():
    global model
    if model is None:
        model = load_model()
    return model

@app.post("/crawl")
def crawl(url: str = Form(...)):
    return crawl_website(url)

@app.post("/predict")
def predict_vulnerability(file: UploadFile = File(...)):
    # Assume CSV upload for prediction
    return predict(file)

@app.post("/network/graph")
def network_graph(endpoints: list, connections: list):
    G = build_graph(endpoints, connections)
    # Example: return graph info
    return {"nodes": list(G.nodes), "edges": list(G.edges)}

@app.post("/network/paths")
def attack_paths(start: str = Form(...), end: str = Form(...)):
    G = build_graph([], [])  # Load or build as needed
    return find_attack_paths(G, start, end)

@app.post("/alert")
def alert(alert_data: dict):
    push_alert(alert_data)
    return {"status": "alert pushed"}

@app.post("/fullscan")
def fullscan(url: str = Form(None), file: UploadFile = File(None), scan_type: str = Form(None)):
    # Log scan_type for debugging or branching (optional)
    print(f"[Fullscan] scan_type: {scan_type}")
    # --- Custom logic for demo: return different vulnerabilities for different URLs ---
    demo_vulns = {
        "https://testphp.vulnweb.com": [
            {
                "id": "vuln-0",
                "name": "SQL Injection in Login Form",
                "severity": "critical",
                "description": "User input in the login form is not sanitized, allowing attackers to execute arbitrary SQL commands.",
                "affectedEndpoint": "/login.php",
                "cve": "CVE-2022-1234",
                "fixAvailable": True
            },
            {
                "id": "vuln-1",
                "name": "Cross-Site Scripting (XSS)",
                "severity": "high",
                "description": "Reflected XSS vulnerability in user profile page.",
                "affectedEndpoint": "/user/profile.php",
                "cve": "CVE-2022-5678",
                "fixAvailable": True
            },
            {
                "id": "vuln-2",
                "name": "Outdated SSL Certificate",
                "severity": "medium",
                "description": "SSL certificate is expired or uses weak hashing algorithm.",
                "affectedEndpoint": "*.vulnweb.com",
                "cve": None,
                "fixAvailable": False
            }
        ],
        "https://demo.testfire.net": [
            {
                "id": "vuln-0",
                "name": "Cross-Site Scripting (XSS)",
                "severity": "critical",
                "description": "Persistent XSS in comment section.",
                "affectedEndpoint": "/comments.aspx",
                "cve": "CVE-2023-1111",
                "fixAvailable": True
            },
            {
                "id": "vuln-1",
                "name": "Insecure Cookie Settings",
                "severity": "medium",
                "description": "Cookies are not set with HttpOnly and Secure flags.",
                "affectedEndpoint": "Global",
                "cve": None,
                "fixAvailable": True
            }
        ],
        "https://juice-shop.herokuapp.com": [
            {
                "id": "vuln-0",
                "name": "Missing Rate Limiting",
                "severity": "high",
                "description": "API endpoint does not enforce rate limiting, allowing brute-force attacks.",
                "affectedEndpoint": "/rest/user/login",
                "cve": None,
                "fixAvailable": False
            }
        ],
        "https://cascade-demo.com": [
            {
                "id": "vuln-0",
                "name": "Sensitive Data Exposure",
                "severity": "critical",
                "description": "Sensitive user data is exposed via API endpoints.",
                "affectedEndpoint": "/api/user/data",
                "cve": "CVE-2024-9999",
                "fixAvailable": True
            },
            {
                "id": "vuln-1",
                "name": "Open Redirect",
                "severity": "low",
                "description": "Improper validation allows open redirects.",
                "affectedEndpoint": "/redirect",
                "cve": None,
                "fixAvailable": False
            }
        ]
    }
    # If the URL is one of our demo URLs, return the fixed vulnerabilities
    if url and url in demo_vulns:
        vulnerabilities = demo_vulns[url]
        endpoints = [v["affectedEndpoint"] for v in vulnerabilities]
        preds = [
            9 if v["severity"] == "critical" else 7 if v["severity"] == "high" else 5 if v["severity"] == "medium" else 2
            for v in vulnerabilities
        ]
        # Build dummy network graph for animation
        connections = [(endpoints[i], endpoints[i+1]) for i in range(len(endpoints)-1)] if len(endpoints) > 1 else []
        G = build_graph(endpoints, connections)
        threat_level = int(100 * sum(preds)/len(preds)) if preds else 0
        attack_paths = []
        if len(endpoints) > 1:
            try:
                attack_paths = find_attack_paths(G, endpoints[0], endpoints[-1])
            except Exception:
                attack_paths = []
        # Demo: show different alerts for each URL
        alert_map = {
            "https://testphp.vulnweb.com": [
                {"message": "SQL Injection detected on login form!", "level": "critical"},
                {"message": "XSS vulnerability found in profile.", "level": "high"}
            ],
            "https://demo.testfire.net": [
                {"message": "Persistent XSS in comments.", "level": "critical"},
                {"message": "Insecure cookie settings detected.", "level": "medium"}
            ],
            "https://juice-shop.herokuapp.com": [
                {"message": "Brute-force risk: missing rate limiting.", "level": "high"}
            ],
            "https://cascade-demo.com": [
                {"message": "Sensitive data exposure found!", "level": "critical"},
                {"message": "Open redirect risk.", "level": "low"}
            ]
        }
        # Demo attack probabilities for dropdown
        if url == "https://testphp.vulnweb.com":
            attack_probs = [
                {"type": "sql", "probability": 0.7},
                {"type": "xss", "probability": 0.2},
                {"type": "mitm", "probability": 0.1},
                {"type": "ddos", "probability": 0.0}
            ]
        elif url == "https://demo.testfire.net":
            attack_probs = [
                {"type": "xss", "probability": 0.6},
                {"type": "mitm", "probability": 0.3},
                {"type": "sql", "probability": 0.1},
                {"type": "ddos", "probability": 0.0}
            ]
        elif url == "https://juice-shop.herokuapp.com":
            attack_probs = [
                {"type": "ddos", "probability": 0.7},
                {"type": "sql", "probability": 0.2},
                {"type": "mitm", "probability": 0.1},
                {"type": "xss", "probability": 0.0}
            ]
        else:
            attack_probs = [
                {"type": "sql", "probability": 0.0},
                {"type": "mitm", "probability": 0.0},
                {"type": "ddos", "probability": 0.0},
                {"type": "xss", "probability": 0.0}
            ]
        # --- Demo chart data for ReportsPage ---
        charts_map = {
            "https://testphp.vulnweb.com": {
                "attackFrequencyData": {
                    "day": [
                        {"time": "00:00", "attacks": 6},
                        {"time": "04:00", "attacks": 3},
                        {"time": "08:00", "attacks": 8},
                        {"time": "12:00", "attacks": 15},
                        {"time": "16:00", "attacks": 9},
                        {"time": "20:00", "attacks": 5},
                    ],
                    "week": [
                        {"time": "Mon", "attacks": 12},
                        {"time": "Tue", "attacks": 18},
                        {"time": "Wed", "attacks": 20},
                        {"time": "Thu", "attacks": 25},
                        {"time": "Fri", "attacks": 19},
                        {"time": "Sat", "attacks": 7},
                        {"time": "Sun", "attacks": 10},
                    ],
                    "month": [
                        {"time": "Week 1", "attacks": 45},
                        {"time": "Week 2", "attacks": 60},
                        {"time": "Week 3", "attacks": 55},
                        {"time": "Week 4", "attacks": 70},
                    ],
                    "year": [
                        {"time": "Jan", "attacks": 100},
                        {"time": "Feb", "attacks": 120},
                        {"time": "Mar", "attacks": 130},
                        {"time": "Apr", "attacks": 140},
                        {"time": "May", "attacks": 115},
                        {"time": "Jun", "attacks": 160},
                        {"time": "Jul", "attacks": 170},
                        {"time": "Aug", "attacks": 180},
                        {"time": "Sep", "attacks": 190},
                        {"time": "Oct", "attacks": 200},
                        {"time": "Nov", "attacks": 210},
                        {"time": "Dec", "attacks": 220},
                    ]
                },
                "vulnerabilityTrendsData": {
                    "day": [
                        {"time": "00:00", "critical": 2, "high": 4, "medium": 7, "low": 8},
                        {"time": "04:00", "critical": 1, "high": 3, "medium": 6, "low": 7},
                        {"time": "08:00", "critical": 3, "high": 5, "medium": 8, "low": 9},
                        {"time": "12:00", "critical": 4, "high": 6, "medium": 8, "low": 10},
                        {"time": "16:00", "critical": 2, "high": 4, "medium": 7, "low": 8},
                        {"time": "20:00", "critical": 2, "high": 3, "medium": 6, "low": 6},
                    ],
                    "week": [
                        {"time": "Mon", "critical": 7, "high": 11, "medium": 16, "low": 21},
                        {"time": "Tue", "critical": 6, "high": 10, "medium": 15, "low": 20},
                        {"time": "Wed", "critical": 8, "high": 12, "medium": 18, "low": 23},
                        {"time": "Thu", "critical": 9, "high": 13, "medium": 19, "low": 24},
                        {"time": "Fri", "critical": 7, "high": 11, "medium": 16, "low": 21},
                        {"time": "Sat", "critical": 3, "high": 5, "medium": 10, "low": 15},
                        {"time": "Sun", "critical": 2, "high": 4, "medium": 8, "low": 13},
                    ],
                    "month": [
                        {"time": "Week 1", "critical": 14, "high": 25, "medium": 36, "low": 48},
                        {"time": "Week 2", "critical": 18, "high": 30, "medium": 45, "low": 60},
                        {"time": "Week 3", "critical": 12, "high": 20, "medium": 30, "low": 40},
                        {"time": "Week 4", "critical": 20, "high": 36, "medium": 54, "low": 72},
                    ],
                    "year": [
                        {"time": "Jan", "critical": 35, "high": 65, "medium": 95, "low": 125},
                        {"time": "Mar", "critical": 28, "high": 55, "medium": 75, "low": 110},
                        {"time": "May", "critical": 40, "high": 80, "medium": 120, "low": 150},
                        {"time": "Jul", "critical": 45, "high": 90, "medium": 130, "low": 170},
                        {"time": "Sep", "critical": 50, "high": 100, "medium": 140, "low": 180},
                        {"time": "Nov", "critical": 38, "high": 75, "medium": 110, "low": 145},
                    ]
                },
                "exploitedServicesData": [
                    {"name": "HTTP/80", "value": 40},
                    {"name": "SSH/22", "value": 18},
                    {"name": "FTP/21", "value": 12},
                    {"name": "SMB/445", "value": 15},
                    {"name": "RDP/3389", "value": 8},
                    {"name": "Other", "value": 7},
                ]
            },
            "https://demo.testfire.net": {
                "attackFrequencyData": {
                    "day": [
                        {"time": "00:00", "attacks": 2},
                        {"time": "04:00", "attacks": 3},
                        {"time": "08:00", "attacks": 5},
                        {"time": "12:00", "attacks": 6},
                        {"time": "16:00", "attacks": 7},
                        {"time": "20:00", "attacks": 4},
                    ],
                    "week": [
                        {"time": "Mon", "attacks": 6},
                        {"time": "Tue", "attacks": 8},
                        {"time": "Wed", "attacks": 12},
                        {"time": "Thu", "attacks": 10},
                        {"time": "Fri", "attacks": 9},
                        {"time": "Sat", "attacks": 5},
                        {"time": "Sun", "attacks": 4},
                    ],
                    "month": [
                        {"time": "Week 1", "attacks": 18},
                        {"time": "Week 2", "attacks": 25},
                        {"time": "Week 3", "attacks": 23},
                        {"time": "Week 4", "attacks": 30},
                    ],
                    "year": [
                        {"time": "Jan", "attacks": 55},
                        {"time": "Feb", "attacks": 60},
                        {"time": "Mar", "attacks": 75},
                        {"time": "Apr", "attacks": 80},
                        {"time": "May", "attacks": 70},
                        {"time": "Jun", "attacks": 90},
                        {"time": "Jul", "attacks": 95},
                        {"time": "Aug", "attacks": 110},
                        {"time": "Sep", "attacks": 120},
                        {"time": "Oct", "attacks": 130},
                        {"time": "Nov", "attacks": 140},
                        {"time": "Dec", "attacks": 150},
                    ]
                },
                "vulnerabilityTrendsData": {
                    "day": [
                        {"time": "00:00", "critical": 1, "high": 2, "medium": 3, "low": 4},
                        {"time": "04:00", "critical": 1, "high": 2, "medium": 3, "low": 4},
                        {"time": "08:00", "critical": 2, "high": 3, "medium": 4, "low": 5},
                        {"time": "12:00", "critical": 2, "high": 3, "medium": 4, "low": 5},
                        {"time": "16:00", "critical": 1, "high": 2, "medium": 3, "low": 4},
                        {"time": "20:00", "critical": 1, "high": 2, "medium": 3, "low": 4},
                    ],
                    "week": [
                        {"time": "Mon", "critical": 2, "high": 4, "medium": 6, "low": 8},
                        {"time": "Tue", "critical": 2, "high": 4, "medium": 6, "low": 8},
                        {"time": "Wed", "critical": 3, "high": 6, "medium": 9, "low": 12},
                        {"time": "Thu", "critical": 3, "high": 6, "medium": 9, "low": 12},
                        {"time": "Fri", "critical": 2, "high": 4, "medium": 6, "low": 8},
                        {"time": "Sat", "critical": 1, "high": 2, "medium": 3, "low": 4},
                        {"time": "Sun", "critical": 1, "high": 2, "medium": 3, "low": 4},
                    ],
                    "month": [
                        {"time": "Week 1", "critical": 4, "high": 8, "medium": 12, "low": 16},
                        {"time": "Week 2", "critical": 5, "high": 10, "medium": 15, "low": 20},
                        {"time": "Week 3", "critical": 3, "high": 6, "medium": 9, "low": 12},
                        {"time": "Week 4", "critical": 7, "high": 14, "medium": 21, "low": 28},
                    ],
                    "year": [
                        {"time": "Jan", "critical": 10, "high": 20, "medium": 30, "low": 40},
                        {"time": "Mar", "critical": 12, "high": 24, "medium": 36, "low": 48},
                        {"time": "May", "critical": 15, "high": 30, "medium": 45, "low": 60},
                        {"time": "Jul", "critical": 18, "high": 36, "medium": 54, "low": 72},
                        {"time": "Sep", "critical": 20, "high": 40, "medium": 60, "low": 80},
                        {"time": "Nov", "critical": 16, "high": 32, "medium": 48, "low": 64},
                    ]
                },
                "exploitedServicesData": [
                    {"name": "HTTP/80", "value": 12},
                    {"name": "SSH/22", "value": 8},
                    {"name": "FTP/21", "value": 6},
                    {"name": "SMB/445", "value": 7},
                    {"name": "RDP/3389", "value": 5},
                    {"name": "Other", "value": 3},
                ]
            },
            "https://juice-shop.herokuapp.com": {
                "attackFrequencyData": {
                    "day": [
                        {"time": "00:00", "attacks": 1},
                        {"time": "04:00", "attacks": 2},
                        {"time": "08:00", "attacks": 3},
                        {"time": "12:00", "attacks": 4},
                        {"time": "16:00", "attacks": 2},
                        {"time": "20:00", "attacks": 1},
                    ],
                    "week": [
                        {"time": "Mon", "attacks": 2},
                        {"time": "Tue", "attacks": 3},
                        {"time": "Wed", "attacks": 4},
                        {"time": "Thu", "attacks": 5},
                        {"time": "Fri", "attacks": 3},
                        {"time": "Sat", "attacks": 2},
                        {"time": "Sun", "attacks": 1},
                    ],
                    "month": [
                        {"time": "Week 1", "attacks": 5},
                        {"time": "Week 2", "attacks": 7},
                        {"time": "Week 3", "attacks": 6},
                        {"time": "Week 4", "attacks": 8},
                    ],
                    "year": [
                        {"time": "Jan", "attacks": 20},
                        {"time": "Feb", "attacks": 22},
                        {"time": "Mar", "attacks": 25},
                        {"time": "Apr", "attacks": 28},
                        {"time": "May", "attacks": 24},
                        {"time": "Jun", "attacks": 30},
                        {"time": "Jul", "attacks": 32},
                        {"time": "Aug", "attacks": 34},
                        {"time": "Sep", "attacks": 36},
                        {"time": "Oct", "attacks": 38},
                        {"time": "Nov", "attacks": 40},
                        {"time": "Dec", "attacks": 42},
                    ]
                },
                "vulnerabilityTrendsData": {
                    "day": [
                        {"time": "00:00", "critical": 1, "high": 1, "medium": 2, "low": 3},
                        {"time": "04:00", "critical": 1, "high": 1, "medium": 2, "low": 3},
                        {"time": "08:00", "critical": 1, "high": 2, "medium": 2, "low": 3},
                        {"time": "12:00", "critical": 1, "high": 2, "medium": 2, "low": 3},
                        {"time": "16:00", "critical": 1, "high": 1, "medium": 2, "low": 3},
                        {"time": "20:00", "critical": 1, "high": 1, "medium": 2, "low": 3},
                    ],
                    "week": [
                        {"time": "Mon", "critical": 1, "high": 2, "medium": 3, "low": 4},
                        {"time": "Tue", "critical": 1, "high": 2, "medium": 3, "low": 4},
                        {"time": "Wed", "critical": 2, "high": 3, "medium": 4, "low": 5},
                        {"time": "Thu", "critical": 2, "high": 3, "medium": 4, "low": 5},
                        {"time": "Fri", "critical": 1, "high": 2, "medium": 3, "low": 4},
                        {"time": "Sat", "critical": 1, "high": 2, "medium": 3, "low": 4},
                        {"time": "Sun", "critical": 1, "high": 2, "medium": 3, "low": 4},
                    ],
                    "month": [
                        {"time": "Week 1", "critical": 2, "high": 3, "medium": 4, "low": 5},
                        {"time": "Week 2", "critical": 3, "high": 4, "medium": 5, "low": 6},
                        {"time": "Week 3", "critical": 2, "high": 3, "medium": 4, "low": 5},
                        {"time": "Week 4", "critical": 4, "high": 5, "medium": 6, "low": 7},
                    ],
                    "year": [
                        {"time": "Jan", "critical": 4, "high": 6, "medium": 8, "low": 10},
                        {"time": "Mar", "critical": 5, "high": 7, "medium": 9, "low": 11},
                        {"time": "May", "critical": 6, "high": 8, "medium": 10, "low": 12},
                        {"time": "Jul", "critical": 7, "high": 9, "medium": 11, "low": 13},
                        {"time": "Sep", "critical": 8, "high": 10, "medium": 12, "low": 14},
                        {"time": "Nov", "critical": 9, "high": 11, "medium": 13, "low": 15},
                    ]
                },
                "exploitedServicesData": [
                    {"name": "HTTP/80", "value": 8},
                    {"name": "SSH/22", "value": 6},
                    {"name": "FTP/21", "value": 4},
                    {"name": "SMB/445", "value": 5},
                    {"name": "RDP/3389", "value": 3},
                    {"name": "Other", "value": 2},
                ]
            }
        }
        return {
            "url": url,
            "threat_level": threat_level,
            "vulnerabilities": vulnerabilities,
            "network": {
                "nodes": list(G.nodes),
                "edges": list(G.edges)
            },
            "attack_paths": attack_paths,
            "alerts": alert_map.get(url, [
                {"message": "High threat detected!", "level": "critical"} if threat_level > 75 else
                {"message": "Moderate threat detected.", "level": "warning"} if threat_level > 40 else
                {"message": "System appears safe.", "level": "info"}
            ]),
            "attackProbabilities": attack_probs,
            # --- Demo summary data for ReportsPage ---
            "totalScans": 12 if url == "https://testphp.vulnweb.com" else 7 if url == "https://demo.testfire.net" else 5 if url == "https://juice-shop.herokuapp.com" else 1,
            "totalVulnerabilities": len(vulnerabilities),
            "resolvedVulnerabilities": 2 if url == "https://testphp.vulnweb.com" else 1,
            "unresolvedVulnerabilities": max(0, len(vulnerabilities) - (2 if url == "https://testphp.vulnweb.com" else 1)),
            "attackSources": 3 if url == "https://testphp.vulnweb.com" else 2 if url == "https://demo.testfire.net" else 1,
            "charts": charts_map.get(url, {})
        }
    # --- End custom demo logic ---
    # 1. Crawl website if URL is provided
    if url:
        crawl_result = crawl_website(url)
        endpoints = crawl_result['endpoints']
        # For demonstration, create dummy connections (sequential)
        connections = [(endpoints[i], endpoints[i+1]) for i in range(len(endpoints)-1)] if len(endpoints) > 1 else []
        # Create DataFrame for ML (dummy: endpoint as feature)
        df = pd.DataFrame({'endpoint': endpoints})
    elif file:
        # 2. Or use uploaded file (assumed CSV)
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(file.file.read())
            tmp_path = tmp.name
        df = preprocess_nsl_kdd(tmp_path)
        endpoints = df.get('endpoint', list(range(len(df)))).tolist()
        connections = []
        os.unlink(tmp_path)
    else:
        return {"error": "Provide either a URL or a file."}

    # 3. Preprocessing (already done for file; for crawl, minimal)
    # (You may want to add more sophisticated preprocessing here)

    # 4. Prediction
    mdl = get_model()
    # For demonstration: if no suitable features, fill with zeros
    try:
        preds = mdl.predict(df)
    except Exception:
        preds = [0]*len(df)

    # 5. Network analysis
    G = build_graph(endpoints, connections)
    attack_paths = []
    if len(endpoints) > 1:
        try:
            attack_paths = find_attack_paths(G, endpoints[0], endpoints[-1])
        except Exception:
            attack_paths = []

    # 6. Threat level (simple: mean of preds, scale 0-100)
    threat_level = int(100 * sum(preds)/len(preds)) if preds else 0

    # 7. Build vulnerabilities table
    # Map old vulnerabilities to frontend-expected format
    vulnerabilities = []
    for idx, (ep, pred) in enumerate(zip(endpoints, preds)):
        # Dummy mapping: severity by score, name from pred, etc.
        score = int(pred)
        if score >= 8:
            severity = "critical"
        elif score >= 6:
            severity = "high"
        elif score >= 3:
            severity = "medium"
        else:
            severity = "low"
        vulnerabilities.append({
            "id": f"vuln-{idx}",
            "name": f"Vulnerability {pred}",
            "severity": severity,
            "description": f"Auto-generated vulnerability for endpoint {ep} with score {score}.",
            "affectedEndpoint": ep,
            "cve": None,
            "fixAvailable": False
        })

    # 8. Return all results
    return {
        "threat_level": threat_level,
        "vulnerabilities": vulnerabilities,
        "network": {
            "nodes": list(G.nodes),
            "edges": list(G.edges)
        },
        "attack_paths": attack_paths,
        "alerts": [
            {"message": "High threat detected!", "level": "critical"}
            if threat_level > 75 else
            {"message": "Moderate threat detected.", "level": "warning"}
            if threat_level > 40 else
            {"message": "System appears safe.", "level": "info"}
        ]
    }
