// LYNX Terminal - Main JavaScript

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        body.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update toggle icon
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    bindEvents() {
        themeToggle?.addEventListener('click', () => this.toggleTheme());
    }
}

// Mobile Menu Management
class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        navMenu?.classList.toggle('mobile-open', this.isOpen);
        
        // Update menu icon
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
            icon.className = this.isOpen ? 'fas fa-times' : 'fas fa-bars';
        }
    }

    close() {
        this.isOpen = false;
        navMenu?.classList.remove('mobile-open');
        
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }

    bindEvents() {
        mobileMenuBtn?.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !navMenu?.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
                this.close();
            }
        });
    }
}

// Chart Management
class ChartManager {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.createMiniChart();
        this.createTokenChart();
        this.createVolumeChart();
        this.bindEvents();
    }

    createMiniChart() {
        const canvas = document.getElementById('miniChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.generateSampleData(20);
        
        this.drawLineChart(ctx, data, canvas.width, canvas.height, '#00D4AA');
    }

    createTokenChart() {
        const canvas = document.getElementById('tokenChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.generateSampleData(50);
        
        this.drawCandlestickChart(ctx, data, canvas.width, canvas.height);
    }

    createVolumeChart() {
        const canvas = document.getElementById('volumeChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.generateVolumeData(20);
        
        this.drawBarChart(ctx, data, canvas.width, canvas.height, '#6C5CE7');
    }

    generateSampleData(points) {
        const data = [];
        let price = 0.4521;
        
        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * 0.02;
            price = Math.max(0.1, price + change);
            data.push({
                x: i,
                y: price,
                high: price + Math.random() * 0.01,
                low: price - Math.random() * 0.01,
                open: price - change / 2,
                close: price
            });
        }
        
        return data;
    }

    generateVolumeData(points) {
        const data = [];
        
        for (let i = 0; i < points; i++) {
            data.push({
                x: i,
                y: Math.random() * 1000000 + 500000
            });
        }
        
        return data;
    }

    drawLineChart(ctx, data, width, height, color) {
        if (data.length === 0) return;

        const padding = 10;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // Find min/max values
        const values = data.map(d => d.y);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        data.forEach((point, i) => {
            const x = padding + (i / (data.length - 1)) * chartWidth;
            const y = padding + (1 - (point.y - minValue) / valueRange) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(1, color + '00');

        ctx.beginPath();
        data.forEach((point, i) => {
            const x = padding + (i / (data.length - 1)) * chartWidth;
            const y = padding + (1 - (point.y - minValue) / valueRange) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    drawCandlestickChart(ctx, data, width, height) {
        if (data.length === 0) return;

        const padding = 20;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // Find min/max values
        const highs = data.map(d => d.high);
        const lows = data.map(d => d.low);
        const minValue = Math.min(...lows);
        const maxValue = Math.max(...highs);
        const valueRange = maxValue - minValue;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = '#2D3748';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i / 5) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw candlesticks
        const candleWidth = Math.max(2, chartWidth / data.length * 0.8);
        
        data.forEach((candle, i) => {
            const x = padding + (i + 0.5) / data.length * chartWidth;
            const openY = padding + (1 - (candle.open - minValue) / valueRange) * chartHeight;
            const closeY = padding + (1 - (candle.close - minValue) / valueRange) * chartHeight;
            const highY = padding + (1 - (candle.high - minValue) / valueRange) * chartHeight;
            const lowY = padding + (1 - (candle.low - minValue) / valueRange) * chartHeight;

            const isGreen = candle.close > candle.open;
            const color = isGreen ? '#00B894' : '#E17055';

            // Draw wick
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, highY);
            ctx.lineTo(x, lowY);
            ctx.stroke();

            // Draw body
            ctx.fillStyle = color;
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);
            ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        });

        // Draw price labels
        ctx.fillStyle = '#B2BEC3';
        ctx.font = '12px Inter';
        ctx.textAlign = 'right';
        
        for (let i = 0; i <= 5; i++) {
            const value = minValue + (maxValue - minValue) * (1 - i / 5);
            const y = padding + (i / 5) * chartHeight;
            ctx.fillText('$' + value.toFixed(4), padding - 5, y + 4);
        }
    }

    drawBarChart(ctx, data, width, height, color) {
        if (data.length === 0) return;

        const padding = 20;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // Find max value
        const maxValue = Math.max(...data.map(d => d.y));

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw bars
        const barWidth = chartWidth / data.length * 0.8;
        
        data.forEach((bar, i) => {
            const x = padding + (i + 0.1) / data.length * chartWidth;
            const barHeight = (bar.y / maxValue) * chartHeight;
            const y = height - padding - barHeight;

            ctx.fillStyle = color + '80';
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }

    bindEvents() {
        // Timeframe buttons
        const timeframeBtns = document.querySelectorAll('.time-btn');
        timeframeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                timeframeBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Regenerate chart with new timeframe
                this.createTokenChart();
            });
        });

        // Tab buttons for trading interface
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                tabBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
}

// Price Ticker
class PriceTicker {
    constructor() {
        this.prices = new Map();
        this.init();
    }

    init() {
        this.setupInitialPrices();
        this.startTicker();
    }

    setupInitialPrices() {
        this.prices.set('LYNX', { price: 0.4521, change: 12.34 });
        this.prices.set('BTC', { price: 43250, change: 2.4 });
        this.prices.set('ETH', { price: 2680, change: -1.2 });
        this.prices.set('BNB', { price: 315, change: 5.67 });
    }

    updatePrice(symbol, newPrice, change) {
        this.prices.set(symbol, { price: newPrice, change });
        this.updateDOM(symbol, newPrice, change);
    }

    updateDOM(symbol, price, change) {
        // Update price displays
        const priceElements = document.querySelectorAll(`[data-price="${symbol}"]`);
        priceElements.forEach(el => {
            el.textContent = this.formatPrice(symbol, price);
        });

        // Update change displays
        const changeElements = document.querySelectorAll(`[data-change="${symbol}"]`);
        changeElements.forEach(el => {
            el.textContent = this.formatChange(change);
            el.className = change >= 0 ? 'change positive' : 'change negative';
        });
    }

    formatPrice(symbol, price) {
        if (symbol === 'LYNX') {
            return `$${price.toFixed(4)}`;
        }
        return `$${price.toLocaleString()}`;
    }

    formatChange(change) {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(2)}%`;
    }

    startTicker() {
        setInterval(() => {
            this.prices.forEach((data, symbol) => {
                // Simulate price movement
                const volatility = symbol === 'LYNX' ? 0.001 : (symbol === 'BTC' ? 100 : 5);
                const change = (Math.random() - 0.5) * volatility;
                const newPrice = Math.max(0, data.price + change);
                const percentChange = ((newPrice - data.price) / data.price) * 100;
                
                this.updatePrice(symbol, newPrice, data.change + percentChange * 0.1);
            });
        }, 3000);
    }
}

// Wallet Connection
class WalletManager {
    constructor() {
        this.connected = false;
        this.address = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkConnection();
    }

    async connectWallet() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                
                if (accounts.length > 0) {
                    this.connected = true;
                    this.address = accounts[0];
                    this.updateConnectionStatus();
                    
                    // Switch to BSC if needed
                    await this.switchToBSC();
                }
            } else {
                this.showWalletNotFound();
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            this.showConnectionError(error.message);
        }
    }

    async switchToBSC() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }], // BSC Mainnet
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                await this.addBSCNetwork();
            }
        }
    }

    async addBSCNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x38',
                    chainName: 'Binance Smart Chain',
                    nativeCurrency: {
                        name: 'BNB',
                        symbol: 'BNB',
                        decimals: 18,
                    },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com/'],
                }],
            });
        } catch (addError) {
            console.error('Failed to add BSC network:', addError);
        }
    }

    disconnectWallet() {
        this.connected = false;
        this.address = null;
        this.updateConnectionStatus();
    }

    updateConnectionStatus() {
        const connectBtn = document.querySelector('.btn-outline');
        if (connectBtn && connectBtn.textContent.includes('Connect')) {
            if (this.connected) {
                connectBtn.textContent = `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
                connectBtn.classList.add('connected');
            } else {
                connectBtn.textContent = 'Connect Wallet';
                connectBtn.classList.remove('connected');
            }
        }
    }

    checkConnection() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts.length > 0) {
                        this.connected = true;
                        this.address = accounts[0];
                        this.updateConnectionStatus();
                    }
                });
        }
    }

    showWalletNotFound() {
        alert('MetaMask not found. Please install MetaMask to connect your wallet.');
    }

    showConnectionError(message) {
        alert(`Failed to connect wallet: ${message}`);
    }

    bindEvents() {
        const connectBtn = document.querySelector('.btn-outline');
        connectBtn?.addEventListener('click', () => {
            if (this.connected) {
                this.disconnectWallet();
            } else {
                this.connectWallet();
            }
        });
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Animation Observer
class AnimationObserver {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                { threshold: 0.1, rootMargin: '50px' }
            );

            this.observeElements();
        }
    }

    observeElements() {
        const elements = document.querySelectorAll('.feature-card, .platform-card, .analytics-card');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer?.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer?.unobserve(entry.target);
            }
        });
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new MobileMenu();
    new ChartManager();
    new PriceTicker();
    new WalletManager();
    new SmoothScroll();
    new AnimationObserver();

    // Add loading animation completion
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);

    console.log('🚀 LYNX Terminal initialized successfully!');
});

// Handle window resize
window.addEventListener('resize', () => {
    // Redraw charts on resize
    const chartManager = new ChartManager();
    setTimeout(() => {
        chartManager.createMiniChart();
        chartManager.createTokenChart();
        chartManager.createVolumeChart();
    }, 100);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Contract and Token Functions
const LYNX_CONTRACT = '0x36DC470B30C157B6a64901Fa091e3574aeFD2eB1';
const LYNX_SYMBOL = 'LYNX';
const LYNX_DECIMALS = 18;
const LYNX_IMAGE = 'https://example.com/lynx-token.png'; // Update with actual image URL

// Copy contract address to clipboard
function copyContract() {
    const contractAddress = document.getElementById('contractAddress').textContent;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(contractAddress).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopy(contractAddress);
        });
    } else {
        fallbackCopy(contractAddress);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Failed to copy: ', err);
        showCopyError();
    } finally {
        document.body.removeChild(textArea);
    }
}

// Show copy success feedback
function showCopySuccess() {
    const copyBtn = document.querySelector('.copy-btn');
    const icon = copyBtn.querySelector('i');
    
    // Change icon temporarily
    icon.className = 'fas fa-check';
    copyBtn.classList.add('copied');
    
    // Create tooltip
    showTooltip(copyBtn, 'Copied!');
    
    // Reset after 2 seconds
    setTimeout(() => {
        icon.className = 'fas fa-copy';
        copyBtn.classList.remove('copied');
    }, 2000);
}

// Show copy error feedback
function showCopyError() {
    const copyBtn = document.querySelector('.copy-btn');
    showTooltip(copyBtn, 'Failed to copy');
}

// Show tooltip
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-md);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 2000);
}

// Add LYNX token to MetaMask wallet
async function addToWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: LYNX_CONTRACT,
                        symbol: LYNX_SYMBOL,
                        decimals: LYNX_DECIMALS,
                        image: LYNX_IMAGE,
                    },
                },
            });
            
            showTooltip(event.target, 'Token added to wallet!');
        } catch (error) {
            console.error('Failed to add token to wallet:', error);
            showTooltip(event.target, 'Failed to add token');
        }
    } else {
        alert('MetaMask is not installed. Please install MetaMask to add the token to your wallet.');
    }
}

// Open BSCScan for the contract
function viewOnBSCScan() {
    const bscscanUrl = `https://bscscan.com/token/${LYNX_CONTRACT}`;
    window.open(bscscanUrl, '_blank', 'noopener,noreferrer');
}

// Social Media Links
function openTwitter() {
    window.open('https://x.com/lynx_terminal', '_blank', 'noopener,noreferrer');
}

function openTelegram() {
    // Update with actual Telegram link when available
    window.open('https://t.me/lynx_terminal', '_blank', 'noopener,noreferrer');
}

function openDiscord() {
    // Update with actual Discord link when available
    window.open('https://discord.gg/lynx_terminal', '_blank', 'noopener,noreferrer');
}

function openGithub() {
    // Update with actual GitHub link when available
    window.open('https://github.com/lynx-terminal', '_blank', 'noopener,noreferrer');
}

// Enhanced Wallet Manager with LYNX token support
class LynxWalletManager extends WalletManager {
    constructor() {
        super();
        this.lynxContract = LYNX_CONTRACT;
    }

    async getTokenBalance() {
        if (!this.connected || !window.ethereum) return 0;

        try {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract([
                {
                    "constant": true,
                    "inputs": [{"name": "_owner", "type": "address"}],
                    "name": "balanceOf",
                    "outputs": [{"name": "balance", "type": "uint256"}],
                    "type": "function"
                }
            ], this.lynxContract);

            const balance = await contract.methods.balanceOf(this.address).call();
            return web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('Failed to get token balance:', error);
            return 0;
        }
    }

    async updateTokenInfo() {
        if (this.connected) {
            const balance = await this.getTokenBalance();
            // Update UI with balance if needed
            console.log(`LYNX Balance: ${balance}`);
        }
    }
}

// Export for potential external use
window.LynxTerminal = {
    ThemeManager,
    MobileMenu,
    ChartManager,
    PriceTicker,
    WalletManager: LynxWalletManager,
    copyContract,
    addToWallet,
    viewOnBSCScan
};
