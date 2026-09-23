# MINTERRA · Entwicklung

## 1. Einstieg

Quellcode und Git-Repository liegen hier. README.md, AGENTS.md und PROJECT_MAP.json nennen den aktuellen Spielstand. VERIFICATION.md enthält die bisherigen Prüfnachweise.

## 2. Voraussetzungen

Node.js 22 und npm. Abhängigkeiten mit `npm ci` aus package-lock.json installieren. Versionen in package.json sind festgehalten; node_modules wird nicht versioniert.

## 3. Bauen und starten

Im Repository: `npm run dev` für die Entwicklung auf Port 5187, `npm run build` für den Browserbuild nach dist. `MINTERRA.cmd` startet über server.mjs die vorhandene lokale Version auf Port 5188. Die separate Website liegt unter JS_Web/minterra.

## 4. Aufbau und gemeinsame Module

src/puzzle/engine.ts definiert die Spielregeln; levels.ts die Aufgaben; world.ts Fortschritt und Oberwelt. main.ts steuert die Bedienung, view.ts das Spielfeld. MODULES.md dokumentiert die Modulgrenzen. Historische Stadtmodule und city.html bleiben erhalten.

## 5. Pruefen

`npm test` führt die vorhandenen automatisierten Tests aus; `npm run build` prüft TypeScript und erzeugt den Browserbuild. Browserprüfung: Garten betreten, lösen, freischalten, Undo, speichern und schmale Ansicht. Ein GitHub-Upload ersetzt diese Produktprüfung nicht.

## 6. Daten und Konfiguration

Spielstände bleiben lokal im Browser. Die Version 0.3 verwendet minterra.puzzle.v3; ältere Speicherschlüssel bleiben erhalten. Keine persönlichen Spielstände oder Zugangsdaten in Git aufnehmen. dist und lokale Testausgaben sind ignoriert.

## 7. Stand, offene Punkte und Zusammenarbeit

Version 0.3.0: neun Rätsel und eine illustrierte Oberwelt. Fachlicher Stand und Grenzen siehe README.md und VERIFICATION.md. Technische Tests beweisen keine persönliche Gestaltungseignung oder Spielspaß. Website-Veröffentlichungen haben einen eigenen Build- und Prüfweg.
