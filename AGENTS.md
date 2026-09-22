# MINTERRA

Zuerst README.md, PROJECT_MAP.json und VERIFICATION.md lesen. Maßgebliches Konzept: ../../JS_GPT_Projects/MINTERRA/SPIELKONZEPT.md v0.2. Diesen Konzeptbestand nicht duplizieren oder still ändern.

src/simulation.ts ist die einzige Verkehrswahrheit. src/world.ts rendert ausschließlich berechnete Zustände. src/state.ts schützt Budget, Speicherung und Undo. Keine erfundenen Folgen für grüne Maßnahmen. Fiktive Geometrie nicht als Bochum ausgeben. Bestehende Spielstände nicht zurücksetzen; Schemaänderungen migrieren.

JANO-App-Kit DESIGN_SYSTEM.md, PROJECT_START.md und JANO_APPS_REGISTRY.md berücksichtigen. Website liegt in ../../JS_Web/minterra; build.py erzeugt ihre Vorlage. Öffentliche Dateien in site/play sind abgeleitete Ausgabe, keine Quellcodebasis. Upload nur des konkret beauftragten Pakets, mit bestehendem FTPS-Backup und HTTPS-Prüfsummenvergleich. Keine Veröffentlichung allein aus einer Quellcodeänderung ableiten.

Vor Lieferung: npm test, npm run build, Browserprüfung des echten Builds einschließlich Bau/Undo/Vergleich/Pause/Laden, statische zentrale Rechtslinks und mindestens eine schmale Ansicht. Technische Prüfung und Jonas Gestaltung/Spielspaßreview unterscheiden.
