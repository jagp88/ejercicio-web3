import React, { useState } from 'react';
import Web3 from 'web3';
import Tx from 'ethereumjs-tx';

const TransactionForm = () => {
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const web3 = new Web3('http://127.0.0.1:7545'); // Reemplaza con tu URL de Ganache

  const handleTransfer = async () => {
    try {
      setError('');
      setTransactionHash('');

      // Validaciones
      if (!fromAddress || !toAddress || !amount) {
        setError('Todos los campos son obligatorios.');
        return;
      }

      // Verificar que las direcciones sean válidas
      if (!web3.utils.isAddress(fromAddress) || !web3.utils.isAddress(toAddress)) {
        setError('Las direcciones ingresadas no son válidas.');
        return;
      }

      // Obtener saldo de la dirección de origen
      const balance = await web3.eth.getBalance(fromAddress);
      const balanceInEth = web3.utils.fromWei(balance, 'ether');

      if (parseFloat(amount) > parseFloat(balanceInEth)) {
        setError('El monto de la transacción supera el saldo de la dirección de origen.');
        return;
      }

      // Realizar la transacción
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = 21000; // Puedes ajustar esto según tus necesidades
      const nonce = await web3.eth.getTransactionCount(fromAddress);

      const txObject = {
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        nonce: web3.utils.toHex(nonce),
      };

      const privateKey = Buffer.from('TU_CLAVE_PRIVADA', 'hex'); // Reemplaza con tu clave privada
      const tx = new Tx(txObject, { chain: 'ropsten' }); // Reemplaza 'ropsten' por tu red Ethereum

      tx.sign(privateKey);

      const serializedTx = tx.serialize();
      const txHash = await web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`);
      setTransactionHash(txHash);
    } catch (err) {
      console.error('Error en la transacción:', err);
      setError('Error en la transacción. Verifica los datos.');
    }
  };

  return (
    <div>
      <h1>Formulario de Transacción</h1>
      <form>
        <div>
          <label>Dirección de Origen:</label>
          <input
            type="text"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Destinatario:</label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Monto (ETH):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleTransfer}>
          Enviar Transacción
        </button>
        {error && <p className="error">{error}</p>}
        {transactionHash && <p>Transacción exitosa. Hash: {transactionHash}</p>}
      </form>
    </div>
  );
};

export default TransactionForm;
