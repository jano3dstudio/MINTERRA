<!-- licensing-20260924 -->
## Nutzung und Lizenz / Use and license

Privat und im eigenen Unternehmen kostenlos nutzbar, einschließlich eigener
Kundenarbeit. Für die eigenen lizenzierbaren Beiträge gelten wahlweise PolyForm
Noncommercial 1.0.0 oder PolyForm Internal Use 1.0.0. Verkauf der Software,
abgeleiteter Software oder kostenpflichtiges externes Hosting benötigen eine
gesonderte Erlaubnis, soweit keine andere geltende Lizenz dies bereits erlaubt.
[Lizenz](LICENSE.md) · [Beispiele / Examples](LICENSE-FAQ.md).
Fremdlizenzen und bereits erteilte Rechte bleiben erhalten. Öffentlich einsehbar
bedeutet hier nicht uneingeschränkt Open Source.
<!-- /licensing-20260924 -->

## Öffentlicher Quellstand · 24.09.2026
 
 Der Quellcode dieses persönlichen Prototyps ist öffentlich einsehbar. Der aktuelle Lizenzumfang steht in LICENSE.md; es wird keine uneingeschränkte Open-Source-Lizenz erteilt. Bestehende Rechte und Lizenzen an enthaltenen Drittanbieterkomponenten bleiben erhalten. Für weitergehende Nutzung oder Weitergabe bitte die jeweiligen Bedingungen beachten bzw. Jona kontaktieren.
 
 Die Releases sind experimentelle, vorhandene Buildstände. ZIP-Integrität und Prüfsummen sind geprüft; die Veröffentlichung ist keine neue Funktionsabnahme oder Zusicherung für produktive Arbeit. Private Profile, persönliche Daten und Zugangsdaten gehören nicht in dieses Repository.
 
 <!-- distribution-entry-20260924 -->
# MINTERRA

Browser-Puzzlespiel mit kompakten Gärten, Lösungen und lokalem Spielstand.

[Website](https://jonaschlegelmilch.de/minterra/) · [Repository](https://github.com/jano3dstudio/MINTERRA) · [Build und Download](DISTRIBUTION.md) · [Entwicklung](DEVELOPMENT.md)

Persoenliches Testprojekt / Prototyp von Jona Fynn Schlegelmilch. Idee, gestalterische Richtung und Optimierung von Jona; KI hat bei Umsetzung und Iterationen unterstuetzt. Kein zugesicherter produktiver Einsatz. Vor wichtigen Arbeiten eigene Sicherungen anlegen.

**Ablage:** Quellen und Anleitungen im Repository; ausfuehrbare Pakete als separate Release-Dateien. Repository ist öffentlich einsehbar. Oeffentliche Freigabe und Lizenzstatus: [PUBLICATION_REVIEW.md](PUBLICATION_REVIEW.md).
<!-- /distribution-entry-20260924 -->

> Veröffentlicht am 22.09.2026: Version 0.3.0 mit Oberwelt, 3 × 3 Rätseln und Geschichte. https://jonaschlegelmilch.de/minterra/play/ . 246 Dateien per HTTPS prüfsummengleich; öffentlicher Spieleinstieg, erster Garten und Rückkehr zur Oberwelt geprüft. Frühere lokale Statusangaben unten sind historisch.

# MINTERRA · Ein Garten kommt zurück · 0.3.0

Lokale Iteration vom 22.09.2026. Start: `MINTERRA.cmd` (Node.js), http://127.0.0.1:5188/. Öffentlich bleibt vorerst die freigegebene 0.2.0.

Neun Rätsel in drei Dreiergruppen: gemeinsames Bewegen, Pflanzkästen, Tore. Jeder Dreierabschluss öffnet einen Bereich der illustrierten Oberwelt. Orte mit Maus oder Pfeiltasten wählen, Enter oder „Garten betreten“. Es ist eine Wegkarte mit Figuren, keine frei begehbare 3D-Welt. Die Geschichte um Mara, Cem und Ruth führt vom Hof über Dachgärten zum Gewächshaus. Blüten, Lichtwelle, Figurenbewegung und optionaler Ton belohnen gelöste Gärten. Reduzierte Bewegung wird respektiert.

Pfeiltasten/WASD und Richtungstasten bewegen; Swipe im Spielfeld. Z: Undo, R: Neustart, Escape: Oberwelt. Drei Aufgaben pro neuer Mechanik. Innerhalb eines offenen Kapitels freie Auswahl. Ein laufender Versuch bleibt beim Besuch der Oberwelt erhalten.

Speichern erst über „Fortschritt merken“. Neuer Schlüssel `minterra.puzzle.v3`, Export/Löschen im Gartenbuch. Ältere Schlüssel `minterra.puzzle.v2` und `minterra.save.v1` bleiben erhalten; keine falsche Fortschrittsübertragung zwischen unterschiedlichen Rätseln. Kein Konto, keine externen Ressourcen. Historische Stadtversion unter `city.html`.

Aktuelles Konzept: ../../JS_GPT_Projects/MINTERRA/RETURN_V0_3.md. `npm test` prüft 20 Tests; `npm run build` erstellt den Browserbuild. `src/puzzle/engine.ts` ist die Regelquelle; levels.ts feste Aufgaben; world.ts Fortschritt und Oberwelt; main.ts Bedienung; view.ts Spielfeld; style.css plus return.css Gestaltung. `tests/check-next.ts` prüft Referenzlösungen. `tests/make-levels.ts` ist das historische 0.2-Entwurfswerkzeug und soll nicht auf die neue Fassung angewendet werden.

Spielspaß und Gestaltung bleiben Jonas Review. Keine Beteiligung oder Autorenschaft Jonathan Blows oder Tim Cains.


## GitHub-Ablage

MINTERRA – Browser-Puzzlespiel mit kompakten Gärten, Lösungen und lokalem Spielstand.

Repository: `jano3dstudio/MINTERRA` (öffentlich einsehbar). Quellen, Build-Anleitung und Projektregeln werden versioniert. Persönliche Laufzeitdaten, Zugangsdaten und lokale Sicherungen gehören nicht in Git. Bestehende lokale Start- und Quellpfade bleiben erhalten. Der Upload ist eine Quellcodesicherung; technische Prüfstände und persönliche Freigabe stehen separat in der Projektdokumentation.
