import React from 'react';
import './App.css'; // Asegúrate de que esta importación sea correcta según tu configuración de estilos.
import TransactionForm from './components/TransactionForm'; // Ajusta la ruta si es necesario.

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Aplicación de Transacciones Ethereum</h1>
      </header>
      <main>
        <TransactionForm />
      </main>
    </div>
  );
}

export default App;
