// 全局变量
let currentVideoData = null;
const CORRECT_PASSWORD = '123456';
const API_BASE_URL = 'https://api.guijianpan.com/waterRemoveDetail/xxmQsyByAk';
const API_KEY = 'e1b3b4dc46004f0ea1166bc14ca21965';

// DOM元素引用
const authContainer = document.getElementById('auth-container');
const mainContainer = document.getElementById('main-container');
const passwordInput = document.getElementById('password-input');
const authError = document.getElementById('auth-error');
const videoLinkInput = document.getElementById('video-link');
const parseBtn = document.getElementById('parse-btn');
const loading = document.getElementById('loading');
const resultSection = document.getElementById('result-section');
const errorSection = document.getElementById('error-section');
const videoTitle = document.getElementById('video-title');
const videoCover = document.getElementById('video-cover');
const errorMessage = document.getElementById('error-message');

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经验证过密码
    if (sessionStorage.getItem('authenticated') === 'true') {
        showMainInterface();
    }
    
    // 为密码输入框添加回车键监听
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            authenticate();
        }
    });
    
    // 为视频链接输入框添加输入监听
    videoLinkInput.addEventListener('input', function() {
        hideResults();
    });
});

// 密码验证函数
function authenticate() {
    const inputPassword = passwordInput.value.trim();
    
    if (inputPassword === '') {
        showAuthError('请输入密码');
        return;
    }
    
    if (inputPassword === CORRECT_PASSWORD) {
        // 验证成功
        sessionStorage.setItem('authenticated', 'true');
        showMainInterface();
        hideAuthError();
    } else {
        // 验证失败
        showAuthError('密码错误，请重新输入');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// 显示认证错误信息
function showAuthError(message) {
    authError.textContent = message;
    authError.classList.add('show');
}

// 隐藏认证错误信息
function hideAuthError() {
    authError.classList.remove('show');
}

// 显示主界面
function showMainInterface() {
    authContainer.classList.add('hidden');
    mainContainer.classList.remove('hidden');
}

// 提取链接的正则表达式函数
function extractUrl(text) {
    // 匹配 http:// 或 https:// 开头的URL
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const matches = text.match(urlRegex);
    
    if (matches && matches.length > 0) {
        // 返回第一个匹配的URL，并清理可能的尾部字符
        return matches[0].replace(/[\s\.,;!?"'）】}\]]*$/, '');
    }
    
    return null;
}

// 解析视频函数
async function parseVideo() {
    const linkText = videoLinkInput.value.trim();
    
    if (!linkText) {
        showError('请输入视频分享链接');
        return;
    }
    
    // 提取URL
    const extractedUrl = extractUrl(linkText);
    
    if (!extractedUrl) {
        showError('未找到有效的视频链接，请检查输入内容');
        return;
    }
    
    console.log('提取到的URL:', extractedUrl);
    
    // 显示加载状态
    showLoading();
    
    try {
        // 构建API请求URL
        const apiUrl = `${API_BASE_URL}?ak=${API_KEY}&link=${encodeURIComponent(extractedUrl)}`;
        console.log('API请求URL:', apiUrl);
        
        // 发送API请求
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API响应数据:', data);
        
        // 检查API响应状态
        if (data.code !== '10000' || !data.content || !data.content.success) {
            throw new Error(data.msg || '解析失败，请检查链接是否正确');
        }
        
        // 保存视频数据
        currentVideoData = data.content;
        
        // 显示解析结果
        showResult(currentVideoData);
        
    } catch (error) {
        console.error('解析错误:', error);
        showError(`解析失败: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// 显示加载状态
function showLoading() {
    parseBtn.disabled = true;
    parseBtn.textContent = '解析中...';
    loading.classList.remove('hidden');
    hideResults();
}

// 隐藏加载状态
function hideLoading() {
    parseBtn.disabled = false;
    parseBtn.textContent = '🔍 开始解析';
    loading.classList.add('hidden');
}

// 显示解析结果
function showResult(data) {
    // 设置视频标题
    videoTitle.textContent = data.title || '未知标题';
    
    // 设置封面图片
    if (data.cover) {
        videoCover.src = data.cover;
        videoCover.alt = data.title || '视频封面';
        videoCover.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgODBMMTgwIDEyMEwxMjAgMTYwVjgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
            this.alt = '封面加载失败';
        };
    } else {
        videoCover.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgODBMMTgwIDEyMEwxMjAgMTYwVjgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
        videoCover.alt = '暂无封面';
    }
    
    // 显示结果区域
    resultSection.classList.remove('hidden');
    errorSection.classList.add('hidden');
}

// 显示错误信息
function showError(message) {
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
}

// 隐藏所有结果
function hideResults() {
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
}

// 下载视频函数
function downloadVideo() {
    if (!currentVideoData || !currentVideoData.url) {
        alert('视频链接不可用');
        return;
    }
    
    const videoUrl = currentVideoData.url;
    const fileName = sanitizeFilename(`${currentVideoData.title || 'video'}.mp4`);
    
    // 尝试直接下载和代理下载
    tryDownloadWithFetch(videoUrl, fileName, 'video')
        .catch(() => tryDownloadWithProxy(videoUrl, fileName, 'video'))
        .catch(() => showDownloadTip('下载失败，请稍后重试'));
}

// 尝试使用fetch下载
async function tryDownloadWithFetch(url, fileName, type) {
    try {
        showDownloadTip(`正在尝试下载${type}...`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
                'Accept': '*/*'
            },
            mode: 'cors',
            referrerPolicy: 'no-referrer'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const blob = await response.blob();
        
        try {
            // 创建下载链接
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
            
            showDownloadTip(`${type}下载成功！`);
        } catch (error) {
            if (error.name === 'AbortError') {
                showDownloadTip('已取消下载');
                return;
            }
            // 如果不支持showSaveFilePicker，回退到传统下载方式
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
            showDownloadTip(`${type}下载成功！`);
        }
        
    } catch (error) {
        console.error('Fetch下载失败:', error);
        throw error;
    }
}

// 尝试使用代理下载
async function tryDownloadWithProxy(url, fileName, type) {
    try {
        showDownloadTip(`尝试代理下载${type}...`);
        
        // 使用CORS代理服务
        const proxyUrls = [
            `https://cors-anywhere.herokuapp.com/${url}`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`
        ];
        
        for (const proxyUrl of proxyUrls) {
            try {
                const response = await fetch(proxyUrl, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = fileName;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    window.URL.revokeObjectURL(downloadUrl);
                    showDownloadTip(`${type}代理下载成功！`);
                    return;
                }
            } catch (proxyError) {
                console.log(`代理 ${proxyUrl} 失败:`, proxyError);
                continue;
            }
        }
        
        throw new Error('所有代理都失败');
        
    } catch (error) {
        console.error('代理下载失败:', error);
        throw error;
    }
}



// 下载封面函数
function downloadCover() {
    if (!currentVideoData || !currentVideoData.cover) {
        alert('封面链接不可用');
        return;
    }
    
    const coverUrl = currentVideoData.cover;
    const fileName = sanitizeFilename(`${currentVideoData.title || 'cover'}_cover.jpg`);
    
    // 尝试直接下载和代理下载
    tryDownloadWithFetch(coverUrl, fileName, '封面')
        .catch(() => tryDownloadWithProxy(coverUrl, fileName, '封面'))
        .catch(() => showDownloadTip('下载失败，请稍后重试'));
}

// 显示下载提示
function showDownloadTip(message) {
    // 创建提示元素
    const tip = document.createElement('div');
    tip.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideIn 0.3s ease-out;
    `;
    tip.textContent = message;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 添加到页面
    document.body.appendChild(tip);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (tip.parentNode) {
            tip.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(tip);
                document.head.removeChild(style);
            }, 300);
        }
    }, 3000);
}

// 工具函数：格式化文件名
function sanitizeFilename(filename) {
    // 移除或替换不安全的字符
    return filename.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');
}

// 错误处理：全局错误捕获
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
});

// 处理未捕获的Promise拒绝
window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的Promise拒绝:', e.reason);
    e.preventDefault();
});