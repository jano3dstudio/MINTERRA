# MINTERRA 0.1.0 · Prüfung 22.09.2026

10 automatisierte Tests bestanden: deterministische Wege, echte Autowartezeiten, Sperrungen, Park-Hin-/Rückwege, Aufenthaltskapazität, kontinuierliche Bewegung, Save-Validierung, Budget/Undo und unabhängige Wiedergabe. TypeScript-Prüfung und Vite-Produktionsbuild bestanden.

Lokal im Browser geprüft: Mara 10,1 → 3,7 Minuten durch Schuldurchgang; Radstreifen verzögert Ruth mit realer Wartezeit; Garten mit Ostzugang erzeugt 16 Besuche. Vergleich, Übernahme, Rückgängig, Speichern/Laden und DE/EN geprüft. Bei 390px kein horizontaler Überlauf. Keine beobachteten Konsolenfehler. Keine Prüfung auf echtem Mobilgerät.

Node-Simulationsbenchmark auf AMD Threadripper PRO 5975WX: 500 Bewohner 41,64 ms; 2.000 80,56 ms; 5.000 192,44 ms. Kein GPU/FPS-Nachweis. Standard sind 500 Bewohner.

Früher Prototyp auf Konzept v0.2: fiktive Geometrie, festgelegte Verkehrsmittel und Ziele, kombinierbare vorbereitete Wege, kein vollständiges Ehrenfeld und kein freies Stadtbausystem. Persönlicher Spaßtest und visuelle Abnahme durch Jona offen.

Veröffentlichungsnachweis: ../../JS_Web/minterra/review/game-0.1.0/https-verification.json (wird erst nach erfolgreichem HTTPS-Abgleich erzeugt). Live-Browserprüfung bestanden: Website-Spieleinstieg, Schulweg/Vergleich, DE/EN, Desktop und 390px; keine beobachteten Konsolenfehler. Alle 90 öffentlichen Paketdateien per HTTPS SHA-256-identisch.
