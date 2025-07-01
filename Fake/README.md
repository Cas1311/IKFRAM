# MoneyMate - Persoonlijk Financieel Beheer

![MoneyMate Logo](public/logo.png)

MoneyMate is een gebruiksvriendelijke, op Vue.js 3 gebaseerde webapplicatie waarmee je je persoonlijke financiën kunt beheren. Houd je inkomsten en uitgaven bij, stel spaardoelen in en krijg inzicht in je uitgavenpatronen met duidelijke visualisaties.

## 🚀 Functies

- **Transactiebeheer**: Voeg inkomsten en uitgaven eenvoudig toe met categorieën
- **Dashboard**: Overzicht van je financiële status met duidelijke statistieken
- **Spaardoelen**: Stel doelen in en volg je voortgang
- **Rapportages**: Inzicht in je uitgavenpatronen met grafieken en overzichten
- **Responsief ontwerp**: Werkt op alle apparaten, van desktop tot mobiel
- **Offline ondersteuning**: Gegevens worden lokaal opgeslagen voor betrouwbare toegang
- **Beveiliging**: Gegevens blijven op je eigen apparaat

## 🛠 Technologieën

- **Frontend**: Vue.js 3, Vuex, Vue Router
- **UI**: Eigen componentenbibliotheek, Responsief ontwerp
- **Data**: LocalStorage (met optionele Firebase-integratie)
- **Visualisatie**: Chart.js met aangepaste componenten
- **Testing**: Vitest, Vue Test Utils
- **Bundler**: Vite

## 📦 Installatie

1. **Kloon de repository**
   ```bash
   git clone https://github.com/yourusername/moneymate.git
   cd moneymate
   ```

2. **Installeer afhankelijkheden**
   ```bash
   npm install
   ```

3. **Start de development server**
   ```bash
   npm run dev
   ```

4. **Bouw voor productie**
   ```bash
   npm run build
   ```

## 🧪 Testen

Voer unit tests uit met:

```bash
npm run test:unit
```

## 🏗 Projectstructuur

```
src/
├── assets/          # Statische bestanden (afbeeldingen, fonts, etc.)
├── components/      # Herbruikbare componenten
│   ├── charts/      # Grafiekcomponenten
│   ├── layout/      # Layoutcomponenten (header, footer, etc.)
│   ├── transactions/# Transactiegerelateerde componenten
│   └── ui/          # Algemene UI-componenten (knoppen, formulieren, etc.)
├── composables/     # Vue 3 composables
├── router/          # Router configuratie
├── services/        # Externe services en API calls
├── store/           # Vuex store modules
│   ├── modules/     # Individuele store modules
│   └── index.js     # Hoofd store configuratie
├── utils/           # Hulpfuncties en helpers
└── views/           # Paginacomponenten
```

## 🌐 Browserondersteuning

MoneyMate ondersteunt moderne webbrowsers, inclusief de laatste versies van:

- Chrome
- Firefox
- Safari
- Edge

## 🤝 Bijdragen

Bijdragen zijn welkom! Volg deze stappen om bij te dragen:

1. Fork de repository
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je wijzigingen (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 Licentie

Dit project is gelicentieerd onder de MIT-licentie - zie het [LICENSE](LICENSE) bestand voor details.

## 📧 Contact

Heb je vragen of suggesties? Neem contact op met het ontwikkelteam op contact@moneymate.app

---

💡 **Tip**: MoneyMate is ontworpen met oog voor gebruiksvriendelijkheid en prestaties. We waarderen je feedback om de applicatie verder te verbeteren!
