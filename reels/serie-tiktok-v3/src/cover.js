const { chromium } = require('playwright');
const covers = [
  { out: '01-cover', av: 'assets/seat_av_full.jpg', avPos: '50% 62%', ap: 'assets/seat_ap.jpg', apPos: '50% 62%', title: 'Avant / Après', sub: 'Sièges & volant, chez vous' },
  { out: '02-cover', av: 'assets/clips/tapis_av/060.jpg', avPos: '50% 62%', ap: 'assets/clips/tapis_ap/040.jpg', apPos: '50% 62%', title: 'Le vrai prix', sub: 'Nettoyage à domicile · Bordeaux' },
  { out: '03-cover', av: 'assets/rear_av.jpg', avPos: '50% 80%', ap: 'assets/rear_ap.jpg', apPos: '50% 70%', pre: 'Pourquoi choisir', title: 'SublimNet ?', sub: '5 bonnes raisons' },
];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const c of covers) {
    await p.goto('http://127.0.0.1:8769/cover.html'); const fs = await p.evaluate(c => window.setup(c), c);
    await p.screenshot({ path: `covers/${c.out}.png` }); console.log(c.out, 'title', fs + 'px');
  }
  await b.close();
})();
