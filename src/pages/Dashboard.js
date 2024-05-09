import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import AddIncomeModal from '../components/Modals/addIncome';
import AddExpenseModal from '../components/Modals/addExpense';
import { addDoc, collection, getDocs, query, writeBatch } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import TransactionsTable from '../components/TransactionsTable';
import NoTransactions from '../components/NoTransactions';
import ChartComponent from '../components/Charts';
import { Modal } from "antd";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);


  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };
  

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };
  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transation added");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }
  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transaction Array", transactionsArray )
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }
  
  const handleResetBalance = async () => {
    Modal.confirm({
      title: "Reset Balance",
      content: "Are you sure you want to reset the balance and delete all transactions?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const transactionsRef = collection(db, `users/${user.uid}/transactions`);
          const querySnapshot = await getDocs(transactionsRef);
          const batch = writeBatch(db); 
          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();

          
          setTransactions([]);
          setTotalBalance(0);
          setIncome(0);
          setExpense(0);

          toast.success("Balance reset successfully!");
        } catch (error) {
          console.error("Error resetting balance: ", error);
          toast.error("Failed to reset balance!");
        }
      },
    });
  };

  let sortedTransactions = transactions.sort((a,b)=>{
    return new Date(a.date) - new Date(b.date);
  })

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
   <>
<Cards 
totalBalance={totalBalance}
income={income}
expense={expense}
showExpenseModal={showExpenseModal}
showIncomeModal={showIncomeModal}
resetBalance={handleResetBalance}

/>
{transactions && transactions.length !== 0 ? (
            <ChartComponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}

<AddExpenseModal
    isExpenseModalVisible={isExpenseModalVisible}
    handleExpenseCancel={handleExpenseCancel}
    onFinish={onFinish}
  />
  <AddIncomeModal
    isIncomeModalVisible={isIncomeModalVisible}
    handleIncomeCancel={handleIncomeCancel}
    onFinish={onFinish}
  />
  <TransactionsTable  
  transactions={transactions}
  addTransaction={addTransaction}
  fetchTransactions={fetchTransactions}
  />
    </>
      )}   
    </div>
  )
}

export default Dashboard