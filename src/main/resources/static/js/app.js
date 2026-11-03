/**
 * app.js - Lógica de Controle da Interface do Usuário (UI)
 * 
 * Gerencia a navegação por abas, eventos de formulário e renderização dos dados.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos de Feedback
    const feedbackEl = document.getElementById('feedback-message');
    const feedbackTextEl = document.getElementById('feedback-text');
    const feedbackCloseBtn = document.getElementById('feedback-close');

    // Navegação em abas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content');

    // Formulários
    const formGet = document.getElementById('form-get');
    const formPost = document.getElementById('form-post');
    const formPut = document.getElementById('form-put');
    const formDelete = document.getElementById('form-delete');

    // Componentes de resultado GET
    const getResultBox = document.getElementById('get-result-box');
    const resultId = document.getElementById('result-id');
    const resultName = document.getElementById('result-name');
    const resultTecnology = document.getElementById('result-tecnology');
    const resultProjectType = document.getElementById('result-projectType');
    const resultHighestVersion = document.getElementById('result-highestVersion');
    const btnResultEdit = document.getElementById('btn-result-edit');
    const btnResultDelete = document.getElementById('btn-result-delete');

    // Armazenamento em memória do último framework consultado
    let currentFramework = null;

    /* ==========================================================================
       SISTEMA DE MENSAGENS / FEEDBACK VISUAL
       ========================================================================== */
    let feedbackTimeout = null;

    function showFeedback(message, type = 'success', autoHideMs = 5000) {
        if (feedbackTimeout) clearTimeout(feedbackTimeout);

        feedbackTextEl.textContent = message;
        feedbackEl.className = `feedback-message ${type}`;

        if (autoHideMs > 0) {
            feedbackTimeout = setTimeout(() => {
                hideFeedback();
            }, autoHideMs);
        }
    }

    function hideFeedback() {
        feedbackEl.className = 'feedback-message';
        feedbackEl.style.display = 'none';
    }

    feedbackCloseBtn.addEventListener('click', hideFeedback);

    /* ==========================================================================
       SISTEMA DE ABAS (TABS)
       ========================================================================== */
    function switchTab(tabId) {
        // Atualiza botões
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Atualiza painéis
        tabPanels.forEach(panel => {
            if (panel.id === `tab-${tabId}`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Atualiza hash na URL para permitir links diretos
        window.location.hash = tabId;
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    // Restaurar aba pela hash da URL ao carregar a página
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && ['get', 'post', 'put', 'delete'].includes(initialHash)) {
        switchTab(initialHash);
    }

    /* ==========================================================================
       ESTADO DE BOTÕES (PREVENIR DUPLO CLIQUE DURANTE ASYNC/AWAIT)
       ========================================================================== */
    function setButtonLoading(button, isLoading, loadingText = 'Processando...') {
        if (isLoading) {
            button.dataset.originalText = button.innerHTML;
            button.disabled = true;
            button.innerHTML = loadingText;
        } else {
            button.disabled = false;
            if (button.dataset.originalText) {
                button.innerHTML = button.dataset.originalText;
            }
        }
    }

    /* ==========================================================================
       MÉTODO GET - CONSULTAR POR TECNOLOGIA
       ========================================================================== */
    formGet.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tecnology = document.getElementById('get-tecnology').value.trim();
        const submitBtn = formGet.querySelector('button[type="submit"]');

        if (!tecnology) {
            showFeedback('Por favor, informe a tecnologia para busca.', 'error');
            return;
        }

        setButtonLoading(submitBtn, true, 'Buscando...');
        getResultBox.classList.remove('active');

        try {
            const data = await window.FrameworkAPI.getByTecnology(tecnology);
            currentFramework = data;

            // Preenche tabela com os dados retornados
            resultId.textContent = data.id !== undefined && data.id !== null ? data.id : '-';
            resultName.textContent = data.name || '-';
            resultTecnology.textContent = data.tecnology || '-';
            resultProjectType.textContent = data.projectType || '-';
            resultHighestVersion.textContent = data.highestVersion || '-';

            getResultBox.classList.add('active');
            showFeedback(`Framework "${data.name || data.tecnology}" encontrado com sucesso!`, 'success');
        } catch (err) {
            currentFramework = null;
            showFeedback(err.message, 'error');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });

    // Ações Rápidas a partir do resultado GET
    btnResultEdit.addEventListener('click', () => {
        if (!currentFramework) return;

        // Preenche formulário de Atualização (PUT)
        document.getElementById('put-id').value = currentFramework.id || '';
        document.getElementById('put-name').value = currentFramework.name || '';
        document.getElementById('put-tecnology').value = currentFramework.tecnology || '';
        document.getElementById('put-projectType').value = currentFramework.projectType || '';
        document.getElementById('put-highestVersion').value = currentFramework.highestVersion || '';

        // Muda para a aba de Atualização (PUT)
        switchTab('put');
        showFeedback(`Dados do ID ${currentFramework.id} carregados para edição.`, 'success', 3000);
    });

    btnResultDelete.addEventListener('click', () => {
        if (!currentFramework || !currentFramework.tecnology) return;

        // Preenche o campo de exclusão e troca para a aba DELETE
        document.getElementById('delete-tecnology').value = currentFramework.tecnology;
        switchTab('delete');
        showFeedback(`Tecnologia "${currentFramework.tecnology}" selecionada para exclusão. Confirme para prosseguir.`, 'error', 5000);
    });

    /* ==========================================================================
       MÉTODO POST - CADASTRAR NOVO FRAMEWORK
       ========================================================================== */
    formPost.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = formPost.querySelector('button[type="submit"]');

        const payload = {
            name: document.getElementById('post-name').value.trim(),
            tecnology: document.getElementById('post-tecnology').value.trim(),
            projectType: document.getElementById('post-projectType').value.trim(),
            highestVersion: document.getElementById('post-highestVersion').value.trim()
        };

        if (!payload.name || !payload.tecnology) {
            showFeedback('Nome e Tecnologia são campos obrigatórios.', 'error');
            return;
        }

        setButtonLoading(submitBtn, true, 'Cadastrando...');

        try {
            await window.FrameworkAPI.create(payload);
            showFeedback(`Framework "${payload.name}" cadastrado com sucesso!`, 'success');
            
            // Opcional: já preenche o campo de busca GET com a tecnologia cadastrada
            document.getElementById('get-tecnology').value = payload.tecnology;
            
            formPost.reset();
        } catch (err) {
            showFeedback(err.message, 'error');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });

    /* ==========================================================================
       MÉTODO PUT - ATUALIZAR FRAMEWORK POR ID
       ========================================================================== */
    formPut.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = formPut.querySelector('button[type="submit"]');

        const id = document.getElementById('put-id').value.trim();
        const payload = {
            name: document.getElementById('put-name').value.trim(),
            tecnology: document.getElementById('put-tecnology').value.trim(),
            projectType: document.getElementById('put-projectType').value.trim(),
            highestVersion: document.getElementById('put-highestVersion').value.trim()
        };

        if (!id) {
            showFeedback('O ID do framework é obrigatório para atualização.', 'error');
            return;
        }

        setButtonLoading(submitBtn, true, 'Atualizando...');

        try {
            await window.FrameworkAPI.update(id, payload);
            showFeedback(`Framework ID ${id} atualizado com sucesso!`, 'success');
        } catch (err) {
            showFeedback(err.message, 'error');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });

    /* ==========================================================================
       MÉTODO DELETE - REMOVER FRAMEWORK POR TECNOLOGIA
       ========================================================================== */
    formDelete.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tecnology = document.getElementById('delete-tecnology').value.trim();
        const submitBtn = formDelete.querySelector('button[type="submit"]');

        if (!tecnology) {
            showFeedback('Por favor, informe a tecnologia a ser removida.', 'error');
            return;
        }

        const confirmAction = confirm(`Tem certeza que deseja excluir o framework associado à tecnologia "${tecnology}"? Esta ação não pode ser desfeita.`);
        if (!confirmAction) return;

        setButtonLoading(submitBtn, true, 'Excluindo...');

        try {
            await window.FrameworkAPI.deleteByTecnology(tecnology);
            showFeedback(`Framework associado à tecnologia "${tecnology}" excluído com sucesso!`, 'success');
            
            // Se o item excluído estava exibido na busca, limpa a exibição
            if (currentFramework && currentFramework.tecnology.toLowerCase() === tecnology.toLowerCase()) {
                getResultBox.classList.remove('active');
                currentFramework = null;
            }

            formDelete.reset();
        } catch (err) {
            showFeedback(err.message, 'error');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
});
