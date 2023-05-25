'use strict';
// BANKIST APP
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [2000, -1200, 1340, -300, -200, 1050, 4400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, -1000, 700, -500, 90, 1460, -90, -150, 1000],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Mehran Uzair',
  movements: [50, -100, 500, 460, -90, -150, 1000],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Todo => Display Movements Function

const displayMovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';
  // todo >=> Sorting Movements Functionality
  const sortArr = (a, b) => a - b;
  const movs = sort ? movements.slice().sort(sortArr) : movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${mov}</div>
          </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// ! ========================================== ;
// Todo => Creating UserName Function

const userName = accs => {
  accs.forEach(acc => {
    const username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join('');

    acc.userName = username;
  });
};

userName(accounts);

// !=========================

// todo => Calculating & Printing Total Balance

const balanceCalc = acc => {
  const balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${balance}€`;
  acc.balance = balance;
};

// !==========================

// todo => Deposit, Withdrwal & Interest Balance Functions

const despositSum = mov => {
  const deposit = mov.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${deposit}€`;
};

const withdrawalSum = mov => {
  const withdrawal = mov
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;
};

const calcInterest = acc => {
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = `${Math.floor(interest)}€`;
};

// ! ======================
const updateUI = acc => {
  balanceCalc(acc);
  withdrawalSum(acc.movements);
  despositSum(acc.movements);
  calcInterest(acc);
  displayMovements(acc.movements);
};

// todo => Login Functionality Event Handler

let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // Functionality
    updateUI(currentAccount);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    alert('Wrong UserID or Password || User doesnt Exist');
  }
});

// todo => Transfer Money into Other accounts

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.abs(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  if (
    recieverAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    recieverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);
    alert(`Transferd Successfully`);
  } else {
    alert('username wrong or Limit Exeeded');
  }
});
// todo => Loan Functionality.

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = inputLoanAmount.value;
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(Number(amount));
    updateUI(currentAccount);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  } else {
    alert('Amount is not Eligible for loan');
  }
});

// !=======================================
// todo >=> Close Account Functionality.

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const currAccIndex = accounts.findIndex(acc => acc === currentAccount);

    accounts.splice(currAccIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    inputCloseUsername.value = inputClosePin.value = '';
  } else {
    alert(`You can only delete your own account`);
  }
});

// todo >=> Sorting movements  <=<
let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
