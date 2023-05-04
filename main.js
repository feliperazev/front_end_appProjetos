

/*
    ----------------------------------------------------------------------------------------------------------------
    Função para popular a tabela de projetos
    ----------------------------------------------------------------------------------------------------------------
*/
const createRow = (projeto, index) => {
  const newRow = document.createElement('tr')
  
  // Formatação de datas para padrão brasileiro
  const dataEntr = new Date(projeto.dataEntr);
  const dataInicio = new Date(projeto.dataInicio);
  const dataEntrFormatada = dataEntr.toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
      });
  const dataInicioFormatada = dataInicio.toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
      });


  // Criação das linhas da tabela 
  newRow.innerHTML = `
      <td id="tdCodigo">${projeto.codigoProjeto}</td>
      <td id="tdCliente">${projeto.cliente}</td>
      <td id="tdSolicitante">${projeto.solicitante}</td>
      <td id="tdCoordenador">${projeto.coordenador}</td>
      <td id="tdHorasPrev">${projeto.horasPrev}</td>
      <td id="tdHorasAcc">${projeto.horasAcc}</td>
      <td id="tdDataInicio">${dataInicioFormatada}</td>
      <td id="tdDataEntr">${dataEntrFormatada}</td>
      <td>
          <button class="button editar" type="button" id="editar-${index}">editar</button>
          <button class="button excluir" type="button" id="excluir-${index}">excluir</button>
      </td> 
  `
  document.querySelector('#tableProjeto>tbody').appendChild(newRow)
}



/*
    ----------------------------------------------------------------------------------------------------------------
    Leitura da lista de projetos 
    Função para obter a lista existente do servidor via requisição GET
    ----------------------------------------------------------------------------------------------------------------
*/
const updateTable = async () => {
    let url = 'http://127.0.0.1:5000/projetos'
    fetch(url, {method: 'get'})
      .then((response) => response.json())
      .then((data) => {
        clearTable()
        data.projetos.forEach(createRow)
      })
    .catch((error) => {
      console.error('Error:', error);
    });

}


/*
  --------------------------------------------------------------------------------------
  Chamada da função para limpar todas as linhas da tabela
  --------------------------------------------------------------------------------------
*/
const clearTable = () => {
    const rows = document.querySelectorAll('#tableProjeto>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}



/*
  --------------------------------------------------------------------------------------
  Cadastro
  Função para cadastrar um projeto no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/

const postItem = async (projeto) => {
    const formData = new FormData();
    formData.append('codigoProjeto', projeto.codigoProjeto);
    formData.append('cliente', projeto.cliente);
    formData.append('solicitante', projeto.solicitante);
    formData.append('coordenador', projeto.coordenador);
    formData.append('horasPrev', projeto.horasPrev);
    formData.append('horasAcc', projeto.horasAcc);
    formData.append('dataInicio', projeto.dataInicio);
    formData.append('dataEntr', projeto.dataEntr);
       
    let url = 'http://127.0.0.1:5000/projeto';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        let message = data.message
        if(message == `Projeto de mesmo código já salvo na base :/`){
            alert(message)
        } else {
            alert("Projeto adicionado!");
            closeModal();

        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/

const deleteProjeto = (codigo) => {
    let url = 'http://127.0.0.1:5000/projeto?codigoProjeto=' + codigo;
    fetch(url, {
        method: 'delete'
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error:', error);
        });
}

/*
  --------------------------------------------------------------------------------------
  Função para editar um item da lista do servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/
const putItem = async (projeto) => {
    const formData = new FormData();
    formData.append('codigoProjeto', projeto.codigoProjeto);
    formData.append('cliente', projeto.cliente);
    formData.append('solicitante', projeto.solicitante);
    formData.append('coordenador', projeto.coordenador);
    formData.append('horasPrev', projeto.horasPrev);
    formData.append('horasAcc', projeto.horasAcc);
    formData.append('dataInicio', projeto.dataInicio);
    formData.append('dataEntr', projeto.dataEntr);
       
    let url = 'http://127.0.0.1:5000/projeto';
    fetch(url, {
      method: 'put',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        let message = data.message
        if(message == `Projeto de mesmo código já salvo na base :/`){
            alert(message)
        } else {
            alert(`Projeto ${projeto.codigoProjeto} alterado!`);
            updateTable()    
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}


//----------------------------------------------------------------------------------------------------------------




/*
  --------------------------------------------------------------------------------------
  MODAL
  Dinâmica abre/fecha do modal
  --------------------------------------------------------------------------------------
*/

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    document.getElementById('modal').classList.remove('active') 
    clearFields()
    clearFieldsData()
    updateTable()

}

//Validação dos campos do modal
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}
//Limpa campos do modal
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}
//Limpa datas do modal
const clearFieldsData = () => {
    const fields = document.querySelectorAll('.modal-field-data')
    fields.forEach(field => field.value = "")
}


//Botão save do modal - pode ser utilizado para cadastro ou edição de um projeto
const saveProjeto = () => {
    if (isValidFields()){
        //Pega os dados do modal
        const projeto = {
            codigoProjeto: document.getElementById('codigo').value,
            cliente: document.getElementById('cliente').value,
            solicitante: document.getElementById('solicitante').value,
            coordenador: document.getElementById('coordenador').value,
            horasPrev:  document.getElementById('horasPrev').value,
            horasAcc:  "0",
            dataInicio:  document.getElementById('dataInicio').value,
            dataEntr: document.getElementById('dataEntr').value
        }
        //Verifica o index do HTML para saber se será criado um novo projeto ou se ocorrerá uma edição de um existente.
        //Se o index possuir o valor defaul criado =new o botão Salvar será para cadastro.

        //Se o index foi modificado (de "new" para 0,1,2... n) pela função "fillFields" na chamada da edição, o botão Salvar será
        //utilizado para atualizar o projeto da respectiva linha da tabela (0,1,2... n).
        const index = document.getElementById('codigo').dataset.index    
        if (index == 'new') {
            postItem(projeto)
            
        } else {
            
            putItem(projeto)
            updateTable()
            closeModal()
        }
    }
}





//INTERAÇÃO COM LAYOUT - Edição - preenchimento do modal
const fillFields = (projeto) => {
    document.getElementById('codigo').value = projeto.codigoProjeto
    document.getElementById('cliente').value = projeto.cliente
    document.getElementById('solicitante').value = projeto.solicitante
    document.getElementById('coordenador').value = projeto.coordenador
    document.getElementById('horasPrev').value = projeto.horasPrev
    

    dataInicio = projeto.dataInicio.replaceAll(`/`,`-`)
    dd1 = dataInicio.substr(0,2)
    mm1 = dataInicio.substr(3,2)
    yyyy1 = projeto.dataInicio.substr(6,4)
    newDataInicio = yyyy1.concat(`-`,mm1,`-`,dd1)
    
    dataEntr = projeto.dataEntr.replaceAll(`/`,`-`)
    dd2 = dataEntr.substr(0,2)
    mm2 = dataEntr.substr(3,2)
    yyyy2 = projeto.dataEntr.substr(6,4)
    newDataEntr = yyyy2.concat(`-`,mm2,`-`,dd2)
    
    console.log(newDataEntr)
    console.log(newDataInicio)
    
    document.getElementById('dataInicio').value = newDataInicio
    document.getElementById('dataEntr').value = newDataEntr
    document.getElementById('codigo').dataset.index = projeto.index
}

//INTERAÇÃO COM LAYOUT - Edição
const editProjeto = (projeto, index) => {
    projeto.index = index
    fillFields(projeto)
    openModal()
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função que verifica qual botão EDITAR ou DELETAR foi clicado.
  --------------------------------------------------------------------------------------
*/
const editDelete = (event) => {
    if (event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
        const projeto = readProjeto(index)
        if (action == 'editar'){
            editProjeto(projeto, index)
        } else {
            const response = confirm(`Deseja realmente excluir o projeto ${projeto.codigoProjeto}`)
                if (response) {
                    deleteProjeto(projeto.codigoProjeto)
                    updateTable()
                    closeModal()
                }
        }
    }

}

/*
  --------------------------------------------------------------------------------------
  Chamada da função que busca o código do projeto na tabela html.
  --------------------------------------------------------------------------------------
*/
const readCodigo = (RowIndex) => {
    var codigos = document.querySelectorAll("#tdCodigo");
    return codigos[RowIndex].innerHTML
}
const readProjeto = (RowIndex) => {
    var codigos = document.querySelectorAll("#tdCodigo");
    var clientes = document.querySelectorAll("#tdCliente");
    var solicitantes = document.querySelectorAll("#tdSolicitante");
    var coordenadores = document.querySelectorAll("#tdCoordenador");
    var horasPrev = document.querySelectorAll("#tdHorasPrev");
    var horasAcc = document.querySelectorAll("#tdHorasAcc");
    var datasInicio = document.querySelectorAll("#tdDataInicio");
    var datasEntr = document.querySelectorAll("#tdDataEntr");
    
    const projeto = {
        codigoProjeto: codigos[RowIndex].innerHTML,
        cliente: clientes[RowIndex].innerHTML,
        solicitante: solicitantes[RowIndex].innerHTML,
        coordenador: coordenadores[RowIndex].innerHTML,
        horasPrev:  horasPrev[RowIndex].innerHTML,
        horasAcc:  horasAcc[RowIndex].innerHTML,
        dataInicio:  datasInicio[RowIndex].innerHTML,
        dataEntr: datasEntr[RowIndex].innerHTML
    }
    
    return projeto
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
updateTable()


//EVENTOS
document.getElementById('cadastrarProjeto')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('modalCancelar')
    .addEventListener('click', closeModal)

document.getElementById('modalSalvar')
    .addEventListener('click', saveProjeto)

document.querySelector('#tableProjeto>tbody')
    .addEventListener('click', editDelete)
