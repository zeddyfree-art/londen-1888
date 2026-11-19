# Spelregels

De actuele spelregels staan in [`data/handleiding.md`](../data/handleiding.md). Dat is dezelfde tekst als de handleiding in de app, zodat er maar één bron is.

## Balans

De slimme testspeler (`tools/testbot.js`) speelt honderden potjes per instelling en schrijft de uitkomst naar [`balans.json`](balans.json). Opnieuw meten na een wijziging:

```bash
node tools/bouw.js
node tools/testbot.js 150
```

De testspeler gebruikt geen spreuken buiten gevechten en geen heldenvermogens die je met een knop activeert. Echte spelers doen het daarom waarschijnlijk iets beter.

Doelen per stand:

| Stand | Doel |
|---|---|
| Ontspannen | Jullie winnen meestal (ongeveer 9 van de 10) |
| Normaal | Ongeveer de helft tot driekwart |
| Genadeloos | Winnen is een prestatie (1 tot 2 van de 10) |
