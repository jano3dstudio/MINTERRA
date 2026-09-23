# MINTERRA · Build und Lieferung

Stand: 24.09.2026. [Website](https://jonaschlegelmilch.de/minterra/) · [GitHub-Releases](https://github.com/jano3dstudio/MINTERRA/releases).

## Vorbereiteter Build

`MINTERRA-0.3.0.zip` (4,471,277 Bytes), SHA-256 `bc854e4472d830b38d5f22fb2aa63531e5ab8389f9f94b72c431bae4b3eec609`.

Quelle im lokalen App-Ordner: `_Pakete/MINTERRA-0.3.0.zip`.
Startweg des bestehenden Lieferstands: `MINTERRA.cmd`.
Der Build ist ein vorhandener Lieferstand, kein frisch kompilierter oder erneut funktional abgenommener Build.
Paketintegritaet und Pruefsumme wurden geprueft. Die Release-Ablage wird separat bestaetigt; diese Datei behauptet keinen bereits erfolgten Upload.

## Selbst bauen

[Entwicklungsanleitung](DEVELOPMENT.md) · [Build-Einstieg](<package.json>).
Voraussetzungen, gepinnte SDKs und produktspezifische Tests stehen in der Entwicklungsanleitung.
Fuer gemeinsame Module benoetigt man gegebenenfalls das [MODULO-Repository](https://github.com/jano3dstudio/jano-app-kit); benachbarte Checkout-Ordner muessen den dort dokumentierten Namen behalten.
Der vorhandene lokale Build beweist keinen erfolgreichen Build aus einem frischen Checkout.

## Ordner und Daten

Quell-, Start- und Profilpfade bleiben stabil. Laufzeitdaten, Passwoerter, Testprofile und Sicherungen gehoeren nicht in Release-Pakete.
Alte Buildstaende bleiben lokal; fuer diese Lieferung wurde nur der oben genannte Kandidat ausgewaehlt.
EXE/ZIP-Dateien werden nicht in die Quellcode-Historie gezwungen. Getrennte Release-Assets enthalten SHA256SUMS.txt.

Vor oeffentlicher Weitergabe [PUBLICATION_REVIEW.md](PUBLICATION_REVIEW.md) beachten.
