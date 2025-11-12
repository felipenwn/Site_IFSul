  (function() {
            'use strict';

            // URLs para tentar (proxy PHP local primeiro, depois alternativas)
            const API_URLS = [
                './proxy.php', // Proxy PHP local (melhor opção)
                'https://api.allorigins.win/raw?url=https://painel.passofundo.ifsul.edu.br/ws/?ws=professor',
                'https://corsproxy.io/?https://painel.passofundo.ifsul.edu.br/ws/?ws=professor',
                'https://painel.passofundo.ifsul.edu.br/ws/?ws=professor' // Tentativa direta
            ];
            
            const container = document.querySelector('#time .row.g-4');

            // Função para criar o HTML de um card de professor
            function criarCardProfessor(prof) {
                const { nome, email, curriculo, titulacao, interesse, img } = prof;
                
                return `
                    <div class="col-md-4">
                        <div class="card-container">
                            <div class="card-inner">
                                <div class="card-front">
                                    <div class="event-card text-center">
                                        <img src="${img}" alt="${nome}"
                                            class="speaker-image mb-3" 
                                            onerror="this.src='../../assets/img/professores/default.jpg'">
                                        <a href="#" class="name">
                                            <h4 class="event-title mb-2">${nome}</h4>
                                        </a>
                                        <p class="mb-2">${titulacao}</p>
                                        <small class="text-muted"></small>
                                    </div>
                                </div>
                                <div class="card-back">
                                    <h5>Tópicos de Interesse:</h5>
                                    <p>${interesse || 'Não informado'}</p>
                                    <div class="social-links">
                                        ${curriculo ? `<a href="${curriculo}" target="_blank"><i class="bi bi-link-45deg"></i> Lattes</a>` : ''}
                                        ${email ? `<a href="mailto:${email}" target="_blank"><i class="bi bi-envelope"></i> Email</a>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Tenta fazer fetch com timeout
            async function fetchComTimeout(url, timeout = 15000) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                
                try {
                    const response = await fetch(url, { 
                        signal: controller.signal,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    clearTimeout(timeoutId);
                    return response;
                } catch (error) {
                    clearTimeout(timeoutId);
                    throw error;
                }
            }

            // Função para carregar os professores da API
            async function carregarProfessores() {
                let ultimoErro = null;
                
                // Tenta cada URL até conseguir
                for (let i = 0; i < API_URLS.length; i++) {
                    const url = API_URLS[i];
                    const urlDisplay = url.includes('proxy.php') ? 'Proxy Local PHP' : url;
                    console.log(`🔄 Tentando carregar de: ${urlDisplay}`);
                    
                    try {
                        const response = await fetchComTimeout(url);
                        
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}`);
                        }

                        const data = await response.json();
                        
                        // Limpa o container
                        container.innerHTML = '';

                        // Verifica se há dados
                        if (!data || data.length === 0) {
                            container.innerHTML = `
                                <div class="col-12 text-center">
                                    <p class="text-muted">Nenhum professor encontrado.</p>
                                </div>
                            `;
                            return;
                        }

                        // Cria os cards para cada professor
                        data.forEach(item => {
                            if (item.professor) {
                                const cardHTML = criarCardProfessor(item.professor);
                                container.insertAdjacentHTML('beforeend', cardHTML);
                            }
                        });

                        console.log(`✅ ${data.length} professores carregados com sucesso de: ${urlDisplay}`);
                        return; // Sucesso, sai da função
                        
                    } catch (error) {
                        console.warn(`❌ Falha ao carregar de ${urlDisplay}:`, error.message);
                        ultimoErro = error;
                        // Continua para próxima URL
                    }
                }
                
                // Se chegou aqui, todas as tentativas falharam
                console.error('❌ Todas as tentativas falharam:', ultimoErro);
                container.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-warning" role="alert">
                            <h5><i class="bi bi-exclamation-triangle"></i> Não foi possível carregar os professores</h5>
                            <p class="mb-2">A API do painel está com restrições CORS.</p>
                            <hr>
                            <p class="mb-2"><strong>Soluções possíveis:</strong></p>
                            <ol class="mb-3">
                                <li>Coloque o arquivo <code>proxy.php</code> na pasta <code>src/professores/</code></li>
                                <li>Configure o servidor para permitir CORS</li>
                                <li>Use um servidor backend (Node.js, Python, etc.)</li>
                            </ol>
                            <button class="btn btn-sm btn-primary" onclick="location.reload()">
                                <i class="bi bi-arrow-clockwise"></i> Tentar novamente
                            </button>
                        </div>
                    </div>
                `;
            }

            // Carrega os professores quando o DOM estiver pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', carregarProfessores);
            } else {
                carregarProfessores();
            }
        })();