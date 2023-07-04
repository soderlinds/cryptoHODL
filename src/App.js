import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [coinAmounts, setCoinAmounts] = useState(() => {
    const savedAmounts = localStorage.getItem("coinAmounts");
    return savedAmounts ? JSON.parse(savedAmounts) : {};
  });
  const [totalValue, setTotalValue] = useState(0);
  
  useEffect(() => {
    const coins = Object.keys(coinAmounts);

    const apiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins.join(",")}&tsyms=USD&api_key=3b57f5b3b195f59cde44730ed50e28051a8faf24cd66b552c0468900c4f7b5bd`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const cryptoArray = [];
        for (const coin in data) {
          cryptoArray.push({
            symbol: coin,
            price: data[coin].USD,
          });
        }
        cryptoArray.sort(
          (a, b) =>
            b.price * (coinAmounts[b.symbol] || 0) -
            a.price * (coinAmounts[a.symbol] || 0)
        );
        setCryptoData(cryptoArray);
      })
      .catch((error) => console.error(error));
  }, [coinAmounts]);

  useEffect(() => {
    let newTotalValue = 0;
    cryptoData.forEach((crypto) => {
      const coinAmount = coinAmounts[crypto.symbol] || 0;
      newTotalValue += crypto.price * coinAmount;
    });
    setTotalValue(newTotalValue);
    localStorage.setItem("coinAmounts", JSON.stringify(coinAmounts));
  }, [coinAmounts, cryptoData]);

  const handleCoinAmountChange = (coinSymbol, amount) => {
    const newCoinAmounts = { ...coinAmounts, [coinSymbol]: parseFloat(amount) };
    setCoinAmounts(newCoinAmounts);
  };

  const exchangeRate = 10.41;

  return (
    <div className="App">
      <div className="total">
        <p>SEK {(totalValue * exchangeRate).toLocaleString("en")}</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => (
              <tr key={crypto.symbol}>
                <td>{crypto.symbol}</td>
                <td>USD {crypto.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    step="1"
                    value={coinAmounts[crypto.symbol] || ""}
                    onChange={(e) => handleCoinAmountChange(crypto.symbol, e.target.value)}
                  />
                </td>
                <td>USD {(crypto.price * (coinAmounts[crypto.symbol] || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
