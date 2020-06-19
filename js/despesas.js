// Classe Despesa
class Despesa {
    constructor(descricao, valorTotal, data) {
        this.descricao = descricao;
        this.valorTotal = valorTotal;
        this.data = data;
    }
}

// Classe UI
class UI {
    static displayDespesas() {
        const despesas = Store.getDespesas();
        despesas.forEach((despesa) => UI.adicionaDespesaNaTabela(despesa));
    }

    static adicionaDespesaNaTabela(despesa) {
        const list = document.querySelector('#tabela');

        const row = document.createElement('tr');
        row.classList.add('table-danger');

        row.innerHTML = `
        <td>${despesa.descricao}</td>
        <td>${despesa.valorTotal}R$</td>
        <td>${despesa.data}</td>
        <td><a href="#" class="btn btn-danger btn-sm deletaDespesa">X</a></td>
      `;

        list.appendChild(row);
    }

    static deletaDespesa(el) {
        if (el.classList.contains('deletaDespesa')) {
            el.parentElement.parentElement.remove();
        }
    }

    static mostraAlerta(mensagem, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensagem));

        const formulario = document.querySelector('#financas');
        const campoDescricao = document.querySelector('.form-group');
        formulario.insertBefore(div, campoDescricao);

        setTimeout(() => document.querySelector('.alert').remove(), 4000);
    }

    static limpaCampos() {
        document.querySelector('#descricao').value = '';
        document.querySelector('#valorTotal').value = '';
        document.querySelector('#data').value = '';
    }
}

// Classe Store
class Store {
    static getDespesas() {
        let despesas;
        if (localStorage.getItem('despesas') === null) {
            despesas = [];
        } else {
            despesas = JSON.parse(localStorage.getItem('despesas'));
        }

        return despesas;
    }

    static adicionaDespesa(despesa) {
        const despesas = Store.getDespesas();
        despesas.push(despesa);
        localStorage.setItem('despesas', JSON.stringify(despesas));
    }

    static removeDespesa(descricao) {
        const despesas = Store.getDespesas();

        despesas.forEach((despesa, index) => {
            if (despesa.descricao === descricao) {
                despesas.splice(index, 1);
            }
        });

        localStorage.setItem('despesas', JSON.stringify(despesas));
    }
}

// Event: Display despesas
document.addEventListener('DOMContentLoaded', UI.displayDespesas);

// Event: Adiciona despesa
document.querySelector('#financas').addEventListener('submit', (e) => {

    // Previne a submissão do form
    e.preventDefault();

    const descricao = document.querySelector('#descricao').value;
    const valorTotal = document.querySelector('#valorTotal').value;
    const data = document.querySelector('#data').value;

    // TODO: VALIDAÇÃO
    if (descricao === '' || valorTotal === '' || data === '') {
        UI.mostraAlerta('Todos os campos devem ser preenchidos !', 'danger');
    } else {

        // Istancia despesa
        const despesa = new Despesa(descricao, valorTotal, data);

        // Guarda a Despesa no local storage
        Store.adicionaDespesa(despesa);

        // Mostra a Despesa na tela
        UI.adicionaDespesaNaTabela(despesa);

        // Mostra mensagem de sucesso
        UI.mostraAlerta('Despesa Adicionada com Sucesso', 'success');

        // Limpa os campos do form
        UI.limpaCampos();
    }
});

// Event: Remove despesa

document.querySelector('#tabela').addEventListener('click', (e) => {

    if (e.target.classList.contains('deletaDespesa')) {
        // Remove despesa da UI
        UI.deletaDespesa(e.target);

        // Remove despesa do local storage
        Store.removeDespesa(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

        // Mostra Alerta
        UI.mostraAlerta('Despesa Removida com Sucesso', 'success');
    }
});