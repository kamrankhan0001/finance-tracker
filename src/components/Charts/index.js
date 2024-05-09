import React from 'react'
import { Line, Pie } from "@ant-design/charts";
import { Transaction } from 'firebase/firestore';


function ChartComponent({ sortedTransactions }) {
  
    const data = sortedTransactions.map((item)=>{
      return {
        date: item.date,
        amount: item.amount
      };
    });

    const spendingData = sortedTransactions.filter((transaction) => {
      if (transaction.type === "expense") {
        return { tag: transaction.tag, amount: transaction.amount };
      }
    });
    let finalSpending = spendingData.reduce((acc, obj) => {
      let key = obj.tag;
      if(!acc[key]){
        acc[key] = {tag:obj.tag, amount:obj.amount}
      }else{
        acc[key].amount=obj.amount
      }
      return acc;
    }, {})

    const config = {
      data: data,
      width:500,
      autoFit: false,
      xField: 'date',
      yField: 'amount',
      
    };
    const spendingConfig = {
    data: Object.values(finalSpending),
    width:500,
    angleField: "amount",
    colorField: "tag",
    label: {
      style: {
        fill: 'red',
      },
  },
  };
  let chart;
  let pie;
  return (
    <div className="charts-wrappper">
      <div className="line-chart">
        <h1> Analytics</h1>
        <Line className="li"
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      </div>

      <div className="pie-chart">
        <h1> Spendings</h1>
        <Pie className="pi"
          {...spendingConfig}
          onReady={(chartInstance) => (pie = chartInstance)}
        />
      </div>
    </div>
  );
}

export default ChartComponent