import { Builder, By, until, Key } from 'selenium-webdriver'
import edge from 'selenium-webdriver/edge.js'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'
const service = new edge.ServiceBuilder(path.resolve('./msedgedriver.exe'))

// Debug UI: HEADLESS=false npm run e2e:edge:search:header
const headless = process.env.HEADLESS !== 'false'
const options = headless ? new edge.Options().addArguments('--headless=new') : new edge.Options()

const ART = path.join(os.tmpdir(), 'e2e-artifacts')
async function dump(driver, name='search') {
  try {
    await fs.mkdir(ART, { recursive: true })
    await fs.writeFile(path.join(ART, `${name}.html`), await driver.getPageSource())
    await fs.writeFile(path.join(ART, `${name}.png`), await driver.takeScreenshot(), 'base64')
    console.error('Artifacts at:', ART, '| URL:', await driver.getCurrentUrl())
  } catch {}
}

async function ready(d) {
  await d.wait(async () => (await d.executeScript('return document.readyState')) === 'complete', 20000)
}

async function clickSafe(d, el) {
  await d.executeScript('arguments[0].scrollIntoView({block:"center"});', el)
  await d.wait(until.elementIsVisible(el), 8000)
  await d.wait(until.elementIsEnabled(el), 8000)
  try { await el.click() } catch { await d.executeScript('arguments[0].click();', el) }
}

// Chờ **có sản phẩm**; KHÔNG tin “empty state” cho tới sau 2.5s
async function waitForCards(d, timeout = 25000) {
  const gridCard = By.css('.row .col .product-card')
  const emptyMsg = By.xpath("//*[contains(., 'Không tìm thấy sản phẩm nào.')]")
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const cards = await d.findElements(gridCard)
    if (cards.length > 0) return cards.length
    // chỉ coi empty sau 2.5s (đợi composable/API load)
    if (Date.now() - start > 2500) {
      const empties = await d.findElements(emptyMsg)
      if (empties.length > 0) return 0
    }
    await new Promise(r => setTimeout(r, 250))
  }
  throw new Error('Hết thời gian chờ kết quả')
}

async function run() {
  const d = await new Builder().forBrowser('MicrosoftEdge').setEdgeService(service).setEdgeOptions(options).build()
  try {
    // 1) HOME
    await d.get(`${BASE_URL}/`)
    await ready(d)

    // 2) Gõ vào ô header (placeholder: “Tìm kiếm sản phẩm...”)
    const input = await d.wait(
      until.elementLocated(By.xpath("//header//input[@placeholder='Tìm kiếm sản phẩm...']")), 15000
    )
    await input.clear()

    // Thử kích hoạt gợi ý: nhiều site cần >=1–2 ký tự → thử 'a', nếu ko có gợi ý thì 'ip'
    await input.sendKeys('a')

    // 3) Nếu có dropdown gợi ý → click item đầu; nếu không → bấm kính lúp (hoặc Enter)
    let suggestion
    try {
      suggestion = await d.wait(
        until.elementLocated(By.xpath("//header//div[contains(@class,'position-absolute')]//div[contains(@class,'py-1')]")),
        8000
      )
    } catch {
      // thử thêm 1 ký tự dễ match
      await input.sendKeys('p') // thành "ap"
      try {
        suggestion = await d.wait(
          until.elementLocated(By.xpath("//header//div[contains(@class,'position-absolute')]//div[contains(@class,'py-1')]")),
          8000
        )
      } catch {}
    }

    if (suggestion) {
      const text = await suggestion.getText().catch(()=> '(no text)')
      console.log('ℹ️ Chọn gợi ý:', text)
      await clickSafe(d, suggestion)
    } else {
      // Không có gợi ý → dùng nút kính lúp; nếu không có, dùng Enter
      try {
        const btn = await d.findElement(
          By.xpath("//header//input[@placeholder='Tìm kiếm sản phẩm...']/following::button[1]")
        )
        await clickSafe(d, btn)
      } catch {
        await input.sendKeys(Key.ENTER)
      }
    }

    // 4) Đợi sang /timkiem?q=...
    await d.wait(until.urlContains('/timkiem'), 15000)
    await ready(d)

    const count = await waitForCards(d)
    if (count === 0) {
      await dump(d, 'search-empty')
      throw new Error('Không có sản phẩm sau khi tìm từ header')
    }
    console.log('✅ Có', count, 'sản phẩm trong kết quả tìm kiếm')

    // 5) Click sản phẩm đầu → /sanpham/:id
    const firstLink = await d.findElement(By.css('.row .col a'))
    await clickSafe(d, firstLink)
    await d.wait(until.urlMatches(/\/sanpham\/\d+/), 15000)
    console.log('✅ Điều hướng chi tiết OK:', await d.getCurrentUrl())

    console.log('🎉 E2E Search-from-Header OK')
  } catch (e) {
    await dump(d, 'search-fail')
    throw e
  } finally {
    await d.quit()
  }
}

run().catch(e => { console.error('❌ Test fail:', e); process.exit(1) })
