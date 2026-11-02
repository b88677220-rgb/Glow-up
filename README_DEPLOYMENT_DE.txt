KI-BACKEND EINRICHTEN – VERSION 17
===================================

1) Voraussetzungen
------------------
- Cloudflare-Konto mit Workers und KV.
- OpenAI API-Projekt mit API-Key und aktiver Abrechnung.
- GitHub-Pages-App unter https://b88677220-rgb.github.io

2) Cloudflare KV einrichten
---------------------------
- Cloudflare Dashboard > Storage & databases > KV > Create namespace.
- Name z. B. GLOWUP_RATE_LIMIT.
- Namespace-ID kopieren.
- In wrangler.toml den Platzhalter REPLACE_WITH_YOUR_CLOUDFLARE_KV_NAMESPACE_ID durch die echte ID ersetzen.
- Worker deployen. Alternativ KV-Binding RATE_LIMIT_KV im Worker-Dashboard exakt so anlegen.

3) Worker Secret und Variablen
------------------------------
- Secret: OPENAI_API_KEY = dein OpenAI API-Key.
- Variable: ALLOWED_ORIGIN = https://b88677220-rgb.github.io
- Variable: OPENAI_MODEL = gpt-6-luna (kostengünstige Standardwahl; nur auf ein in deinem API-Projekt verfügbares Modell ändern).

Den API-Key niemals in index.html, App, GitHub-Repository oder Chat eintragen. OpenAI verlangt serverseitige Speicherung. Siehe https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety

4) Deployen und verbinden
-------------------------
- Worker mit index.js deployen.
- Worker-URL kopieren, z. B. https://glow-up-2026-ai.<subdomain>.workers.dev
- GLOW UP > Ernährung > KI-Verbindung öffnen.
- URL eintragen, speichern, Einwilligung anhaken und Verbindung testen.

5) Eingebaute Schutzmaßnahmen
-----------------------------
- CORS-Allowlist auf ALLOWED_ORIGIN.
- Cloudflare KV Rate-Limit pro IP: maximal 5 Anfragen pro Minute und 60 pro Tag (best-effort bei parallelen Requests).
- Begrenzte Request-Größen und Aktions-spezifische Eingabelimits.
- Timeout von 25 Sekunden.
- Maximal 900 Output-Tokens.
- Responses API store=false.
- API-Key bleibt serverseitig.
- Default GPT-6 Luna statt teurerem GPT-6 Astra.

Wichtige Grenzen
----------------
- CORS ist keine Authentifizierung. Nicht autorisierte direkte Aufrufe können CORS umgehen. IP-Limits sind eine Missbrauchsbremse, keine vollständige Zugriffskontrolle.
- Cloudflare KV-Zähler sind eventual-consistent und keine atomare Abrechnungssperre. Für öffentliche Nutzung zusätzlich Authentifizierung/Turnstile, Abuse-Monitoring und harte API-Projektlimits einrichten.
- API-Nutzung wird separat vom ChatGPT-Abo abgerechnet. Prüfe Preise und setze ein Projektbudget / Usage Limits.
- KI-Antworten und Nährwerte können falsch sein. Keine medizinische Diagnose oder Therapie.


Version 19 – zusätzlicher Kosten-Schutz:
- Standardlimit: 30 KI-Anfragen pro IP und UTC-Tag sowie 5 pro Minute.
- Optional über DAILY_REQUEST_LIMIT und MINUTE_REQUEST_LIMIT anpassbar (sinnvolle Obergrenzen werden serverseitig erzwungen).
- Bei KV-Fehlern werden KI-Anfragen geschlossen blockiert (fail-closed).
- IP-Adressen werden vor dem Speichern der Limit-Schlüssel gehasht; keine Prompt-Inhalte werden für Limits gespeichert.
- Token-Obergrenzen pro Aktion: Mahlzeit 300, Rezept 650, Coach 650, Health 80.
- Das Limit ist ein Schutzgeländer, keine garantierte Euro-Ausgabenobergrenze: Cloudflare KV-Zähler sind nicht atomar und ein IP-Limit kann durch mehrere Nutzer hinter derselben IP geteilt werden. Für öffentliche Nutzung später Authentifizierung und ein echtes Ausgabenlimit beim API-Anbieter ergänzen.
