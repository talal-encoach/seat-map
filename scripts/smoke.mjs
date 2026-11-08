import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const OUT = '/opt/cursor/artifacts'
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1400, height: 900 },
  recordVideo: { dir: OUT, size: { width: 1400, height: 900 } },
})
const page = await context.newPage()

await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Desklane')
await page.screenshot({ path: `${OUT}/desklane-initial.png`, fullPage: true })

const brand = await page.locator('h1').innerText()
const zones = await page.locator('.zone-head h2').allInnerTexts()
const queueCount = await page.locator('.hire-list .hire').count()

await page.getByRole('button', { name: /Maya Chen/i }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/desklane-hire-selected.png`, fullPage: true })

await page.getByRole('button', { name: /W-02, available/i }).click()
await page.waitForSelector('text=Maya Chen → W-02')
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/desklane-assigned.png`, fullPage: true })

const placed = await page.locator('.assigned-list li').allInnerTexts()
const deskW02 = await page.getByRole('button', { name: /W-02/i }).innerText()
const stillInQueue = await page.getByRole('button', { name: /Maya Chen/i }).count()

const videoPath = await page.video().path()
await context.close()
await browser.close()

console.log(
  JSON.stringify(
    {
      brand,
      zones,
      queueCountBeforeAssign: queueCount,
      placed,
      deskW02,
      mayaStillInQueue: stillInQueue > 0,
      videoPath,
      screenshots: [
        `${OUT}/desklane-initial.png`,
        `${OUT}/desklane-hire-selected.png`,
        `${OUT}/desklane-assigned.png`,
      ],
    },
    null,
    2,
  ),
)
