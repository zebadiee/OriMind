#!/usr/bin/env node

/**
 * 🌍 OriMind Universal Cross-Platform Installer
 * One script to install on any platform and architecture
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class UniversalInstaller {
    constructor() {
        this.platform = os.platform();
        this.arch = os.arch();
        this.deployDir = 'deploy';
    }

    async install() {
        console.log('🌍 OriMind Universal Cross-Platform Installer');
        console.log('==============================================');
        console.log(`🖥️  Platform: ${this.platform}`);
        console.log(`🏗️  Architecture: ${this.arch}`);
        
        try {
            switch (this.platform) {
                case 'win32':
                    await this.installWindows();
                    break;
                case 'darwin':
                    await this.installMacOS();
                    break;
                case 'linux':
                    await this.installLinux();
                    break;
                case 'freebsd':
                    await this.installFreeBSD();
                    break;
                default:
                    await this.installGeneric();
                    break;
            }
            
            console.log('🎉 Universal installation complete!');
            this.showQuickStart();
            
        } catch (error) {
            console.error('❌ Installation failed:', error.message);
            process.exit(1);
        }
    }

    async installWindows() {
        console.log('🪟 Installing for Windows...');
        const scriptPath = path.join(this.deployDir, 'windows', 'install-windows.bat');
        if (fs.existsSync(scriptPath)) {
            execSync(scriptPath, { stdio: 'inherit' });
        } else {
            console.log('⚠️  Windows installer not found, using generic installation');
            await this.installGeneric();
        }
    }

    async installMacOS() {
        console.log('🍎 Installing for macOS...');
        const scriptPath = path.join(this.deployDir, 'macos', 'install-macos.sh');
        if (fs.existsSync(scriptPath)) {
            execSync(`bash "${scriptPath}"`, { stdio: 'inherit' });
        } else {
            console.log('⚠️  macOS installer not found, using generic installation');
            await this.installGeneric();
        }
    }

    async installLinux() {
        console.log('🐧 Installing for Linux...');
        
        // Check for PowerPC
        if (this.arch.startsWith('ppc')) {
            const ppcScript = path.join(this.deployDir, 'powerpc', 'install-powerpc.sh');
            if (fs.existsSync(ppcScript)) {
                execSync(`bash "${ppcScript}"`, { stdio: 'inherit' });
                return;
            }
        }
        
        const scriptPath = path.join(this.deployDir, 'linux', 'install-linux.sh');
        if (fs.existsSync(scriptPath)) {
            execSync(`bash "${scriptPath}"`, { stdio: 'inherit' });
        } else {
            console.log('⚠️  Linux installer not found, using generic installation');
            await this.installGeneric();
        }
    }

    async installFreeBSD() {
        console.log('🔱 Installing for FreeBSD...');
        const scriptPath = path.join(this.deployDir, 'freebsd', 'install-freebsd.sh');
        if (fs.existsSync(scriptPath)) {
            execSync(`sh "${scriptPath}"`, { stdio: 'inherit' });
        } else {
            console.log('⚠️  FreeBSD installer not found, using generic installation');
            await this.installGeneric();
        }
    }

    async installGeneric() {
        console.log('🔧 Generic installation...');
        
        // Basic Node.js check
        try {
            execSync('node --version', { stdio: 'ignore' });
            console.log('✅ Node.js found');
        } catch (e) {
            throw new Error('Node.js is required but not found. Please install Node.js first.');
        }
        
        // Install dependencies
        console.log('📦 Installing dependencies...');
        try {
            execSync('npm install', { stdio: 'inherit' });
            console.log('✅ Dependencies installed');
        } catch (e) {
            throw new Error('Failed to install dependencies');
        }
        
        console.log('✅ Generic installation complete');
    }

    showQuickStart() {
        console.log('\n🚀 Quick Start:');
        console.log('================');
        
        switch (this.platform) {
            case 'win32':
                console.log('   Start: .\\start-orimind-universal.bat');
                console.log('   Stop:  .\\stop-orimind-universal.bat');
                break;
            default:
                console.log('   Start: ./start-orimind-universal.sh');
                console.log('   Stop:  ./stop-orimind-universal.sh');
                break;
        }
        
        console.log('\n🌐 Access URLs (after starting):');
        console.log('   - Chi Flow Platform: http://localhost:3002');
        console.log('   - Sherlock IDE: http://localhost:3000');
        console.log('   - ReliaKit Dashboard: http://localhost:5000');
    }
}

if (require.main === module) {
    const installer = new UniversalInstaller();
    installer.install();
}

module.exports = UniversalInstaller;