import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const OUT = '/opt/cursor/artifacts'
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  recordVideo: { dir: OUT, size: { width: 1440, height: 960 } },
})
const page = await context.newPage()

await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Seat Map')
await page.waitForTimeout(1800)
await page.screenshot({ path: `${OUT}/seatmap-3d-initial.png`, fullPage: true })

await page.locator('.hire-row', { hasText: 'Priya Shah' }).click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: 'Place on suggested' }).click()
await page.waitForSelector('.toast')
const toastText = await page.locator('.toast').innerText()
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/seatmap-after-assign.png`, fullPage: true })

const needDesk = await page.locator('.stat-card').nth(3).locator('.stat-value').innerText()

await page.getByRole('button', { name: 'Floor 5' }).click()
await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}/seatmap-floor5.png`, fullPage: true })

const videoPath = await page.video().path()

await context.close()
await browser.close()

console.log(
  JSON.stringify(
    {
      toastText,
      needDesk,
      videoPath,
      screenshots: [
        `${OUT}/seatmap-3d-initial.png`,
        `${OUT}/seatmap-after-assign.png`,
        `${OUT}/seatmap-floor5.png`,
      ],
    },
    null,
    2,
  ),
)
