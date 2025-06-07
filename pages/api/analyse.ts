// pages/api/analyse.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;

  if (!url || !url.includes('autoscout24.ch')) {
    return res.status(400).json({ message: 'Ungültiger Link. Nur AutoScout24.ch wird unterstützt.' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Daten aus der AutoScout24-Seite auslesen
    const title = $('h1').first().text().trim();
    const price = $('[data-testid="vehicle-price"]').first().text().trim();
    const km = $('dt:contains("Kilometer")').next().text().trim();
    const firstReg = $('dt:contains("Erstzulassung")').next().text().trim();

    return res.status(200).json({
      message: `📄 Fahrzeugdaten gefunden:\n\nTitel: ${title}\nPreis: ${price}\nKilometer: ${km}\nErstzulassung: ${firstReg}`
    });
  } catch (error) {
    return res.status(500).json({ message: 'Fehler beim Analysieren des Links.' });
  }
}
