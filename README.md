# MINTERRA · erster spielbarer Browser-Prototyp 0.1.0

Grundlage: Spielkonzept v0.2 vom 22.09.2026 in `../../JS_GPT_Projects/MINTERRA/SPIELKONZEPT.md` (ab kanonischem App-Ordner entsprechend `../../JS_GPT_Projects` auflösen). Das Konzept bleibt dort; diese Map führt zu den ausführbaren Quellen.

## Spielen

- Veröffentlicht am 22.09.2026: https://jonaschlegelmilch.de/minterra/play/ – Veröffentlichungsnachweis in `VERIFICATION.md` prüfen.
- Lokal: Node.js 22 installieren/vorhandenen Node nutzen; `node server.mjs`, danach http://127.0.0.1:5188 öffnen. Der Server bindet nur an 127.0.0.1. `MINTERRA.cmd` vereinfacht den Start.
- Entwicklung: `npm ci`, `npm run dev`; Produktion: `npm run build`; fachliche Tests: `npm test`; Simulation ohne Grafik: `npm run bench`.

## Diese Version

Fertigkriterium: Einzelne Anschlüsse kombinieren, die Querstraße ändern, einen Grünort mit Eingang gestalten, denselben Morgen abspielen und vergleichen, Entwurf zurücknehmen/übernehmen sowie speichern und wieder laden. Drei hervorgehobene Bewohner und insgesamt 500 synthetische Personen. DE/EN-Umschaltung erhält die Sitzung. Website verwendet vorhandene MINTERRA-Gestaltung; echte Aufnahme im Media Kit.

Bedienung: links drei Werkzeuge, rechts Mara/Cem/Ruth, unten Pause/1×/5×/20×/Zeitregler/Vergleich. Leertaste pausiert. Blick drehen mit linkem Ziehen, verschieben mit rechtem Ziehen, zoomen mit Mausrad. Einzelne Verbindungen werden über vorbereitete Anschlüsse geöffnet. Im kleinen Display stehen die Werkzeuge unter der 3D-Ansicht.

Speichern erfolgt ausschließlich nach Klick im Local Storage unter `minterra.save.v1`. Laden erfolgt bewusst über „Spielstand“. Datei-Export/-Import und gezieltes Löschen der Browserkopie sind vorhanden. Ein neuer Versuch überschreibt keine gespeicherte Kopie. Sprache bleibt für die Sitzung; keine Hintergrundsimulation bei geschlossener Seite.

## Ehrliche Grenze

Dies ist ein fiktives Testviertel, noch kein OpenStreetMap-/Ehrenfeld-Import. Die dargestellte Architektur ist eine frühe geometrische Stilprobe. Keine finale visuelle Freigabe oder Spielspaßvalidierung. Keine Kampagne, Gebäudeplatzierung, freie Straßenzeichnung, Busse/Bahn, vollständiger Tages-/Nachtzyklus oder automatische Verkehrsmittelwahl. Modi und Ziele sind im Szenario festgelegt; Schul-/Arbeitsplatzverteilung ist vorbereitet, kein dynamischer Zielmarkt. Zeitfenster, erlaubte Wege, reale Reisezeiten im Modell, durchflussbegrenzte Autozufahrt und Aufenthaltskapazität werden berechnet.

Der Simulationskern verwendet einen deterministischen Ereignisablauf statt jeden Schritt mit der Bildrate zu koppeln. Er berechnet den Morgen im Worker vor; die Zeitleiste spielt die errechneten Bewegungen und Wartephasen ab. Kamera und Wiedergabegeschwindigkeit verändern diese Ergebnisse nicht. Diese vereinfachte Simulation ist keine Verkehrsprognose für Bochum. Weitere Netze können neue Tests erfordern.

500/2.000/5.000 sind gemessene Rechengrößen, keine allgemeine Grafik-Leistungszusage. Die Simulation bei 5.000 Personen ist geprüft; die Spieloberfläche startet bewusst mit 500. Weiterentwicklung erst nach Jonas Beurteilung von Entdecken, Gestalten und Beobachten.

## Ablage und Gestaltung

App-Quelle: `JS_GitHub/MINTERRA`. Website-Quelle: `JS_Web/minterra`. Domain-Ausgabe: `JS_Web/jona-fynn-schlegelmilch/site/minterra`. Keine zweite eigenständige Website im App-Repository. `media/` enthält echte Aufnahmen und Produktionsangaben.

JANO App Kit 0.2.0: feste Kopie der Web-Tokens, Autorenzeile, sichtbarer Fokus und reversible Vorgänge. Bewusste Spielanpassung: helle Grünwelt gemäß MINTERRA v0.2, keine native Fensterbasis und kein zusätzlicher Look-Editor. Die Website besitzt ihre bestehenden drei Looks. Das Website-Signet ist auch das Spielicon. Babylon.js 8.26.0 (Apache-2.0); Lizenz in `public/BABYLON-LICENSE.txt` und im Build. Arbeitstitel ohne Markenfreigabe.
