# MINTERRA · aktuelle Iteration 0.3.0

Zuerst README.md, PROJECT_MAP.json, VERIFICATION.md und ../../JS_GPT_Projects/MINTERRA/RETURN_V0_3.md lesen. Alte Stadt-/13-Gärten-Konzepte sind historische Quellen.

src/puzzle/engine.ts bleibt Regelquelle. Neun feste Aufgaben, drei pro Kapitel; world.ts steuert Freischaltung. Bestehende Speicherschlüssel v1/v2 erhalten; neue Aufgaben verwenden minterra.puzzle.v3. Keine alten Lösungen blind migrieren. city.html und alte Stadtmodule erhalten.

Vor Lieferung npm test und npm run build, Browserablauf Oberwelt/Betreten/Lösen/Freischalten/Undo/Speichern sowie schmale Ansicht prüfen. Kanonische Website JS_Web/minterra; generiertes site/play nicht als Quelle ändern. Website build.py und puzzle-copy.json gemeinsam pflegen. Upload nur mit entsprechendem Auftrag und bestehendem Backup/HTTPS-Verfahren. Technische Tests beweisen keinen Spielspaß. Persönliches Review durch Jona offen.
