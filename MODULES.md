# Module und nächster Schritt

- simulation.ts: Netz, Dijkstra-Routen, feste Bewohnerpläne, deterministische Ereigniswarteschlange, echte Auto-Wartephasen, Hin-/Aufenthalts-/Rückreise mit Kapazitätsprüfung.
- worker.ts: validierte Simulation im Hintergrundthread. Kein Servermodell und keine Netzwerkabfrage.
- world.ts: Babylon-Szene, Modellhäuser, Auswahl, Bewohnerpositionen und Vorher-/Nachher-Routen.
- state.ts: Schema 1, Budget relativ zur übernommenen Basis, vollständige Undo-Entwürfe und valide Spielstandübernahme.
- main.ts: Bedienung, Vergleich, Wiedergabe und lokaler Import/Export. Noch kleine zentrale UI-Datei; erst bei notwendiger Erweiterung aufteilen.
- i18n.ts: lokale DE/EN-Präsentation. Keine Änderung der Spielschlüssel oder Bewohnernamen durch Sprachwechsel.
- server.mjs: lokaler, auf den dist-Ordner begrenzter Loopback-Dateiserver.

Nächster Entwicklungsschritt nach Review: Spielgefühl des kleinen Viertels prüfen, Ansichtsmaßstab und direkte Bauinteraktion an Jonas Feedback anpassen. Danach Ehrenfeld-Geometrie vorbereiten. Keine automatische Ausweitung auf einen vollständigen Städtebausimulator.
