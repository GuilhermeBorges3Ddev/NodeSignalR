import React, { Component } from 'react';
import { HubConnectionBuilder } from '@aspnet/signalr';
import './Chat.css';
import { adicionarMensagem } from './acoes/chat.acao';
import { connect } from 'react-redux';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.conexao = {};
    this.state = {mensagem: '', nome: '', id: ''};
  }
  
  componentDidMount() {

    // Crio a instância do Hub de conexão do SignalR
    this.conexao = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/chatHub').build();

    // Trato o recebimento da mensagem.
    this.conexao.on("RecebendoMensagem", (dado) => { 
      this.props.adicionarMensagem(dado);
    }); 
    
    // Inicio a conexão.
    this.conexao.start().catch(err => console.error(err.toString()));
    let nome = prompt('Entre com o seu nome:');
    // Armazeno o nome no state.
    this.setState({nome});
  }

  obterMensagem(e) {
    this.setState({mensagem: e.target.value });
  }

  obterId(e) {
     this.setState({id: e.target.value });
  }

  enviarMensagem(e) {
    e.preventDefault();
    // Invoco o método EnviarMensagem no lado do servidor.
    this.conexao.invoke('EnviarMensagem', {id: this.state.id, nome: this.state.nome, msg: this.state.mensagem});
    this.setState({mensagem:''})
  }
  
  render() {
    
    return (
          <div>
            <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet" />
            <div className="container">
              <div className="row">
                  <div className="message-wrap col-lg-12">
                  {this.props.mensagensChat.map(item => (
                    <div key={item.id + item.nome + item.msg} className="msg-wrap">                                                                  
                      <div className="media-body">
                          <small>{item.id}</small>
                          <h5 className="media-heading">{item.nome}</h5>
                          <small>{item.msg}</small>
                      </div>
                    </div>
                  ))}                    
                    <div className="send-wrap ">
                      <form onSubmit={e => this.enviarMensagem(e)} className="input-group mb-3">

                        <h1 className="py-3">Ola {this.state.nome}</h1>
                        
                        <div className="d-flex w-100">
                          <h5><small>Entre com a sua mensagem:</small></h5><br />
                          <input type="text" value={this.state.mensagem} className="form-control w-75 ml-4" onChange={e => this.obterMensagem(e)} />
                        </div>
                        
                        <br /><br />

                        <div className="d-flex w-100">
                          <h5><small>ID destino:</small></h5><br />
                          <input type="text" value={this.state.id} className="form-control w-75 ml-4" onChange={e => this.obterId(e)} />
                        </div>

                        <br /><br />

                        <div className="input-group-append">
                            <button className="btn btn-lg btn-primary" type="submit">Enviar</button>
                        </div>

                      </form>

                      <table class="table table-dark">
                        <thead>
                          <tr>
                              <th scope="col">Mensagem enviada para o user: {this.state.id}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                              <th scope="row">Remetente: {this.state.nome}</th>                   
                          </tr>
                          <tr>
                              <th scope="row">Lista de mensagens: {this.state.mensagem}</th>
                          </tr>
                        </tbody>
                      </table>


                    </div>                  
                  </div>
              </div>
            </div>
          </div>
    );
  }
}



const mapStateToProps = state => {
  return { mensagensChat : state.chat }
};

const mapDispatchToProps = dispatch => {
  return {
    adicionarMensagem : (mensagem) => {
      dispatch(adicionarMensagem(mensagem));     
    }
  }
}

const ChatContainer = connect(mapStateToProps,mapDispatchToProps)(Chat);


export default ChatContainer;
