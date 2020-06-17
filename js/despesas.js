// Classe Receita
class Receita {
    constructor(descricao, valorTotal, data) {
        this.descricao = descricao;
        this.valorTotal = valorTotal;
        this.data = data;
    }
}

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
    static displayReceitas() {
        const receitas = Store.getReceitas();
        receitas.forEach((receita) => UI.adicionaRecitaNaTabela(receita));
    }

    static displayDespesas() {
        const despesas = Store.getDespesas();
        despesas.forEach((despesa) => UI.adicionaDespesaNaTabela(despesa));
    }

    static adicionaRecitaNaTabela(receita) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.classList.add('table-success');

        row.innerHTML = `
        <td>${receita.descricao}</td>
        <td>${receita.valorTotal}R$</td>
        <td>${receita.data}</td>
        <td><a href="#" class="btn btn-danger btn-sm deletaReceita">X</a></td>
      `;

        list.appendChild(row);
    }

    static adicionaDespesaNaTabela(despesa) {
        const list = document.querySelector('#book-list');

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

    static deletaReceita(el) {
        if (el.classList.contains('deletaReceita')) {
            el.parentElement.parentElement.remove();
        }
    }

    static deletaDespesa(el) {
        if (el.classList.contains('deletaDespesa')) {
            el.parentElement.parentElement.remove();
        }
    }

    static mostraAlerta(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#financas');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static limpaCampos() {
        document.querySelector('#descricao').value = '';
        document.querySelector('#valorTotal').value = '';
        document.querySelector('#data').value = '';
    }
}

// Classe Store
class Store {

    static getReceitas() {
        let receitas;
        if (localStorage.getItem('receitas') === null) {
            receitas = [];
        } else {
            receitas = JSON.parse(localStorage.getItem('receitas'));
        }

        return receitas;
    }

    static getDespesas() {
        let despesas;
        if (localStorage.getItem('despesas') === null) {
            despesas = [];
        } else {
            despesas = JSON.parse(localStorage.getItem('despesas'));
        }

        return despesas;
    }

    static adicionaReceita(receita) {
        const receitas = Store.getReceitas();
        receitas.push(receita);
        localStorage.setItem('receitas', JSON.stringify(receitas));
    }

    static adicionaDespesa(despesa) {
        const despesas = Store.getDespesas();
        despesas.push(despesa);
        localStorage.setItem('despesas', JSON.stringify(despesas));
    }

    static removeReceita(descricao) {
        const receitas = Store.getReceitas();

        receitas.forEach((receita, index) => {
            if (receita.descricao === descricao) {
                receitas.splice(index, 1);
            }
        });

        localStorage.setItem('receitas', JSON.stringify(receitas));
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

// Event: Display receitas
document.addEventListener('DOMContentLoaded', UI.displayReceitas);

// Event: Display despesas
document.addEventListener('DOMContentLoaded', UI.displayDespesas);

// Event: Adiciona receita/despesa
document.querySelector('#financas').addEventListener('submit', (e) => {

    // Previne a submissão do form
    e.preventDefault();

    const descricao = document.querySelector('#descricao').value;
    const valorTotal = document.querySelector('#valorTotal').value;
    const data = document.querySelector('#data').value;
    const tipo = document.querySelector('#tipo').value;

    // TODO: VALIDAÇÃO

    if (tipo === 'Receita') {
        // Istancia receita
        const receita = new Receita(descricao, valorTotal, data);

        // Guarda a receita no local storage
        Store.adicionaReceita(receita);

        // Mostra a receita na tela
        UI.adicionaRecitaNaTabela(receita);

        // Mostra mensagem de sucesso
        UI.mostraAlerta('Receita Adicionada com Sucesso', 'success');

        // Limpa os campos do form
        UI.limpaCampos();
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

// Event: Remove receita
document.querySelector('#tabela').addEventListener('click', (e) => {
    // Remove receita da UI
    UI.deletaReceita(e.target);

    // Remove receita do local storage
    Store.removeReceita(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    // Mostra Alerta
    UI.mostraAlerta('Receita Removida com Sucesso', 'success');
});

// Event: Remove despesa
document.querySelector('#tabela').addEventListener('click', (e) => {
    // Remove despesa da UI
    UI.deletaDespesa(e.target);

    // Remove despesa do local storage
    Store.removeDespesa(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    // Mostra Alerta
    UI.mostraAlerta('Despesa Removida com Sucesso', 'success');
});