// E2E test for alliteration detection through the UI
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Alliteration E2E Tests', () => {
    let browser;
    let page;
    let serverProcess;
    const serverUrl = 'http://localhost:8765';

    beforeAll(async () => {
        // Start HTTP server from dist folder
        const distFolder = resolve(__dirname, '../dist');
        serverProcess = spawn('npx', ['http-server', distFolder, '-p', '8765', '-c-1'], {
            stdio: 'pipe',
            shell: true
        });

        // Wait for server to start
        await new Promise(resolve => setTimeout(resolve, 2000));

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    });

    afterAll(async () => {
        await browser.close();
        if (serverProcess) {
            serverProcess.kill();
        }
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(serverUrl);
    });

    afterEach(async () => {
        await page.close();
    });

    test('alliteration dropdown should populate textarea', async () => {
        // Select alliteration from dropdown
        await page.select('#deviceExample', 'alliteration');

        // Wait for textarea to be populated
        await page.waitForFunction(
            () => document.querySelector('#textInput').value.length > 0,
            { timeout: 1000 }
        );

        // Get textarea value
        const textareaValue = await page.$eval('#textInput', el => el.value);

        // Should have loaded the alliteration example text
        expect(textareaValue).toContain('Peter Piper picked');
        expect(textareaValue.length).toBeGreaterThan(100);
    });

    test('sample text buttons should populate textarea', async () => {
        // Click the Churchill sample button
        await page.click('[data-sample="churchill"]');

        // Wait for textarea to be populated
        await page.waitForFunction(
            () => document.querySelector('#textInput').value.length > 0,
            { timeout: 1000 }
        );

        // Get textarea value
        const textareaValue = await page.$eval('#textInput', el => el.value);

        // Should have loaded Churchill's speech
        expect(textareaValue).toContain('We shall fight');
        expect(textareaValue.length).toBeGreaterThan(50);
    });

    test('full alliteration detection flow should find 6 instances', async () => {
        // Select alliteration example
        await page.select('#deviceExample', 'alliteration');

        // Wait for textarea to be populated
        await page.waitForFunction(
            () => document.querySelector('#textInput').value.length > 0,
            { timeout: 1000 }
        );

        // Click analyze button
        await page.click('#analyzeBtn');

        // Wait for navigation to results page
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });

        // Check if we're on results page
        const url = page.url();
        expect(url).toContain('results.html');

        // Check sessionStorage for results
        const results = await page.evaluate(() => {
            return JSON.parse(sessionStorage.getItem('analysisResult'));
        });

        expect(results).toBeTruthy();
        expect(results.highlights).toBeDefined();

        // Should detect exactly 6 alliteration instances
        const alliterations = results.highlights.filter(h => h.device === 'alliteration');
        expect(alliterations.length).toBe(6);
    });
});
