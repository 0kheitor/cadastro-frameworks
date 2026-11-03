/**
 * api.js - Módulo de Integração com API REST (/framework)
 * 
 * Camada de serviço responsável pelas chamadas assíncronas utilizando Fetch API.
 * Sem dependências externas, pronto para consumo pelo front-end.
 */

const BASE_URL = '/framework';

/**
 * Utilitário para tratar erros de respostas HTTP não-2xx
 */
async function handleResponseError(response, defaultMsg) {
    let errorDetails = '';
    try {
        const errorData = await response.json();
        errorDetails = errorData.message || errorData.error || JSON.stringify(errorData);
    } catch {
        // Se a resposta não tiver corpo JSON
        try {
            errorDetails = await response.text();
        } catch {
            errorDetails = '';
        }
    }
    const statusText = `(Status HTTP ${response.status})`;
    throw new Error(errorDetails ? `${defaultMsg}: ${errorDetails} ${statusText}` : `${defaultMsg} ${statusText}`);
}

const FrameworkAPI = {
    /**
     * GET /framework?tecnology={tecnology}
     * Consulta os dados de um framework pelo nome da tecnologia associada.
     * 
     * @param {string} tecnology - Nome da tecnologia (ex: "Java", "Python")
     * @returns {Promise<Object>} Dados do Framework cadastrado
     */
    async getByTecnology(tecnology) {
        const url = `${BASE_URL}?tecnology=${encodeURIComponent(tecnology.trim())}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            await handleResponseError(response, `Tecnologia "${tecnology}" não encontrada`);
        }

        return await response.json();
    },

    /**
     * POST /framework
     * Cria um novo registro de framework enviando os dados no corpo (Body JSON).
     * 
     * @param {Object} frameworkData - Objeto contendo { tecnology, name, projectType, highestVersion }
     * @returns {Promise<boolean>} Retorna true caso o cadastro seja bem-sucedido
     */
    async create(frameworkData) {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(frameworkData)
        });

        if (!response.ok) {
            await handleResponseError(response, 'Falha ao cadastrar framework');
        }

        return true;
    },

    /**
     * PUT /framework?id={id}
     * Atualiza um framework existente pelo seu ID único.
     * 
     * @param {number|string} id - ID do framework a ser atualizado
     * @param {Object} frameworkData - Dados a serem atualizados { tecnology, name, highestVersion, projectType }
     * @returns {Promise<boolean>} Retorna true caso a atualização seja bem-sucedida
     */
    async update(id, frameworkData) {
        const url = `${BASE_URL}?id=${encodeURIComponent(id)}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(frameworkData)
        });

        if (!response.ok) {
            await handleResponseError(response, `Falha ao atualizar framework ID ${id}`);
        }

        return true;
    },

    /**
     * DELETE /framework?tecnology={tecnology}
     * Remove um framework através do parâmetro de tecnologia.
     * 
     * @param {string} tecnology - Nome da tecnologia a ser deletada
     * @returns {Promise<boolean>} Retorna true caso a exclusão seja bem-sucedida
     */
    async deleteByTecnology(tecnology) {
        const url = `${BASE_URL}?tecnology=${encodeURIComponent(tecnology.trim())}`;

        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            await handleResponseError(response, `Falha ao excluir framework com tecnologia "${tecnology}"`);
        }

        return true;
    }
};

// Disponibiliza globalmente
window.FrameworkAPI = FrameworkAPI;
